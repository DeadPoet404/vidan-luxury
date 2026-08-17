import Image from "next/image";
import Link from "next/link";
import BookingForm from "@/components/BookingForm";
import ResidencesGrid from "@/components/ResidencesGrid";
import MobileNav from "@/components/MobileNav";
import FAQSection from "@/components/FAQSection";
import {
  ArrowDown,
  ArrowUpRight,
  CarFront,
  Check,
  CookingPot,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Tv,
  Wifi,
} from "lucide-react";

const amenities = [
  {
    name: "24/7 Security",
    description:
      "Security support across the featured portfolio, throughout your stay.",
    icon: ShieldCheck,
  },
  {
    name: "High-Speed Wi-Fi",
    description:
      "Reliable connectivity for remote work, streaming and staying in touch.",
    icon: Wifi,
  },
  {
    name: "Smart Entertainment",
    description:
      "Smart TV access for relaxed evenings and entertainment on your schedule.",
    icon: Tv,
  },
  {
    name: "Fitted Kitchens",
    description:
      "Practical, fully fitted spaces for breakfast, dinner or an extended stay.",
    icon: CookingPot,
  },
  {
    name: "Private Parking",
    description:
      "Convenient on-site parking available across the featured residences.",
    icon: CarFront,
  },
  {
    name: "Prime Locations",
    description:
      "Stay close to Accra's business, dining, shopping and entertainment hubs.",
    icon: MapPin,
  },
  {
    name: "Serviced Stays",
    description:
      "Housekeeping support is available with selected serviced residences.",
    icon: Sparkles,
  },
  {
    name: "Direct Guest Support",
    description:
      "Speak with the Vidan team directly before arrival and during your stay.",
    icon: MessageCircle,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* NAVIGATION */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/35 backdrop-blur-xl">
        <div className="container-page flex h-24 items-center justify-between">
          <Link href="/" className="group">
            <p className="text-lg font-semibold tracking-[0.18em]">
              VIDAN
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[var(--muted)]">
              Luxury Apartments
            </p>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.14em] text-white/70 md:flex"
          >
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

            <a
              href="#faq"
              className="transition hover:text-white"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#book"
              className="flex h-11 items-center gap-2 border border-[var(--gold)] px-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black sm:px-5 sm:text-[10px]"
            >
              Book
              <ArrowUpRight size={13} />
            </a>

            <MobileNav />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/vidan/07-ashaley-botwe-modern-two-bedroom/05.webp"
          alt="Vidan furnished apartment living area in Accra"
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
              East Legon · Cantonments · Spintex · Adenta
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
        id="december"
        aria-label="December direct booking offer"
        className="relative scroll-mt-24 overflow-hidden border-y border-black/10 bg-[var(--gold)] text-[#0b0b0a]"
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
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow">The Vidan Experience</p>

              <h2 className="mt-5 max-w-4xl text-4xl font-light leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                More than a
                <br />
                <span className="text-white/35">
                  beautiful apartment.
                </span>
              </h2>
            </div>

            <div className="lg:pb-2">
              <p className="max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Thoughtfully furnished spaces, practical everyday comforts and
                direct guest support — designed to help you settle into Accra
                from the moment you arrive.
              </p>

              <a
                href="#book"
                className="group mt-7 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]"
              >
                Plan your stay

                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <figure className="group relative min-h-[500px] overflow-hidden sm:min-h-[620px] lg:min-h-[720px]">
              <Image
                src="/images/vidan/08-pantang-classy-two-bedroom/01.webp"
                alt="Vidan serviced apartment living and dining area in Pantang"
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.025]"
                sizes="(max-width: 1024px) 100vw, 68vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)]">
                    01 · Your own space
                  </p>

                  <p className="mt-2 text-2xl font-light text-white sm:text-3xl">
                    Furnished for real living
                  </p>
                </div>

                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-white/50 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                />
              </figcaption>
            </figure>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <figure className="group relative min-h-[320px] overflow-hidden lg:min-h-0">
                <Image
                  src="/images/vidan/07-ashaley-botwe-modern-two-bedroom/06.webp"
                  alt="Swimming pool available at a selected Vidan residence"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)]">
                    02 · Selected residences
                  </p>

                  <p className="mt-2 text-xl font-light text-white">
                    Poolside stays
                  </p>
                </figcaption>
              </figure>

              <figure className="group relative min-h-[320px] overflow-hidden lg:min-h-0">
                <Image
                  src="/images/vidan/03-cantonments-one-bedroom/01.webp"
                  alt="Vidan apartment building exterior in Cantonments, Accra"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />

                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)]">
                    03 · Across Accra
                  </p>

                  <p className="mt-2 text-xl font-light text-white">
                    Prime city addresses
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <p className="eyebrow">Everything you need</p>

              <h3 className="mt-5 text-3xl font-light leading-tight tracking-[-0.04em] sm:text-5xl">
                The essentials,
                <br />
                already considered.
              </h3>

              <p className="mt-7 max-w-md text-sm leading-7 text-[var(--muted)]">
                From a reliable connection to a secure place to park, each
                detail is selected to make short visits and longer stays feel
                straightforward.
              </p>

              <div className="mt-8 border-l border-[var(--gold)] pl-5">
                <p className="text-xs leading-6 text-white/45">
                  Amenities vary by residence. Confirm the features that matter
                  to you when making your enquiry.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {amenities.map(
                ({ name, description, icon: Icon }, index) => (
                  <article
                    key={name}
                    className="group min-h-[190px] border border-white/10 p-6 transition duration-300 hover:border-[var(--gold)]/60 hover:bg-white/[0.02]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-10 w-10 items-center justify-center border border-[var(--gold)]/35 text-[var(--gold)] transition group-hover:bg-[var(--gold)] group-hover:text-black">
                        <Icon
                          size={17}
                          strokeWidth={1.5}
                        />
                      </span>

                      <span className="text-[9px] tracking-[0.18em] text-white/20">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h4 className="mt-6 text-lg font-light text-white">
                      {name}
                    </h4>

                    <p className="mt-3 text-xs leading-6 text-white/40">
                      {description}
                    </p>
                  </article>
                ),
              )}
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
                {
                  number: "04",
                  name: "Adenta & Pantang",
                  description:
                    "Serene residential options around Ashaley Botwe and Pantang, with convenient access to major routes across Accra.",
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
                    offers stays in Cantonments, Spintex, Ashaley Botwe and
                    Pantang, giving you more ways to choose your Accra base.
                  </p>

                  <div className="mt-8 space-y-3 border-y border-white/10 py-6">
                    {[
                      "East Legon",
                      "Cantonments",
                      "Spintex",
                      "Ashaley Botwe",
                      "Pantang",
                    ].map((area) => (
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
          <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-20">
            <div className="lg:self-start">
              <p className="eyebrow">Book Direct</p>

              <h2 className="mt-5 text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                Your stay,
                <br />
                handled personally.
              </h2>

              <p className="mt-8 max-w-md text-sm leading-7 text-[var(--muted)]">
                Tell us what you need once. The Vidan team will match your
                dates, confirm the residence and send the next steps directly
                through WhatsApp.
              </p>

              <div className="mt-10 border-y border-white/10">
                {[
                  {
                    number: "01",
                    title: "Share your stay details",
                    copy: "Choose your dates, party size and preferred residence.",
                  },
                  {
                    number: "02",
                    title: "Receive live availability",
                    copy: "The team confirms the best available option and rate.",
                  },
                  {
                    number: "03",
                    title: "Complete your reservation",
                    copy: "Payment and check-in instructions follow after confirmation.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="grid grid-cols-[auto_1fr] gap-5 border-b border-white/10 py-6 last:border-b-0"
                  >
                    <span className="pt-1 text-[9px] tracking-[0.18em] text-[var(--gold)]">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="text-sm font-medium text-white/80">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-white/35">
                        {step.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Prefer to speak directly?
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <a
                    href="https://wa.me/233591581142"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border border-white/10 p-4 transition hover:border-[var(--gold)]/60"
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                        Bookings & WhatsApp
                      </p>

                      <p className="mt-2 text-sm text-white/70">
                        +233 59 158 1142
                      </p>
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold)]"
                    />
                  </a>

                  <a
                    href="https://wa.me/233549517317"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border border-white/10 p-4 transition hover:border-[var(--gold)]/60"
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                        East Legon enquiries
                      </p>

                      <p className="mt-2 text-sm text-white/70">
                        +233 54 951 7317
                      </p>
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold)]"
                    />
                  </a>
                </div>
              </div>

              <div className="mt-10 border-l border-[var(--gold)] pl-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">
                  Detty December 2026
                </p>

                <p className="mt-2 text-xs leading-6 text-white/45">
                  Peak-season dates are limited. Early enquiries receive the
                  widest choice of available residences.
                </p>
              </div>
            </div>

            <BookingForm />

          </div>
        </div>
      </section>

      <FAQSection />

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
