'use client';

import { Printer } from 'lucide-react';

export default function PrintButton({ title }: { title: string }) {
  const printWithCustomName = () => {
    const originalTitle = document.title;

    // Convert "Content Brief - Al Raha Beach, Abu Dhabi" into a clean filename:
    // "riwaa-content-brief-al-raha-beach-abu-dhabi"
    const safeSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with hyphens
      .replace(/^-+|-+$/g, '');    // Remove leading or trailing hyphens

    // Set the document title temporarily so the browser's "Save as PDF" uses it as the default filename
    document.title = `riwaa-${safeSlug}`;

    window.print();

    // Restore the original page title after the print dialog opens
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  return (
    <button
      onClick={printWithCustomName}
      className="print:hidden px-4 py-2 cursor-pointer text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition flex items-center gap-2"
    >
      <Printer className="w-3.5 h-3.5" />
    </button>
  );
}