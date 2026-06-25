"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, UserCircle, Sparkles, Shield, Diamond, LayoutDashboard, MessageCircleMore, CheckCircle2, Building2 } from "lucide-react";

export default function RiwaaHomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white font-jost">
      {/* ================= Background ================= */}

      <div className="absolute inset-0">
        <div className="absolute -left-62.5 -top-62.5 h-162.5 w-162.5 rounded-full bg-[#b8924a]/12 blur-[150px]" />

        <div className="absolute -right-37.5 top-[15%] h-125 w-125 rounded-full bg-[#8d6a37]/10 blur-[130px]" />

        <div className="absolute -bottom-62.5 left-1/2 h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-[#b8924a]/8 blur-[170px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      {/* ================= Navbar ================= */}

      <nav className="relative z-30 border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Image src="/riwa-logo.png" alt="RIWAA" width={26} height={26} />
            </div>

            <div>
              <h2 className="text-lg uppercase tracking-[0.45em] font-light">
                RIWAA
              </h2>

              <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-[#b8924a]">
                AI Platform by Solvetude
              </p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-10">
            <span className="text-[11px] uppercase tracking-[0.35em] text-white/40">
              Advisor AI
            </span>

            <span className="text-[11px] uppercase tracking-[0.35em] text-white/40">
              Social AI
            </span>

            <span className="text-[11px] uppercase tracking-[0.35em] text-white/40">
              Website Studio
            </span>
          </div>

          <a
            href="mailto:ak@solvetude.com"
            className="rounded-full border border-[#b8924a]/30 bg-[#b8924a]/10 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-[#d8bc83] transition hover:bg-[#b8924a] hover:text-black"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* ================= Hero ================= */}

      <main className="relative z-20">
        <section className="mx-auto max-w-375 px-5 sm:px-6 lg:px-8 pt-16 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2">
              <Sparkles size={14} className="text-[#b8924a]" />

              <span className="text-[10px] uppercase tracking-[0.35em] text-[#d8bc83]">
                AI Infrastructure for UAE Real Estate
              </span>
            </div>

            <h1 className="mx-auto mt-8 max-w-6xl text-4xl font-light leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-cormorant">
              Everything Your
              <br />
              <span className="text-[#d8bc83]">Brokerage Needs.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-white/55 md:text-lg">
              Build luxury advisor portfolios, automate customer engagement,
              generate premium websites and manage your complete digital
              presence through one AI-powered operating system.
            </p>
          </motion.div>

          {/* ================= Products ================= */}

          <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ================================================= */}
            {/* ADVISOR PORTFOLIO */}
            {/* ================================================= */}

            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35 }}
              className="group relative overflow-hidden rounded-[30px] border border-[#b8924a]/20 bg-gradient-to-br from-[#17120d] via-[#101010] to-[#080808] min-h-[470px]"
            >
              <div className="absolute right-0 top-0 h-75 w-75 rounded-full bg-[#b8924a]/10 blur-[120px]" />

              <div className="relative flex h-full flex-col p-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b8924a]/10">
                    <UserCircle size={28} className="text-[#d8bc83]" />
                  </div>

                  <span className="rounded-full border border-[#b8924a]/20 bg-[#b8924a]/10 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#d8bc83]">
                    Flagship
                  </span>
                </div>

                <h2 className="mt-8 text-3xl font-light">
                  Advisor
                  <br />
                  Portfolio Studio
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  Automatically generate luxury advisor profiles using Property
                  Finder, Bayut and your internal brokerage data.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    "Property Finder Import",
                    "AI Generated Biography",
                    "Live Listings",
                    "Achievements & Awards",
                    "Forbes Style Portfolio",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <CheckCircle2 size={16} className="text-[#b8924a]" />

                      <span className="text-sm text-white/70">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <Link
                    href="/real-estate/advisors/create"
                    className="inline-flex items-center gap-3 rounded-full bg-[#b8924a] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black transition-all hover:gap-5"
                  >
                    Launch Studio
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
            {/* ================================================ */}
            {/* SOCIAL INTELLIGENCE */}
            {/* ================================================ */}

            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35 }}
              className="group relative overflow-hidden rounded-[30px] border border-purple-500/20 bg-gradient-to-br from-[#121018] via-[#0d0d12] to-[#080808] min-h-[470px]"
            >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/15 blur-[120px]" />
              <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-pink-500/10 blur-[90px]" />

              <div className="relative flex h-full flex-col p-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                    <MessageCircleMore size={26} className="text-pink-300" />
                  </div>

                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-purple-300">
                    LIVE
                  </span>
                </div>

                <h2 className="mt-8 text-3xl font-light">
                  Social
                  <br />
                  Intelligence
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  Manage Google Reviews, Facebook and Instagram comments from
                  one intelligent AI dashboard.
                </p>

                {/* Inbox */}

                <div className="mt-8 flex-1 rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl overflow-hidden">
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                      LIVE FEED
                    </p>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="rounded-xl bg-[#1b1b22] border border-white/10 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-orange-400" />

                        <div>
                          <p className="text-xs font-medium">Instagram</p>

                          <p className="text-[10px] text-white/40">
                            New Comment
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-white/70">
                        Amazing experience buying our villa ❤️
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#16161b] border border-white/10 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-500" />

                        <div>
                          <p className="text-xs font-medium">Facebook</p>

                          <p className="text-[10px] text-white/40">
                            AI Reply Generated
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-purple-200">
                        &quot;Thank you Sarah. We truly appreciate your trust...&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/social-media-agent"
                    className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold"
                  >
                    Open Dashboard
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* ================================================ */}
            {/* WEBSITE STUDIO */}
            {/* ================================================ */}

            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35 }}
              className="group relative overflow-hidden rounded-[30px] border border-[#b8924a]/20 bg-gradient-to-br from-[#15120d] via-[#101010] to-[#080808] min-h-[470px]"
            >
              <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#b8924a]/10 blur-[120px]" />

              <div className="relative flex h-full flex-col p-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b8924a]/10 border border-[#b8924a]/20">
                    <LayoutDashboard size={26} className="text-[#d8bc83]" />
                  </div>

                  <span className="rounded-full border border-[#b8924a]/20 bg-[#b8924a]/10 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#d8bc83]">
                    AI Builder
                  </span>
                </div>

                <h2 className="mt-8 text-3xl font-light">
                  Website
                  <br />
                  Studio
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  Generate premium developer and brokerage websites with
                  editable sections, AI content and luxury templates.
                </p>

                {/* Browser Preview */}

                <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#080808]">
                  <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                    <div className="h-3 w-3 rounded-full bg-red-400" />

                    <div className="h-3 w-3 rounded-full bg-yellow-400" />

                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="h-24 rounded-xl bg-gradient-to-r from-[#b8924a]/25 to-[#6d5731]/25" />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-14 rounded-lg bg-white/5" />

                      <div className="h-14 rounded-lg bg-white/5" />
                    </div>

                    <div className="h-10 rounded-lg bg-white/5" />
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <Link
                    href="/real-estate/web-studio/create"
                    className="inline-flex items-center gap-3 rounded-full border border-[#b8924a]/30 bg-[#b8924a]/10 px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-[#d8bc83] transition hover:bg-[#b8924a] hover:text-black"
                  >
                    Start Building
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          {/* ========================================= */}
          {/* WHY RIWAA */}
          {/* ========================================= */}

          <section className="mt-28">
            <div className="text-center">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#b8924a]/20 bg-[#b8924a]/10 px-5 py-2">
                <Diamond size={14} className="text-[#b8924a]" />

                <span className="text-[10px] uppercase tracking-[0.35em] text-[#d8bc83]">
                  Why RIWAA
                </span>
              </span>

              <h2 className="mt-8 text-4xl md:text-5xl font-light">
                Enterprise AI Infrastructure
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-white/55 leading-8">
                Designed specifically for modern brokerages, luxury developers,
                and real estate advisors across the UAE.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: Diamond,
                  title: "Luxury Experience",
                  desc: "Institutional-grade interfaces inspired by Forbes Global Properties and premium wealth brands.",
                },
                {
                  icon: Sparkles,
                  title: "AI Native",
                  desc: "Generate websites, advisor profiles, social media replies and marketing content instantly.",
                },
                {
                  icon: Shield,
                  title: "Enterprise Ready",
                  desc: "Role-based architecture, scalable infrastructure and brokerage-ready workflows.",
                },
                {
                  icon: Building2,
                  title: "Built for UAE",
                  desc: "Purpose-built for developers, agencies and brokerages operating across the UAE market.",
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{
                    y: -6,
                  }}
                  transition={{ duration: 0.25 }}
                  className="group rounded-[28px] border border-white/10 bg-white/3 backdrop-blur-xl p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b8924a]/20 bg-[#b8924a]/10">
                    <feature.icon size={24} className="text-[#d8bc83]" />
                  </div>

                  <h3 className="mt-8 text-2xl font-light group-hover:text-[#d8bc83] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-white/50">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ========================================= */}
          {/* CTA */}
          {/* ========================================= */}

          <section className="mt-28">
            <div className="relative overflow-hidden rounded-[36px] border border-[#b8924a]/20 bg-gradient-to-br from-[#15120d] via-[#0d0d0d] to-[#090909]">
              <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-[#b8924a]/10 blur-[120px]" />

              <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#b8924a]/5 blur-[120px]" />

              <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#d8bc83]">
                  Ready to Transform Your Brokerage?
                </span>

                <h2 className="mx-auto mt-8 max-w-4xl text-4xl md:text-6xl font-light leading-tight">
                  One Platform.
                  <br />
                  Endless Possibilities.
                </h2>

                <p className="mx-auto mt-8 max-w-2xl text-white/55 leading-8">
                  From advisor portfolios to AI-powered websites and social
                  intelligence, RIWAA gives your brokerage every digital tool
                  required to dominate the luxury real estate market.
                </p>

                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="mailto:ak@solvetude.com"
                    className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-white transition hover:bg-white/10"
                  >
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}

      <footer className="relative z-20 mt-24 border-t border-white/10">
        <div className="mx-auto flex max-w-375 flex-col gap-10 px-5 py-10 md:flex-row md:items-center md:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Image src="/riwa-logo.png" alt="RIWAA" width={24} height={24} />
            </div>

            <div>
              <h3 className="text-lg uppercase tracking-[0.4em] font-light">
                RIWAA
              </h3>

              <p className="mt-1 text-xs text-white/40">
                AI Infrastructure for UAE Real Estate
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 text-xs text-white/40 uppercase tracking-[0.25em]">
            <Link href="/real-estate/advisors/create">Advisor</Link>

            <Link href="/social-media-agent">Social</Link>

            <Link href="/real-estate/web-studio/create">Website</Link>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
            © {new Date().getFullYear()} Solvetude. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
