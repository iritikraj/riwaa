import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#14181F]/10 bg-[#FCFBF8]">
      <div className="mx-auto max-w-7xl px-6 md:px-0 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-8">

          {/* Brand & SEO Description (Left Column) */}
          <div className="flex flex-col md:col-span-5 lg:col-span-6">
            <Link href={"/"} className="flex items-center gap-3">
              {/* RIWAA Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#14181F]/10 bg-white">
                <Image
                  src="/riwa-logo-transparent.png"
                  alt="RIWAA"
                  width={30}
                  height={30}
                />
              </div>

              {/* RIWAA Text */}
              <div className="leading-none">
                <p className="text-[15px] font-medium tracking-[0.22em] text-[#14181F]">
                  RIWAA
                </p>
                <p className="mt-1 font-jost text-[9px] uppercase tracking-[0.22em] text-[#565C6B]">
                  powered by
                </p>
              </div>

              {/* Divider */}
              <div className="mx-2 h-8 w-px bg-[#14181F]/15" />

              {/* Solvetude Logo */}
              <Image
                src="/solvetude-logo.png"
                alt="Solvetude"
                width={100}
                height={30}
                className="object-contain"
              />
            </Link>

            {/* SEO-Rich Paragraph */}
            <p className="mt-6 max-w-md font-jost text-sm leading-relaxed text-[#565C6B]">
              The enterprise AI workspace built natively for real estate brokerages. Deploy autonomous agents to automate property marketing, scale technical SEO, manage social intelligence, and execute data-driven media buying without adding headcount.
            </p>
          </div>

          {/* Platform Links */}
          <nav className="md:col-span-4 lg:col-span-3">
            <h4 className="mb-5 font-jost text-[10px] font-bold uppercase tracking-[0.25em] text-[#9C7A3C]">
              AI Agents Workspace
            </h4>
            <ul className="space-y-3 font-jost text-[13px] text-[#565C6B]">
              <li>
                <Link href="/real-estate/advisors/create" className="transition-colors hover:text-[#14181F]">
                  Advisor Portfolio Studio
                </Link>
              </li>
              <li>
                <Link href="/social-media-agent" className="transition-colors hover:text-[#14181F]">
                  Social Intelligence Agent
                </Link>
              </li>
              <li>
                <Link href="/real-estate/web-studio/create" className="transition-colors hover:text-[#14181F]">
                  Developer Website Studio
                </Link>
              </li>
              <li>
                <Link href="/seo-agent/audit" className="transition-colors hover:text-[#14181F]">
                  Technical SEO Agent
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#14181F]">
                  Meta Ads Optimizer
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company & Legal Links */}
          <nav className="md:col-span-2 lg:col-span-3">
            <h4 className="mb-5 font-jost text-[10px] font-bold uppercase tracking-[0.25em] text-[#9C7A3C]">
              Company
            </h4>
            <ul className="space-y-3 font-jost text-[13px] text-[#565C6B]">
              <li>
                <Link href="/contact" className="transition-colors hover:text-[#14181F]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition-colors hover:text-[#14181F]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="transition-colors hover:text-[#14181F]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-16 flex flex-col items-center justify-center border-t border-[#14181F]/10 pt-8 sm:flex-row">
          <p className="font-jost text-[10px] uppercase tracking-[0.2em] text-[#565C6B]/80">
            &copy; {new Date().getFullYear()} Riwaa powered by Solvetude. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}