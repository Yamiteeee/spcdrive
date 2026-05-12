'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { BentoCard } from '@/components/BentoCard';
import MainDashboardLayout from '@/components/layouts/MainDashboardLayout';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { FileBank } from '@/components/FileBank'; // Import the component we discussed

export default function AdminDashboard() {
  const { user, logout, loading } = useMockAuth();
  const { colors } = useSPCTheme();
  const router = useRouter();

  // Mock data for the File Bank
  const [files] = useState([
    { id: '1', name: 'SPC_System_Core_v2.bin', size: '1.2 GB', type: 'EXE', updatedAt: '2026-05-12' },
    { id: '2', name: 'Database_Backup_May.sql', size: '450 MB', type: 'SQL', updatedAt: '2026-05-10' },
    { id: '3', name: 'UI_Brand_Guidelines.pdf', size: '12 MB', type: 'PDF', updatedAt: '2026-05-08' },
  ]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/dashboard/auth');
      } else if (user.role !== 'admin') {
        router.push('/dashboard/user');
      }
    }
  }, [user, loading, router]);

  if (!user || loading || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-50">
        <div 
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" 
          style={{ borderColor: `${colors.primary}33`, borderTopColor: colors.primary }}
        />
        <p className="mt-4 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
          Authenticating Root...
        </p>
      </div>
    );
  }

  return (
    <MainDashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Admin Branding & Quick Upload */}
        <BentoCard className="md:col-span-2 bg-white border-zinc-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <p style={{ color: colors.primary }} className="text-[10px] font-bold uppercase tracking-widest mb-0.5">
                  Root Level Access
                </p>
                <h2 className="text-2xl font-black text-zinc-950 tracking-tight">{user.name}</h2>
              </div>
            </div>
            <div className="flex gap-2">
               <button 
                className="px-4 py-2 text-[10px] font-black text-white rounded-xl transition-all uppercase tracking-widest hover:brightness-110 active:scale-95 shadow-md shadow-emerald-100"
                style={{ backgroundColor: colors.primary }}
              >
                Upload
              </button>
              <button 
                onClick={logout} 
                className="px-4 py-2 text-[10px] font-black text-zinc-400 hover:text-red-500 bg-zinc-50 rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-red-100"
              >
                Terminate
              </button>
            </div>
          </div>
        </BentoCard>

        {/* System Health Status */}
        <BentoCard 
          title="Core Engine Load" 
          className="md:col-span-2 border-none shadow-2xl shadow-emerald-100/30"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="flex items-end gap-3 text-white">
            <span className="text-5xl font-black font-mono tracking-tighter">0.042ms</span>
            <span className="text-emerald-100 text-[10px] font-bold pb-1 uppercase tracking-[0.2em]">
              Latency
            </span>
          </div>
        </BentoCard>

        {/* The Main File Bank (Full Width) */}
        <BentoCard title="SPC File Bank - Secure Storage" className="md:col-span-4 bg-white border-zinc-200">
            <FileBank role="admin" files={files} />
        </BentoCard>

        {/* System Activity Logs (Moved to Bottom or Sidebar) */}
        <BentoCard title="Recent Protocol Logs" className="md:col-span-4 bg-zinc-50/50 border-zinc-100">
          <div className="space-y-2 font-mono text-[9px]">
            <div className="flex gap-4 opacity-60">
              <span className="text-emerald-600 font-bold">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-zinc-500">ADMIN_ACCESS: File Bank accessed by Root User.</span>
            </div>
          </div>
        </BentoCard>

      </div>
    </MainDashboardLayout>
  );
}