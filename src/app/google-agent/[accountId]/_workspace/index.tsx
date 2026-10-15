/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, History, BarChart3, ChevronDown, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkspaceHeaderClient({
  accounts,
  activeAccountId
}: {
  accounts: any[];
  activeAccountId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Safely extract the active account name based on Strapi's JSON structure
  const getActiveAccountName = () => {
    const acc = accounts.find((a: any) =>
      (a.attributes?.customerId === activeAccountId) || (a.customerId === activeAccountId)
    );
    return acc?.attributes?.accountName || acc?.accountName || 'Select Account';
  };

  const navItems = [
    { name: 'Dashboard', href: `/google-agent/${activeAccountId}`, icon: LayoutDashboard },
    { name: 'Campaign Setup', href: `/google-agent/${activeAccountId}/setup`, icon: PlusCircle },
    { name: 'Blueprints', href: `/google-agent/${activeAccountId}/blueprints`, icon: FileText },
    { name: 'History', href: `/google-agent/${activeAccountId}/history`, icon: History },
    { name: 'Reports', href: `/google-agent/${activeAccountId}/reports`, icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full relative">

      {/* 2. Main Navigation Pill (Center Aligned) */}
      <nav className="flex items-center gap-1.5 bg-white border border-[#14181F]/10 rounded-full p-1.5">
        {navItems.map((item) => {
          // Dashboard gets an exact match; subpages use startsWith to keep active state on dynamic IDs
          const isActive = item.name === 'Dashboard'
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all ${isActive
                ? 'bg-[#14181F] text-[#FCFBF8] shadow-sm'
                : 'text-[#14181F]/70 hover:bg-[#14181F]/5'
                }`}
            >
              <Icon size={16} className={isActive ? 'text-[#9C7A3C]' : 'opacity-70'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Account Switcher Dropdown (Right Aligned) */}
      <div className="flex-1 flex justify-end">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white border border-[#14181F]/10 hover:border-[#14181F]/20 hover:bg-gray-50 rounded-full px-4 py-2.5 transition-all shadow-sm cursor-pointer"
          >
            {/* Google-specific Search Icon inside the pill */}
            <div className="h-6 w-6 rounded-full bg-[#9C7A3C]/10 flex items-center justify-center text-[#9C7A3C]">
              <Search size={12} strokeWidth={2.5} />
            </div>

            <span className="text-[13px] font-semibold text-[#14181F] max-w-30 truncate">
              {getActiveAccountName()}
            </span>

            <ChevronDown size={14} className={`text-[#14181F]/50 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Animated Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#14181F]/10 overflow-hidden z-50"
              >
                <div className="p-3 border-b border-[#14181F]/5 bg-[#FCFBF8]">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/50">
                    Switch Ads Account
                  </span>
                </div>

                <div className="max-h-75 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#14181F]/10 scrollbar-track-transparent">
                  {accounts.length === 0 ? (
                    <div className="p-4 text-center text-[12px] text-[#14181F]/50">
                      No active accounts found
                    </div>
                  ) : (
                    accounts.map((acc: any) => {
                      const id = acc.attributes?.customerId || acc.customerId;
                      const name = acc.attributes?.accountName || acc.accountName;
                      const isSelected = id === activeAccountId;

                      return (
                        <button
                          key={id}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            router.push(`/google-agent/${id}`);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${isSelected ? 'bg-[#9C7A3C]/10' : 'hover:bg-[#14181F]/5'
                            }`}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#9C7A3C] text-white' : 'bg-[#FCFBF8] text-[#14181F]/40 border border-[#14181F]/10'}`}>
                            <Search size={14} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-[13px] font-semibold truncate ${isSelected ? 'text-[#9C7A3C]' : 'text-[#14181F]'}`}>
                              {name}
                            </span>
                            <span className="text-[11px] text-[#14181F]/40 font-mono truncate">
                              ID: {id}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}