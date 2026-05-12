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
      // This is the key line that makes the "gray" pop
      style={{ backgroundColor: colors.background }} 
    >
      {/* Persistent Brand Header */}
      <header className="mb-10 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="group">
          {/* UPDATED: Using colors.textMain instead of zinc-950 */}
          <h1 
            className="text-2xl font-black tracking-tighter transition-colors group-hover:text-emerald-600"
            style={{ color: colors.textMain }}
          >
            SPC DRIVE
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: colors.textMuted }}>
            Secure File Platform
          </p>
        </Link>

        {/* System Status Indicator */}
        <div 
          className="h-12 w-12 flex items-center justify-center border shadow-sm transition-transform hover:rotate-90"
          style={{ 
            backgroundColor: colors.card, // Pops white against the gray background
            borderColor: colors.border,
            borderRadius: radius.base // Using your theme radius
          }}
        >
          <div 
            className="h-2.5 w-2.5 rounded-full animate-pulse"
            style={{ 
              backgroundColor: colors.primary,
              boxShadow: `0 0 12px ${colors.primary}`
            }} 
          />
        </div>
      </header>

      {/* The Page Content (The white Bento Boxes will sit here) */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>

      {/* Subtle Footer */}
      {/* UPDATED: Using theme border color */}
      <footer 
        className="mt-20 py-8 border-t text-center max-w-7xl mx-auto"
        style={{ borderColor: colors.border }}
      >
        <p className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: colors.textMuted }}>
          Secured Protocol • San Pablo City Node
        </p>
      </footer>
    </main>
  );
}