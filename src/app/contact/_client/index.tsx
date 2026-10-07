"use client";

import { useState } from "react";
import { CountryCode } from "@/utils/data/country-code";
import { submitLeadForm } from "@/utils/server-actions/lead-form";
import { ChevronDown } from "lucide-react";

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+971",
    phone: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const result = await submitLeadForm(form);

      if (!result.success) {
        throw new Error(result.message || "Something went wrong");
      }

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        countryCode: "+971",
        phone: "",
        note: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-12 text-center rounded-3xl border border-[#14181F]/10 bg-white shadow-sm p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] text-2xl">
          ✓
        </div>
        <h3 className="mt-6 text-2xl font-medium text-gray-900 font-cormorant">
          Thank you for reaching out
        </h3>
        <p className="mt-3 text-base leading-6 text-[#565C6B]">
          Our team has received your request and will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4 text-[#565C6B]" onSubmit={handleSubmit}>
      <input
        required
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Full Name"
        className="w-full rounded-lg border border-[#14181F]/10 bg-transparent px-4 py-3.5 text-sm outline-none focus:border-[#1B2A4A] transition-colors"
      />

      <input
        required
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email Address"
        className="w-full rounded-lg border border-[#14181F]/10 bg-transparent px-4 py-3.5 text-sm outline-none focus:border-[#1B2A4A] transition-colors"
      />

      <div className="flex gap-3">
        <div className="relative w-40">
          <select
            required
            value={form.countryCode}
            onChange={(e) =>
              setForm({ ...form, countryCode: e.target.value })
            }
            className="w-full appearance-none rounded-lg border border-[#14181F]/10 bg-transparent px-3 py-3.5 pr-10 text-sm outline-none transition-colors focus:border-[#1B2A4A]"
          >
            {CountryCode.map((country) => (
              <option key={country.code} value={country.dial_code}>
                {country.name} ({country.dial_code})
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#14181F]/50"
          />
        </div>

        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone Number"
          className="flex-1 rounded-lg border border-[#14181F]/10 bg-transparent px-4 py-3.5 text-sm outline-none focus:border-[#1B2A4A] transition-colors"
        />
      </div>

      <textarea
        rows={5}
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
        placeholder="Please share the details of your inquiry (Optional)"
        className="w-full rounded-lg border border-[#14181F]/10 bg-transparent px-4 py-3.5 text-sm outline-none focus:border-[#1B2A4A] transition-colors resize-none"
      />

      <div className="pt-2">
        <button
          disabled={loading}
          type="submit"
          className={`${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-[#2A3B5C]"} w-full rounded-lg bg-[#1B2A4A] py-4 text-[13px] font-medium uppercase tracking-[0.18em] text-white transition-colors`}
        >
          {loading ? "Submitting..." : "Submit request"}
        </button>
      </div>
    </form>
  );
}