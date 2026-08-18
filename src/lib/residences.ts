// ─────────────────────────────────────────────────────────────
// Vidan Luxury Apartments — single source of truth for the
// residence portfolio. Consumed by:
//   • src/components/ResidencesGrid.tsx  (card grid + filters)
//   • src/components/BookingForm.tsx     (residence select)
//   • AI concierge prompt (Increment 3+, same data, no drift)
// ─────────────────────────────────────────────────────────────

export const RESIDENCE_AREAS = [
  "East Legon",
  "Cantonments",
  "Spintex",
  "Adenta",
] as const;

export type ResidenceArea = (typeof RESIDENCE_AREAS)[number];

export type Residence = {
  /** Matches the image folder under /public/images/vidan/ */
  id: string;
  /** Card title */
  name: string;
  /** Badge text on the card */
  location: string;
  /** Neighbourhood bucket used by the grid filter */
  area: ResidenceArea;
  /** e.g. "2 Bedrooms · Serviced" */
  type: string;
  /** "Studio" | "1" | "2" | "3" */
  bedrooms: string;
  /** Mock maximum occupancy for the demo */
  sleeps: number;
  /** Display strings (as published) */
  priceUsd: string;
  priceGhs: string;
  /** Three amenity chips shown on the card */
  amenities: string[];
  /** Featured card image */
  image: string;
  /** Gallery folder for this residence */
  imageDir: string;
  /** Option label in the booking form select */
  bookingLabel: string;
  /** Indicative rate sentence (booking form + AI prompt) */
  rateSummary: string;
};

export const RESIDENCES: Residence[] = [
  {
    id: "01-east-legon-one-bedroom",
    name: "Beautiful One-Bedroom",
    location: "East Legon",
    area: "East Legon",
    type: "1 Bedroom · Furnished",
    bedrooms: "1",
    sleeps: 2,
    priceUsd: "$130",
    priceGhs: "≈ GH₵1,430",
    amenities: ["En-suite bedroom", "High-speed Wi-Fi", "Smart TV & DSTV"],
    image: "/images/vidan/01-east-legon-one-bedroom/01.webp",
    imageDir: "/images/vidan/01-east-legon-one-bedroom",
    bookingLabel: "Beautiful One-Bedroom — East Legon",
    rateSummary: "$130 / approximately GH₵1,430 per night",
  },
  {
    id: "02-east-legon-two-bedroom",
    name: "Affordable Two-Bedroom",
    location: "East Legon",
    area: "East Legon",
    type: "2 Bedrooms · Serviced",
    bedrooms: "2",
    sleeps: 4,
    priceUsd: "≈ $214",
    priceGhs: "GH₵2,350",
    amenities: ["All rooms en-suite", "Equipped kitchen", "24/7 security"],
    image: "/images/vidan/02-east-legon-two-bedroom/01.webp",
    imageDir: "/images/vidan/02-east-legon-two-bedroom",
    bookingLabel: "Affordable Two-Bedroom — East Legon",
    rateSummary: "GH₵2,350 / approximately $214 per night",
  },
  {
    id: "03-cantonments-one-bedroom",
    name: "Furnished One-Bedroom",
    location: "Cantonments",
    area: "Cantonments",
    type: "1 Bedroom · Furnished",
    bedrooms: "1",
    sleeps: 2,
    priceUsd: "$120",
    priceGhs: "≈ GH₵1,320",
    amenities: ["Backup power", "High-speed Wi-Fi", "Secure parking"],
    image: "/images/vidan/03-cantonments-one-bedroom/01.webp",
    imageDir: "/images/vidan/03-cantonments-one-bedroom",
    bookingLabel: "Furnished One-Bedroom — Cantonments",
    rateSummary: "$120 / approximately GH₵1,320 per night",
  },
  {
    id: "04-spintex-two-bedroom-85",
    name: "Spintex Two-Bedroom",
    location: "Spintex",
    area: "Spintex",
    type: "2 Bedrooms · Furnished",
    bedrooms: "2",
    sleeps: 4,
    priceUsd: "$85",
    priceGhs: "≈ GH₵935",
    amenities: ["Unlimited internet", "Weekly cleaning", "Washing machine"],
    image: "/images/vidan/04-spintex-two-bedroom-85/01.webp",
    imageDir: "/images/vidan/04-spintex-two-bedroom-85",
    bookingLabel: "Two-Bedroom Furnished Apartment — Spintex",
    rateSummary: "$85 / approximately GH₵935 per night",
  },
  {
    id: "05-spintex-two-bedroom-75",
    name: "Spintex City Apartment",
    location: "Spintex",
    area: "Spintex",
    type: "2 Bedrooms · Furnished",
    bedrooms: "2",
    sleeps: 4,
    priceUsd: "$75",
    priceGhs: "≈ GH₵825",
    amenities: ["Unlimited Wi-Fi", "Weekly cleaning", "Prime location"],
    image: "/images/vidan/05-spintex-two-bedroom-75/01.webp",
    imageDir: "/images/vidan/05-spintex-two-bedroom-75",
    bookingLabel: "Spintex City Apartment",
    rateSummary: "$75 / approximately GH₵825 per night",
  },
  {
    id: "06-ashaley-botwe-premium-suite",
    name: "Premium One-Bedroom Suite",
    location: "Ashaley Botwe",
    area: "Adenta",
    type: "1 Bedroom · Premium Suite",
    bedrooms: "1",
    sleeps: 2,
    priceUsd: "≈ $180",
    priceGhs: "GH₵1,980",
    amenities: ["En-suite bedroom", "Wi-Fi & DSTV", "24/7 security"],
    image: "/images/vidan/06-ashaley-botwe-premium-suite/03.webp",
    imageDir: "/images/vidan/06-ashaley-botwe-premium-suite",
    bookingLabel: "Premium One-Bedroom Suite — Ashaley Botwe",
    rateSummary: "GH₵1,980 / approximately $180 per night",
  },
  {
    id: "07-ashaley-botwe-modern-two-bedroom",
    name: "Modern Two-Bedroom",
    location: "Ashaley Botwe",
    area: "Adenta",
    type: "2 Bedrooms · Furnished",
    bedrooms: "2",
    sleeps: 4,
    priceUsd: "≈ $158",
    priceGhs: "GH₵1,740",
    amenities: ["Fitted kitchen", "Reliable utilities", "Secure parking"],
    image: "/images/vidan/07-ashaley-botwe-modern-two-bedroom/01.webp",
    imageDir: "/images/vidan/07-ashaley-botwe-modern-two-bedroom",
    bookingLabel: "Modern Two-Bedroom — Ashaley Botwe",
    rateSummary: "GH₵1,740 / approximately $158 per night",
  },
  {
    id: "08-pantang-classy-two-bedroom",
    name: "Classy Two-Bedroom",
    location: "Pantang Junction",
    area: "Adenta",
    type: "2 Bedrooms · Serviced",
    bedrooms: "2",
    sleeps: 4,
    priceUsd: "$140",
    priceGhs: "≈ GH₵1,540",
    amenities: ["Two en-suite rooms", "Wi-Fi & DSTV", "Constant utilities"],
    image: "/images/vidan/08-pantang-classy-two-bedroom/01.webp",
    imageDir: "/images/vidan/08-pantang-classy-two-bedroom",
    bookingLabel: "Classy Two-Bedroom — Pantang Junction",
    rateSummary: "$140 / approximately GH₵1,540 per night",
  },
  {
    id: "09-pantang-three-bedroom",
    name: "Serene Three-Bedroom",
    location: "Pantang Junction",
    area: "Adenta",
    type: "3 Bedrooms · Serviced",
    bedrooms: "3",
    sleeps: 6,
    priceUsd: "$150",
    priceGhs: "≈ GH₵1,650",
    amenities: ["All rooms en-suite", "Fitted kitchen", "Wi-Fi & DSTV"],
    image: "/images/vidan/09-pantang-three-bedroom/01.webp",
    imageDir: "/images/vidan/09-pantang-three-bedroom",
    bookingLabel: "Serene Three-Bedroom — Pantang Junction",
    rateSummary: "$150 / approximately GH₵1,650 per night",
  },
  {
    id: "10-ashaley-botwe-classic-studio",
    name: "Classic Studio Apartment",
    location: "Ashaley Botwe",
    area: "Adenta",
    type: "Studio · Furnished",
    bedrooms: "Studio",
    sleeps: 2,
    priceUsd: "≈ $104",
    priceGhs: "GH₵1,140",
    amenities: ["Fitted kitchen", "24/7 security", "Secure parking"],
    image: "/images/vidan/10-ashaley-botwe-classic-studio/01.webp",
    imageDir: "/images/vidan/10-ashaley-botwe-classic-studio",
    bookingLabel: "Classic Studio — Ashaley Botwe",
    rateSummary: "GH₵1,140 / approximately $104 per night",
  },
];

/** First, neutral option in the booking form select */
export const ANY_RESIDENCE_OPTION = {
  value: "Any available residence",
  label: "Any available residence",
  rate: "Best available direct rate",
} as const;
