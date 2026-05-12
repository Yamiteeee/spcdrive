'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMockAuth } from '@/hooks/useMockAuth';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [switching, setSwitching] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { login, loading, error } = useMockAuth();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleAuth = async () => {
    const role = email === 'jason@test' ? 'admin' : 'user';
    await login(role, password);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleAuth();
  };

  const toggleMode = () => {
    setSwitching(true);
    setTimeout(() => {
      setIsLogin((p) => !p);
      setSwitching(false);
    }, 180);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 font-sans overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/green.png"
          alt="Background"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* CONTAINER (entrance animation) */}
      <div
        className={`
          w-full max-w-md transition-all duration-700 ease-out
          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        `}
      >

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

        {/* CARD (switch animation) */}
        <div
          className={`
            bg-white/15 backdrop-blur-xl border border-white/20
            rounded-[2.5rem] p-10 shadow-2xl
            transition-all duration-200 ease-out
            ${switching ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'}
          `}
        >

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {isLogin ? 'Welcome back' : 'Join SPC Drive'}
            </h1>

            <p className="text-sm text-white/70 mt-2">
              {isLogin
                ? 'Sign in to continue to your workspace'
                : 'Create your secure file workspace'}
            </p>

            {error && (
              <p className="text-red-300 text-xs font-semibold mt-3">
                {error}
              </p>
            )}
          </div>

          {/* FORM */}
          <div className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-xs font-semibold text-white/70 uppercase">
                Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="you@spc.drive"
                  className="
                    w-full pl-11 pr-4 py-4 rounded-2xl
                    border border-white/30
                    bg-white text-slate-900
                    placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-emerald-300/50
                    transition
                  "
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-semibold text-white/70 uppercase">
                Password
              </label>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="
                    w-full pl-11 pr-4 py-4 rounded-2xl
                    border border-white/30
                    bg-white text-slate-900
                    placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-emerald-300/50
                    transition
                  "
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>

          {/* SWITCH */}
          <div className="mt-8 text-center">
            <button
              onClick={toggleMode}
              className="text-sm font-semibold text-white/60 hover:text-emerald-300 transition"
            >
              {isLogin
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        {/* FOOT NOTE */}
        <p className="text-center text-[10px] text-white/40 mt-8 tracking-[0.2em] font-semibold">
          SECURE FILE ACCESS PLATFORM
        </p>

      </div>
    </main>
  );
}