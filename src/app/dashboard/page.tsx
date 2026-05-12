'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { BentoCard } from '@/components/BentoCard';
import { DashboardShell } from '@/components/DashboardShell';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { FileBank } from '@/components/FileBank';
import { Upload, UserCircle, History, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, loading } = useMockAuth();
  const { colors } = useSPCTheme();
  const router = useRouter();

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
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: colors.background }}>
        <div 
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" 
          style={{ borderColor: `${colors.primary}33`, borderTopColor: colors.primary }}
        />
      </div>
    );
  }

  return (
    <DashboardShell 
      title="File Manager" 
      role="Administrator" 
      userName={user.name} 
      onLogout={logout}
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        
        {/* Profile & Upload Action - Pure White */}
        <BentoCard className="md:col-span-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-1">
              <p style={{ color: colors.primary }} className="text-[10px] font-black uppercase tracking-widest">Active Session</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h2>
              <p className="text-emerald-600/40 text-xs font-medium italic">"Secure node connection established"</p>
            </div>
            
            <button 
              style={{ backgroundColor: colors.primary }}
              className="group flex items-center justify-center gap-3 px-8 py-4 text-white rounded-2xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Upload className="w-5 h-5" />
              Upload New File
            </button>
          </div>
        </BentoCard>

        {/* Navigation Stack - Pure White Buttons */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <button className="group flex items-center justify-between p-5 bg-white border border-emerald-500/5 rounded-[1.5rem] transition-all hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50/50 rounded-xl text-emerald-600">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Manage Account</p>
                <p className="text-[10px] text-emerald-600/40 font-black uppercase tracking-wider">Settings</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-500/20 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </button>

          <button className="group flex items-center justify-between p-5 bg-white border border-emerald-500/5 rounded-[1.5rem] transition-all hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50/50 rounded-xl text-emerald-600">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">File History</p>
                <p className="text-[10px] text-emerald-600/40 font-black uppercase tracking-wider">Activity</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-500/20 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* File Bank - Removed gray inner background */}
        <BentoCard title="Your Files" className="md:col-span-6">
          <div className="bg-white">
            <FileBank role="admin" files={files} />
          </div>
        </BentoCard>

        {/* Activity Log - Pure White Accents */}
        <BentoCard title="Recent Activity" className="md:col-span-6">
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 text-xs p-4 bg-white rounded-xl border border-emerald-500/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                <p className="text-slate-600">System node verification complete. Logged in as administrator.</p>
                <span className="ml-auto text-[9px] font-black text-emerald-600/30 uppercase tracking-widest">Live</span>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}