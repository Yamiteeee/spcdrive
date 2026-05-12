'use client';
import { useSPCTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';

export default function MainDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors, radius } = useSPCTheme();

  return (
    <main 
      className="min-h-screen p-6 md:p-10 font-sans transition-colors duration-300"
      style={{ backgroundColor: colors.background }}
    >
      {/* Persistent Brand Header */}
      <header className="mb-10 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="group">
          <h1 className="text-2xl font-black tracking-tighter text-zinc-950 group-hover:text-emerald-600 transition-colors">
            SPC DRIVE
          </h1>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
            System Control Interface
          </p>
        </Link>

        {/* System Status Indicator */}
        <div 
          className="h-12 w-12 flex items-center justify-center border shadow-sm transition-transform hover:rotate-90"
          style={{ 
            backgroundColor: colors.card, 
            borderColor: colors.border,
            borderRadius: '1rem' 
          }}
        >
          <div 
            className="h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_8px]"
            style={{ 
              backgroundColor: colors.primary,
              boxShadow: `0 0 12px ${colors.primary}`
            }} 
          />
        </div>
      </header>

      {/* The Page Content (Bento Grid) */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>

      {/* Subtle Footer */}
      <footer className="mt-20 py-8 border-t border-zinc-200 text-center max-w-7xl mx-auto">
        <p className="text-[9px] text-zinc-300 font-black uppercase tracking-[0.4em]">
          Secured Protocol • San Pablo City Node
        </p>
      </footer>
    </main>
  );
}