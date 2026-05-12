'use client';

import { useSPCTheme } from '@/providers/ThemeProvider';
import { ReactNode } from 'react';
import Image from 'next/image';

export function DashboardShell({
  children,
  title,
  role,
  userName,
  onLogout,
}: any) {
  const { colors } = useSPCTheme();

  return (
    // FIX: Removed 'bg-slate-50' and linked it to your Theme Provider background
    <div 
      className="min-h-screen p-4 md:p-10 font-sans transition-colors duration-500"
      style={{ backgroundColor: colors.background }}
    >
      
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

          <div className="flex items-center gap-6">

            {/* Logo box remains pure white to pop against the dark background */}
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
              <Image
                src="/assets/SPCLOGO.avif"
                alt="SPC"
                width={40}
                height={40}
              />
            </div>

            <div>
              {/* Using colors.primary for the breadcrumb instead of gray */}
              <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: `${colors.primary}88` }}>
                System Node • {title}
              </p>

              {/* Title color linked to theme textMain */}
              <h1 className="text-4xl font-black tracking-tight" style={{ color: colors.textMain }}>
                {userName}
              </h1>
            </div>
          </div>

        {/* Sign Out Button in DashboardShell.tsx */}
            <button
            onClick={onLogout}
            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all active:scale-95 bg-white shadow-sm"
            style={{ 
                color: colors.danger,           // Use the new red color
                borderColor: `${colors.danger}20` // Very light red border (20% opacity)
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.danger}08`; // Faint red tint on hover
                e.currentTarget.style.borderColor = colors.danger;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = `${colors.danger}20`;
            }}
            >
            Sign Out
            </button>
        </header>

        {/* CONTENT */}
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {children}
        </main>

      </div>
    </div>
  );
}