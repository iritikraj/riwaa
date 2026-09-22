"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image"
import Link from "next/link"
import { User, LogOut, Loader2 } from 'lucide-react';
import BookWalkthroughButton from "../_lead-button";

const Navbar = ({ hideLoginButton }: { hideLoginButton?: boolean }) => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const waNumber = "971581980131";
  const waMessage = encodeURIComponent("Hi, I would like to know more about RIWAA.");

  // Fetch user session on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.reload();
  };

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

          <div className="leading-none hidden md:block">
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
        {/* <div className="hidden items-center gap-9 lg:flex">
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
        </div> */}

        {/* Right Side: Actions */}
        <div className="flex items-center gap-5">
          {/* WhatsApp Action */}
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-[#25ad57] hover:scale-110 transition-transform"
            aria-label="Chat on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
            </svg>
          </a>

          <BookWalkthroughButton />

          <div className={`h-6 w-px bg-neutral-200 ${hideLoginButton ? "hidden" : ""}`} />

          {/* Authentication Section */}
          <div className={`relative font-jost ${hideLoginButton ? "hidden" : ""}`} ref={popupRef}>
            {isLoading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-neutral-400" />
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14181F] text-white hover:bg-black transition-colors shadow-sm hover:cursor-pointer"
                >
                  <User size={16} className="text-[#b8924a]" />
                </button>

                {/* Profile Popup */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-neutral-100 bg-white p-2 shadow-xl shadow-black/10">
                    <div className="px-3 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900 truncate">Username: {user.username}</p>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">Email: {user.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="cursor-pointer flex w-full text-center justify-center items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-[11px] font-bold uppercase tracking-widest text-[#14181F] hover:text-[#b8924a] transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar;