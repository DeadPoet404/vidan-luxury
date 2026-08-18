"use client";

import {
  Check,
  ExternalLink,
  MessageCircle,
  SendHorizonal,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

// ── Types mirroring src/lib/concierge.ts (client-safe copies) ──

type ChatMsg = {
  role: "user" | "model";
  content: string;
};

type Booking = {
  guestName: string | null;
  phone: string | null;
  residence: string | null;
  arrival: string | null;
  departure: string | null;
  guests: string | null;
  purpose: string | null;
  requests: string | null;
};

type ApiResponse = {
  reply: string;
  suggestions: string[];
  booking: Booking;
  bookingComplete: boolean;
  source: "gemini" | "fallback";
  note?: string;
  alertSent?: boolean;
  alertNote?: string;
};

const STORAGE_KEY = "vidan-concierge-v1";

const WELCOME: ChatMsg = {
  role: "model",
  content:
    "Hello — I am the Vidan Concierge. Tell me your dates, the neighbourhood you prefer, or the kind of stay you need, and I will help you book it.",
};

const STARTERS = [
  "Show me two-bedroom options",
  "What are your rates?",
  "Book for Detty December",
];

const BOOKING_ROWS: { key: keyof Booking; label: string }[] = [
  { key: "guestName", label: "Guest" },
  { key: "phone", label: "WhatsApp" },
  { key: "residence", label: "Residence" },
  { key: "arrival", label: "Check-in" },
  { key: "departure", label: "Check-out" },
  { key: "guests", label: "Guests" },
];

const EMPTY_BOOKING: Booking = {
  guestName: null,
  phone: null,
  residence: null,
  arrival: null,
  departure: null,
  guests: null,
  purpose: null,
  requests: null,
};

type Persisted = {
  messages: ChatMsg[];
  booking: Booking;
  bookingComplete: boolean;
  alerted: boolean;
};

function loadPersisted(): Persisted | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Persisted>;
    if (!Array.isArray(data.messages) || data.messages.length === 0) {
      return null;
    }
    return {
      messages: data.messages as ChatMsg[],
      booking: { ...EMPTY_BOOKING, ...(data.booking ?? {}) },
      bookingComplete: data.bookingComplete === true,
      alerted: data.alerted === true,
    };
  } catch {
    return null;
  }
}

export default function ConciergeWidget() {
  // This component is loaded with next/dynamic ssr:false, so lazy
  // initializers see a real window and can restore the saved session.
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(
    () => loadPersisted()?.messages ?? [WELCOME],
  );
  const [suggestions, setSuggestions] = useState<string[]>(STARTERS);
  const [booking, setBooking] = useState<Booking>(
    () => loadPersisted()?.booking ?? EMPTY_BOOKING,
  );
  const [bookingComplete, setBookingComplete] = useState(
    () => loadPersisted()?.bookingComplete ?? false,
  );
  const [alerted, setAlerted] = useState(
    () => loadPersisted()?.alerted ?? false,
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist on change.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, booking, bookingComplete, alerted }),
      );
    } catch {
      // storage full or disabled — ignore
    }
  }, [messages, booking, bookingComplete, alerted]);

  // Keep the latest messages in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  // Focus the input and support Escape to close.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMsg[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, alerted }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as ApiResponse;

      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.reply },
      ]);
      setSuggestions(
        data.suggestions.length ? data.suggestions : suggestions,
      );
      setBooking(data.booking);
      setBookingComplete(data.bookingComplete);
      setNotice(data.note ?? null);
      if (data.alertSent === true) setAlerted(true);
      if (data.alertNote) setNotice(`Alert issue: ${data.alertNote}`);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "I could not reach the concierge service just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setMessages([WELCOME]);
    setSuggestions(STARTERS);
    setBooking(EMPTY_BOOKING);
    setBookingComplete(false);
    setAlerted(false);
    setNotice(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const captured = BOOKING_ROWS.filter((row) => booking[row.key]).length;
  const hasBookingData = captured > 0;

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Vidan concierge" : "Open Vidan concierge"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)] text-black shadow-2xl transition hover:scale-105 hover:bg-[var(--gold-light)]"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && !alerted ? (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#0b0b0a] bg-emerald-400"
          />
        ) : null}
      </button>

      {/* Panel */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vidan AI concierge"
          className="fixed bottom-24 right-4 z-[70] flex h-[min(620px,78vh)] w-[min(400px,93vw)] flex-col overflow-hidden border border-white/10 bg-[#0e0e0c] shadow-2xl shadow-black/60 sm:right-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-black/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/40 text-[var(--gold)]">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-[0.14em] text-white">
                  VIDAN CONCIERGE
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/40">
                  AI booking assistant · demo
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetConversation}
              className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/30 transition hover:text-[var(--gold)]"
            >
              Reset
            </button>
          </div>

          {/* Degraded-mode notice */}
          {notice ? (
            <p className="border-b border-amber-400/20 bg-amber-400/[0.06] px-5 py-2 text-[10px] leading-4 text-amber-200/80">
              {notice}
            </p>
          ) : null}

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] whitespace-pre-line px-4 py-3 text-[13px] leading-6 ${
                  msg.role === "user"
                    ? "ml-auto bg-[var(--gold)] text-black"
                    : "mr-auto border border-white/10 bg-white/[0.04] text-white/85"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading ? (
              <div className="mr-auto flex items-center gap-1.5 border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="concierge-dot h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                <span className="concierge-dot h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                <span className="concierge-dot h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              </div>
            ) : null}
          </div>

          {/* Booking progress */}
          {hasBookingData ? (
            <div
              className={`border-t px-4 py-3 ${
                bookingComplete
                  ? "border-[var(--gold)]/40 bg-[var(--gold)]/[0.06]"
                  : "border-white/10 bg-black/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                  Reservation summary
                </p>
                <p className="text-[9px] uppercase tracking-[0.14em] text-white/30">
                  {captured} of {BOOKING_ROWS.length}
                </p>
              </div>

              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {BOOKING_ROWS.map((row) => (
                  <div key={row.key} className="flex items-baseline gap-2">
                    <dt className="shrink-0 text-[8px] uppercase tracking-[0.12em] text-white/30">
                      {row.label}
                    </dt>
                    <dd className="truncate text-[11px] text-white/80">
                      {booking[row.key] ?? (
                        <span className="text-white/25">pending</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {bookingComplete ? (
                <p
                  className={`mt-2 flex items-center gap-1.5 text-[10px] ${
                    alerted ? "text-emerald-300" : "text-white/50"
                  }`}
                >
                  {alerted ? (
                    <>
                      <Check size={12} />
                      Vidan team notified on Telegram
                    </>
                  ) : (
                    "Details complete — notifying the team…"
                  )}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Suggestions */}
          {suggestions.length && !loading ? (
            <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="shrink-0 border border-white/10 px-3 py-2 text-[10px] text-white/55 transition hover:border-[var(--gold)]/60 hover:text-[var(--gold)]"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {/* Input */}
          <form
            className="flex items-center gap-2 border-t border-white/10 bg-black/40 px-3 py-3"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about a stay, dates, rates…"
              aria-label="Message the Vidan concierge"
              className="h-11 flex-1 border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--gold)]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 items-center justify-center bg-[var(--gold)] text-black transition hover:bg-[var(--gold-light)] disabled:opacity-40"
            >
              <SendHorizonal size={16} />
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5">
            <p className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.14em] text-white/25">
              <ShieldCheck size={11} className="text-[var(--gold)]/60" />
              Demo — no real booking is created
            </p>
            <a
              href="https://wa.me/233591581142"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]/80 transition hover:text-[var(--gold)]"
            >
              WhatsApp instead
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
