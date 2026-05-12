'use client';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { ReactNode } from 'react';

interface DashboardShellProps {
  children: ReactNode;
  title: string;
  role: string;
  userName: string;
  onLogout: () => void;
}

export function DashboardShell({ children, title, role, userName, onLogout }: DashboardShellProps) {
  const { colors, radius } = useSPCTheme();

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div 
                className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md"
                style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
              >
                {role} Node
              </div>
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-tighter">System / {title}</span>
            </div>
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
              Welcome back, <span style={{ color: colors.primary }}>{userName.split(' ')[0]}</span>
            </h1>
          </div>

          <button 
            onClick={onLogout}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95"
            style={{ backgroundColor: colors.textMain, color: 'white' }}
          >
            <span className="group-hover:text-red-400 transition-colors">Terminate Session</span>
          </button>
        </header>

        {/* Main Content Area (Where your Bento Cards go) */}
        <main className="w-full">
          {children}
        </main>

        {/* System Footer */}
        <footer className="pt-8 border-t border-zinc-200 flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <p>© 2026 SPC DRIVE • {role}_AUTH_SUCCESS</p>
          <p>Location: San Pablo City</p>
        </footer>
      </div>
    </div>
  );
}