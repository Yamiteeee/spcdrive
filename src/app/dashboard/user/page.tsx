'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { BentoCard } from '@/components/BentoCard';
import MainDashboardLayout from '@/components/layouts/MainDashboardLayout';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { FileBank } from '@/components/FileBank';

export default function UserDashboard() {
  const { user, logout, loading } = useMockAuth();
  const { colors } = useSPCTheme();
  const router = useRouter();

  // Mock data (matches Admin for consistency)
  const [files] = useState([
    { id: '1', name: 'SPC_System_Core_v2.bin', size: '1.2 GB', type: 'EXE', updatedAt: '2026-05-12' },
    { id: '2', name: 'Database_Backup_May.sql', size: '450 MB', type: 'SQL', updatedAt: '2026-05-10' },
    { id: '3', name: 'UI_Brand_Guidelines.pdf', size: '12 MB', type: 'PDF', updatedAt: '2026-05-08' },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/dashboard/auth');
    }
  }, [user, loading, router]);

  if (!user || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-50">
        <div 
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" 
          style={{ borderColor: `${colors.primary}33`, borderTopColor: colors.primary }}
        />
        <p className="mt-4 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
          Opening Your Drive...
        </p>
      </div>
    );
  }

  return (
    <MainDashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* User Profile Card */}
        <BentoCard className="md:col-span-4 bg-white border-zinc-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl"
                style={{ backgroundColor: colors.textMain }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">
                  Standard Node
                </p>
                <h2 className="text-2xl font-black text-zinc-950 tracking-tight">{user.name}</h2>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="px-6 py-2.5 text-[10px] font-black text-white rounded-xl transition-all uppercase tracking-widest hover:bg-red-500 active:scale-95 shadow-sm"
              style={{ backgroundColor: colors.textMain }}
            >
              Disconnect
            </button>
          </div>
        </BentoCard>

        {/* The Main File Bank (Full Width for Users) */}
        <BentoCard title="Central File Repository" className="md:col-span-4 bg-white border-zinc-200">
            <FileBank role="user" files={files} />
        </BentoCard>

        {/* Storage Management (Moved to Sidebar/Bottom) */}
        <BentoCard title="Node Storage" className="md:col-span-2 bg-zinc-50/50 border-zinc-100">
          <div className="mt-2 flex items-center gap-4">
            <div className="flex-1 bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full w-[66%] rounded-full" 
                style={{ backgroundColor: colors.primary }}
              />
            </div>
            <span className="text-sm font-black text-zinc-900">66% Full</span>
          </div>
        </BentoCard>

        {/* Access Level Card */}
        <BentoCard className="md:col-span-2 bg-emerald-50/50 border-emerald-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04 Pelm-1.414 1.414L10 14.172l-1.293 1.293a1 1 0 001.414 1.414L11.414 15.586l1.293 1.293a1 1 0 001.414-1.414L12.828 14.172l1.293-1.293a1 1 0 00-1.414-1.414L11.414 12.758l-1.293-1.293z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Access: Read-Only</p>
            <p className="text-[11px] text-emerald-600 font-medium">Download & View protocols active.</p>
          </div>
        </BentoCard>

      </div>
    </MainDashboardLayout>
  );
}