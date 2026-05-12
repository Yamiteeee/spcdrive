'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useMockAuth } from '@/hooks/useMockAuth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  // 1. Add state to capture inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loading, error } = useMockAuth();

  const handleAuth = async () => {
    // 2. Pass the password state to the login function
    // We'll assume 'admin' for your email and 'user' for others
    const role = email === 'jason@spc.drive' ? 'admin' : 'user';
    await login(role, password);
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="font-bold tracking-tighter text-2xl text-zinc-900">SPC DRIVE</span>
          </Link>
        </div>

        <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
              {isLogin ? 'System Login' : 'Register Node'}
            </h1>
            {/* 3. Show the error message if login fails */}
            {error && (
              <p className="text-red-500 text-xs font-bold mt-2 uppercase animate-pulse">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jason@spc.drive"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <button 
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98] mt-4 disabled:opacity-70"
            >
              {loading ? 'Processing...' : (isLogin ? 'Initialize Session' : 'Create Account')}
            </button>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-zinc-500 hover:text-emerald-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have access? Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-zinc-400 mt-8 uppercase tracking-[0.2em] font-bold">
          Encrypted SPC Protocol v1.0
        </p>
      </div>
    </main>
  );
}