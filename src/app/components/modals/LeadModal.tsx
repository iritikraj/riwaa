"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function LeadModal({ isOpen, onClose, siteId, siteTitle }: { isOpen: boolean; onClose: () => void; siteId: number; siteTitle: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);

    await fetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        websiteId: siteId,
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: `Inquiry for ${siteTitle}`,
      }),
    });
    setStatus("success");
    setTimeout(() => { onClose(); setStatus("idle"); }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-sm" />

          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-[#F8F8F3] rounded-[32px] overflow-hidden shadow-2xl p-8 md:p-12">
            <button onClick={onClose} className="absolute top-6 right-6 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"><X size={24} /></button>

            {status === "success" ? (
              <div className="py-12 text-center">
                <CheckCircle2 size={64} className="mx-auto text-[#A6A79f] mb-6" />
                <h2 className="text-3xl font-cormorant text-[#1A1A1A] mb-2">Thank You</h2>
                <p className="text-[#1A1A1A]/60 font-light">Our concierge will contact you shortly.</p>
              </div>
            ) : (
              <>
                <span className="text-[#B9A089] tracking-[0.3em] text-[10px] uppercase mb-4 block">Reservation</span>
                <h2 className="text-3xl md:text-4xl font-cormorant text-[#1A1A1A] mb-8 leading-tight">Inquire About {siteTitle}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="name" type="text" placeholder="Full Name" required className="w-full bg-white border border-[#D8D6D0] rounded-xl px-5 py-4 text-sm outline-none focus:border-[#A6A79f] transition-all" />
                  <input name="email" type="email" placeholder="Email Address" required className="w-full bg-white border border-[#D8D6D0] rounded-xl px-5 py-4 text-sm outline-none focus:border-[#A6A79f] transition-all" />
                  <input name="phone" type="tel" placeholder="Phone Number" className="w-full bg-white border border-[#D8D6D0] rounded-xl px-5 py-4 text-sm outline-none focus:border-[#A6A79f] transition-all" />
                  <button disabled={status === "submitting"} className="w-full bg-[#1A1A1A] text-[#F8F8F3] py-5 rounded-full text-sm font-medium flex items-center justify-center gap-3 hover:bg-[#2D2D2D] transition-all mt-4">
                    {status === "submitting" ? "Registering..." : "Submit Interest"}
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}