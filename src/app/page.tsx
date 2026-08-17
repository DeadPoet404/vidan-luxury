import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  BedDouble,
  MapPin,
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
    </main>
  );
}
