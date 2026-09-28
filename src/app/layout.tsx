import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

export const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.riwaa.com"),
  title: {
    default: "AI Agents for Real Estate Brokerages in Dubai | RIWAA",
    template: "%s | RIWAA",
  },
  description:
    "RIWAA's AI agents for real estate brokerages in Dubai build advisor profiles, answer reviews, audit SEO and ship websites from one console. Book a walkthrough.",
  applicationName: "RIWAA",
  creator: "Ritik Raj",
  publisher: "Solvetude",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${jost.variable} ${playfairDisplay.className} ${playfairDisplay.variable} ${cormorantGaramond.className} ${jost.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f9f6f1]">{children}</body>
    </html>
  );
}
