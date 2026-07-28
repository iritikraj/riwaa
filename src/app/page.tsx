"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Roster from "./(home)/_roster";
import Hero from "./(home)/_hero";
import Navbar from "./(home)/_nav";

const WHY = [
  {
    title: "Built for real estate, not retrofitted",
    desc: "RIWAA understands listings, advisor bios and reviews natively — it isn't a generic chatbot wearing a brokerage skin.",
  },
  {
    title: "Every agent drafts. You approve.",
    desc: "Replies and content are prepared and queued, never auto-published. Your name stays on everything, on your terms.",
  },
  {
    title: "One login for every agent",
    desc: "Advisor Studio, Social Intelligence, Website Studio and SEO Agent report into a single console — no separate tools to juggle.",
  },
  {
    title: "Scales with the brokerage",
    desc: "Role-based access and multi-brand support mean the same system works for a single advisor or a 40-desk agency.",
  },
];

export default function RiwaaHomePage() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] font-jost text-[#14181F] antialiased">
      <Navbar />

      <main>
        <Hero />
        <Roster />
        {/* ================= Why RIWAA ================= */}
        <section className="mx-auto max-w-350 px-6 py-24 lg:px-10">
          <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
            Why RIWAA
          </span>
          <h2 className="mt-5 max-w-lg text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
            Enterprise habits, agent speed.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-[#14181F]/10 bg-[#14181F]/10 sm:grid-cols-2">
            {WHY.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#FCFBF8] p-9"
              >
                <CheckCircle2 size={18} className="text-[#1F4D3A]" />
                <h3 className="mt-6 text-lg font-medium">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-[#565C6B]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        {/* ================= CTA ================= */}
        <section className="mx-auto max-w-350 px-6 pb-24 lg:px-10">
          <div className="relative overflow-hidden rounded-[28px] bg-[#14181F] px-8 py-16 text-[#FCFBF8] sm:px-16 sm:py-20">
            <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#c9b183]">
              Ready when you are
            </span>
            <h2 className="mt-6 max-w-xl text-4xl font-medium leading-[1.12] tracking-[-0.01em] sm:text-5xl">
              Put agents on the team, without adding headcount.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-white/60">
              A short walkthrough is enough to see whether RIWAA fits your
              brokerage — no setup required to look.
            </p>
            <a
              href="mailto:ak@solvetude.com"
              className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-[#FCFBF8] px-7 py-3.5 text-[13px] font-medium text-[#14181F] transition-opacity hover:opacity-90"
            >
              Book a walkthrough
              <ArrowRight size={15} />
            </a>
          </div>
        </section>
      </main>

      {/* ================= Footer ================= */}
      <footer className="border-t border-[#14181F]/8">
        <div className="mx-auto flex max-w-350 flex-col gap-8 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            {/* RIWAA Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#14181F]/10 bg-white">
              <Image
                src="/riwa-logo-transparent.png"
                alt="RIWAA"
                width={30}
                height={30}
              />
            </div>

            {/* RIWAA Text */}
            <div className="leading-none">
              <p className="text-[15px] font-medium tracking-[0.22em] text-[#14181F]">
                RIWAA
              </p>
              <p className="mt-1 font-jost text-[9px] uppercase tracking-[0.22em] text-[#565C6B]">
                powered by
              </p>
            </div>

            {/* Divider */}
            <div className="mx-2 h-8 w-px bg-[#14181F]/15" />

            {/* Solvetude Logo */}
            <Image
              src="/solvetude-logo.png"
              alt="Solvetude"
              width={100}
              height={30}
              className="object-contain"
            />
          </div>

          <div className="flex flex-wrap gap-7 font-jost text-[11px] uppercase tracking-[0.16em] text-[#565C6B]">
            <Link href="/real-estate/advisors/create" className="hover:text-[#14181F]">
              Advisor Studio
            </Link>
            <Link href="/social-media-agent" className="hover:text-[#14181F]">
              Social Intelligence
            </Link>
            <Link href="/real-estate/web-studio/create" className="hover:text-[#14181F]">
              Website Studio
            </Link>
            <Link href="/seo-agent/audit" className="hover:text-[#14181F]">
              SEO Agent
            </Link>
          </div>

          <p className="font-jost text-[10px] uppercase tracking-[0.16em] text-[#565C6B]/70">
            © {new Date().getFullYear()} Solvetude
          </p>
        </div>
      </footer>
    </div>
  );
}