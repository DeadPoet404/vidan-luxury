const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "Vidan Luxury Apartments",
  shortName: "Vidan",
  description:
    "Luxury furnished short-let apartments across East Legon, Cantonments, Spintex, Ashaley Botwe and Pantang in Accra.",
  url: configuredUrl.replace(/\/$/, ""),
  locale: "en_GH",
  phone: "+233591581142",
  secondaryPhone: "+233549517317",
  locations: [
    "East Legon",
    "Cantonments",
    "Spintex",
    "Ashaley Botwe",
    "Pantang",
  ],
} as const;
