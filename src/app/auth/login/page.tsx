/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/(home)/_nav';
import { Footer } from '@/app/(home)/_footer';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Grab the "next" parameter from the URL, default to "/" (home) if it doesn't exist
  const nextUrl = searchParams.get('next') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      // Refresh to update server components, then push to the exact requested URL
      router.refresh();
      router.push(nextUrl);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-neutral-200 shadow-xl shadow-black/5">
      {/* Branding */}
      <Link href="/" className="flex flex-col items-center mb-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#14181F]/10 bg-white mb-4">
          <Image src="/riwa-logo-transparent.png" alt="RIWAA" width={40} height={40} />
        </div>
        <h1 className="text-xl font-medium tracking-widest text-[#14181F]">RIWAA</h1>
        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mt-2">Workspace Login</p>
      </Link>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs text-center rounded-xl font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Email / Username</label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-50 border text-gray-700 border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 text-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#050505] hover:bg-black text-white rounded-xl py-4 flex items-center justify-center gap-2 font-semibold uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/10 mt-6 disabled:opacity-70"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} className="text-white" />}
          {isLoading ? 'Authenticating...' : 'Secure Access'}
        </button>
      </form>
    </div>
  );
}

// Wrap the component that uses `useSearchParams` in Suspense to prevent Next.js build errors
export default function LoginPage() {
  return (
    <div className='bg-[#FCFBF8] font-jost'>
      <Navbar hideLoginButton={true} />
      <div className="min-h-screen md:min-h-[80vh] flex flex-col items-center justify-center p-6">
        <Suspense fallback={
          <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-neutral-200 flex justify-center items-center h-96">
            <Loader2 size={24} className="animate-spin text-neutral-400" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}