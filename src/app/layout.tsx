import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidan Luxury Apartments | Accra",
  description:
    "Luxury furnished short-let apartments across East Legon, Cantonments, Spintex, Ashaley Botwe and Pantang in Accra.",
  keywords: [
    "Vidan Luxury Apartments",
    "luxury apartments Accra",
    "short let Accra",
    "East Legon apartments",
    "Cantonments apartments",
    "Spintex apartments",
    "Adenta short lets",
    "Ashaley Botwe apartments",
    "Pantang apartments",
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
