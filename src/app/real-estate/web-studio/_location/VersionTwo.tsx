"use client";
import { motion } from "framer-motion";

export function VersionTwo({ heading, subtext, mapsLink }: { heading?: string; subtext?: string; mapsLink?: string }) {
  const defaultMap = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178510024316!2d55.27218771500908!3d25.19719698389574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1620000000000!5m2!1sen!2sae";

  const mapUrl = mapsLink?.includes('<iframe')
    ? mapsLink.match(/src="([^"]+)"/)?.[1] || defaultMap
    : (mapsLink || defaultMap);

  return (
    <section className="py-24 md:py-32 bg-[#1A1A1A] font-jost text-[#F8F8F3]">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#B9A089]/40 rounded-full text-[#B9A089] text-xs uppercase tracking-widest font-medium mb-6">
              Positioned In The Pinnacle
            </div>
            <h2 className="text-4xl md:text-5xl font-cormorant font-light">{heading || "Strategic Vantage"}</h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[#F8F8F3]/60 max-w-sm text-sm leading-relaxed font-light"
          >
            {subtext || "Nestled in Dubai's most coveted district, offering unrivaled access to global commerce and luxury lifestyle."}
          </motion.p>
        </div>

        {/* Map Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full bg-[#2D2D2D]/50 backdrop-blur-xl border border-white/10 p-2 md:p-4 rounded-[32px] h-125 md:h-150 shadow-2xl relative overflow-hidden"
        >
          {/* Forcing Dark Mode colors on the iframe using CSS filter inversion technique */}
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '24px', filter: 'invert(90%) hue-rotate(180deg) contrast(1.1)' }}
            allowFullScreen={false}
            loading="lazy"
          />

          <div className="absolute top-8 left-8 bg-[#1A1A1A]/80 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 hidden md:block">
            <p className="font-cormorant text-[#B9A089]">0.0 km</p>
            <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Center of Gravity</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}