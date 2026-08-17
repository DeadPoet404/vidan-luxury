import Image from "next/image";
import Link from "next/link";
import BookingForm from "@/components/BookingForm";
import {
  ArrowDown,
  ArrowUpRight,
  BedDouble,
  Check,
  MapPin,
  MessageCircle,
} from "lucide-react";

const residences = [
  {
    name: "East Legon Residence",
    location: "East Legon",
    type: "1 Bedroom · Furnished",
    price: "$130",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
  },
  {
    name: "Cantonments Residence",
    location: "Cantonments",
    type: "1 Bedroom · Furnished",
    price: "$120",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=90",
  },
  {
    name: "Spintex Residence",
    location: "Spintex",
    type: "2 Bedroom · Furnished",
    price: "$85",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
  },
];

const amenities = [
  "24/7 Security",
  "High-Speed Wi-Fi",
  "Smart TV",
  "Fully Fitted Kitchen",
  "Private Parking",
  "Prime Locations",
];

const locations = [
  {
    name: "East Legon",
    description:
      "Restaurants, cafés, shopping, entertainment and a polished residential atmosphere.",
  },
  {
    name: "Cantonments",
    description:
      "A central, established neighbourhood with convenient access to business and the city.",
  },
  {
    name: "Spintex",
    description:
      "A vibrant Accra base with convenient access to the city and airport corridor.",
  },
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
            A curated collection of furnished apartments designed for
            business, leisure and extended stays.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {residences.map((home) => (
            <article
              key={home.name}
              className="group overflow-hidden bg-[var(--surface)]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={home.image}
                  alt={home.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute bottom-0 w-full p-6">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]">
                    <MapPin size={11} />
                    {home.location}
                  </div>

                  <h3 className="mt-3 text-2xl font-light text-white">
                    {home.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                    <BedDouble size={13} />
                    {home.type}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-white/40">
                        From
                      </p>

                      <p className="text-xl text-white">
                        {home.price}
                        <span className="text-xs text-white/40">
                          {" "}
                          / night
                        </span>
                      </p>
                    </div>

                    <ArrowUpRight
                      className="text-white/60 transition group-hover:text-[var(--gold)]"
                      size={18}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
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
                  Detty December
                </p>

                <p className="mt-2 text-xs leading-6 text-white/50">
                  Reserve early for peak season availability.
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
