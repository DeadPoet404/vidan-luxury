export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="container-page flex h-24 items-center justify-between">
        <div>
          <p className="text-lg font-semibold tracking-[0.18em]">
            VIDAN
          </p>
          <p className="mt-1 text-[9px] tracking-[0.3em] text-[var(--muted)] uppercase">
            Luxury Apartments
          </p>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
          <a href="#apartments" className="transition hover:text-white">
            Apartments
          </a>

          <a href="#experience" className="transition hover:text-white">
            Experience
          </a>

          <a href="#location" className="transition hover:text-white">
            Location
          </a>
        </nav>

        <a
          href="#book"
          className="border border-[var(--gold)] px-5 py-3 text-[10px] font-semibold tracking-[0.18em] text-[var(--gold)] uppercase transition hover:bg-[var(--gold)] hover:text-black"
        >
          Book Your Stay
        </a>
      </header>

      <section className="container-page flex min-h-[calc(100vh-6rem)] items-center">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">
            East Legon · Cantonments · Spintex
          </p>

          <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
            Stay somewhere
            <br />
            <span className="text-[var(--gold)]">worth arriving for.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Thoughtfully furnished apartments in Accra's most desirable
            neighbourhoods — designed for business, leisure and everything
            between.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#apartments"
              className="bg-[var(--gold)] px-7 py-4 text-xs font-semibold tracking-[0.16em] text-black uppercase transition hover:bg-[var(--gold-light)]"
            >
              Explore Apartments
            </a>

            <a
              href="#book"
              className="border border-white/20 px-7 py-4 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:border-white/50"
            >
              Check Availability
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
