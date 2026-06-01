"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function VersionOne({ heading, subtext, mapsLink }: { heading?: string; subtext?: string; mapsLink?: string }) {
  const defaultMap = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231016.5332074312!2d55.06869738096053!3d25.07628044810629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2sae!4v1715000000000!5m2!1sen!2sae";

  // Strict logic: If it's an iframe code, grab the src. If it's a raw link with "embed", use it. Otherwise, use default.
  let mapUrl = defaultMap;
  if (mapsLink?.includes('<iframe')) {
    mapUrl = mapsLink.match(/src="([^"]+)"/)?.[1] || defaultMap;
  } else if (mapsLink?.includes('embed')) {
    mapUrl = mapsLink;
  }

  return (
    // Changed background to crisp Porcelain White (#F8F8F3) for maximum contrast
    <section className="py-24 md:py-32 bg-[#F8F8F3] font-jost text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#A6A79f]/40 rounded-full text-[#A6A79f] text-sm font-medium mb-4 shadow-sm">
            Prime Connectivity
          </div>
          <h2 className="text-4xl md:text-5xl font-cormorant font-medium mb-6">
            {heading || "Intelligent Location"}
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#A6A79f] to-transparent mb-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left: Map Container */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-[#D8D6D0] rounded-3xl overflow-hidden h-125 shadow-lg p-2">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '20px', filter: 'grayscale(0.3) contrast(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Compass / Location Pill */}
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg border border-[#D8D6D0] shadow-sm flex items-center gap-2">
              <MapPin size={14} className="text-[#A6A79f]" />
              <span className="text-xs font-medium text-[#1A1A1A]/80 uppercase tracking-widest">Dubai</span>
            </div>
          </motion.div>

          {/* Right: Connectivity Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl font-cormorant font-medium mb-8">Strategic Connectivity</h3>

            <div className="space-y-4">
              {[
                { name: "Global Landmarks", desc: "Iconic destinations & business districts", time: "5 min" },
                { name: "Luxury Retail", desc: "Premium shopping & dining", time: "7 min" },
                { name: "International Airport", desc: "Global travel access", time: "15 min" },
                { name: "Wellness Centers", desc: "Premium healthcare & spas", time: "10 min" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-[#D8D6D0] flex justify-between items-center hover:border-[#A6A79f] transition-all shadow-sm hover:shadow-md">
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{item.name}</p>
                    <p className="text-sm text-[#1A1A1A]/60 font-light mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-[#A6A79f] font-medium bg-[#A6A79f]/10 px-3 py-1 rounded-full text-sm">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}