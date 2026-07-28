import Image from "next/image"
import Link from "next/link"
import BookWalkthroughButton from "../_lead-button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#14181F]/8 bg-[#FCFBF8]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-350 items-center justify-center lg:justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
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

        <div className="hidden items-center gap-9 lg:flex">
          {["Advisor Studio", "Social Intelligence", "Website Studio", "SEO Agent"].map(
            (item) => (
              <span
                key={item}
                className="font-jost text-[11px] uppercase tracking-[0.18em] text-[#565C6B] transition-colors hover:text-[#14181F]"
              >
                {item}
              </span>
            )
          )}
        </div>

        <BookWalkthroughButton />
      </nav>
    </header>
  )
}

export default Navbar;