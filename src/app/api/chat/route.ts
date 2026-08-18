// POST /api/chat — Vidan AI Concierge
// Browser sends the conversation; we answer via Gemini (structured JSON)
// with the LIVE availability board injected into its instructions.
// Falls back to a scripted assistant when no key is configured or on error.
// When a booking completes, WE — not the model — verify + lock the dates in
// the availability store (tryBlockRange is atomic), then alert the team on
// Telegram with the booking ref and release/confirm buttons.

import { NextResponse } from "next/server";
import {
  buildSystemPrompt,
  coerceResponse,
  fallbackConcierge,
  formatAlertText,
  resolveResidenceId,
  RESPONSE_SCHEMA,
  sendTelegramAlert,
  withNote,
  type AlertButton,
  type ChatMessage,
  type ConciergeBooking,
  type ConciergeResponse,
} from "@/lib/concierge";
import {
  boardSnapshot,
  tryBlockRange,
  type AvailabilityResult,
  type BookingStatus,
  type PublicRoomSnapshot,
} from "@/lib/store";
import { RESIDENCES } from "@/lib/residences";

export const dynamic = "force-dynamic";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const MAX_MESSAGES = 24;
const MAX_CHARS = 2000;

/** "confirmed" = instant block (default). "reserved" = 24h hold + confirm button. */
const CHAT_BLOCK_STATUS: BookingStatus =
  process.env.BOOKING_CHAT_STATUS === "reserved" ? "reserved" : "confirmed";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function isRole(value: unknown): value is ChatMessage["role"] {
  return value === "user" || value === "model";
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: ChatMessage[] = [];
  for (const item of raw.slice(-MAX_MESSAGES)) {
    const role = (item as { role?: unknown })?.role;
    const content = (item as { content?: unknown })?.content;
    if (isRole(role) && typeof content === "string" && content.trim()) {
      messages.push({ role, content: content.slice(0, MAX_CHARS) });
    }
  }
  return messages.length ? messages : null;
}

async function askGemini(
  messages: ChatMessage[],
  board: PublicRoomSnapshot[] | undefined,
): Promise<unknown> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt(board) }],
        },
        contents: messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
      signal: AbortSignal.timeout(25_000),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    console.error(`[concierge] Gemini HTTP ${res.status}: ${detail}`);
    throw new Error(`Gemini HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("");

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini returned non-JSON content.");
  }
}

// ── Server-side booking commit gate ──────────────────────────

type GateOutcome =
  | { kind: "blocked"; ref: string; status: BookingStatus }
  | { kind: "duplicate"; ref: string }
  | { kind: "conflict"; reason: string };

/** Mid-sentence explanation for a failed gate attempt. */
function gateReason(
  label: string,
  result: Extract<AvailabilityResult, { ok: false }>,
): string {
  switch (result.reason) {
    case "overlap":
      return result.conflict
        ? `${label} is already taken from ${result.conflict.from} to ${result.conflict.to} (ref ${result.conflict.ref})`
        : `${label} is already taken for some of those nights`;
    case "min-nights":
      return `${label} requires a minimum stay of ${result.minNights ?? "more"} nights`;
    case "paused":
      return `${label} is temporarily unavailable`;
    case "invalid-dates":
      return "those dates do not form a valid stay (checkout must be after arrival)";
    default:
      return `${label} could not be matched to one of our residences`;
  }
}

export async function commitBooking(b: ConciergeBooking): Promise<GateOutcome> {
  const arrival = b.arrival ?? "";
  const departure = b.departure ?? "";
  const label = b.residence ?? "the chosen residence";

  const resolved = resolveResidenceId(b.residence);
  const anyMode = !resolved && b.residence !== null && /any/i.test(b.residence);
  if (!resolved && !anyMode) {
    return {
      kind: "conflict",
      reason: `I could not match "${label}" to one of our residences`,
    };
  }
  const roomIds = resolved ? [resolved] : RESIDENCES.map((r) => r.id);

  const guest = {
    name: b.guestName ?? undefined,
    phone: b.phone ?? undefined,
  };

  for (const roomId of roomIds) {
    const outcome = await tryBlockRange(roomId, arrival, departure, "chat", {
      actor: "chat",
      guest,
      status: CHAT_BLOCK_STATUS,
    });
    if (outcome.ok) {
      return {
        kind: "blocked",
        ref: outcome.entry.ref,
        status: outcome.entry.status,
      };
    }
    const { result } = outcome;
    if (result.reason === "overlap" && result.conflict) {
      const c = result.conflict;
      // Idempotency: identical stay + same guest phone => the booking was
      // already locked by an earlier message — reuse the ref silently.
      const sameStay = c.from === arrival && c.to === departure;
      const sameGuest = !b.phone || !c.guest?.phone || c.guest.phone === b.phone;
      if (sameStay && sameGuest) return { kind: "duplicate", ref: c.ref };
      if (resolved) {
        return { kind: "conflict", reason: gateReason(label, result) };
      }
      continue; // "any" mode: this residence is taken, try the next one
    }
    if (resolved) {
      return { kind: "conflict", reason: gateReason(label, result) };
    }
    // any mode + non-overlap refusal (paused, min-nights…): try next room
  }

  return {
    kind: "conflict",
    reason: "none of our residences is free for those exact dates right now",
  };
}

function refSentence(ref: string, status: BookingStatus): string {
  return status === "reserved"
    ? `\n\nYour booking reference is ${ref}; your dates are held and the Vidan team confirms on WhatsApp shortly.`
    : `\n\nYour booking reference is ${ref}. Your dates are now locked in our live availability — the Vidan team will confirm on WhatsApp shortly.`;
}

function alertButtons(ref: string, status: BookingStatus): AlertButton[][] {
  return status === "reserved"
    ? [
        [
          { text: "✅ Confirm booking", callback_data: `a:ok:${ref}` },
          { text: "🗑 Release", callback_data: `a:drop:${ref}` },
        ],
      ]
    : [[{ text: "🗑 Release booking", callback_data: `a:drop:${ref}` }]];
}

/** Gate + alert for a freshly completed booking. Never throws. */
async function finalizeBooking(
  response: ConciergeResponse,
): Promise<ConciergeResponse> {
  let gate: GateOutcome;
  try {
    gate = await commitBooking(response.booking);
  } catch (error) {
    console.error("[concierge] availability gate failed:", error);
    return {
      ...response,
      bookingComplete: false,
      bookingRef: null,
      alertSent: false,
      alertNote: `Availability gate error: ${String(error)}`,
      reply:
        "I am very sorry — I could not reach our live availability system just now. " +
        "Please try again in a moment, or message the team directly on WhatsApp.",
      suggestions: ["Try again", "WhatsApp the team"],
    };
  }

  if (gate.kind === "blocked") {
    const withRef: ConciergeResponse = {
      ...response,
      bookingRef: gate.ref,
      reply: response.reply.trimEnd() + refSentence(gate.ref, gate.status),
    };
    const alert = await sendTelegramAlert(
      formatAlertText(withRef.booking, withRef.source, {
        ref: gate.ref,
        status: gate.status,
        holdHours: Number(process.env.BOOKING_HOLD_HOURS ?? 24),
      }),
      alertButtons(gate.ref, gate.status),
    );
    return alert.ok
      ? { ...withRef, alertSent: true }
      : { ...withRef, alertSent: false, alertNote: alert.error };
  }

  if (gate.kind === "duplicate") {
    return {
      ...response,
      bookingRef: gate.ref,
      alertSent: true, // client echoes this back, so no further attempts
      alertNote: `Duplicate of ${gate.ref} — inventory was already locked; no new alert sent.`,
      reply:
        response.reply.trimEnd() +
        `\n\nYour booking reference is ${gate.ref} (already locked in our system).`,
    };
  }

  // Honest conflict: never present a failed commit as a success.
  return {
    ...response,
    bookingComplete: false,
    bookingRef: null,
    alertSent: false,
    alertNote: "Availability gate: no inventory taken.",
    reply:
      "I am very sorry — a live re-check of our availability shows " +
      `${gate.reason}. Would you like different dates, or shall I show you ` +
      "the closest matching residences?",
    suggestions: ["Different dates", "Show other residences", "WhatsApp the team"],
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const messages = parseMessages(body);
  if (!messages) {
    return badRequest("Body must include a non-empty messages array.");
  }
  if (messages[messages.length - 1].role !== "user") {
    return badRequest("The conversation must end with a user message.");
  }

  // The client echoes this back so we never alert twice for the same booking.
  const alreadyAlerted = (body as { alerted?: unknown }).alerted === true;

  // Live board for the model's instructions (undefined = graceful degrade).
  let board: PublicRoomSnapshot[] | undefined;
  try {
    board = await boardSnapshot(false);
  } catch (error) {
    console.error("[concierge] availability board unavailable:", error);
  }

  let response: ConciergeResponse;

  if (!process.env.GEMINI_API_KEY) {
    response = withNote(
      fallbackConcierge(messages),
      "GEMINI_API_KEY not configured — running scripted demo mode.",
    );
  } else {
    try {
      const parsed = await askGemini(messages, board);
      response = coerceResponse(parsed, "gemini");
    } catch (error) {
      console.error("[concierge] falling back to scripted mode:", error);
      response = withNote(
        fallbackConcierge(messages),
        "AI temporarily unavailable — scripted demo reply.",
      );
    }
  }

  // Commit to inventory + alert the team exactly once per completed booking.
  if (response.bookingComplete && !alreadyAlerted) {
    response = await finalizeBooking(response);
  }

  return NextResponse.json(response);
}
