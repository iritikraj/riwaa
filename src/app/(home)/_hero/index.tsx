import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AGENT_LOG = [
  {
    time: "09:41",
    agent: "Social Intelligence",
    tone: "forest",
    text: "Drafted a reply to an Instagram comment on the Marina Tower listing — waiting on your approval.",
  },
  {
    time: "09:38",
    agent: "Advisor Studio",
    tone: "navy",
    text: "Rebuilt Ahmed Al Farsi's bio after 3 new Property Finder listings went live.",
  },
  {
    time: "09:22",
    agent: "SEO Agent",
    tone: "oxblood",
    text: "Flagged missing schema markup on /listings/downtown-views.",
  },
  {
    time: "09:05",
    agent: "Website Studio",
    tone: "navy",
    text: "Published the landing page for the Emaar Beachfront campaign.",
  },
] as const;

const TONE_MAP: Record<string, string> = {
  forest: "bg-[#1F4D3A]",
  navy: "bg-[#1B2A4A]",
  oxblood: "bg-[#7A2E33]",
};

const Hero = () => {
  return (
    <section className="mx-auto max-w-350 px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* Left: thesis */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <span className="font-jost font-medium text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
            Agent infrastructure for real estate brokerages
          </span>

          <h1 className="mt-7 max-w-xl text-[2.75rem] font-medium leading-[1.08] tracking-[-0.02em] sm:text-6xl">
            The staff you
            <br />
            never have to{" "}
            <span className="relative inline-block">
              onboard.
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,1 100,4 T200,3"
                  stroke="#9C7A3C"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-md text-[15px] leading-7 text-[#565C6B]">
            RIWAA runs AI agents that build advisor portfolios, answer your
            reviews, audit your SEO, and ship your website — all reporting
            into one console, running under your brokerage&apos;s name.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="mailto:ak@solvetude.com"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#1B2A4A] px-7 py-3.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Book a walkthrough
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#console"
              className="inline-flex items-center gap-2 rounded-full border border-[#14181F]/15 px-7 py-3.5 text-[13px] font-medium text-[#14181F] transition-colors hover:border-[#14181F]/30"
            >
              See the live console
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#14181F]/8 pt-6 font-jost text-[10px] uppercase tracking-[0.16em] text-[#565C6B]">
            <span>SEO Agent</span>
            <span className="text-[#14181F]/25">·</span>
            <span>Advisor Studio</span>
            <span className="text-[#14181F]/25">·</span>
            <span>Social Intelligence</span>
            <span className="text-[#14181F]/25">·</span>
            <span>Website Studio</span>
          </div>
        </motion.div>

        {/* Right: signature — live agent console */}
        <motion.div
          id="console"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[#14181F]/10 bg-white shadow-[0_20px_60px_-25px_rgba(20,24,31,0.25)]"
        >
          <div className="flex items-center justify-between border-b border-[#14181F]/8 px-6 py-5">
            <span className="font-jost text-[10px] uppercase tracking-[0.25em] text-[#565C6B]">
              Agent console
            </span>
            <span className="flex items-center gap-2 font-jost text-[10px] uppercase tracking-[0.2em] text-[#1F4D3A]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1F4D3A] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1F4D3A]" />
              </span>
              Live
            </span>
          </div>

          <div className="flex-1 divide-y divide-[#14181F]/6">
            {AGENT_LOG.map((line, i) => (
              <motion.div
                key={line.time + line.agent}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                className="flex gap-4 px-6 py-5"
              >
                <span className="mt-1 font-jost text-[11px] text-[#565C6B]/70">
                  {line.time}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${TONE_MAP[line.tone]}`}
                    />
                    <span className="text-[12.5px] font-medium tracking-[0.02em] text-[#14181F]">
                      {line.agent}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-6 text-[#565C6B]">
                    {line.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto border-t border-[#14181F]/8 bg-[#FCFBF8] px-6 py-4">
            <p className="font-jost text-[10px] uppercase tracking-[0.18em] text-[#565C6B]">
              Built by Riwaa. Approved by you.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
};

export default Hero;