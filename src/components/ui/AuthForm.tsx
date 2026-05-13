'use client';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

interface AuthFormProps {
  title: string;
  subtitle: string;
  error?: string | null;
  loading: boolean;
  submitLabel: string;
  onAuth: () => void;
  // Controlled Inputs
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  footerAction?: React.ReactNode;
}

export function AuthForm({
  title, subtitle, error, loading, submitLabel, 
  onAuth, email, setEmail, password, setPassword, 
  onKeyDown, footerAction 
}: AuthFormProps) {
  return (
    <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl transition-all">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-sm text-white/70 mt-2">{subtitle}</p>
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl py-2 px-4 mt-4">
            <p className="text-red-200 text-xs font-bold">{error}</p>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Identity</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onKeyDown}
              placeholder="name@provider.com" 
              className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/10 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 transition-all font-medium" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Security Key</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKeyDown}
              placeholder="••••••••" 
              className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/10 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 transition-all font-medium" 
            />
          </div>
        </div>

        <button 
          onClick={onAuth} disabled={loading} 
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-black py-4 rounded-2xl hover:bg-emerald-400 shadow-lg transition-all active:scale-[0.97] disabled:opacity-50 mt-4"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>{submitLabel} <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </div>

      {footerAction && <div className="mt-8 text-center">{footerAction}</div>}
    </div>
  );
}