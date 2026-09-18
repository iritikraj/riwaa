import Image from "next/image"
import Link from "next/link"
import BookWalkthroughButton from "../_lead-button";

const Navbar = () => {
  // Add your WhatsApp number and message here
  const waNumber = "971581980131";
  const waMessage = encodeURIComponent("Hi, I would like to know more about RIWAA.");

  return (
    <header className="sticky top-0 z-40 border-b border-[#14181F]/8 bg-[#FCFBF8]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-350 items-center justify-between px-6 py-4 lg:px-10">

        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#14181F]/10 bg-white">
            <Image
              src="/riwa-logo-transparent.png"
              alt="RIWAA"
              width={30}
              height={30}
            />
          </div>

          <div className="leading-none">
            <p className="text-[15px] font-medium tracking-[0.22em] text-[#14181F]">
              RIWAA
            </p>
            <p className="mt-1 font-jost text-[9px] uppercase tracking-[0.22em] text-[#565C6B]">
              powered by
            </p>
          </div>

          <div className="mx-2 h-8 w-px bg-[#14181F]/15" />

          <Image
            src="/solvetude-logo.png"
            alt="Solvetude"
            width={100}
            height={30}
            className="object-contain"
          />
        </Link>

        {/* Center: Links */}
        <div className="hidden items-center gap-9 lg:flex">
          {["Advisor Studio", "Social Intelligence", "Website Studio", "SEO Agent"].map(
            (item) => (
              <span
                key={item}
                className="font-jost text-[11px] uppercase tracking-[0.18em] text-[#565C6B] transition-colors hover:text-[#14181F] cursor-pointer"
              >
                {item}
              </span>
            )
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-5">
          {/* WhatsApp Action */}
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-[#25ad57]"
            aria-label="Chat on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
            </svg>
          </a>

          <BookWalkthroughButton />
        </div>
      </nav>
    </header>
  )
}

export default Navbar;