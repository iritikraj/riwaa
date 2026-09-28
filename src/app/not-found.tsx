"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FCFBF8] px-6 font-jost antialiased">

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <span className="font-jost font-medium text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
          404
        </span>

        <h1 className="mt-7 max-w-2xl font-playfair text-3xl font-medium leading-[1.05] tracking-tight text-[#14181F] sm:text-7xl">
          Oops
        </h1>

        <p className="mt-7 max-w-md text-xl leading-7 text-[#565C6B]">
          The page or listing you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#1B2A4A] px-8 py-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Home
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}