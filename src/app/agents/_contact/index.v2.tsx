"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, Phone, Send, CheckCircle2 } from "lucide-react";

export function AgentContactVersionTwo({ agentId, agentName, whatsapp }: { agentId?: number; agentName: string; whatsapp?: string }) {
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionStatus("sending");
    const formFields = new FormData(e.currentTarget);

    await fetch("/api/real-estate-agents/leads", { // Make sure this points to the agent leads API
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
    <section className="relative overflow-hidden bg-[#070b14] py-24 md:py-32 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-16"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Private Client Office
          </div>

          <h2 className="font-sans text-[42px] md:text-[72px] leading-[0.98] tracking-[-0.05em] font-light">
            Work With
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300">
              {agentName}
            </span>
          </h2>

          <p className="mt-8 max-w-2xl mx-auto text-sm leading-7 text-slate-400">
            Access premium advisory, acquisitions and investment opportunities through a direct and confidential channel.
          </p>
        </motion.div>

        {/* Contact Actions */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          <button
            onClick={handleWhatsAppClick}
            className="group border border-white/10 bg-white/[0.03] backdrop-blur-xl py-5 px-5 hover:border-cyan-300/20 hover:bg-white/[0.05] transition-all"
          >
            <MessageSquare
              size={18}
              className="mx-auto mb-3 text-cyan-300"
            />

            <div className="text-[11px] uppercase tracking-[0.25em]">
              WhatsApp
            </div>
          </button>

          <a href={`tel:${whatsapp}`}>
            <div className="group border border-white/10 bg-white/[0.03] backdrop-blur-xl py-5 px-5 hover:border-cyan-300/20 hover:bg-white/[0.05] transition-all">
              <Phone
                size={18}
                className="mx-auto mb-3 text-cyan-300"
              />

              <div className="text-[11px] uppercase tracking-[0.25em] text-center">
                Voice Channel
              </div>
            </div>
          </a>

          <button className="group border border-white/10 bg-white/[0.03] backdrop-blur-xl py-5 px-5 hover:border-cyan-300/20 hover:bg-white/[0.05] transition-all">
            <Calendar
              size={18}
              className="mx-auto mb-3 text-cyan-300"
            />

            <div className="text-[11px] uppercase tracking-[0.25em]">
              Consultation
            </div>
          </button>
        </motion.div>

        {/* Form Container */}

        <div className="rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-12">

          {submissionStatus === "success" ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="py-20 text-center"
            >
              <CheckCircle2
                size={60}
                className="mx-auto mb-6 text-cyan-300"
              />

              <h3 className="text-[36px] font-light mb-4">
                Inquiry Received
              </h3>

              <p className="max-w-md mx-auto text-slate-400 leading-7">
                Your request has been securely registered and will be reviewed by the advisory team.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <div className="text-[10px] uppercase tracking-[0.35em] text-cyan-300 mb-4">
                  Client Registration
                </div>

                <h3 className="text-2xl md:text-3xl font-light">
                  Begin Your Inquiry
                </h3>
              </div>

              <form
                onSubmit={handleInquirySubmit}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">

                  <input
                    name="firstName"
                    required
                    placeholder="First Name"
                    className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-cyan-300 transition-colors placeholder:text-slate-500"
                  />

                  <input
                    name="lastName"
                    required
                    placeholder="Last Name"
                    className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-cyan-300 transition-colors placeholder:text-slate-500"
                  />

                </div>

                <input
                  name="email"
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-cyan-300 transition-colors placeholder:text-slate-500"
                />

                <input
                  name="phone"
                  required
                  placeholder="Phone Number"
                  className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-cyan-300 transition-colors placeholder:text-slate-500"
                />

                <select
                  name="interest"
                  required
                  className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-cyan-300"
                >
                  <option value="">Investment Interest</option>
                  <option value="villas">Luxury Villas</option>
                  <option value="penthouses">Penthouses</option>
                  <option value="commercial">Commercial Assets</option>
                  <option value="advisory">Investment Advisory</option>
                </select>

                <select
                  name="budget"
                  required
                  className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-cyan-300"
                >
                  <option value="">Investment Budget</option>
                  <option value="tier1">$5M – $15M</option>
                  <option value="tier2">$15M – $50M</option>
                  <option value="tier3">$50M – $100M</option>
                  <option value="tier4">$100M+</option>
                </select>

                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Additional Notes"
                  className="w-full bg-transparent border-b border-white/10 py-4 outline-none resize-none focus:border-cyan-300 transition-colors placeholder:text-slate-500"
                />

                <button
                  disabled={submissionStatus === "sending"}
                  className="w-full mt-4 border border-cyan-300/20 bg-cyan-300/10 py-5 uppercase tracking-[0.25em] text-[11px] font-semibold text-cyan-100 hover:bg-cyan-300/15 transition-all flex items-center justify-center gap-3"
                >
                  {submissionStatus === "sending"
                    ? "Submitting..."
                    : "Submit Inquiry"}

                  <Send size={14} />
                </button>

                <p className="text-center text-[10px] tracking-[0.25em] uppercase text-slate-500 pt-4">
                  All communications remain confidential
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}