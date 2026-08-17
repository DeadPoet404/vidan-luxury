"use client";

import {
  CalendarDays,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const residences = [
  {
    value: "Any available residence",
    label: "Any available residence",
    rate: "Best available direct rate",
  },
  {
    value: "Beautiful One-Bedroom — East Legon",
    label: "Beautiful One-Bedroom — East Legon",
    rate: "$130 / approximately GH₵1,430 per night",
  },
  {
    value: "Affordable Two-Bedroom — East Legon",
    label: "Affordable Two-Bedroom — East Legon",
    rate: "GH₵2,350 / approximately $214 per night",
  },
  {
    value: "Furnished One-Bedroom — Cantonments",
    label: "Furnished One-Bedroom — Cantonments",
    rate: "$120 / approximately GH₵1,320 per night",
  },
  {
    value: "Two-Bedroom Furnished Apartment — Spintex",
    label: "Two-Bedroom Furnished Apartment — Spintex",
    rate: "$85 / approximately GH₵935 per night",
  },
  {
    value: "Spintex City Apartment",
    label: "Spintex City Apartment",
    rate: "$75 / approximately GH₵825 per night",
  },
  {
    value: "Premium One-Bedroom Suite — Ashaley Botwe",
    label: "Premium One-Bedroom Suite — Ashaley Botwe",
    rate: "GH₵1,980 / approximately $180 per night",
  },
  {
    value: "Modern Two-Bedroom — Ashaley Botwe",
    label: "Modern Two-Bedroom — Ashaley Botwe",
    rate: "GH₵1,740 / approximately $158 per night",
  },
  {
    value: "Classy Two-Bedroom — Pantang Junction",
    label: "Classy Two-Bedroom — Pantang Junction",
    rate: "$140 / approximately GH₵1,540 per night",
  },
  {
    value: "Serene Three-Bedroom — Pantang Junction",
    label: "Serene Three-Bedroom — Pantang Junction",
    rate: "$150 / approximately GH₵1,650 per night",
  },
  {
    value: "Classic Studio — Ashaley Botwe",
    label: "Classic Studio — Ashaley Botwe",
    rate: "GH₵1,140 / approximately $104 per night",
  },
];

const guestOptions = [
  { value: "1", label: "1 guest" },
  { value: "2", label: "2 guests" },
  { value: "3", label: "3 guests" },
  { value: "4", label: "4 guests" },
  { value: "5+", label: "5+ guests" },
];

const stayPurposes = [
  "Leisure",
  "Business",
  "Extended stay",
  "Relocation",
  "Other",
];

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dateToUtcTimestamp(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function getNightCount(
  arrival: string,
  departure: string,
) {
  if (!arrival || !departure) {
    return null;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.round(
    (dateToUtcTimestamp(departure) -
      dateToUtcTimestamp(arrival)) /
      millisecondsPerDay,
  );
}

function getNextDate(value: string) {
  const timestamp = dateToUtcTimestamp(value);
  const nextDate = new Date(
    timestamp + 1000 * 60 * 60 * 24,
  );

  return nextDate.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  if (!value) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function BookingForm() {
  const [today] = useState(() =>
    toDateInputValue(new Date()),
  );

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("2");
  const [residence, setResidence] = useState(
    "Any available residence",
  );
  const [purpose, setPurpose] = useState("Leisure");
  const [formError, setFormError] = useState("");

  const nightCount = getNightCount(
    arrival,
    departure,
  );

  const selectedResidence =
    residences.find(
      (item) => item.value === residence,
    ) ?? residences[0];

  const minimumDeparture = arrival
    ? getNextDate(arrival)
    : today;

  function handleArrivalChange(value: string) {
    setArrival(value);
    setFormError("");

    if (departure && departure <= value) {
      setDeparture("");
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const currentNightCount = getNightCount(
      arrival,
      departure,
    );

    if (!currentNightCount || currentNightCount < 1) {
      setFormError(
        "Departure must be at least one night after arrival.",
      );
      return;
    }

    if (arrival < today) {
      setFormError(
        "Please choose an arrival date from today onwards.",
      );
      return;
    }

    const data = new FormData(event.currentTarget);

    const guestName = String(
      data.get("guestName") ?? "",
    ).trim();

    const whatsapp = String(
      data.get("whatsapp") ?? "",
    ).trim();

    const requests = String(
      data.get("requests") ?? "",
    ).trim();

    setFormError("");

    const message = [
      "Hello Vidan Luxury Apartments 👋",
      "",
      "I'd like to check availability for a stay.",
      "",
      `Guest name: ${guestName}`,
      `Guest WhatsApp: ${whatsapp}`,
      `Residence: ${residence}`,
      `Indicative rate: ${selectedResidence.rate}`,
      `Arrival: ${formatDate(arrival)}`,
      `Departure: ${formatDate(departure)}`,
      `Length of stay: ${currentNightCount} ${
        currentNightCount === 1
          ? "night"
          : "nights"
      }`,
      `Guests: ${guests}`,
      `Stay purpose: ${purpose}`,
      ...(requests
        ? [`Requests: ${requests}`]
        : []),
      "",
      "Please confirm availability, the final rate and the next steps.",
    ].join("\n");

    window.open(
      `https://wa.me/233591581142?text=${encodeURIComponent(
        message,
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const inputClassName =
    "h-14 w-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--gold)]";

  const labelClassName =
    "mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40";

  return (
    <div className="border border-white/10 bg-[var(--background)] shadow-2xl shadow-black/20">
      <div className="border-b border-white/10 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)]">
              Availability enquiry
            </p>

            <h3 className="mt-2 text-2xl font-light sm:text-3xl">
              Plan your Vidan stay
            </h3>

            <p className="mt-3 max-w-lg text-xs leading-6 text-white/35">
              Complete the details below. Your enquiry
              will open as a prepared WhatsApp message
              for the bookings team.
            </p>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 text-white/25">
            <CalendarDays size={20} />
          </span>
        </div>

        <div className="mt-7 grid grid-cols-3 border border-white/10 text-[8px] uppercase tracking-[0.14em] text-white/30">
          <span className="border-r border-white/10 p-3 text-[var(--gold)]">
            01 · Details
          </span>

          <span className="border-r border-white/10 p-3">
            02 · WhatsApp
          </span>

          <span className="p-3">
            03 · Confirm
          </span>
        </div>
      </div>

      <form
        className="p-6 sm:p-8"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <legend className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
            Guest details
          </legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={labelClassName}>
                Full name
              </span>

              <input
                name="guestName"
                type="text"
                autoComplete="name"
                required
                placeholder="Your full name"
                className={inputClassName}
              />
            </label>

            <label className="block">
              <span className={labelClassName}>
                WhatsApp number
              </span>

              <input
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                minLength={8}
                placeholder="+233 or international number"
                className={inputClassName}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="mt-8 border-t border-white/10 pt-8">
          <legend className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
            Stay dates
          </legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={labelClassName}>
                Arrival
              </span>

              <input
                name="arrival"
                type="date"
                required
                min={today}
                value={arrival}
                onChange={(event) =>
                  handleArrivalChange(
                    event.target.value,
                  )
                }
                className={`${inputClassName} [color-scheme:dark]`}
              />
            </label>

            <label className="block">
              <span className={labelClassName}>
                Departure
              </span>

              <input
                name="departure"
                type="date"
                required
                min={minimumDeparture}
                value={departure}
                onChange={(event) => {
                  setDeparture(event.target.value);
                  setFormError("");
                }}
                className={`${inputClassName} [color-scheme:dark]`}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="mt-8 border-t border-white/10 pt-8">
          <legend className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
            Stay preferences
          </legend>

          <label className="block">
            <span className={labelClassName}>
              Preferred residence
            </span>

            <select
              name="residence"
              value={residence}
              onChange={(event) =>
                setResidence(event.target.value)
              }
              className={`${inputClassName} appearance-none`}
            >
              {residences.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                  className="bg-black"
                >
                  {item.label} · {item.rate}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={labelClassName}>
                Guests
              </span>

              <select
                name="guests"
                value={guests}
                onChange={(event) =>
                  setGuests(event.target.value)
                }
                className={`${inputClassName} appearance-none`}
              >
                {guestOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-black"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClassName}>
                Purpose of stay
              </span>

              <select
                name="purpose"
                value={purpose}
                onChange={(event) =>
                  setPurpose(event.target.value)
                }
                className={`${inputClassName} appearance-none`}
              >
                {stayPurposes.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-black"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-5 block">
            <span className={labelClassName}>
              Special requests{" "}
              <span className="text-white/20">
                · Optional
              </span>
            </span>

            <textarea
              name="requests"
              rows={4}
              placeholder="Airport arrival, accessibility needs, preferred area or anything else we should know."
              className="w-full resize-y border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-[var(--gold)]"
            />
          </label>
        </fieldset>

        <div
          aria-live="polite"
          className="mt-8 border border-[var(--gold)]/20 bg-[var(--gold)]/[0.05] p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Enquiry summary
            </p>

            <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
              No payment yet
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[8px] uppercase tracking-[0.14em] text-white/25">
                Residence
              </p>

              <p className="mt-2 text-xs leading-5 text-white/65">
                {selectedResidence.label}
              </p>

              <p className="mt-1 text-[10px] text-white/30">
                {selectedResidence.rate}
              </p>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.14em] text-white/25">
                Dates and duration
              </p>

              <p className="mt-2 text-xs leading-5 text-white/65">
                {arrival && departure
                  ? `${formatDate(
                      arrival,
                    )} — ${formatDate(departure)}`
                  : "Choose your arrival and departure"}
              </p>

              <p className="mt-1 text-[10px] text-white/30">
                {nightCount && nightCount > 0
                  ? `${nightCount} ${
                      nightCount === 1
                        ? "night"
                        : "nights"
                    }`
                  : "Duration will appear here"}
              </p>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.14em] text-white/25">
                Guests
              </p>

              <p className="mt-2 text-xs text-white/65">
                {guests === "1"
                  ? "1 guest"
                  : `${guests} guests`}
              </p>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.14em] text-white/25">
                Stay purpose
              </p>

              <p className="mt-2 text-xs text-white/65">
                {purpose}
              </p>
            </div>
          </div>
        </div>

        {formError ? (
          <p
            role="alert"
            className="mt-5 border border-red-400/25 bg-red-400/[0.06] px-4 py-3 text-xs leading-5 text-red-200"
          >
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          className="group mt-6 flex min-h-16 w-full items-center justify-center gap-3 bg-[var(--gold)] px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-[var(--gold-light)]"
        >
          Send enquiry through WhatsApp

          <MessageCircle
            size={16}
            className="shrink-0 transition-transform group-hover:scale-110"
          />
        </button>

        <div className="mt-5 flex items-start justify-center gap-2 text-center text-[10px] leading-5 text-white/30">
          <ShieldCheck
            size={13}
            className="mt-0.5 shrink-0 text-[var(--gold)]/60"
          />

          <p>
            This is an availability enquiry, not a
            confirmed reservation. No card details or
            payment are required at this stage.
          </p>
        </div>
      </form>
    </div>
  );
}
