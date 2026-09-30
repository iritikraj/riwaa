/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, BarChart3, History, FileText, ChevronDown, Building2, Check } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function WorkspaceHeaderClient({ accounts, activeAccountId }: any) {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const activeAccount = accounts.find((a: any) => a.id === activeAccountId);

  // 2. Added History back into the array and fixed the icons
  const navTabs = [
    { name: 'Dashboard', href: `/meta-agent/${activeAccountId}`, icon: LayoutDashboard },
    { name: 'Campaign Setup', href: `/meta-agent/${activeAccountId}/setup`, icon: PlusCircle },
    { name: 'History', href: `/meta-agent/${activeAccountId}/history`, icon: History },
    { name: 'Reports', href: `/meta-agent/${activeAccountId}/reports`, icon: BarChart3 },
    { name: 'Audit Log', href: `/meta-agent/${activeAccountId}/audit`, icon: FileText },
  ];

  const handleAccountSwitch = (newAccountId: string) => {
    setIsAccountDropdownOpen(false);

    // Smart Swap: If user is on /meta-agent/123/setup and clicks 456, move them to /meta-agent/456/setup
    const currentSubpath = pathname.replace(`/meta-agent/${activeAccountId}`, '');
    router.push(`/meta-agent/${newAccountId}${currentSubpath}`);
  };

  return (
    <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Module Navigation Tabs */}
      <div className="hidden md:flex overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#14181F]/10 rounded-full shadow-sm">
          {navTabs.map((tab) => {
            const isDashboardRoot = tab.href === `/meta-agent/${activeAccountId}`;
            const isActive = isDashboardRoot
              ? pathname === tab.href
              : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all ${isActive ? 'bg-[#14181F] text-[#FCFBF8] shadow-md' : 'text-[#565C6B] hover:bg-[#14181F]/5'}`}
              >
                <tab.icon size={16} className={isActive ? 'text-[#9C7A3C]' : 'opacity-70'} />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Account Switcher Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
          className="flex items-center gap-3 px-5 py-3 bg-white border border-[#14181F]/10 hover:border-[#14181F]/30 rounded-full shadow-sm transition-all"
        >
          <div className="h-6 w-6 rounded-full bg-[#14181F]/5 flex items-center justify-center">
            <Building2 size={12} className="text-[#9C7A3C]" />
          </div>
          <span className="text-[14px] font-medium text-[#14181F]">
            {activeAccount?.name || 'Select Account'}
          </span>
          {accounts.length > 1 && <ChevronDown size={14} className="text-[#565C6B]" />}
        </button>

        <AnimatePresence>
          {isAccountDropdownOpen && accounts.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#14181F]/10 rounded-2xl shadow-xl overflow-hidden z-50"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-[11px] font-medium text-[#565C6B] uppercase tracking-wider">Switch Client Account</div>
                {accounts.map((acc: any) => (
                  <button
                    key={acc.id}
                    onClick={() => handleAccountSwitch(acc.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] text-left hover:bg-[#14181F]/5 transition-colors"
                  >
                    {acc.name}
                    {acc.id === activeAccountId && <Check size={14} className="text-[#9C7A3C]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}