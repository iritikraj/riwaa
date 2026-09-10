"use client";

import React, { useState } from 'react';
import { Send, ShieldCheck, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
}

interface LeadCaptureFormProps {
  developerName: string;
  agentName: string;
  projects: Project[];
}

export function LeadCaptureForm({ developerName, agentName, projects }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <section className="w-full bg-white py-24 border-t border-neutral-100 font-jost">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy & Trust Signals */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#b8924a] mb-4 block">
              Register Your Interest
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 leading-[1.15] mb-6">
              Secure your <br />
              <span className="font-medium text-[#b8924a]">investment today.</span>
            </h2>
            <p className="text-neutral-500 leading-relaxed max-w-md mb-10">
              Connect directly with {agentName}, your dedicated {developerName} specialist, to receive exclusive floor plans, VIP pricing, and availability.
            </p>

            <div className="flex items-center gap-4 text-sm text-neutral-600 font-medium">
              <ShieldCheck className="text-[#b8924a]" size={20} />
              <span>Your information is strictly confidential.</span>
            </div>
          </div>

          {/* Right: The Form */}
          <div className="bg-[#fcfcfb] p-8 md:p-10 rounded-3xl border border-neutral-200/60 shadow-xl shadow-black/2">
            {isSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="text-emerald-500" size={32} />
                </div>
                <h3 className="text-2xl font-medium text-neutral-900 mb-2">Request Received</h3>
                <p className="text-neutral-500 text-sm">
                  {agentName} will be in touch with you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-[10px] uppercase tracking-widest text-[#b8924a] font-semibold hover:text-neutral-900 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3.5 text-sm text-neutral-900 outline-none focus:border-[#b8924a] transition-colors "
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+971 50 000 0000"
                      className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3.5 text-sm text-neutral-900 outline-none focus:border-[#b8924a] transition-colors "
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3.5 text-sm text-neutral-900 outline-none focus:border-[#b8924a] transition-colors "
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Project of Interest</label>
                  <select className="w-full appearance-none bg-white border border-neutral-200 rounded-sm px-4 py-3.5 text-sm text-neutral-900 outline-none focus:border-[#b8924a] transition-colors">
                    <option value="General Inquiry">General Inquiry</option>
                    {projects?.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-sm py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-neutral-900/20 group"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      Request Details
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}