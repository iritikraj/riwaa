"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UserCircle, Globe, Sparkles, Shield, Diamond } from "lucide-react";
import Image from "next/image";

export default function RiwaaHomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-jost selection:bg-[#b8924a] selection:text-white overflow-hidden relative">
      {/* Background Subtle Effects */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#b8924a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[#b8924a]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 w-full px-8 py-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <Image src="/riwa-logo.png" height={20} width={20} alt="RIWAA" className="object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-white font-light uppercase text-sm tracking-[0.3em] leading-none">RIWAA</h1>
            <span className="text-[8px] tracking-[0.2em] uppercase text-[#b8924a] mt-1.5">By Solvetude</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-widest text-white/50">
          {/* <span className="hover:text-white transition-colors cursor-pointer">About</span> */}
          {/* <span className="hover:text-white transition-colors cursor-pointer">Enterprise</span> */}
          <a href="mailto:ak@solvetude.com" className="hover:text-[#b8924a] transition-colors">Contact</a>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-[#b8924a]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#b8924a] font-semibold">Your AI Partner</span>
            <div className="h-px w-8 bg-[#b8924a]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cormorant text-5xl md:text-7xl font-light tracking-tight mb-8 leading-tight"
          >
            Elevating the Standard of <br />
            <span className="font-cormorant text-white/80">Dubai Real Estate</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/50 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto font-jost"
          >
            Bespoke AI solutions crafted exclusively for elite brokerages and top-tier advisors.
            Transform your market presence with institutional-grade digital platforms.
          </motion.p>
        </div>

        {/* Tools Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Tool 1: Advisor Profiler */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/real-estate/advisors/create" className="block group h-full">
              <div className="relative h-full bg-[#111111] border border-white/10 rounded-3xl p-10 overflow-hidden transition-all duration-700 hover:border-[#b8924a]/50 hover:bg-[#151515]">
                {/* Hover Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8924a]/5 blur-[80px] rounded-full group-hover:bg-[#b8924a]/10 transition-colors duration-700" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <UserCircle size={28} className="text-[#b8924a]" />
                  </div>

                  <h3 className="font-cormorant text-3xl mb-4 text-white group-hover:text-[#b8924a] transition-colors duration-500">
                    Advisor Portfolio Studio
                  </h3>

                  <p className="text-white/50 text-sm font-light leading-relaxed mb-12 grow font-jost">
                    Transform an agent&apos;s track record into a high-converting, Forbes-tier digital portfolio. Auto-generate metrics, pull live properties, and establish elite authority instantly.
                  </p>

                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#b8924a] font-semibold font-jost">
                    <span>Enter Studio</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Tool 2: Web Studio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/real-estate/web-studio/create" className="block group h-full">
              <div className="relative h-full bg-[#111111] border border-white/10 rounded-3xl p-10 overflow-hidden transition-all duration-700 hover:border-[#b8924a]/50 hover:bg-[#151515]">
                {/* Hover Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8924a]/5 blur-[80px] rounded-full group-hover:bg-[#b8924a]/10 transition-colors duration-700" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Globe size={28} className="text-[#b8924a]" />
                  </div>

                  <h3 className="font-cormorant text-3xl mb-4 text-white group-hover:text-[#b8924a] transition-colors duration-500">
                    Brokerage Web Studio
                  </h3>

                  <p className="text-white/50 text-sm font-light leading-relaxed mb-12 grow font-jost">
                    Deploy immersive, data-rich property platforms designed for the global ultra-high-net-worth market. Architect entire corporate websites in minutes.
                  </p>

                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#b8924a] font-semibold font-jost">
                    <span>Launch Platform</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>

        {/* Value Proposition Micro-Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-32 pt-16 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div className="flex flex-col items-center text-center">
            <Diamond size={20} className="text-white/30 mb-4" />
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3">Institutional Design</h4>
            <p className="text-xs text-white/40 font-light leading-relaxed">Aesthetics strictly aligned with the world&apos;s most prestigious luxury brands and wealth management firms.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Sparkles size={20} className="text-white/30 mb-4" />
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3">AI-Powered Extraction</h4>
            <p className="text-xs text-white/40 font-light leading-relaxed">Effortlessly parse CVs, property finder links, and historical deals into structured, high-converting data.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Shield size={20} className="text-white/30 mb-4" />
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3">Exclusive Networks</h4>
            <p className="text-xs text-white/40 font-light leading-relaxed">Built from the ground up to cater specifically to Forbes Global Properties and elite Dubai brokerages.</p>
          </div>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 py-8 text-center bg-[#020202]">
        <p className="text-[9px] uppercase tracking-widest text-white/30">
          &copy; {new Date().getFullYear()} Riwaa by Solvetude. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}