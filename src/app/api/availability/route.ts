// GET /api/availability — public (PII-free) availability board.
//   ?room=<id>&from=YYYY-MM-DD&to=YYYY-MM-DD  -> live check for one range;
//     conflict echoes are PII-safe (guest name/phone never leave the server)
// POST /api/availability (dev-only) — engine self-test; returns pass/fail.

import { NextResponse } from "next/server";
import {
  addDaysISO,
  blockRange,
  boardSnapshot,
  checkAvailability,
  getRoom,
  releaseRange,
  updateRoom,
} from "@/lib/store";
import type { OccupiedRange } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Public echo of a conflicting range — strips guest PII (name/phone). */
function publicConflict(c: OccupiedRange): Omit<OccupiedRange, "guest"> {
  return {
    ref: c.ref,
    from: c.from,
    to: c.to,
    source: c.source,
    status: c.status,
    createdAt: c.createdAt,
    expiresAt: c.expiresAt,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const room = url.searchParams.get("room");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (room && from && to) {
    const state = await getRoom(room);
    const result = checkAvailability(state ?? undefined, from, to);
    const safe =
      !result.ok && result.conflict
        ? { ...result, conflict: publicConflict(result.conflict) }
        : result;
    return NextResponse.json({ room, from, to, ...safe });
  }

  const board = await boardSnapshot(false);
  return NextResponse.json({ generatedAt: new Date().toISOString(), board });
}

type Step = { name: string; pass: boolean; detail?: string };

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const roomId = "05-spintex-two-bedroom-75";
  const steps: Step[] = [];
  const push = (name: string, pass: boolean, detail?: string) =>
    steps.push({ name, pass, detail });

  try {
    // 1. far-future range is free
    const r1 = checkAvailability(
      (await getRoom(roomId)) ?? undefined,
      "2035-01-01",
      "2035-01-05",
    );
    push("free window is available", r1.ok === true && r1.nights === 4);

    // 2. block part of it (with guest PII) and see the overlap rejected
    const entry = await blockRange(roomId, "2035-01-02", "2035-01-04", "selftest", {
      actor: "selftest",
      guest: { name: "Selftest Guest", phone: "+233200000000" },
    });
    push("block created with ref", !!entry?.ref, entry?.ref);
    const ref = entry?.ref ?? "";

    // 2b. public conflict echo never leaks guest PII
    const echo = entry ? publicConflict(entry) : null;
    push(
      "conflict echo strips guest PII",
      !!echo && echo.ref === ref && !("guest" in echo),
    );

    const r2 = checkAvailability(
      (await getRoom(roomId)) ?? undefined,
      "2035-01-01",
      "2035-01-05",
    );
    push("overlapping window rejected", !r2.ok && r2.reason === "overlap");

    // 3. half-open ranges: departure day == next arrival day is allowed
    const r3 = checkAvailability(
      (await getRoom(roomId)) ?? undefined,
      "2035-01-04",
      "2035-01-06",
    );
    push("back-to-back window allowed", r3.ok === true);

    // 4. turnover buffer closes that same window
    await updateRoom(roomId, { turnoverBufferDays: 1 }, "selftest");
    const r4 = checkAvailability(
      (await getRoom(roomId)) ?? undefined,
      "2035-01-04",
      "2035-01-06",
    );
    push("buffer day blocks back-to-back", !r4.ok && r4.reason === "overlap");
    await updateRoom(roomId, { turnoverBufferDays: 0 }, "selftest");

    // 5. min-nights rule
    await updateRoom(roomId, { minNights: 3 }, "selftest");
    const r5 = checkAvailability(
      (await getRoom(roomId)) ?? undefined,
      "2035-02-01",
      "2035-02-03",
    );
    push("min-nights enforced", !r5.ok && r5.reason === "min-nights");
    await updateRoom(roomId, { minNights: 1 }, "selftest");

    // 6. expired reserved hold frees inventory (lazy expiry)
    const expired = await blockRange(
      roomId,
      "2035-03-01",
      "2035-03-03",
      "selftest",
      { actor: "selftest", holdHours: -1, status: "reserved" },
    );
    const r6 = checkAvailability(
      (await getRoom(roomId)) ?? undefined,
      "2035-03-01",
      "2035-03-03",
    );
    push("expired hold frees the room", r6.ok === true, expired?.ref);
    if (expired?.ref) await releaseRange(expired.ref, "selftest");

    // 7. release restores availability
    const released = await releaseRange(ref, "selftest");
    const r7 = checkAvailability(
      (await getRoom(roomId)) ?? undefined,
      "2035-01-01",
      "2035-01-05",
    );
    push("release frees the original window", released && r7.ok === true);

    // 8. buffer helper sanity
    push(
      "date math correct",
      addDaysISO("2035-01-31", 1) === "2035-02-01",
    );

    const pass = steps.every((s) => s.pass);
    return NextResponse.json({ pass, steps });
  } catch (error) {
    return NextResponse.json(
      { pass: false, steps, error: String(error) },
      { status: 500 },
    );
  }
}
