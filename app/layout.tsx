import type { Metadata } from "next";
import { Ingrid_Darling, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const ingridDarling = Ingrid_Darling({
  variable: "--font-ingrid-darling",
  weight: "400"
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400"
});

const inter = Inter({
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Faerity",
  description: "I know everything.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${ingridDarling.variable} ${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
