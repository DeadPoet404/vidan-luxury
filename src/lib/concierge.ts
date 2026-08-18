// ─────────────────────────────────────────────────────────────
// Vidan AI Concierge — shared contract + Gemini helpers +
// scripted fallback (demo works even without an API key).
// Used by: src/app/api/chat/route.ts (server only)
// ─────────────────────────────────────────────────────────────

import { RESIDENCES } from "@/lib/residences";
import { addDaysISO, type PublicRoomSnapshot } from "@/lib/store";

export type ChatRole = "user" | "model";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ConciergeBooking {
  guestName: string | null;
  phone: string | null;
  residence: string | null;
  arrival: string | null;   // YYYY-MM-DD
  departure: string | null; // YYYY-MM-DD
  guests: string | null;
  purpose: string | null;
  requests: string | null;
}

export const EMPTY_BOOKING: ConciergeBooking = {
  guestName: null,
  phone: null,
  residence: null,
  arrival: null,
  departure: null,
  guests: null,
  purpose: null,
  requests: null,
};

export interface ConciergeResponse {
  reply: string;
  suggestions: string[];
  booking: ConciergeBooking;
  bookingComplete: boolean;
  source: "gemini" | "fallback";
  note?: string;
  /** Server-side booking ref once inventory is locked (e.g. "VX-4F2A") */
  bookingRef?: string | null;
  /** Present once a Telegram alert attempt was made for this booking */
  alertSent?: boolean;
  alertNote?: string;
}

// Fields that must be present before we alert the team.
const REQUIRED_FIELDS: (keyof ConciergeBooking)[] = [
  "guestName",
  "phone",
  "residence",
  "arrival",
  "departure",
  "guests",
];

export function isBookingComplete(b: ConciergeBooking): boolean {
  return REQUIRED_FIELDS.every((k) => !!b[k] && b[k]!.trim().length > 0);
}

// ── Gemini response schema (structured JSON output) ──────────

export const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    reply: {
      type: "STRING",
      description:
        "Concierge reply to the guest, warm and concise (max ~80 words).",
    },
    suggestions: {
      type: "ARRAY",
      description: "2-4 short follow-up quick replies the guest might tap.",
      items: { type: "STRING" },
    },
    booking: {
      type: "OBJECT",
      description:
        "Everything known so far about the booking enquiry, accumulated across the whole conversation.",
      properties: {
        guestName: { type: "STRING", nullable: true },
        phone: { type: "STRING", nullable: true },
        residence: {
          type: "STRING",
          nullable: true,
          description:
            "The exact residence label from the portfolio list, or 'Any available residence'.",
        },
        arrival: {
          type: "STRING",
          nullable: true,
          description: "YYYY-MM-DD",
        },
        departure: {
          type: "STRING",
          nullable: true,
          description: "YYYY-MM-DD",
        },
        guests: { type: "STRING", nullable: true },
        purpose: { type: "STRING", nullable: true },
        requests: { type: "STRING", nullable: true },
      },
      propertyOrdering: [
        "guestName",
        "phone",
        "residence",
        "arrival",
        "departure",
        "guests",
        "purpose",
        "requests",
      ],
    },
  },
  required: ["reply", "suggestions", "booking"],
  propertyOrdering: ["reply", "suggestions", "booking"],
} as const;

// ── System prompt built from the single source of truth ──────

function portfolioLines(): string {
  return RESIDENCES.map(
    (r, i) =>
      `${String(i + 1).padStart(2, "0")}. "${r.bookingLabel}" — ${r.type}, ` +
      `sleeps ${r.sleeps}, amenities: ${r.amenities.join(", ")}. ` +
      `Indicative rate: ${r.rateSummary}.`,
  ).join("\n");
}

function availabilityLines(board: PublicRoomSnapshot[]): string {
  const lines: string[] = [];
  for (const room of board) {
    if (room.paused) continue; // paused rooms are invisible to the AI
    const extras: string[] = [];
    if (room.minNights > 1) extras.push(`min ${room.minNights} nights`);
    if (room.rateNote) extras.push(`rate note: ${room.rateNote}`);
    if (room.note) extras.push(`note: ${room.note}`);
    const suffix = extras.length ? ` (${extras.join("; ")})` : "";
    const sorted = [...room.occupied].sort((a, b) =>
      a.from.localeCompare(b.from),
    );
    if (sorted.length === 0) {
      lines.push(`- "${room.name}": FREE — no current blocks${suffix}.`);
      continue;
    }
    const ranges = sorted
      .map((o) => `[${o.from} → ${addDaysISO(o.to, room.turnoverBufferDays)})`)
      .join(", ");
    lines.push(
      `- "${room.name}": BLOCKED ${ranges}; all other dates free${suffix}.`,
    );
  }
  return lines.join("\n");
}

function availabilitySection(board: PublicRoomSnapshot[] | undefined): string[] {
  if (!board) {
    return [
      "",
      "LIVE AVAILABILITY: the availability board could not be loaded right now — be honest that the team will confirm exact dates before anything is locked.",
    ];
  }
  return [
    "",
    "LIVE AVAILABILITY BOARD (authoritative snapshot, refreshed for every message):",
    availabilityLines(board),
    "",
    "AVAILABILITY RULES:",
    "- BLOCKED ranges are nights already taken, written [arrival → departure). If the guest's stay overlaps one even partially, those dates are NOT available: apologise briefly, name the conflict, and offer different dates or a FREE residence. Never promise, pencil in or 'request' blocked dates.",
    "- Back-to-back stays are allowed: arriving on the exact day a blocked range ends, or departing on the day one begins, is fine.",
    "- Residences absent from the board are paused and not offered: never recommend or mention them; if the guest asks for one by name, say it is currently unavailable and steer them to the listed ones.",
    "- When dates are FREE you may sound confident: the system locks those dates the moment the booking completes.",
  ];
}

export function buildSystemPrompt(board?: PublicRoomSnapshot[]): string {
  return [
    "You are the Vidan Concierge, the AI booking assistant for Vidan Luxury Apartments, a portfolio of furnished short-let residences in Accra, Ghana (East Legon, Cantonments, Spintex, Ashaley Botwe and Pantang).",
    "",
    "PORTFOLIO (the only residences that exist — never invent others):",
    portfolioLines(),
    ...availabilitySection(board),
    "",
    "YOUR GOAL: guide the guest from enquiry to a complete booking request. Collect, step by step (never more than one question per reply):",
    "1) guest full name, 2) WhatsApp phone number, 3) preferred residence (or 'Any available residence'), 4) arrival date, 5) departure date, 6) number of guests. Purpose and special requests are nice-to-have.",
    "",
    "RULES:",
    "- Rates are indicative starting prices per night; final rates are always confirmed by the Vidan team. Never quote a total price as final — you may estimate (nights x nightly rate) but label it 'indicative'.",
    "- The live availability board above is authoritative: it decides what is bookable, not you. Final rates are still confirmed by the team on WhatsApp.",
    "- Never share exact street addresses or payment links. Never ask for card details.",
    "- December in Accra is peak season ('Detty December') — encourage early confirmation.",
    "- Keep replies warm, polished and concise (max ~80 words). Short sentences. No emojis.",
    "- Dates must be normalised to YYYY-MM-DD in the booking fields.",
    "- The booking object you return must reflect EVERYTHING known so far in the conversation, not just the latest message.",
    "- Suggestions are 2-4 short next actions the guest could tap (e.g. 'See two-bedroom options').",
    "- If the guest goes off-topic, answer briefly and steer back to their stay.",
    "- When every required booking field is known AND the availability rules above allow it, summarise the stay and say the dates will be locked instantly and the Vidan team will confirm on WhatsApp shortly. If the rules do not allow it, do not complete the booking — offer alternatives instead.",
  ].join("\n");
}

/** Map whatever label the model produced to an actual residence id. */
export function resolveResidenceId(label: string | null): string | null {
  if (!label) return null;
  const needle = label.trim().toLowerCase();
  for (const r of RESIDENCES) {
    if (
      r.id === needle ||
      r.bookingLabel.toLowerCase() === needle ||
      r.name.toLowerCase() === needle
    ) {
      return r.id;
    }
  }
  for (const r of RESIDENCES) {
    if (
      needle.includes(r.bookingLabel.toLowerCase()) ||
      r.bookingLabel.toLowerCase().includes(needle) ||
      needle.includes(r.name.toLowerCase())
    ) {
      return r.id;
    }
  }
  return null;
}

// ── Coercion: sanitize whatever the model returns ───────────

function str(v: unknown, max = 120): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t.length ? t : null;
}

export function coerceBooking(input: unknown): ConciergeBooking {
  const o = (input ?? {}) as Record<string, unknown>;
  return {
    guestName: str(o.guestName, 80),
    phone: str(o.phone, 30),
    residence: str(o.residence, 90),
    arrival: str(o.arrival, 10),
    departure: str(o.departure, 10),
    guests: str(o.guests, 10),
    purpose: str(o.purpose, 40),
    requests: str(o.requests, 240),
  };
}

export function coerceResponse(
  input: unknown,
  source: ConciergeResponse["source"],
): ConciergeResponse {
  const o = (input ?? {}) as Record<string, unknown>;
  const rawSuggestions = Array.isArray(o.suggestions) ? o.suggestions : [];
  const suggestions = rawSuggestions
    .map((s) => str(s, 60))
    .filter((s): s is string => !!s)
    .slice(0, 4);
  const booking = coerceBooking(o.booking);
  return {
    reply: str(o.reply, 900) ?? "…",
    suggestions,
    booking,
    bookingComplete: isBookingComplete(booking),
    source,
  };
}

export function withNote(r: ConciergeResponse, note: string): ConciergeResponse {
  return { ...r, note };
}

// ── Telegram booking alerts ──────────────────────────────────

export function nightsBetween(
  arrival: string | null,
  departure: string | null,
): number | null {
  if (!arrival || !departure) return null;
  const a = Date.parse(`${arrival}T00:00:00Z`);
  const d = Date.parse(`${departure}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(d)) return null;
  const nights = Math.round((d - a) / 86_400_000);
  return nights > 0 ? nights : null;
}

function rateForResidence(label: string | null): string | null {
  if (!label) return null;
  const hit = RESIDENCES.find(
    (r) => r.bookingLabel === label || r.name === label,
  );
  return hit ? hit.rateSummary : null;
}

export type AlertExtras = {
  ref?: string | null;
  status?: string; // "confirmed" (instant) | "reserved" (timed hold)
  holdHours?: number;
};

export function formatAlertText(
  b: ConciergeBooking,
  source: string,
  extras: AlertExtras = {},
): string {
  const nights = nightsBetween(b.arrival, b.departure);
  const rate = rateForResidence(b.residence);
  const when = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Accra",
  });
  const locked = Boolean(extras.ref);

  return [
    locked
      ? `✅ BOOKING LOCKED — dates already blocked in the live system`
      : "NEW BOOKING REQUEST — Vidan Concierge (demo)",
    ...(locked
      ? [
          `Ref: ${extras.ref} · ${extras.status ?? "confirmed"}${
            extras.status === "reserved" && extras.holdHours
              ? ` (auto-expires in ${extras.holdHours}h unless confirmed)`
              : ""
          }`,
        ]
      : []),
    "",
    `Guest: ${b.guestName ?? "—"}`,
    `WhatsApp: ${b.phone ?? "—"}`,
    `Residence: ${b.residence ?? "—"}`,
    `Dates: ${b.arrival ?? "?"} to ${b.departure ?? "?"}${
      nights ? ` (${nights} night${nights === 1 ? "" : "s"})` : ""
    }`,
    `Guests: ${b.guests ?? "—"}`,
    `Purpose: ${b.purpose ?? "—"}`,
    `Requests: ${b.requests ?? "—"}`,
    `Indicative rate: ${rate ?? "best available direct rate"}`,
    `Assistant: ${source}`,
    `Received: ${when} (Accra)`,
    "",
    locked
      ? "The guest was told the dates are locked. Tap 🗑 Release only if this booking should be undone."
      : "Demo alert — confirm availability and the final rate with the guest on WhatsApp before payment.",
  ].join("\n");
}

export type AlertButton = { text: string; callback_data: string };

export async function sendTelegramAlert(
  text: string,
  buttons?: AlertButton[][],
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      ok: false,
      error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured",
    };
  }

  let lastError = "unknown error";

  // One automatic retry absorbs transient network hiccups (DNS/TLS).
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            disable_web_page_preview: true,
            ...(buttons && buttons.length
              ? { reply_markup: { inline_keyboard: buttons } }
              : {}),
          }),
          signal: AbortSignal.timeout(15_000),
          cache: "no-store",
        },
      );

      if (!res.ok) {
        lastError = `Telegram HTTP ${res.status}`;
        if (res.status < 500) break; // 4xx will not heal by retrying
        continue;
      }

      const data = (await res.json()) as {
        ok?: boolean;
        description?: string;
      };

      if (data.ok) return { ok: true };
      return {
        ok: false,
        error: data.description ?? "unknown Telegram error",
      };
    } catch (error) {
      const cause = (
        error as { cause?: { code?: string; message?: string } }
      )?.cause;
      lastError =
        cause?.code ??
        cause?.message ??
        (error instanceof Error ? error.message : "network error");

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    }
  }

  return { ok: false, error: lastError };
}

// ── Scripted fallback (no API key / Gemini unavailable) ─────

const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
};

function extractDates(text: string, b: ConciergeBooking) {
  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/g);
  if (iso && iso.length >= 1 && !b.arrival) b.arrival = iso[0];
  if (iso && iso.length >= 2 && !b.departure) b.departure = iso[1];

  if (!b.arrival || !b.departure) {
    const monthName =
      /\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s*(20\d{2})?/gi;
    const found: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = monthName.exec(text)) !== null) {
      const year = m[3] ?? "2026";
      found.push(
        `${year}-${MONTHS[m[2].toLowerCase()]}-${m[1].padStart(2, "0")}`,
      );
    }
    if (!b.arrival && found[0]) b.arrival = found[0];
    if (!b.departure && found[1]) b.departure = found[1];
  }
}

function extractResidence(
  text: string,
  b: ConciergeBooking,
): string | null {
  if (b.residence) return b.residence;
  const lower = text.toLowerCase();
  let best: { label: string; score: number } | null = null;
  for (const r of RESIDENCES) {
    const tokens = [
      ...r.location.toLowerCase().split(/\s+/),
      ...r.name
        .toLowerCase()
        .split(/[\s-]+/)
        .filter((t) => t.length > 4),
      r.id.includes("studio") ? "studio" : "",
    ];
    const score = tokens.reduce(
      (n, t) => (t && lower.includes(t) ? n + 1 : n),
      0,
    );
    if (score > (best?.score ?? 0)) {
      best = { label: r.bookingLabel, score };
    }
  }
  return best ? best.label : null;
}

function extractBooking(messages: ChatMessage[]): ConciergeBooking {
  const text = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
  const b = { ...EMPTY_BOOKING };

  const name = text.match(
    /my name is ([A-Za-z][A-Za-z'-]*(?: +[A-Za-z][A-Za-z'-]*){0,3})/i,
  );
  if (name) b.guestName = name[1].trim();

  const phone = text.match(/(\+\d[\d\s-]{7,16}\d|\b0\d{2}[\s-]?\d{3}[\s-]?\d{4}\b)/);
  if (phone) b.phone = phone[1].replace(/\s+/g, " ").trim();

  extractDates(text, b);
  b.residence = extractResidence(text, b);

  const guests = text.match(/(\d{1,2})\s*(?:guests?|people|persons|of us)\b/i);
  if (guests) b.guests = guests[1];

  const purpose = text.match(
    /\b(business|leisure|holiday|vacation|relocat\w*|extended(?:\s+stay)?)\b/i,
  );
  if (purpose) {
    const p = purpose[1].toLowerCase();
    b.purpose = p.startsWith("business")
      ? "Business"
      : p.startsWith("relocat")
        ? "Relocation"
        : p.startsWith("extended")
          ? "Extended stay"
          : "Leisure";
  }

  return b;
}

const FALLBACK_SUGGESTIONS = [
  "See the residences",
  "What are the rates?",
  "Check December availability",
];

export function fallbackConcierge(messages: ChatMessage[]): ConciergeResponse {
  const booking = extractBooking(messages);
  const last = messages[messages.length - 1]?.content.toLowerCase() ?? "";
  let reply: string;

  const missing = REQUIRED_FIELDS.filter((k) => !booking[k]);

  if (isBookingComplete(booking)) {
    reply =
      `Thank you, ${booking.guestName} — that is everything I need. ` +
      `${booking.residence}, ${booking.arrival} to ${booking.departure}, ` +
      `${booking.guests} guest(s). The Vidan team will confirm availability and your final rate on WhatsApp shortly.`;
  } else if (messages.length <= 1 && /^(hi|hello|hey|good)/.test(last)) {
    reply =
      "Welcome to Vidan Luxury Apartments. I can help you find and book a furnished residence in Accra — East Legon, Cantonments, Spintex, Ashaley Botwe or Pantang. What dates are you considering?";
  } else {
    const next = missing[0];
    const prompts: Record<string, string> = {
      guestName: "May I have your full name for the reservation?",
      phone: "Could you share a WhatsApp number the team can reach you on?",
      residence:
        "Do you have a preferred residence, or should we match the best available option for your dates?",
      arrival: "What is your arrival date?",
      departure: "And your departure date?",
      guests: "How many guests will be staying?",
    };
    const known: string[] = [];
    if (booking.guestName) known.push(`thank you, ${booking.guestName}`);
    if (booking.residence) known.push(`noted ${booking.residence}`);
    if (booking.arrival) known.push(`arrival ${booking.arrival}`);
    if (booking.departure) known.push(`departure ${booking.departure}`);
    reply =
      (known.length ? `Noted — ${known.join(", ")}. ` : "") +
      prompts[next] +
      " (Demo mode: scripted assistant — configure GEMINI_API_KEY for full AI answers.)";
  }

  return {
    reply,
    suggestions: FALLBACK_SUGGESTIONS,
    booking,
    bookingComplete: isBookingComplete(booking),
    source: "fallback",
  };
}
