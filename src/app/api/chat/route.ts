// POST /api/chat — Vidan AI Concierge (demo)
// Browser sends the conversation; we answer via Gemini (structured JSON).
// Falls back to a scripted assistant when no key is configured or on error.
// When a booking becomes complete (and was not already alerted), the team
// receives a Telegram alert with the full summary.

import { NextResponse } from "next/server";
import {
  buildSystemPrompt,
  coerceResponse,
  fallbackConcierge,
  formatAlertText,
  RESPONSE_SCHEMA,
  sendTelegramAlert,
  withNote,
  type ChatMessage,
  type ConciergeResponse,
} from "@/lib/concierge";

export const dynamic = "force-dynamic";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const MAX_MESSAGES = 24;
const MAX_CHARS = 2000;

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

async function askGemini(messages: ChatMessage[]): Promise<unknown> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt() }],
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

  let response: ConciergeResponse;

  if (!process.env.GEMINI_API_KEY) {
    response = withNote(
      fallbackConcierge(messages),
      "GEMINI_API_KEY not configured — running scripted demo mode.",
    );
  } else {
    try {
      const parsed = await askGemini(messages);
      response = coerceResponse(parsed, "gemini");
    } catch (error) {
      console.error("[concierge] falling back to scripted mode:", error);
      response = withNote(
        fallbackConcierge(messages),
        "AI temporarily unavailable — scripted demo reply.",
      );
    }
  }

  // Fire the team alert exactly once per completed booking.
  if (response.bookingComplete && !alreadyAlerted) {
    const alert = await sendTelegramAlert(
      formatAlertText(response.booking, response.source),
    );
    response = alert.ok
      ? { ...response, alertSent: true }
      : { ...response, alertSent: false, alertNote: alert.error };
  }

  return NextResponse.json(response);
}
