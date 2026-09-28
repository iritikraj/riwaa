import { Footer } from "./(home)/_footer";
import RiwaaHomePage from "./(home)/_client";
import Navbar from "@/components/navbar";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "AI Agents for Real Estate Brokerages in Dubai | RIWAA",
  description:
    "RIWAA's AI agents for real estate brokerages in Dubai build advisor profiles, answer reviews, audit SEO and ship websites from one console. Book a walkthrough.",
  keywords: [
    "AI agents for real estate",
    "Real estate software Dubai",
    "AI for real estate agents",
    "Proptech Dubai",
    "Real estate AI tools",
    "AI real estate",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "AI Agents for Real Estate Brokerages in Dubai | RIWAA",
    description:
      "RIWAA's AI agents for real estate brokerages in Dubai build advisor profiles, answer reviews, audit SEO and ship websites from one console.",
    siteName: "RIWAA",
    locale: "en_AE",
  },
  twitter: {
    card: "summary",
    title: "AI Agents for Real Estate Brokerages in Dubai | RIWAA",
    description:
      "Build advisor profiles, answer reviews, audit SEO and ship websites from one console.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RIWAA",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description":
    "AI agents for real estate brokerages in Dubai to build advisor profiles, answer reviews, audit SEO and ship websites.",
  "creator": {
    "@type": "Organization",
    "name": "Solvetude",
  },
  "areaServed": "AE",
};

export default async function Riwaa() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] font-jost text-[#14181F] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <RiwaaHomePage />
      <Footer />
    </div>
  );
}