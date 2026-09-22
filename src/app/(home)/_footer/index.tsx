import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#14181F]/8" >
      <div className="mx-auto flex max-w-350 flex-col gap-8 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="flex items-center gap-3">
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
        </div>

        {/* <div className="flex flex-wrap gap-7 font-jost text-[11px] uppercase tracking-[0.16em] text-[#565C6B]">
          <Link href="/real-estate/advisors/create" className="hover:text-[#14181F]">
            Advisor Studio
          </Link>
          <Link href="/social-media-agent" className="hover:text-[#14181F]">
            Social Intelligence
          </Link>
          <Link href="/real-estate/web-studio/create" className="hover:text-[#14181F]">
            Website Studio
          </Link>
          <Link href="/seo-agent/audit" className="hover:text-[#14181F]">
            SEO Agent
          </Link>
        </div> */}

        <p className="font-jost text-xs uppercase tracking-[0.15em] text-[#565C6B]/70">
          &copy; {new Date().getFullYear()} Riwaa powered by Solvetude
        </p>
      </div>
    </footer >
  )
}