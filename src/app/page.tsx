"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Roster from "./(home)/_roster";
import Hero from "./(home)/_hero";
import Navbar from "./(home)/_nav";
import { Footer } from "./(home)/_footer";

const waNumber = "971581980131";
const waMessage = encodeURIComponent("Hi, I would like to know more about RIWAA.");

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
              href={`https://wa.me/${waNumber}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a walkthrough"
              className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-[#FCFBF8] px-7 py-3.5 text-[13px] font-medium text-[#14181F] transition-opacity hover:opacity-90"
            >
              Book a walkthrough
              <ArrowRight size={15} />
            </a>
          </div>
        </section>
      </main>

      {/* ================= Footer ================= */}
      <Footer />
    </div>
  );
}