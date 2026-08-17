import type {
  Metadata,
  Viewport,
} from "next";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default:
      "Vidan Luxury Apartments | Accra",
    template:
      "%s | Vidan Luxury Apartments",
  },

  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "travel",

  keywords: [
    "Vidan Luxury Apartments",
    "luxury apartments Accra",
    "short let Accra",
    "furnished apartments Accra",
    "East Legon apartments",
    "Cantonments apartments",
    "Spintex apartments",
    "Adenta short lets",
    "Ashaley Botwe apartments",
    "Pantang apartments",
    "Accra Airbnb",
    "Ghana short stay apartments",
  ],

  authors: [
    {
      name: siteConfig.name,
    },
  ],

  creator: siteConfig.name,
  publisher: siteConfig.name,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title:
      "Vidan Luxury Apartments | Stay in Accra",
    description: siteConfig.description,

    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt:
          "Vidan Luxury Apartments in Accra, Ghana",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Vidan Luxury Apartments | Stay in Accra",
    description: siteConfig.description,
    images: [
      "/opengraph-image",
    ],
  },

  icons: {
    icon: "/icon.svg",
  },

  manifest: "/manifest.webmanifest",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",

  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.phone,

  image:
    `${siteConfig.url}/images/vidan/` +
    "07-ashaley-botwe-modern-two-bedroom/05.webp",

  priceRange: "$75–$214 per night",

  address: {
    "@type": "PostalAddress",
    addressLocality: "Accra",
    addressRegion: "Greater Accra",
    addressCountry: "GH",
  },

  areaServed: siteConfig.locations.map(
    (location) => ({
      "@type": "Place",
      name: `${location}, Accra`,
    }),
  ),

  amenityFeature: [
    "Furnished apartments",
    "Wi-Fi",
    "Security",
    "Fitted kitchens",
    "Parking",
  ].map((name) => ({
    "@type":
      "LocationFeatureSpecification",
    name,
    value: true,
  })),

  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "reservations",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      telephone:
        siteConfig.secondaryPhone,
      contactType:
        "East Legon enquiries",
      availableLanguage: "English",
    },
  ],

  potentialAction: {
    "@type": "ReserveAction",
    target: `${siteConfig.url}/#book`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GH">
      <body>
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>

        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              structuredData,
            ).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      </body>
    </html>
  );
}
