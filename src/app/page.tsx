import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";

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
        {/* HERO IMAGE */}
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=90"
          alt="Luxury apartment interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* IMAGE TREATMENT */}
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

        {/* HERO CONTENT */}
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
                Thoughtfully furnished apartments in Accra's most desirable
                neighbourhoods — designed for business, leisure and everything
                between.
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

        {/* LOCATION MARKER */}
        <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-3 lg:flex">
          <div className="h-px w-8 bg-white/30" />

          <p className="text-[9px] tracking-[0.22em] text-white/50 uppercase">
            East Legon · Cantonments · Spintex
          </p>
        </div>
      </section>

      {/* TEMPORARY NEXT SECTION MARKER */}
      <section
        id="apartments"
        className="container-page py-32"
      >
        <p className="eyebrow">The Residences</p>

        <h2 className="mt-5 max-w-2xl text-4xl font-light tracking-[-0.03em] sm:text-5xl">
          Your next stay,
          <br />
          <span className="text-white/45">beautifully considered.</span>
        </h2>
      </section>
    </main>
  );
}
