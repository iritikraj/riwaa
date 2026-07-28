"use client";

import { useState } from "react";
import LeadModal from "../_lead";

const BookWalkthroughButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:inline rounded-full text-center bg-[#1B2A4A] px-5 py-2.5 font-jost text-[11px] uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
      >
        Book a walkthrough
      </button>

      <LeadModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default BookWalkthroughButton;
