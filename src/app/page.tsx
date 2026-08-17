import Image from "next/image";
import Link from "next/link";
import BookingForm from "@/components/BookingForm";
import ResidencesGrid from "@/components/ResidencesGrid";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  MapPin,
  MessageCircle,
} from "lucide-react";

const amenities = [
  "24/7 Security",
  "High-Speed Wi-Fi",
  "Smart TV",
  "Fully Fitted Kitchen",
  "Private Parking",
  "Prime Locations",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* NAVIGATION */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="container-page flex h-24 items-center justify-between">
          <Link href="/" className="group">
            <p className="text-lg font-semibold tracking-[0.18em]">
              VIDAN
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[var(--muted)]">
              Luxury Apartments
            </p>
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.14em] text-white/70 md:flex">
            <a
              href="#apartments"
              className="transition hover:text-white"
            >
              Apartments
            </a>

            <a
              href="#experience"
              className="transition hover:text-white"
            >
              Experience
            </a>

            <a
              href="#location"
              className="transition hover:text-white"
            >
              Location
            </a>
          </nav>

          <a
            href="#book"
            className="flex items-center gap-2 border border-[var(--gold)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black"
          >
            Book
            <ArrowUpRight size={13} />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90"
          alt="Luxury apartment interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="container-page relative z-10 flex min-h-screen items-end pb-24 pt-40">
          <div className="max-w-4xl">
            <p className="mb-6 text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">
              East Legon · Cantonments · Spintex
            </p>

            <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl">
              Stay somewhere
              <br />
              worth arriving for.
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-white/70 sm:text-base">
              Luxury furnished residences across Accra&apos;s most desirable
              neighbourhoods.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#apartments"
                className="bg-[var(--gold)] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-[var(--gold-light)]"
              >
                Explore
              </a>

              <a
                href="#book"
                className="border border-white/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white/50"
              >
                Check Availability
              </a>
            </div>
          </div>
        </div>

        <a
          href="#apartments"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white/70 transition hover:text-[var(--gold)]"
          aria-label="Scroll to apartments"
        >
          <ArrowDown size={22} />
        </a>
      </section>

      {/* DETTY DECEMBER */}
      <section
        aria-label="December direct booking offer"
        className="relative overflow-hidden border-y border-black/10 bg-[var(--gold)] text-[#0b0b0a]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 text-[9rem] font-semibold leading-none tracking-[-0.08em] text-black/[0.04] sm:text-[13rem]"
        >
          DEC
        </div>

        <div className="container-page relative z-10 grid gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/55">
              Detty December · 2026
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-light tracking-[-0.04em] sm:text-4xl">
              Book December direct — no platform booking fees.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-black/60">
              Peak-season dates in Accra move quickly. Send your preferred
              dates now and confirm your stay directly with the Vidan team.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/55">
              {["Direct rates", "Priority response", "Personal assistance"].map(
                (benefit) => (
                  <span
                    key={benefit}
                    className="flex items-center gap-2"
                  >
                    <Check size={13} strokeWidth={2.5} />
                    {benefit}
                  </span>
                ),
              )}
            </div>
          </div>

          <a
            href={`https://wa.me/233591581142?text=${encodeURIComponent(
              "Hello Vidan Luxury Apartments, I'd like to check availability for December 2026.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-3 bg-[#0b0b0a] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black"
          >
            Check December dates
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </section>

      {/* RESIDENCES */}
      <section
        id="apartments"
        className="container-page py-28 sm:py-36"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">The Residences</p>

            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] sm:text-6xl">
              Find your
              <br />
              perfect stay.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
            Browse furnished studios, one-bedroom and two-bedroom stays across
            Vidan&apos;s growing Accra portfolio.
          </p>
        </div>

        <ResidencesGrid />
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="border-t border-white/10 bg-[var(--surface)]"
      >
        <div className="container-page py-28 sm:py-36">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow">The Experience</p>

              <h2 className="mt-5 text-4xl font-light tracking-[-0.04em] sm:text-6xl">
                Comfort,
                <br />
                beautifully considered.
              </h2>

              <p className="mt-8 max-w-lg text-sm leading-7 text-[var(--muted)]">
                Every residence includes the essentials for effortless living
                in Accra, giving you the freedom to settle in and make the
                space your own.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3">
                {amenities.map((item) => (
                  <div
                    key={item}
                    className="border border-white/10 p-4 text-sm text-white/70 transition hover:border-[var(--gold)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[5/6] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90"
                alt="Elegant luxury apartment interior"
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section
        id="location"
        className="border-t border-white/10 bg-[var(--background)]"
      >
        <div className="container-page py-28 sm:py-36">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="eyebrow">Accra, Ghana</p>

              <h2 className="mt-5 max-w-xl text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                Stay close to
                <br />
                <span className="text-white/40">
                  everything.
                </span>
              </h2>

              <p className="mt-8 max-w-md text-sm leading-7 text-[var(--muted)] sm:text-base">
                Your Vidan residence puts you in some of Accra&apos;s most
                sought-after neighbourhoods — close to business, dining,
                shopping and the city&apos;s energy.
              </p>

              <div className="mt-10 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--gold)]/50">
                  <MapPin size={13} className="text-[var(--gold)]" />
                </span>

                Accra, Ghana
              </div>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {[
                {
                  number: "01",
                  name: "East Legon",
                  description:
                    "A premium residential district surrounded by restaurants, cafés, shopping and Accra's modern social scene.",
                },
                {
                  number: "02",
                  name: "Cantonments",
                  description:
                    "Established, central and refined — with easy access to business districts, embassies, dining and the city centre.",
                },
                {
                  number: "03",
                  name: "Spintex",
                  description:
                    "A lively and convenient Accra base with excellent access to the airport corridor, retail and everyday essentials.",
                },
              ].map((place) => (
                <div
                  key={place.name}
                  className="group flex gap-6 py-7 sm:gap-10"
                >
                  <span className="pt-1 text-[9px] tracking-[0.2em] text-[var(--gold)]">
                    {place.number}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-5">
                      <h3 className="text-2xl font-light transition-colors group-hover:text-[var(--gold)] sm:text-3xl">
                        {place.name}
                      </h3>

                      <ArrowUpRight
                        size={18}
                        className="mt-1 shrink-0 text-white/20 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                      />
                    </div>

                    <p className="mt-3 max-w-xl text-xs leading-6 text-white/40 sm:text-sm">
                      {place.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 overflow-hidden border border-white/10 bg-[var(--surface)]">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[380px] bg-[#181815] lg:min-h-[520px]">
                <iframe
                  title="Map showing East Legon in Accra, Ghana"
                  src="https://www.google.com/maps?q=East%20Legon%2C%20Accra%2C%20Ghana&z=13&output=embed"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 grayscale-[0.85] contrast-[1.08] invert-[0.9] opacity-80"
                />

                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

                <div className="pointer-events-none absolute bottom-4 left-4 bg-black/80 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--gold)]">
                    Neighbourhood map
                  </p>

                  <p className="mt-1 text-[10px] text-white/50">
                    Exact check-in details are shared after confirmation.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                <div>
                  <p className="eyebrow">Explore the neighbourhood</p>

                  <h3 className="mt-5 text-3xl font-light leading-tight tracking-[-0.04em] sm:text-4xl">
                    An Accra base that keeps you connected.
                  </h3>

                  <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
                    Explore the East Legon area before you arrive. Vidan also
                    offers stays in Cantonments and Spintex, giving you the
                    flexibility to choose the right side of the city.
                  </p>

                  <div className="mt-8 space-y-3 border-y border-white/10 py-6">
                    {["East Legon", "Cantonments", "Spintex"].map((area) => (
                      <div
                        key={area}
                        className="flex items-center gap-3 text-sm text-white/65"
                      >
                        <MapPin
                          size={14}
                          className="text-[var(--gold)]"
                        />
                        {area}, Accra
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=East+Legon%2C+Accra%2C+Ghana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-10 inline-flex w-fit items-center gap-3 border border-[var(--gold)] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black"
                >
                  View in Google Maps
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK DIRECT */}
      <section
        id="book"
        className="border-t border-white/10 bg-[var(--surface)]"
      >
        <div className="container-page py-28 sm:py-36">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="eyebrow">Book Direct</p>

              <h2 className="mt-5 text-4xl font-light tracking-[-0.04em] sm:text-6xl">
                Your stay.
                <br />
                Your way.
              </h2>

              <p className="mt-8 max-w-md text-sm leading-7 text-[var(--muted)]">
                Send your preferred dates directly through WhatsApp and our
                team will confirm availability.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Direct communication",
                  "Priority availability",
                  "Personal stay assistance",
                  "Fast WhatsApp response",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--gold)]">
                      <Check size={11} />
                    </span>

                    <span className="text-sm text-white/70">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 border-l border-[var(--gold)] pl-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">
                  Detty December 2026
                </p>

                <p className="mt-2 text-xs leading-6 text-white/50">
                  Peak-season dates are limited. Reserve early for the
                  best choice of residence.
                </p>
              </div>
            </div>

            <BookingForm />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-page py-24">
        <div className="border border-white/10 bg-[var(--surface)] p-8 sm:p-14">
          <p className="eyebrow">Vidan Luxury Apartments</p>

          <h2 className="mt-4 max-w-3xl text-4xl font-light tracking-[-0.04em] sm:text-6xl">
            Experience Accra with comfort, privacy and style.
          </h2>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#book"
              className="bg-[var(--gold)] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-[var(--gold-light)]"
            >
              Book Direct
            </a>

            <a
              href="https://wa.me/233591581142"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              WhatsApp
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em]">
              VIDAN
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/35">
              Luxury Apartments · Accra
            </p>
          </div>

          <p className="text-[10px] text-white/30">
            © {new Date().getFullYear()} Vidan Luxury Apartments
          </p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a
        href="https://wa.me/233591581142"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Vidan on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)] text-black shadow-2xl transition hover:scale-105 hover:bg-[var(--gold-light)]"
      >
        <MessageCircle size={22} />
      </a>
    </main>
  );
}
