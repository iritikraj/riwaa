"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CountryCode } from "@/config/data/country-code";
import { motion } from "framer-motion";

const LeadModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, onClose]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+971",
    phone: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/lead-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (data.success) {
        setSuccess(true);

        setForm({
          name: "",
          email: "",
          countryCode: "+971",
          phone: "",
          note: "",
        });
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed font-jost text-black inset-0 z-999 flex min-h-screen items-center justify-center overflow-y-auto bg-[#14181F]/40 px-4 py-8 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-[#14181F]/10 bg-[#FCFBF8] p-8 shadow-2xl">
          {
            !success && (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-jost text-[10px] uppercase tracking-[0.25em] text-[#9C7A3C]">
                    Get started
                  </p>
                  <h2 className="mt-3 text-2xl font-medium">
                    Book a walkthrough
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setSuccess(false);
                    onClose();
                  }}
                  className="cursor-pointer text-[#565C6B] hover:text-[#14181F]"
                >
                  ✕
                </button>
              </div>
            )
          }

          {success ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A]">
                ✓
              </div>

              <h3 className="mt-5 text-xl font-medium">
                Thank you for reaching out.
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#565C6B]">
                Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Full name"
                className="w-full rounded-xl border border-[#14181F]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#1B2A4A]"
              />

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="Email address"
                className="w-full rounded-xl border border-[#14181F]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#1B2A4A]"
              />


              <div className="flex gap-2">
                <select
                  required
                  value={form.countryCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      countryCode: e.target.value,
                    })
                  }
                  className="w-40 rounded-xl border border-[#14181F]/10 bg-white px-3 text-sm outline-none"
                >
                  {CountryCode.map((country) => (
                    <option key={country.code} value={country.dial_code}>
                      {country.name} ({country.dial_code})
                    </option>
                  ))}
                </select>

                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Phone number"
                  className="flex-1 rounded-xl border border-[#14181F]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#1B2A4A]"
                />
              </div>

              <textarea
                value={form.note}
                onChange={(e) =>
                  setForm({
                    ...form,
                    note: e.target.value,
                  })
                }
                placeholder={`What would you like "RIWAA" to help your team achieve?`}
                className="w-full rounded-xl border border-[#14181F]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#1B2A4A]"
              />


              <button
                disabled={loading}
                type="submit"
                className="mt-3 w-full rounded-full bg-[#1B2A4A] py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit request"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default LeadModal;
