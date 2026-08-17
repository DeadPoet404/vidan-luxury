"use client";

import { CalendarDays, MessageCircle } from "lucide-react";

export default function BookingForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const arrival = data.get("arrival");
    const departure = data.get("departure");
    const guests = data.get("guests");
    const residence = data.get("residence");

    const message = [
      "Hello Vidan Luxury Apartments 👋",
      "",
      "I'd like to check availability.",
      "",
      `Residence: ${residence}`,
      `Arrival: ${arrival}`,
      `Departure: ${departure}`,
      `Guests: ${guests}`,
      "",
      "Please let me know what is available.",
    ].join("\n");

    window.open(
      `https://wa.me/233591581142?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  }

  return (
    <div className="border border-white/10 bg-[var(--background)]">
      <div className="border-b border-white/10 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] tracking-[0.2em] text-[var(--gold)] uppercase">
              Availability
            </p>

            <h3 className="mt-2 text-2xl font-light">
              Plan your stay
            </h3>
          </div>

          <CalendarDays
            size={22}
            className="text-white/25"
          />
        </div>
      </div>

      <form
        className="p-6 sm:p-8"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[9px] tracking-[0.16em] text-white/40 uppercase">
              Arrival
            </span>

            <input
              name="arrival"
              type="date"
              required
              className="h-14 w-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[9px] tracking-[0.16em] text-white/40 uppercase">
              Departure
            </span>

            <input
              name="departure"
              type="date"
              required
              className="h-14 w-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[9px] tracking-[0.16em] text-white/40 uppercase">
              Guests
            </span>

            <select
              name="guests"
              defaultValue="2"
              className="h-14 w-full appearance-none border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            >
              <option value="1" className="bg-black">
                1 guest
              </option>
              <option value="2" className="bg-black">
                2 guests
              </option>
              <option value="3" className="bg-black">
                3 guests
              </option>
              <option value="4" className="bg-black">
                4 guests
              </option>
              <option value="5" className="bg-black">
                5+ guests
              </option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[9px] tracking-[0.16em] text-white/40 uppercase">
              Residence
            </span>

            <select
              name="residence"
              defaultValue="Any available residence"
              className="h-14 w-full appearance-none border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            >
              <option
                value="Any available residence"
                className="bg-black"
              >
                Any available
              </option>

              <option
                value="East Legon Residence"
                className="bg-black"
              >
                East Legon · $130 / GH₵1,430
              </option>

              <option
                value="Cantonments Residence"
                className="bg-black"
              >
                Cantonments · $120 / GH₵1,320
              </option>

              <option
                value="Spintex Residence"
                className="bg-black"
              >
                Spintex · $85 / GH₵935
              </option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="group mt-8 flex h-16 w-full items-center justify-center gap-3 bg-[var(--gold)] text-[10px] font-semibold tracking-[0.2em] text-black uppercase transition hover:bg-[var(--gold-light)]"
        >
          Check availability on WhatsApp

          <MessageCircle
            size={16}
            className="transition-transform group-hover:scale-110"
          />
        </button>

        <p className="mt-4 text-center text-[10px] leading-5 text-white/30">
          Your enquiry opens directly in WhatsApp. No payment is
          required at this stage.
        </p>
      </form>
    </div>
  );
}
