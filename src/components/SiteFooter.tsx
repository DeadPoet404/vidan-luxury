import {
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const exploreLinks = [
  {
    label: "Residences",
    href: "#apartments",
  },
  {
    label: "Experience",
    href: "#experience",
  },
  {
    label: "Locations",
    href: "#location",
  },
  {
    label: "Guest information",
    href: "#faq",
  },
  {
    label: "Book direct",
    href: "#book",
  },
];

const locations = [
  "East Legon",
  "Cantonments",
  "Spintex",
  "Ashaley Botwe",
  "Pantang",
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080807]">
      <div className="container-page pt-20 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.6fr_0.7fr_0.9fr] lg:gap-10">
          <div>
            <a
              href="#"
              aria-label="Vidan Luxury Apartments home"
            >
              <p className="text-xl font-semibold tracking-[0.2em] text-white">
                VIDAN
              </p>

              <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-[var(--gold)]">
                Luxury Apartments · Accra
              </p>
            </a>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/40">
              Furnished short-let apartments across
              Accra, with direct booking support for
              business, leisure and extended stays.
            </p>

            <a
              href="https://wa.me/233591581142?text=Hello%20Vidan%20Luxury%20Apartments%2C%20I%27d%20like%20to%20check%20availability."
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-3 bg-[var(--gold)] px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-[var(--gold-light)]"
            >
              <MessageCircle size={15} />
              Check availability

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Explore
            </p>

            <ul className="mt-6 space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 transition hover:text-[var(--gold)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Accra locations
            </p>

            <ul className="mt-6 space-y-4">
              {locations.map((location) => (
                <li key={location}>
                  <a
                    href="#location"
                    className="flex items-center gap-2.5 text-sm text-white/50 transition hover:text-[var(--gold)]"
                  >
                    <MapPin
                      size={12}
                      className="text-[var(--gold)]/60"
                    />
                    {location}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Direct contacts
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="https://wa.me/233591581142"
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-white/10 p-4 transition hover:border-[var(--gold)]/50"
              >
                <span className="flex items-center gap-2 text-[8px] uppercase tracking-[0.15em] text-white/25">
                  <MessageCircle size={12} />
                  Bookings & WhatsApp
                </span>

                <span className="mt-2 block text-sm text-white/65 transition group-hover:text-[var(--gold)]">
                  +233 59 158 1142
                </span>
              </a>

              <a
                href="tel:+233549517317"
                className="group block border border-white/10 p-4 transition hover:border-[var(--gold)]/50"
              >
                <span className="flex items-center gap-2 text-[8px] uppercase tracking-[0.15em] text-white/25">
                  <Phone size={12} />
                  East Legon enquiries
                </span>

                <span className="mt-2 block text-sm text-white/65 transition group-hover:text-[var(--gold)]">
                  +233 54 951 7317
                </span>
              </a>
            </div>

            <p className="mt-4 text-[10px] leading-5 text-white/25">
              Availability and final rates are
              confirmed directly by the Vidan team
              before payment.
            </p>
          </div>
        </div>

        <div className="mt-20 overflow-hidden border-y border-white/10 py-8 sm:mt-24 sm:py-10">
          <p
            aria-hidden="true"
            className="whitespace-nowrap text-center text-[clamp(4.25rem,15vw,13rem)] font-semibold leading-[0.72] tracking-[-0.065em] text-white/[0.055]"
          >
            VIDAN
          </p>
        </div>

        <div className="flex flex-col gap-4 py-8 text-[9px] uppercase tracking-[0.14em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Vidan Luxury
            Apartments
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>Accra, Ghana</span>
            <span>Direct booking</span>
            <span>Rates subject to confirmation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
