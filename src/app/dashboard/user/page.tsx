'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { BentoCard } from '@/components/BentoCard';
import { DashboardShell } from '@/components/DashboardShell';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { FileBank } from '@/components/FileBank';

export default function UserDashboard() {
  const { user, logout, loading } = useMockAuth();
  const { colors } = useSPCTheme();
  const router = useRouter();

  const [files] = useState([
    { id: '1', name: 'SPC_System_Core_v2.bin', size: '1.2 GB', type: 'EXE', updatedAt: '2026-05-12' },
    { id: '2', name: 'Database_Backup_May.sql', size: '450 MB', type: 'SQL', updatedAt: '2026-05-10' },
    { id: '3', name: 'UI_Brand_Guidelines.pdf', size: '12 MB', type: 'PDF', updatedAt: '2026-05-08' },
    { id: '4', name: 'Network_Topology_Map.svg', size: '2.4 MB', type: 'SVG', updatedAt: '2026-05-09' },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/dashboard/auth');
    }
  }, [user, loading, router]);

  if (!user || loading) {
    return (
      // FIX: Matches the dark theme background instead of zinc-50
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: colors.background }}>
        <div 
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" 
          style={{ borderColor: `${colors.primary}33`, borderTopColor: colors.primary }}
        />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse" style={{ color: `${colors.primary}88` }}>
          Opening Your Drive...
        </p>
      </div>
    );
  }

  return (
    <DashboardShell 
      title="User Drive"
      role="Standard"
      userName={user.name}
      onLogout={logout}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Profile Card - Pure White */}
        <BentoCard className="md:col-span-4">
          <div className="flex items-center gap-5 p-2">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform hover:scale-105 duration-300"
              style={{ backgroundColor: colors.primary }} // Use primary color for the avatar
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
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40">Active Session</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Central File Bank - No gray background */}
        <BentoCard title="Available Protocols & Assets" className="md:col-span-4">
          <div className="bg-white rounded-2xl">
            <FileBank role="user" files={files} />
          </div>
        </BentoCard>

        {/* Node Storage Info - Pure White */}
        <BentoCard title="System Quota" className="md:col-span-2">
          <div className="mt-2 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40">Storage Efficiency</span>
              <span className="text-xs font-black tracking-tighter" style={{ color: colors.textMain }}>66% Utilized</span>
            </div>
            {/* Progress Bar - Emerald tint instead of gray */}
            <div className="relative h-2 w-full bg-emerald-500/5 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ 
                  width: '66%', 
                  backgroundColor: colors.primary,
                }} 
              />
            </div>
            <p className="text-[9px] font-black uppercase tracking-tighter opacity-30">8.4 GB of 12.0 GB remaining</p>
          </div>
        </BentoCard>

        {/* Permission Status - Emerald tint */}
        <BentoCard className="md:col-span-2 flex items-center gap-4 transition-all hover:shadow-xl hover:shadow-emerald-500/5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-700 tracking-[0.15em]">
              Security: Restricted
            </p>
            <p className="text-[11px] text-emerald-600 font-bold tracking-tight">
              Read-Only Access Enabled
            </p>
          </div>
        </BentoCard>

      </div>
    </DashboardShell>
  );
}