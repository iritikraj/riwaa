"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, Phone, Send, CheckCircle2 } from "lucide-react";

export function AgentContact({ agentId, agentName, whatsapp }: { agentId?: number; agentName: string; whatsapp?: string }) {
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionStatus("sending");
    const formFields = new FormData(e.currentTarget);

    await fetch("/api/agents/leads", { // Make sure this points to the agent leads API
      method: "POST",
      body: JSON.stringify({
        websiteId: agentId || null,
        name: `${formFields.get("firstName")} ${formFields.get("lastName")}`,
        email: formFields.get("email"),
        phone: formFields.get("phone"),
        message: `VIP Inquiry via Portfolio: ${formFields.get("interest")} | Budget: ${formFields.get("budget")} | Notes: ${formFields.get("notes") || "None"}`,
      }),
    });

    setSubmissionStatus("success");
    e.currentTarget.reset();
  };

  // NEW: WhatsApp click handler
  const handleWhatsAppClick = () => {
    if (whatsapp) {
      // Strip everything except numbers (e.g., +971 50 123 4567 -> 971501234567)
      const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    } else {
      alert("Direct WhatsApp line is currently unavailable.");
    }
  };

  return (
    <section className="bg-[#1a1a1a] relative overflow-hidden py-28 text-white font-jost">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(184,146,74,0.1)_0%,transparent_60%),radial-gradient(ellipse_at_70%_50%,rgba(184,146,74,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        <div className="text-center mb-16">
          <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/40 mb-4">Begin the Conversation</div>
          <h2 className="font-cormorant font-light text-4xl md:text-6xl leading-tight text-white mb-5">
            Work with <br />
            <em className="text-transparent bg-clip-text bg-gradient-to-br from-[#b8924a] to-[#d4af71] not-italic">
              {agentName}
            </em>
          </h2>
          <p className="text-sm font-light text-white/50 max-w-md mx-auto tracking-wide leading-relaxed">
            Access to exclusive placement opportunities operates entirely via private mandate. All interactions are protected under institutional NDA constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          <div className="space-y-6">
            <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/40 mb-4">Direct Connectivity</div>

            <button className="w-full text-left py-4 px-6 bg-gradient-to-r from-[#b8924a] via-[#d4af71] to-[#b8924a] bg-[length:200%_100%] hover:bg-[100%_0] text-white text-[11px] font-semibold tracking-widest uppercase transition-all duration-500 flex items-center gap-3 shadow-lg">
              <Calendar size={16} />
              <span>Book a Private Consultation</span>
            </button>

            {/* NEW: Wired up the WhatsApp button */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full text-left py-4 px-6 border cursor-pointer border-white/20 text-white text-[11px] font-semibold tracking-widest uppercase hover:border-[#d4af71] hover:bg-[#b8924a]/10 transition-all duration-300 flex items-center gap-3"
            >
              <MessageSquare size={16} className="text-[#25d366]" />
              <span>WhatsApp Direct Line</span>
            </button>

            <a href={`tel:${whatsapp}`}>
              <button className="w-full text-left py-4 cursor-pointer px-6 border border-white/20 text-white text-[11px] font-semibold tracking-widest uppercase hover:border-[#d4af71] hover:bg-[#b8924a]/10 transition-all duration-300 flex items-center gap-3">
                <Phone size={16} />
                <span>Secure Voice Channel</span>
              </button>
            </a>

            <div className="border border-white/10 bg-white/[0.02] p-6 mt-8">
              <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/40 mb-3">Headquarters Location</div>
              <p className="text-xs font-light text-white/60 leading-relaxed">
                Gate Avenue, Executive Tower B<br />
                Suite 28, DIFC District, Dubai, UAE
              </p>
              <div className="text-[9px] font-semibold tracking-wider text-white/30 uppercase mt-4">Corporate Operations: 9AM - 7PM GST</div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-xl relative">
            {submissionStatus === "success" ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center space-y-4">
                <CheckCircle2 size={48} className="text-[#d4af71] mx-auto animate-bounce" />
                <h4 className="font-cormorant text-2xl font-light">Inquiry Dispatched</h4>
                <p className="text-xs font-light text-white/50 max-w-xs mx-auto">Discretion priority acknowledged. An executive associate will initiate secure contact within two hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/40 mb-4">Registration Dossier</div>

                <div className="grid grid-cols-2 gap-3">
                  <input name="firstName" required type="text" placeholder="First Name" className="w-full bg-white/[0.05] border border-white/10 text-white text-xs font-light px-4 py-3.5 outline-none focus:border-[#d4af71] transition-colors rounded-none" />
                  <input name="lastName" required type="text" placeholder="Last Name" className="w-full bg-white/[0.05] border border-white/10 text-white text-xs font-light px-4 py-3.5 outline-none focus:border-[#d4af71] transition-colors rounded-none" />
                </div>

                <input name="email" required type="email" placeholder="Secure Email Address" className="w-full bg-white/[0.05] border border-white/10 text-white text-xs font-light px-4 py-3.5 outline-none focus:border-[#d4af71] transition-colors rounded-none" />
                <input name="phone" required type="tel" placeholder="Phone / Encrypted Channel" className="w-full bg-white/[0.05] border border-white/10 text-white text-xs font-light px-4 py-3.5 outline-none focus:border-[#d4af71] transition-colors rounded-none" />

                <select name="interest" required className="w-full bg-[#2d2d2d] border border-white/10 text-white text-xs font-light px-4 py-3.5 outline-none focus:border-[#d4af71] transition-colors rounded-none appearance-none">
                  <option value="" disabled selected>Asset Domain Interest</option>
                  <option value="villas">Ultra-Luxury Villas (Frond Placement)</option>
                  <option value="penthouses">Sky Penthouses (Downtown / DIFC)</option>
                  <option value="commercial">Commercial/Institutional Portfolios</option>
                  <option value="advisory">Multi-Asset Wealth Management Advisory</option>
                </select>

                <select name="budget" required className="w-full bg-[#2d2d2d] border border-white/10 text-white text-xs font-light px-4 py-3.5 outline-none focus:border-[#d4af71] transition-colors rounded-none appearance-none">
                  <option value="" disabled selected>Allocated Investment Liquidity</option>
                  <option value="tier1">$5M – $15M</option>
                  <option value="tier2">$15M – $50M</option>
                  <option value="tier3">$50M – $100M</option>
                  <option value="tier4">$100M+</option>
                </select>

                <textarea name="notes" rows={3} placeholder="Discretionary parameters or transaction notes (Optional)" className="w-full bg-white/[0.05] border border-white/10 text-white text-xs font-light px-4 py-3.5 outline-none focus:border-[#d4af71] transition-colors resize-none rounded-none" />

                <button disabled={submissionStatus === "sending"} className="w-full cursor-pointer bg-gradient-to-r from-[#b8924a] to-[#d4af71] text-white text-[11px] font-semibold tracking-widest uppercase py-4 mt-2 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                  {submissionStatus === "sending" ? "Processing Clearance..." : "Submit Inquiry"}
                  <Send size={12} />
                </button>

                <p className="text-[10px] text-center text-white/20 tracking-wider mt-4">All inquiries processed under strict corporate non-disclosure parameters.</p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}