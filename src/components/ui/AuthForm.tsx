'use client';
import React from 'react';
import { Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';

interface AuthFormProps {
  title: string;
  subtitle: string;
  error?: string | null;
  loading: boolean;
  submitLabel: string;
  onAuth: () => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  name: string;                  
  setName: (val: string) => void;  
  onKeyDown?: (e: React.KeyboardEvent) => void;
  footerAction?: React.ReactNode;
}

export function AuthForm({
  title, subtitle, error, loading, submitLabel, 
  onAuth, email, setEmail, password, setPassword, 
  name, setName, onKeyDown, footerAction 
}: AuthFormProps) {
  const { colors, radius } = useSPCTheme();

  // Determine if it is a registration screen based on systemic keywords
  const isRegisterScreen = submitLabel.includes('INITIALIZE') || title.toLowerCase().includes('join');

  return (
    <div 
      className="backdrop-blur-xl border p-10 shadow-2xl transition-all"
      style={{ 
        backgroundColor: `${colors.card}25`, 
        borderColor: `${colors.card}30`,
        borderRadius: radius.large 
      }}
    >
      {/* --- HEADER BLOCK --- */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: colors.textMain }}>
          {title}
        </h1>
        <p className="text-sm mt-2 opacity-70" style={{ color: colors.textMain }}>
          {subtitle}
        </p>
        
        {error && (
          <div 
            className="border rounded-xl py-2 px-4 mt-4 animate-in shake-1"
            style={{ 
              backgroundColor: `${colors.danger}20`, 
              borderColor: `${colors.danger}50` 
            }}
          >
            <p className="text-xs font-bold" style={{ color: colors.textMain }}>
              {error}
            </p>
          </div>
        )}
      </div>

      {/* --- INPUT STACK --- */}
      <div className="space-y-5">
        
        {/* 🌟 1. IDENTITY NAME FIELD (Only visible when creating an account) */}
        {isRegisterScreen && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-50" style={{ color: colors.textMain }}>
              Operations Identity Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.primary }} />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                onKeyDown={onKeyDown}
                placeholder="e.g., Agent Don" 
                required
                className="w-full pl-11 pr-4 py-4 border focus:outline-none transition-all font-medium" 
                style={{ 
                  backgroundColor: colors.card,
                  color: '#09090b', 
                  borderColor: colors.border,
                  borderRadius: radius.base,
                }}
              />
            </div>
          </div>
        )}

        {/* 🔑 2. EMAIL IDENTITY FIELD (Always visible) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-50" style={{ color: colors.textMain }}>
            Identity
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.primary }} />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onKeyDown={onKeyDown}
              placeholder="name@provider.com" 
              className="w-full pl-11 pr-4 py-4 border focus:outline-none transition-all font-medium" 
              style={{ 
                backgroundColor: colors.card,
                color: '#09090b', 
                borderColor: colors.border,
                borderRadius: radius.base,
              }}
            />
          </div>
        </div>

        {/* 🔒 3. SECURITY KEY FIELD (Always visible) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-50" style={{ color: colors.textMain }}>
            Security Key
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.primary }} />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onKeyDown={onKeyDown}
              placeholder="••••••••" 
              className="w-full pl-11 pr-4 py-4 border focus:outline-none transition-all font-medium" 
              style={{ 
                backgroundColor: colors.card,
                color: '#09090b', 
                borderColor: colors.border,
                borderRadius: radius.base,
              }}
            />
          </div>
        </div>

        {/* --- SYSTEM TRIGGER ACTION BUTTON --- */}
        <button 
          onClick={onAuth} 
          disabled={loading} 
          className="w-full flex items-center justify-center gap-2 font-black py-4 shadow-lg transition-all active:scale-[0.97] disabled:opacity-50 mt-4"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.buttonText,
            borderRadius: radius.base
          }}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>{submitLabel} <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </div>

      {/* --- FOOTER CARD REDIRECT --- */}
      {footerAction && (
        <div className="mt-8 text-center" style={{ color: colors.textMain }}>
          {footerAction}
        </div>
      )}
    </div>
  );
}