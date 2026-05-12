'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface AuthCardProps {
  isLogin: boolean;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  error: string | null;
  switching: boolean;
  onAuth: () => void;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function AuthCard({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  switching,
  onAuth,
  onToggle,
  onKeyDown
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      {/* LOGO */}
      <div className="flex justify-center mb-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-white/20 border border-white/20 shadow-lg overflow-hidden">
            <Image
              src="/assets/SPCLOGO.avif"
              alt="SPC Logo"
              fill
              className="object-contain p-2"
            />
          </div>
          <span className="font-black text-xl tracking-tight text-white drop-shadow">
            SPC <span className="text-emerald-300">Drive</span>
          </span>
        </Link>
      </div>

      {/* CARD */}
      <div
        className={`
          bg-white/15 backdrop-blur-xl border border-white/20
          rounded-[2.5rem] p-10 shadow-2xl transition-all duration-200 ease-out
          ${switching ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'}
        `}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {isLogin ? 'Welcome back' : 'Join SPC Drive'}
          </h1>
          <p className="text-sm text-white/70 mt-2">
            {isLogin ? 'Sign in to continue to your workspace' : 'Create your secure file workspace'}
          </p>
          {error && <p className="text-red-300 text-xs font-semibold mt-3">{error}</p>}
        </div>

        <div className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-xs font-semibold text-white/70 uppercase">Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="you@spc.drive"
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/30 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 transition"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs font-semibold text-white/70 uppercase">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/30 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 transition"
              />
            </div>
          </div>

          <button
            onClick={onAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onToggle}
            className="text-sm font-semibold text-white/60 hover:text-emerald-300 transition"
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-white/40 mt-8 tracking-[0.2em] font-semibold">
        SECURE FILE ACCESS PLATFORM
      </p>
    </div>
  );
}