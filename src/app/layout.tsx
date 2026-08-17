import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidan Luxury Apartments | Accra",
  description:
    "Luxury short-let apartments in East Legon, Cantonments and Spintex, Accra.",
  keywords: [
    "Vidan Luxury Apartments",
    "luxury apartments Accra",
    "short let Accra",
    "East Legon apartments",
    "Cantonments apartments",
    "Spintex apartments",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
