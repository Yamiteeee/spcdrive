'use client';

import { useUserDashboard } from '@/hooks/useUserDashboard';
import { useSearch } from '@/hooks/useSearch';
import { BentoCard } from '@/components/ui/BentoCard';
import { DashboardShell } from '@/components/shells/DashboardShell';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { FileBank } from '@/components/FileBank';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function UserDashboard() {
  const { user, logout, loading, files } = useUserDashboard();
  const { colors } = useSPCTheme();

  // Use the search hook for file filtering
  const { query: searchQuery, setQuery: setSearchQuery, filteredData: filteredFiles } = useSearch(files, ['name', 'type']);

  // Loading State (Thematic)
  if (!user || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: colors.background }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: colors.primary }} />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse" style={{ color: `${colors.primary}88` }}>
          Opening Your Drive...
        </p>
      </div>
    );
  }

  return (
    <DashboardShell 
      title="User Drive"
      role="Standard Operative"
      userName={user.name}
      onLogout={logout}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Profile Identity Card */}
        <BentoCard className="md:col-span-4">
          <div className="flex items-center gap-5 p-2">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform hover:scale-105 duration-300"
              style={{ backgroundColor: colors.primary }}
            >
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color: `${colors.primary}66` }}>
                Authenticated Node
              </p>
              <h2 className="text-2xl font-black tracking-tight leading-none" style={{ color: colors.textMain }}>
                {user.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40">Active Session</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Central File Bank */}
        <BentoCard title="Available Protocols & Assets" className="md:col-span-4">
          <FileBank 
            role="user" 
            files={filteredFiles} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </BentoCard>

        {/* System Quota Monitoring */}
        <BentoCard title="System Quota" className="md:col-span-2">
          <div className="mt-2 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40">Storage Efficiency</span>
              <span className="text-xs font-black tracking-tighter" style={{ color: colors.textMain }}>66% Utilized</span>
            </div>
            
            <div className="relative h-2.5 w-full bg-emerald-500/5 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: '66%', backgroundColor: colors.primary }} 
              />
            </div>
            <p className="text-[9px] font-black uppercase tracking-tighter opacity-30">
              8.4 GB of 12.0 GB remaining
            </p>
          </div>
        </BentoCard>

        {/* Security Status Component */}
        <BentoCard className="md:col-span-2 flex items-center gap-4 transition-all hover:shadow-xl hover:shadow-emerald-500/5 border border-transparent hover:border-emerald-500/10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.15em]">
              Security: Restricted
            </p>
            <p className="text-[11px] text-slate-500 font-bold tracking-tight">
              Read-Only Access Enabled
            </p>
          </div>
        </BentoCard>

      </div>
    </DashboardShell>
  );
}