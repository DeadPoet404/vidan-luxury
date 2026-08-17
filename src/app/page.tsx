import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
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
    priceGhs: "GH₵ 1,980",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
  },
  {
    name: "Cantonments Residence",
    location: "Cantonments",
    type: "1 Bedroom · Furnished",
    price: "$120",
    priceGhs: "GH₵ 1,830",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=90",
  },
  {
    name: "Spintex Residence",
    location: "Spintex",
    type: "2 Bedroom · Furnished",
    price: "$85",
    priceGhs: "GH₵ 1,250",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* NAVIGATION */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="container-page flex h-24 items-center justify-between">
          <a href="/" className="group">
            <p className="text-lg font-semibold tracking-[0.18em]">
              VIDAN
            </p>

            <p className="mt-1 text-[9px] tracking-[0.3em] text-[var(--muted)] uppercase">
              Luxury Apartments
            </p>
          </a>

          <nav className="hidden items-center gap-10 text-[11px] tracking-[0.14em] text-white/65 uppercase md:flex">
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
            className="group flex items-center gap-2 border border-[var(--gold)] px-5 py-3 text-[10px] font-semibold tracking-[0.18em] text-[var(--gold)] uppercase transition hover:bg-[var(--gold)] hover:text-black"
          >
            Book Your Stay
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=90"
          alt="Luxury apartment interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

        <div className="container-page relative z-10 flex min-h-screen items-end pb-24 pt-40 sm:pb-28 lg:pb-32">
          <div className="max-w-4xl">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[var(--gold)]" />

              <p className="text-[10px] font-medium tracking-[0.28em] text-[var(--gold-light)] uppercase">
                Accra · Ghana
              </p>
            </div>

            <h1 className="max-w-4xl text-5xl font-light leading-[0.94] tracking-[-0.045em] text-white sm:text-7xl lg:text-[6.8rem]">
              Stay somewhere
              <br />
              <span className="text-white/90">
                worth arriving for.
              </span>
            </h1>

            <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-sm leading-7 text-white/65 sm:text-base">
                Thoughtfully furnished apartments in Accra&apos;s most
                desirable neighbourhoods — designed for business, leisure
                and everything between.
              </p>

              <a
                href="#apartments"
                className="group flex shrink-0 items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-white uppercase"
              >
                Explore residences

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-black">
                  <ArrowDown
                    size={14}
                    className="transition-transform group-hover:translate-y-0.5"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-3 lg:flex">
          <div className="h-px w-8 bg-white/30" />

          <p className="text-[9px] tracking-[0.22em] text-white/50 uppercase">
            East Legon · Cantonments · Spintex
          </p>
        </div>
      </section>

      {/* RESIDENCES */}
      <section
        id="apartments"
        className="container-page py-28 sm:py-36"
      >
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">The Residences</p>

            <h2 className="mt-5 max-w-2xl text-4xl font-light leading-tight tracking-[-0.035em] sm:text-6xl">
              A place that feels
              <br />
              <span className="text-white/40">entirely your own.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
            From intimate city stays to spacious serviced apartments,
            discover Vidan residences across some of Accra&apos;s most
            sought-after neighbourhoods.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          {residences.map((residence, index) => (
            <article
              key={residence.name}
              className={`group relative overflow-hidden bg-[var(--surface)] ${
                index === 0 ? "lg:row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${
                  index === 0 ? "aspect-[4/5] lg:h-full" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={residence.image}
                  alt={residence.name}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  sizes={
                    index === 0
                      ? "(max-width: 1024px) 100vw, 50vw"
                      : "(max-width: 1024px) 100vw, 30vw"
                  }
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-[var(--gold-light)] uppercase">
                    <MapPin size={12} />
                    {residence.location}
                  </div>

                  <h3 className="mt-3 text-2xl font-light tracking-[-0.02em] text-white">
                    {residence.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/65">
                    <span className="flex items-center gap-2">
                      <BedDouble size={14} />
                      {residence.type}
                    </span>
                  </div>

                  <div className="mt-6 flex items-end justify-between border-t border-white/15 pt-5">
                    <div>
                      <p className="text-[9px] tracking-[0.16em] text-white/40 uppercase">
                        From
                      </p>

                      <p className="mt-1 text-xl font-light text-white">
                        {residence.price}
                        <span className="ml-1 text-xs text-white/45">
                          / night
                        </span>
                      </p>

                      <p className="mt-1 text-[10px] text-white/40">
                        {residence.priceGhs} equivalent
                      </p>
                    </div>

                    <a
                      href="#book"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-black"
                      aria-label={`View ${residence.name}`}
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#book"
            className="group flex items-center gap-3 border-b border-white/20 pb-2 text-[10px] font-semibold tracking-[0.2em] text-white uppercase transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            View all residences

            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>
      </section>

      {/* LOCATION */}
      <section
        id="location"
        className="relative overflow-hidden border-t border-white/[0.07]"
      >
        <div className="container-page py-28 sm:py-36">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow">The Neighbourhood</p>

              <h2 className="mt-6 max-w-lg text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                Accra,
                <br />
                <span className="text-white/40">
                  on your terms.
                </span>
              </h2>

              <p className="mt-8 max-w-md text-sm leading-7 text-[var(--muted)] sm:text-base">
                Wake up close to where you want to be. Vidan places you
                across three of Accra&apos;s most sought-after neighbourhoods,
                giving every stay its own rhythm.
              </p>

              <div className="mt-10 flex items-center gap-3 text-[10px] tracking-[0.18em] text-white/40 uppercase">
                <MapPin size={14} className="text-[var(--gold)]" />
                Accra, Ghana
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  number: "01",
                  name: "East Legon",
                  description:
                    "A polished residential and lifestyle district, surrounded by restaurants, cafés, shopping and entertainment.",
                  image:
                    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=85",
                },
                {
                  number: "02",
                  name: "Cantonments",
                  description:
                    "Central, established and effortlessly connected — ideal for business travellers and longer city stays.",
                  image:
                    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
                },
                {
                  number: "03",
                  name: "Spintex",
                  description:
                    "A vibrant Accra base with convenient access to the city, airport corridor and everyday essentials.",
                  image:
                    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
                },
              ].map((location) => (
                <article
                  key={location.name}
                  className="group relative min-h-[260px] overflow-hidden border border-white/10"
                >
                  <Image
                    src={location.image}
                    alt={`${location.name} lifestyle`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                  />

                  <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/35" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />

                  <div className="relative flex min-h-[260px] flex-col justify-between p-7 sm:p-9">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.2em] text-[var(--gold-light)]">
                        {location.number}
                      </span>

                      <ArrowUpRight
                        size={16}
                        className="text-white/50 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                      />
                    </div>

                    <div className="max-w-lg">
                      <h3 className="text-3xl font-light tracking-[-0.025em] text-white sm:text-4xl">
                        {location.name}
                      </h3>

                      <p className="mt-3 max-w-md text-xs leading-6 text-white/55 sm:text-sm">
                        {location.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* LOCATION STATEMENT */}
        <div className="border-t border-white/[0.07] bg-[var(--surface)]">
          <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">
                Wherever you are going
              </p>

              <p className="mt-2 text-sm text-white/55">
                Your apartment should be part of the journey.
              </p>
            </div>

            <a
              href="#book"
              className="group flex w-fit items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-white uppercase"
            >
              Find your apartment

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-black">
                <ArrowUpRight size={13} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* DIRECT BOOKING */}
      <section
        id="book"
        className="relative overflow-hidden border-t border-white/[0.07] bg-[var(--surface)]"
      >
        <div className="container-page py-28 sm:py-36">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="eyebrow">Book Direct</p>

              <h2 className="mt-6 max-w-xl text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                Your stay.
                <br />
                <span className="text-white/40">
                  Your way.
                </span>
              </h2>

              <p className="mt-8 max-w-md text-sm leading-7 text-[var(--muted)] sm:text-base">
                Tell us when you&apos;re coming and what you&apos;re looking
                for. Our team will confirm availability and help you find
                the right Vidan residence.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Direct communication with our team",
                  "Access to our Accra residences",
                  "Rates confirmed before you arrive",
                  "Personalised stay assistance",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/65"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--gold)]">
                      <Check size={11} />
                    </span>

                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-12 border-l border-[var(--gold)]/50 pl-5">
                <p className="text-[9px] font-semibold tracking-[0.2em] text-[var(--gold)] uppercase">
                  Coming to Accra in December?
                </p>

                <p className="mt-2 max-w-sm text-xs leading-6 text-white/45">
                  Secure your preferred residence early. December stays are
                  subject to availability.
                </p>
              </div>
            </div>

            {/* ENQUIRY PANEL */}
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
                onSubmit={(event) => {
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
                    "_blank"
                  );
                }}
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
                        East Legon
                      </option>

                      <option
                        value="Cantonments Residence"
                        className="bg-black"
                      >
                        Cantonments
                      </option>

                      <option
                        value="Spintex Residence"
                        className="bg-black"
                      >
                        Spintex
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
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="border-t border-white/[0.07] bg-[var(--surface)]"
      >
        <div className="container-page py-28 sm:py-36">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow">The Vidan Experience</p>

              <h2 className="mt-6 max-w-xl text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                Everything you need.
                <br />
                <span className="text-white/40">
                  Nothing you don&apos;t.
                </span>
              </h2>

              <p className="mt-8 max-w-lg text-sm leading-7 text-[var(--muted)] sm:text-base">
                Come home to thoughtfully furnished spaces, modern comforts
                and the freedom to settle into Accra on your own terms.
              </p>

              <div className="mt-10">
                <a
                  href="#book"
                  className="group inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-[var(--gold)] uppercase"
                >
                  Plan your stay

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold)] transition group-hover:bg-[var(--gold)] group-hover:text-black">
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4]">
                <Image
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=90"
                  alt="Elegant Vidan-style apartment interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-4 hidden border border-white/10 bg-[var(--background)] p-6 sm:block lg:-left-8">
                <p className="text-[9px] tracking-[0.2em] text-[var(--gold)] uppercase">
                  Accra
                </p>

                <p className="mt-2 text-sm text-white/70">
                  East Legon · Cantonments · Spintex
                </p>
              </div>
            </div>
          </div>

          {/* AMENITIES */}
          <div className="mt-28 border-t border-white/10 pt-12 sm:mt-36">
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Included</p>

                <h3 className="mt-3 text-2xl font-light tracking-[-0.02em] sm:text-3xl">
                  Comfort, considered.
                </h3>
              </div>

              <p className="max-w-xs text-xs leading-6 text-white/40">
                The essentials for an effortless stay, wherever your plans
                take you.
              </p>
            </div>

            <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Fully Fitted Kitchens",
                  description:
                    "Settle in, cook at home and stay on your own schedule.",
                },
                {
                  number: "02",
                  title: "High-Speed Wi-Fi",
                  description:
                    "Stay connected whether you are working or unwinding.",
                },
                {
                  number: "03",
                  title: "24/7 Security",
                  description:
                    "Peace of mind throughout your stay in Accra.",
                },
                {
                  number: "04",
                  title: "Smart TV & DSTV",
                  description:
                    "Switch off and enjoy your favourite entertainment.",
                },
                {
                  number: "05",
                  title: "Private Parking",
                  description:
                    "Convenient parking available across the residences.",
                },
                {
                  number: "06",
                  title: "Prime Locations",
                  description:
                    "Close to restaurants, shopping, entertainment and more.",
                },
              ].map((amenity) => (
                <div
                  key={amenity.number}
                  className="group border-b border-r border-white/10 p-7 transition hover:bg-white/[0.025] sm:p-9"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] tracking-[0.18em] text-[var(--gold)]">
                      {amenity.number}
                    </span>

                    <ArrowUpRight
                      size={14}
                      className="text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold)]"
                    />
                  </div>

                  <h4 className="mt-10 text-lg font-light text-white">
                    {amenity.title}
                  </h4>

                  <p className="mt-3 max-w-xs text-xs leading-6 text-white/40">
                    {amenity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* FLOATING WHATSAPP */}
      <a
        href="https://wa.me/233591581142?text=Hello%20Vidan%20Luxury%20Apartments%20%F0%9F%91%8B%20I%27d%20like%20to%20check%20availability."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Vidan on WhatsApp"
        className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-white/10 bg-[#151513] px-4 py-3 shadow-2xl transition hover:border-[var(--gold)] sm:bottom-7 sm:right-7"
      >
        <span className="hidden text-[9px] font-semibold tracking-[0.16em] text-white uppercase sm:block">
          Chat with Vidan
        </span>

        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-black transition group-hover:scale-105">
          <MessageCircle size={18} />
        </span>
      </a>

    </main>
  );
}
