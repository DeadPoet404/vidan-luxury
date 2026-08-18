// ─────────────────────────────────────────────────────────────
// Vidan availability store — single source of truth for occupancy.
//
// Design rules:
//  • The server (this module) is authoritative; the LLM never decides
//    availability, it only presents what this store reports.
//  • File-backed for the local/24-7 demo. The KV/Redis swap later only
//    needs to replace loadStore/saveStore — every caller goes through
//    the exported functions below.
//  • Mutations are serialized through one promise queue (single-writer),
//    making check-then-block atomic within this process.
// ─────────────────────────────────────────────────────────────

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { RESIDENCES } from "@/lib/residences";

export const STORE_VERSION = 1;

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(STORE_DIR, "store.json");
const TMP_PATH = path.join(STORE_DIR, "store.json.tmp");
const BACKUP_PATH = path.join(STORE_DIR, "store.backup.json");
const LOCK_PATH = path.join(STORE_DIR, "store.lock");
const LOCK_STALE_MS = 15_000;
const LOCK_TIMEOUT_MS = 10_000;

const AUDIT_CAP = 500;

export const DEFAULT_HOLD_HOURS = Number(
  process.env.BOOKING_HOLD_HOURS ?? 24,
);

// ── Types ────────────────────────────────────────────────────

export type BlockSource = "chat" | "telegram" | "selftest";
export type BookingStatus = "reserved" | "confirmed" | "released";

export type OccupiedRange = {
  ref: string;                    // e.g. "VX-4F2A"
  from: string;                   // YYYY-MM-DD (arrival, inclusive)
  to: string;                     // YYYY-MM-DD (checkout, exclusive)
  source: BlockSource;
  status: BookingStatus;
  createdAt: string;              // ISO timestamp
  expiresAt: string | null;       // set for "reserved" holds only
  guest?: { name?: string; phone?: string }; // private; never in public API
};

export type RoomState = {
  id: string;                     // matches residences.ts id
  paused: boolean;                // hidden from the AI entirely
  turnoverBufferDays: number;     // cleaning gap after checkout
  minNights: number;
  note: string | null;            // free-text fact for the AI context
  rateNote: string | null;        // advisory rate override for the AI
  occupied: OccupiedRange[];
};

export type AuditEntry = {
  at: string;
  actor: string;                  // "chat" | chatId | "selftest" | "system"
  action: string;                 // block | release | pause | resume | ...
  detail: string;
};

export type StoreFile = {
  version: number;
  updatedAt: string;
  rooms: Record<string, RoomState>;
  audit: AuditEntry[];
};

export type AvailabilityResult =
  | { ok: true; nights: number }
  | {
      ok: false;
      reason: "unknown-room" | "paused" | "invalid-dates" | "overlap" | "min-nights";
      conflict?: OccupiedRange;
      minNights?: number;
    };

// ── Date helpers (ISO YYYY-MM-DD, string-comparable) ─────────

export function isISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(
    Date.parse(`${value}T00:00:00Z`),
  );
}

export function addDaysISO(value: string, days: number): string {
  const d = new Date(`${value}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function nightsBetweenISO(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
      86_400_000,
  );
}

/** Half-open overlap: [aFrom,aTo) intersects [bFrom,bTo) */
export function rangesOverlap(
  aFrom: string,
  aTo: string,
  bFrom: string,
  bTo: string,
): boolean {
  return aFrom < bTo && bFrom < aTo;
}

// ── Seed / load / save ───────────────────────────────────────

function seedRoom(id: string): RoomState {
  return {
    id,
    paused: false,
    turnoverBufferDays: 0,
    minNights: 1,
    note: null,
    rateNote: null,
    occupied: [],
  };
}

function seedStore(): StoreFile {
  const rooms: Record<string, RoomState> = {};
  for (const r of RESIDENCES) rooms[r.id] = seedRoom(r.id);
  return {
    version: STORE_VERSION,
    updatedAt: new Date().toISOString(),
    rooms,
    audit: [
      {
        at: new Date().toISOString(),
        actor: "system",
        action: "seed",
        detail: `Seeded ${Object.keys(rooms).length} rooms from residences.ts`,
      },
    ],
  };
}

function isValidStore(data: unknown): data is StoreFile {
  const s = data as StoreFile;
  return (
    !!s &&
    s.version === STORE_VERSION &&
    !!s.rooms &&
    typeof s.rooms === "object" &&
    Array.isArray(s.audit)
  );
}

async function writeRaw(file: StoreFile): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  // Backup the previous file first, then atomic-rename the new one.
  try {
    await fs.copyFile(STORE_PATH, BACKUP_PATH);
  } catch {
    // first write — nothing to back up
  }
  await fs.writeFile(TMP_PATH, JSON.stringify(file, null, 2), "utf8");
  await fs.rename(TMP_PATH, STORE_PATH);
}

let cache: StoreFile | null = null;

async function loadStore(): Promise<StoreFile> {
  if (cache) return cache;

  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const data = JSON.parse(raw) as unknown;
    if (isValidStore(data)) {
      // Ensure newly added residences appear automatically.
      let changed = false;
      for (const r of RESIDENCES) {
        if (!data.rooms[r.id]) {
          data.rooms[r.id] = seedRoom(r.id);
          changed = true;
        }
      }
      cache = data;
      if (changed) await writeRaw(data);
      return cache;
    }
    throw new Error("store failed validation");
  } catch (error) {
    // Restore from backup if possible, else reseed — never silently
    // treat a corrupt store as "everything available" without a trace.
    try {
      const raw = await fs.readFile(BACKUP_PATH, "utf8");
      const data = JSON.parse(raw) as unknown;
      if (isValidStore(data)) {
        data.audit.push({
          at: new Date().toISOString(),
          actor: "system",
          action: "restore-backup",
          detail: `Recovered from backup after: ${String(error)}`,
        });
        cache = data;
        await writeRaw(data);
        return cache;
      }
    } catch {
      // no usable backup either
    }
    const fresh = seedStore();
    fresh.audit.push({
      at: new Date().toISOString(),
      actor: "system",
      action: "reseed",
      detail: `Reseeded store after: ${String(error)}`,
    });
    cache = fresh;
    await writeRaw(fresh);
    return cache;
  }
}

/** Serialize all mutations so check-then-block is atomic in-process. */
let queue: Promise<unknown> = Promise.resolve();

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Advisory cross-process lock (O_EXCL lockfile). The Next server and the
 * Telegram bot are separate OS processes sharing data/store.json; this
 * serializes their load → mutate → persist spans so neither can lose the
 * other's update. Stale locks (crashed holder) self-heal after 15s.
 */
async function acquireLock(): Promise<void> {
  const start = Date.now();
  for (;;) {
    try {
      await fs.mkdir(STORE_DIR, { recursive: true });
      const handle = await fs.open(LOCK_PATH, "wx");
      try {
        await handle.writeFile(
          JSON.stringify({ pid: process.pid, at: new Date().toISOString() }),
        );
      } finally {
        await handle.close();
      }
      return;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "EEXIST") throw error;
      try {
        const stat = await fs.stat(LOCK_PATH);
        if (Date.now() - stat.mtimeMs > LOCK_STALE_MS) {
          await fs.unlink(LOCK_PATH).catch(() => undefined); // stale: break it
          continue;
        }
      } catch {
        continue; // lock vanished between checks — retry at once
      }
      if (Date.now() - start > LOCK_TIMEOUT_MS) {
        throw new Error("Timed out waiting for the store lock");
      }
      await sleep(40);
    }
  }
}

async function releaseLock(): Promise<void> {
  await fs.unlink(LOCK_PATH).catch(() => undefined);
}

export function withStore<T>(
  fn: (store: StoreFile) => T | Promise<T>,
): Promise<T> {
  const run = queue.then(async () => {
    await acquireLock();
    try {
      cache = null; // another process may have written since our last read
      const store = await loadStore();
      return await fn(store);
    } finally {
      await releaseLock();
    }
  });
  queue = run.catch(() => undefined);
  return run;
}

async function persist(store: StoreFile): Promise<void> {
  store.updatedAt = new Date().toISOString();
  if (store.audit.length > AUDIT_CAP) {
    store.audit = store.audit.slice(-AUDIT_CAP);
  }
  cache = store;
  await writeRaw(store);
}

function audit(store: StoreFile, actor: string, action: string, detail: string) {
  store.audit.push({
    at: new Date().toISOString(),
    actor,
    action,
    detail,
  });
}

// ── Engine ───────────────────────────────────────────────────

/** Ranges that actually block inventory right now (lazy expiry applied). */
export function activeOccupied(
  room: RoomState,
  now: Date = new Date(),
): OccupiedRange[] {
  const nowIso = now.toISOString();
  return room.occupied.filter((r) => {
    if (r.status === "released") return false;
    if (r.status === "reserved" && r.expiresAt && r.expiresAt <= nowIso) {
      return false; // hold lapsed — frees itself without a cron job
    }
    return true;
  });
}

export function checkAvailability(
  room: RoomState | undefined,
  arrival: string,
  departure: string,
  now: Date = new Date(),
): AvailabilityResult {
  if (!room) return { ok: false, reason: "unknown-room" };
  if (room.paused) return { ok: false, reason: "paused" };
  if (!isISODate(arrival) || !isISODate(departure) || departure <= arrival) {
    return { ok: false, reason: "invalid-dates" };
  }

  const nights = nightsBetweenISO(arrival, departure);
  if (nights < room.minNights) {
    return { ok: false, reason: "min-nights", minNights: room.minNights };
  }

  for (const r of activeOccupied(room, now)) {
    const bufferedTo = addDaysISO(r.to, room.turnoverBufferDays);
    if (rangesOverlap(arrival, departure, r.from, bufferedTo)) {
      return { ok: false, reason: "overlap", conflict: r };
    }
  }

  return { ok: true, nights };
}

function makeRef(store: StoreFile): string {
  for (let i = 0; i < 10; i += 1) {
    const ref = `VX-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
    const taken = Object.values(store.rooms).some((room) =>
      room.occupied.some((o) => o.ref === ref),
    );
    if (!taken) return ref;
  }
  return `VX-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

// ── Public mutations ─────────────────────────────────────────

export type BlockOptions = {
  status?: BookingStatus; // default: chat -> reserved, telegram -> confirmed
  holdHours?: number;
  guest?: { name?: string; phone?: string };
  actor: string;
};

/** Shared write path — must be called inside a withStore turn. */
async function pushBlock(
  store: StoreFile,
  roomId: string,
  from: string,
  to: string,
  source: BlockSource,
  opts: BlockOptions,
): Promise<OccupiedRange | null> {
  const room = store.rooms[roomId];
  if (!room) return null;

  const status =
    opts.status ?? (source === "chat" ? "reserved" : "confirmed");
  const holdHours = opts.holdHours ?? DEFAULT_HOLD_HOURS;
  const now = new Date();

  const entry: OccupiedRange = {
    ref: makeRef(store),
    from,
    to,
    source,
    status,
    createdAt: now.toISOString(),
    expiresAt:
      status === "reserved"
        ? new Date(now.getTime() + holdHours * 3_600_000).toISOString()
        : null,
    guest: opts.guest,
  };

  room.occupied.push(entry);
  audit(
    store,
    opts.actor,
    "block",
    `${entry.ref} ${roomId} ${from}→${to} (${status}, ${source})`,
  );
  await persist(store);
  return entry;
}

/** Block a range unchecked (self-tests / forced ops). Prefer tryBlockRange. */
export async function blockRange(
  roomId: string,
  from: string,
  to: string,
  source: BlockSource,
  opts: BlockOptions,
): Promise<OccupiedRange | null> {
  return withStore((store) =>
    pushBlock(store, roomId, from, to, source, opts),
  );
}

/**
 * Atomic verify-then-block: checkAvailability and the write share one
 * store turn (in-process queue + cross-process lock), so two writers can
 * never both succeed on overlapping ranges. This is the gate every real
 * booking path must use.
 */
export async function tryBlockRange(
  roomId: string,
  from: string,
  to: string,
  source: BlockSource,
  opts: BlockOptions,
): Promise<
  | { ok: true; entry: OccupiedRange }
  | { ok: false; result: Extract<AvailabilityResult, { ok: false }> }
> {
  return withStore(async (store) => {
    const room = store.rooms[roomId];
    const result = checkAvailability(room ?? undefined, from, to);
    if (!result.ok) return { ok: false, result };
    const entry = await pushBlock(store, roomId, from, to, source, opts);
    if (!entry) {
      return { ok: false, result: { ok: false, reason: "unknown-room" } };
    }
    return { ok: true, entry };
  });
}

/** Confirm a live hold: reserved → confirmed, expiry cleared. */
export async function confirmRange(
  ref: string,
  actor: string,
): Promise<boolean> {
  return withStore(async (store) => {
    for (const room of Object.values(store.rooms)) {
      const hit = room.occupied.find((o) => o.ref === ref);
      if (hit && hit.status === "reserved") {
        hit.status = "confirmed";
        hit.expiresAt = null;
        audit(store, actor, "confirm", `${ref} in ${room.id}`);
        await persist(store);
        return true;
      }
    }
    return false;
  });
}

export async function releaseRange(
  ref: string,
  actor: string,
): Promise<boolean> {
  return withStore(async (store) => {
    for (const room of Object.values(store.rooms)) {
      const hit = room.occupied.find((o) => o.ref === ref);
      if (hit && hit.status !== "released") {
        hit.status = "released";
        audit(store, actor, "release", `${ref} in ${room.id}`);
        await persist(store);
        return true;
      }
    }
    return false;
  });
}

export async function updateRoom(
  roomId: string,
  patch: Partial<
    Pick<
      RoomState,
      "paused" | "turnoverBufferDays" | "minNights" | "note" | "rateNote"
    >
  >,
  actor: string,
): Promise<boolean> {
  return withStore(async (store) => {
    const room = store.rooms[roomId];
    if (!room) return false;
    Object.assign(room, patch);
    audit(
      store,
      actor,
      "update-room",
      `${roomId}: ${JSON.stringify(patch)}`,
    );
    await persist(store);
    return true;
  });
}

export function findRef(
  store: StoreFile,
  ref: string,
): { room: RoomState; entry: OccupiedRange } | null {
  for (const room of Object.values(store.rooms)) {
    const entry = room.occupied.find((o) => o.ref === ref);
    if (entry) return { room, entry };
  }
  return null;
}

// ── Snapshots ────────────────────────────────────────────────

export type PublicRoomSnapshot = {
  id: string;
  name: string;
  location: string;
  paused: boolean;
  minNights: number;
  turnoverBufferDays: number;
  note: string | null;
  rateNote: string | null;
  occupied: {
    ref: string;
    from: string;
    to: string;
    status: BookingStatus;
    expiresAt?: string | null;
    guest?: { name?: string; phone?: string };
  }[];
};

/** includePrivate=true adds PII — admin/Telegram use only. */
export async function boardSnapshot(
  includePrivate = false,
): Promise<PublicRoomSnapshot[]> {
  return withStore(async (store) => {
    const now = new Date();
    return RESIDENCES.map((r) => {
      const room = store.rooms[r.id] ?? seedRoom(r.id);
      return {
        id: r.id,
        name: r.bookingLabel,
        location: r.location,
        paused: room.paused,
        minNights: room.minNights,
        turnoverBufferDays: room.turnoverBufferDays,
        note: room.note,
        rateNote: room.rateNote,
        occupied: activeOccupied(room, now).map((o) => ({
          ref: o.ref,
          from: o.from,
          to: o.to,
          status: o.status,
          ...(includePrivate
            ? { expiresAt: o.expiresAt, guest: o.guest }
            : {}),
        })),
      };
    });
  });
}

/** Convenience: fetch one room's live state inside the writer queue. */
export async function getRoom(roomId: string): Promise<RoomState | null> {
  return withStore(async (store) => store.rooms[roomId] ?? null);
}
