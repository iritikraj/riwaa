'use client';

import { Printer } from 'lucide-react';


export default function PrintButton({ title }: { title: string }) {

  const printWithCustomName = () => {
    const originalTitle = document.title;

    const { pathname, hostname } = new URL(title);

    // neighborhoods/muroor-abu-dhabi -> neighborhoods-muroor-abu-dhabi
    const slug = pathname
      .replace(/^\/|\/$/g, "")
      .replace(/\//g, "-");

    const siteName = hostname.replace(/^www\./, "").split(".")[0];

    document.title = `Riwaa-Seo-Brief-Compliance-Report-${siteName}-${slug}`;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  return (
    <button
      onClick={printWithCustomName}
      className="print:hidden px-4 py-2 cursor-pointer text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 transition flex items-center gap-2"
    >
      <Printer className="w-3.5 h-3.5" />
    </button>
  );
}