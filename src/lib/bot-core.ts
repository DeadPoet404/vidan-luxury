// ─────────────────────────────────────────────────────────────
// Vidan 24/7 admin bot — pure conversation brain.
//
// Every Telegram side-effect goes through the injected BotDeps, so
// the entire state machine (commands, guided flows, buttons) can be
// exercised end-to-end in tests without touching the network.
//
// Rules baked in here:
//  • Only whitelisted admin chat IDs get answers — everyone else is
//    ignored silently.
//  • The bot NEVER overrides the store: blocks go through
//    tryBlockRange (server-side verification), so a conflict with an
//    existing hold/booking is reported, never overwritten.
//  • Every action is audited with actor = tg:<chatId>.
// ─────────────────────────────────────────────────────────────

import { RESIDENCES } from "@/lib/residences";
import {
  addDaysISO,
  boardSnapshot,
  confirmRange,
  getRoom,
  isISODate,
  nightsBetweenISO,
  releaseRange,
  tryBlockRange,
  updateRoom,
  type AvailabilityResult,
} from "@/lib/store";
import type {
  InlineButton,
  ReplyMarkup,
  TgCallbackQuery,
  TgMessage,
  TgUpdate,
} from "@/lib/telegram";

export type BotDeps = {
  send(chatId: number, text: string, markup?: ReplyMarkup): Promise<void>;
  edit(
    chatId: number,
    messageId: number,
    text: string,
    markup?: ReplyMarkup,
  ): Promise<void>;
  answer(callbackQueryId: string, text?: string): Promise<void>;
};

export type BotConfig = {
  adminChatIds: ReadonlySet<number>;
};

// ── Persistent reply keyboard (one-tap commands on phones) ────

const L_STATUS = "📊 Status";
const L_BLOCK = "🔒 Block dates";
const L_UNBLOCK = "🔓 Unblock";
const L_BOOKINGS = "📋 Bookings";
const L_PAUSE = "⏸️ Pause/Resume";
const L_HELP = "❓ Help";

const MAIN_KEYBOARD: ReplyMarkup = {
  keyboard: [
    [{ text: L_STATUS }, { text: L_BLOCK }],
    [{ text: L_UNBLOCK }, { text: L_BOOKINGS }],
    [{ text: L_PAUSE }, { text: L_HELP }],
  ],
  resize_keyboard: true,
  is_persistent: true,
};

// ── Guided-flow state (in-memory; 10 minute TTL) ──────────────

type FlowKind =
  | { kind: "block-room" }
  | { kind: "block-range"; roomId: string }
  | { kind: "block-custom"; roomId: string }
  | { kind: "block-confirm"; roomId: string; from: string; to: string };

type Flow = FlowKind & { at: number };

const FLOW_TTL_MS = 10 * 60_000;
const flows = new Map<number, Flow>();

function setFlow(chatId: number, kind: FlowKind): void {
  flows.set(chatId, { ...kind, at: Date.now() });
}

function getFlow(chatId: number): FlowKind | null {
  const flow = flows.get(chatId);
  if (!flow) return null;
  if (Date.now() - flow.at > FLOW_TTL_MS) {
    flows.delete(chatId);
    return null;
  }
  return flow;
}

function clearFlow(chatId: number): void {
  flows.delete(chatId);
}

// ── Small helpers ──────────────────────────────────────────────

function resById(id: string) {
  return RESIDENCES.find((r) => r.id === id);
}

function roomLabel(id: string): string {
  return resById(id)?.bookingLabel ?? id;
}

/** Today's date in Ghana, YYYY-MM-DD. */
export function accraTodayISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
  }).format(now);
}

/** Coming Saturday → Monday (today counts if it is Saturday/Sunday). */
export function weekendRangeISO(today: string): { from: string; to: string } {
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0=Sun … 6=Sat
  const untilSat = (6 - dow + 7) % 7;
  const from = addDaysISO(today, untilSat);
  return { from, to: addDaysISO(from, 2) };
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-12-24" → "24 Dec" */
function shortDay(iso: string): string {
  const [, mm, dd] = iso.split("-");
  return `${Number(dd)} ${MONTHS[Number(mm) - 1]}`;
}

function reasonText(
  result: Extract<AvailabilityResult, { ok: false }>,
  label: string,
): string {
  switch (result.reason) {
    case "paused":
      return `⏸️ ${label} is paused — resume it first (⏸️ Pause/Resume).`;
    case "overlap":
      return `⚠️ Conflict: ${
        result.conflict
          ? `${result.conflict.ref} already blocks ${result.conflict.from} → ${result.conflict.to}.`
          : "those dates are already taken."
      }\nPick other dates, or release that range first.`;
    case "min-nights":
      return `⚠️ Minimum stay at ${label} is ${result.minNights ?? "?"} nights.`;
    case "invalid-dates":
      return "⚠️ Invalid dates — expected YYYY-MM-DD with checkout after arrival.";
    default:
      return "⚠️ Unknown residence.";
  }
}

// ── Keyboards ─────────────────────────────────────────────────

const BTN_CANCEL: InlineButton = { text: "❌ Cancel", callback_data: "b:no" };

function roomPickerKeyboard(): InlineButton[][] {
  return [
    ...RESIDENCES.map((r) => [
      { text: `🏠 ${r.bookingLabel}`, callback_data: `b:r:${r.id}` },
    ]),
    [BTN_CANCEL],
  ];
}

function quickRangeKeyboard(today: string): InlineButton[][] {
  const wk = weekendRangeISO(today);
  return [
    [
      {
        text: `🗓 This weekend (${shortDay(wk.from)} → ${shortDay(wk.to)})`,
        callback_data: "b:g:weekend",
      },
    ],
    [{ text: "🗓 Next 7 days", callback_data: "b:g:7d" }],
    [{ text: "🗓 Next 14 days", callback_data: "b:g:14d" }],
    [{ text: "✍️ Custom dates…", callback_data: "b:g:custom" }],
    [BTN_CANCEL],
  ];
}

function confirmKeyboard(): InlineButton[][] {
  return [
    [{ text: "✅ Block these dates", callback_data: "b:ok" }],
    [BTN_CANCEL],
  ];
}

function startOverKeyboard(): InlineButton[][] {
  return [
    [{ text: "↩️ Start blocking again", callback_data: "b:start" }],
    [BTN_CANCEL],
  ];
}

function confirmScreenText(roomId: string, from: string, to: string): string {
  const nights = nightsBetweenISO(from, to);
  return [
    "🔒 Confirm this block?",
    "",
    `🏠 ${roomLabel(roomId)}`,
    `📅 ${from} → ${to} (${nights} night${nights === 1 ? "" : "s"})`,
    "",
    "It takes effect instantly — the AI stops offering these dates.",
  ].join("\n");
}

// ── Board renderers ────────────────────────────────────────────

async function sendStatus(chatId: number, deps: BotDeps): Promise<void> {
  const board = await boardSnapshot(false);
  const lines: string[] = ["📊 Live availability board", ""];
  for (const room of board) {
    if (room.paused) {
      lines.push(`⏸️ ${room.name} — paused (hidden from the AI)`);
      continue;
    }
    if (room.occupied.length === 0) {
      lines.push(`🟢 ${room.name} — free`);
      continue;
    }
    const upcoming = [...room.occupied].sort((a, b) =>
      a.from.localeCompare(b.from),
    );
    lines.push(`🔴 ${room.name} — ${upcoming.length} blocked range(s)`);
    for (const o of upcoming.slice(0, 3)) {
      lines.push(
        `     • ${o.ref}: ${o.from} → ${o.to}${
          o.status === "reserved" ? " (hold)" : ""
        }`,
      );
    }
    if (upcoming.length > 3) lines.push(`     … +${upcoming.length - 3} more`);
  }
  lines.push(
    "",
    "🔒 Block dates marks a residence occupied (offline bookings).",
    "🔓 Unblock releases a range by ref.",
  );
  await deps.send(chatId, lines.join("\n"), MAIN_KEYBOARD);
}

async function sendBookings(chatId: number, deps: BotDeps): Promise<void> {
  const board = await boardSnapshot(true); // admin-only: includes guest PII
  const rows: string[] = [];
  for (const room of board) {
    const active = [...room.occupied].sort((a, b) =>
      a.from.localeCompare(b.from),
    );
    for (const o of active) {
      const badge =
        o.status === "reserved"
          ? `⏳ hold · expires ${o.expiresAt?.slice(0, 10) ?? "?"}`
          : `🔖 ${o.status}`;
      const guest =
        o.guest && (o.guest.name || o.guest.phone)
          ? `\n   👤 ${o.guest.name ?? "?"} · ${o.guest.phone ?? "?"}`
          : "";
      rows.push(
        `${o.ref} — ${room.name}\n   📅 ${o.from} → ${o.to} (${nightsBetweenISO(
          o.from,
          o.to,
        )} nights, ${badge})${guest}`,
      );
    }
  }
  if (rows.length === 0) {
    await deps.send(
      chatId,
      "📋 No active holds or bookings right now.",
      MAIN_KEYBOARD,
    );
    return;
  }
  const kept: string[] = [];
  let size = 0;
  for (const row of rows) {
    if (size + row.length > 3_600) break;
    kept.push(row);
    size += row.length + 2;
  }
  const extra = rows.length - kept.length;
  await deps.send(
    chatId,
    `📋 Active holds & bookings\n\n${kept.join("\n\n")}${
      extra > 0 ? `\n\n… and ${extra} more` : ""
    }`,
    MAIN_KEYBOARD,
  );
}

async function sendUnblockList(chatId: number, deps: BotDeps): Promise<void> {
  const board = await boardSnapshot(false);
  const rows: { ref: string; from: string; label: string }[] = [];
  for (const room of board) {
    for (const o of room.occupied) {
      rows.push({
        ref: o.ref,
        from: o.from,
        label: `🗑 ${o.ref} · ${room.name} · ${shortDay(o.from)} → ${shortDay(
          o.to,
        )}`,
      });
    }
  }
  if (rows.length === 0) {
    await deps.send(
      chatId,
      "✅ Nothing is blocked right now — everything is bookable.",
      MAIN_KEYBOARD,
    );
    return;
  }
  rows.sort((a, b) => a.from.localeCompare(b.from));
  const kb = rows
    .slice(0, 14)
    .map((r) => [{ text: r.label, callback_data: `r:ref:${r.ref}` }]);
  await deps.send(
    chatId,
    `🔓 Tap a block to release it:${
      rows.length > 14 ? `\n(showing the first 14 of ${rows.length})` : ""
    }`,
    { inline_keyboard: kb },
  );
}

async function renderPauseMenu(
  chatId: number,
  deps: BotDeps,
  edit?: { messageId: number },
): Promise<void> {
  const board = await boardSnapshot(false);
  const kb: InlineButton[][] = board.map((room) => [
    {
      text: room.paused ? `▶️ ${room.name} (paused)` : `⏸️ ${room.name}`,
      callback_data: `t:p:${room.id}`,
    },
  ]);
  const text = [
    "⏸️ Pause / resume a residence",
    "",
    "Paused residences are completely hidden from the AI — never suggested, never bookable. Tap to toggle:",
  ].join("\n");
  if (edit) {
    await deps.edit(chatId, edit.messageId, text, { inline_keyboard: kb });
  } else {
    await deps.send(chatId, text, { inline_keyboard: kb });
  }
}

const HELP_TEXT = [
  "🤖 Vidan 24/7 admin console",
  "",
  "Everything you do here updates the AI concierge and the live availability board instantly.",
  "",
  `📊 Status — live availability board`,
  `🔒 Block dates — mark a residence occupied (offline bookings)`,
  `🔓 Unblock — release a blocked range by ref`,
  `📋 Bookings — every active hold & booking, with refs`,
  `⏸️ Pause/Resume — hide/show a residence from the AI`,
  "",
  "Commands: /status /block /unblock /bookings /pause /resume",
  "/release VX-XXXX · /cancel",
].join("\n");

// ── Message handling ───────────────────────────────────────────

function commandOf(text: string): { cmd: string; arg: string } {
  const noSlash = text.replace(/^\//, "");
  const [rawCmd, ...rest] = noSlash.split(/\s+/);
  return { cmd: rawCmd.split("@")[0].toLowerCase(), arg: rest.join(" ") };
}

async function handleMessage(
  msg: TgMessage,
  cfg: BotConfig,
  deps: BotDeps,
): Promise<void> {
  const chatId = msg.chat.id;
  if (!cfg.adminChatIds.has(chatId)) return; // private bot: ignore strangers

  const actor = `tg:${chatId}`;
  const text = (msg.text ?? "").trim();
  if (!text) return;

  const flow = getFlow(chatId);

  // Guided custom-dates input (typed, not a command)
  if (
    flow?.kind === "block-custom" &&
    !text.startsWith("/") &&
    !isMainLabel(text)
  ) {
    const match = text.match(/(\d{4}-\d{2}-\d{2})\D+(\d{4}-\d{2}-\d{2})/);
    const from = match?.[1];
    const to = match?.[2];
    if (!from || !to || !isISODate(from) || !isISODate(to) || to <= from) {
      await deps.send(
        chatId,
        "⚠️ Couldn't read those dates. Send them like:\n2026-12-24 2027-01-02\n(arrival first, checkout second)",
        { inline_keyboard: [[BTN_CANCEL]] },
      );
      return;
    }
    setFlow(chatId, { kind: "block-confirm", roomId: flow.roomId, from, to });
    await deps.send(chatId, confirmScreenText(flow.roomId, from, to), {
      inline_keyboard: confirmKeyboard(),
    });
    return;
  }

  const { cmd, arg } = text.startsWith("/")
    ? commandOf(text)
    : { cmd: text, arg: "" };

  switch (cmd) {
    case "start":
    case "help":
    case L_HELP: {
      clearFlow(chatId);
      await deps.send(chatId, HELP_TEXT, MAIN_KEYBOARD);
      return;
    }
    case "cancel": {
      clearFlow(chatId);
      await deps.send(chatId, "✅ Cancelled — nothing changed.", MAIN_KEYBOARD);
      return;
    }
    case "status":
    case L_STATUS: {
      await sendStatus(chatId, deps);
      return;
    }
    case "bookings":
    case L_BOOKINGS: {
      await sendBookings(chatId, deps);
      return;
    }
    case "block":
    case L_BLOCK: {
      setFlow(chatId, { kind: "block-room" });
      await deps.send(chatId, "🔒 Block dates\n\nWhich residence?", {
        inline_keyboard: roomPickerKeyboard(),
      });
      return;
    }
    case "unblock":
    case L_UNBLOCK: {
      await sendUnblockList(chatId, deps);
      return;
    }
    case "pause":
    case "resume":
    case L_PAUSE: {
      await renderPauseMenu(chatId, deps);
      return;
    }
    case "release": {
      const ref = arg.toUpperCase();
      if (!/^VX-[0-9A-F]{4,8}$/.test(ref)) {
        await deps.send(
          chatId,
          "Usage: /release VX-XXXX — or pick from the list:",
          { inline_keyboard: roomPickerKeyboard() },
        );
        await sendUnblockList(chatId, deps);
        return;
      }
      const ok = await releaseRange(ref, actor);
      await deps.send(
        chatId,
        ok
          ? `✅ Released ${ref} — those dates are bookable again.`
          : `⚠️ ${ref} not found (already released or expired).`,
        MAIN_KEYBOARD,
      );
      return;
    }
    default: {
      await deps.send(
        chatId,
        "🤔 I didn't catch that. Tap a button below or /help.",
        MAIN_KEYBOARD,
      );
      return;
    }
  }
}

function isMainLabel(text: string): boolean {
  return [L_STATUS, L_BLOCK, L_UNBLOCK, L_BOOKINGS, L_PAUSE, L_HELP].includes(
    text,
  );
}

// ── Button (callback query) handling ───────────────────────────

async function handleCallback(
  cb: TgCallbackQuery,
  cfg: BotConfig,
  deps: BotDeps,
): Promise<void> {
  const msg = cb.message;
  const chatId = msg?.chat.id ?? cb.from.id;
  if (!cfg.adminChatIds.has(chatId)) return;

  const actor = `tg:${chatId}`;
  const data = cb.data ?? "";
  const edit = (text: string, markup?: ReplyMarkup) =>
    msg
      ? deps.edit(chatId, msg.message_id, text, markup)
      : deps.send(chatId, text, markup);

  // ── block flow ──
  if (data === "b:start") {
    setFlow(chatId, { kind: "block-room" });
    await deps.answer(cb.id);
    await edit("🔒 Block dates\n\nWhich residence?", {
      inline_keyboard: roomPickerKeyboard(),
    });
    return;
  }

  if (data === "b:no") {
    clearFlow(chatId);
    await deps.answer(cb.id);
    await edit("✅ Cancelled — nothing changed.");
    return;
  }

  if (data.startsWith("b:r:")) {
    const roomId = data.slice(4);
    if (!resById(roomId)) {
      await deps.answer(cb.id, "Unknown residence");
      return;
    }
    setFlow(chatId, { kind: "block-range", roomId });
    await deps.answer(cb.id);
    await edit(`🔒 ${roomLabel(roomId)}\n\nPick a range, or choose custom:`, {
      inline_keyboard: quickRangeKeyboard(accraTodayISO()),
    });
    return;
  }

  if (data.startsWith("b:g:")) {
    const preset = data.slice(4);
    const flow = getFlow(chatId);
    if (flow?.kind !== "block-range") {
      await deps.answer(cb.id, "That flow expired");
      await edit("⌛ This flow expired. Start again?", {
        inline_keyboard: startOverKeyboard(),
      });
      return;
    }
    if (preset === "custom") {
      setFlow(chatId, { kind: "block-custom", roomId: flow.roomId });
      await deps.answer(cb.id);
      await edit(
        `✍️ Custom dates for ${roomLabel(flow.roomId)}\n\nSend them in one message, like:\n2026-12-24 2027-01-02`,
        { inline_keyboard: [[BTN_CANCEL]] },
      );
      return;
    }
    const today = accraTodayISO();
    const range =
      preset === "weekend"
        ? weekendRangeISO(today)
        : preset === "7d"
          ? { from: today, to: addDaysISO(today, 7) }
          : preset === "14d"
            ? { from: today, to: addDaysISO(today, 14) }
            : null;
    if (!range) {
      await deps.answer(cb.id, "Unknown range");
      return;
    }
    setFlow(chatId, { kind: "block-confirm", roomId: flow.roomId, ...range });
    await deps.answer(cb.id);
    await edit(confirmScreenText(flow.roomId, range.from, range.to), {
      inline_keyboard: confirmKeyboard(),
    });
    return;
  }

  if (data === "b:ok") {
    const flow = getFlow(chatId);
    if (flow?.kind !== "block-confirm") {
      await deps.answer(cb.id, "That flow expired");
      await edit("⌛ This flow expired. Start again?", {
        inline_keyboard: startOverKeyboard(),
      });
      return;
    }
    // Server-verified commit — the store re-checks availability inside the
    // lock, so races with chat bookings are rejected, never double-booked.
    const outcome = await tryBlockRange(
      flow.roomId,
      flow.from,
      flow.to,
      "telegram",
      { actor },
    );
    clearFlow(chatId);
    if (!outcome.ok) {
      await deps.answer(cb.id, "Conflict");
      await edit(
        `${reasonText(outcome.result, roomLabel(flow.roomId))}`,
        { inline_keyboard: startOverKeyboard() },
      );
      return;
    }
    const { entry } = outcome;
    await deps.answer(cb.id, "Blocked ✔");
    await edit(
      [
        `🔒 Blocked — ${roomLabel(flow.roomId)}`,
        `📅 ${entry.from} → ${entry.to} (${nightsBetweenISO(
          entry.from,
          entry.to,
        )} nights)`,
        `Ref ${entry.ref} · status confirmed`,
        "",
        "The AI now treats those dates as occupied.",
      ].join("\n"),
      {
        inline_keyboard: [
          [{ text: `↩️ Undo (release ${entry.ref})`, callback_data: `r:ref:${entry.ref}` }],
        ],
      },
    );
    return;
  }

  // ── releases ──
  if (data.startsWith("r:ref:")) {
    const ref = data.slice(6);
    const ok = await releaseRange(ref, actor);
    await deps.answer(cb.id, ok ? "Released ✔" : "Not found");
    await edit(
      ok
        ? `✅ Released ${ref} — those dates are bookable again.`
        : `⚠️ ${ref} is no longer active (already released or expired).`,
    );
    return;
  }

  // ── pause/resume toggles ──
  if (data.startsWith("t:p:")) {
    const roomId = data.slice(4);
    const room = await getRoom(roomId);
    if (!room) {
      await deps.answer(cb.id, "Unknown residence");
      return;
    }
    await updateRoom(roomId, { paused: !room.paused }, actor);
    await deps.answer(
      cb.id,
      `${roomLabel(roomId)} ${room.paused ? "resumed ▶️" : "paused ⏸️"}`,
    );
    if (msg) {
      await renderPauseMenu(chatId, deps, { messageId: msg.message_id });
    }
    return;
  }

  // ── booking-alert buttons (wired on chat alerts in the next increment) ──
  if (data.startsWith("a:ok:") || data.startsWith("a:drop:")) {
    const ref = data.split(":")[2] ?? "";
    const confirming = data.startsWith("a:ok:");
    const ok = confirming
      ? await confirmRange(ref, actor)
      : await releaseRange(ref, actor);
    await deps.answer(
      cb.id,
      ok
        ? confirming
          ? "Confirmed ✔"
          : "Released ✔"
        : "No longer pending",
    );
    if (msg) {
      const suffix = ok
        ? confirming
          ? "\n\n✅ Confirmed by admin"
          : "\n\n🗑 Released by admin"
        : "\n\nℹ️ No longer pending (already resolved)";
      await deps.edit(chatId, msg.message_id, `${msg.text ?? ""}${suffix}`, {
        inline_keyboard: [],
      });
    }
    return;
  }

  await deps.answer(cb.id);
}

// ── Entry point ────────────────────────────────────────────────

export async function handleUpdate(
  update: TgUpdate,
  cfg: BotConfig,
  deps: BotDeps,
): Promise<void> {
  try {
    if (update.message) {
      await handleMessage(update.message, cfg, deps);
    } else if (update.callback_query) {
      await handleCallback(update.callback_query, cfg, deps);
    }
  } catch (error) {
    // A failed update must never kill the poll loop.
    console.error("[bot] update failed:", error);
  }
}
