'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { BentoCard } from '@/components/BentoCard';
import { DashboardShell } from '@/components/DashboardShell';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { FileBank } from '@/components/FileBank';
import { UploadModal } from '@/components/UploadModal';
import { UserManagement } from '@/components/UserManagement';
import { DownloadHistory } from '@/components/DownloadHistory'; // Ensure this component exists
import { 
  Upload, 
  UserCircle, 
  Download, 
  ArrowRight, 
  LayoutDashboard 
} from 'lucide-react';

// Define valid views for strict TypeScript checking
type DashboardView = 'files' | 'users' | 'history';

export default function AdminDashboard() {
  const { user, logout, loading } = useMockAuth();
  const { colors } = useSPCTheme();
  const router = useRouter();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('files');
  const [files, setFiles] = useState([
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

  const handleUploadComplete = (newFile: any) => {
    setFiles((prev) => [newFile, ...prev]);
  };

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
      title={
        activeView === 'files' ? "File Manager" : 
        activeView === 'users' ? "User Management" : "Download Logs"
      } 
      role="Administrator" 
      userName={user.name} 
      onLogout={logout}
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        
        {/* Profile & Primary Action */}
        <BentoCard className="md:col-span-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-1">
              <p style={{ color: colors.primary }} className="text-[10px] font-black uppercase tracking-widest">Active Session</p>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.textMain }}>{user.name}</h2>
              <p className="text-emerald-600/40 text-xs font-medium italic">
                "Node {activeView.toUpperCase()} Protocol Active"
              </p>
            </div>
            
            <button 
              onClick={() => activeView === 'files' ? setIsUploadOpen(true) : setActiveView('files')}
              style={{ backgroundColor: colors.primary }}
              className="group flex items-center justify-center gap-3 px-8 py-4 text-white rounded-2xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              {activeView === 'files' ? (
                <>
                  <Upload className="w-5 h-5" />
                  Upload New File
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-5 h-5" />
                  Return to Files
                </>
              )}
            </button>
          </div>
        </BentoCard>

        {/* Navigation Stack */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* USER MANAGEMENT BUTTON */}
          <button 
            onClick={() => setActiveView('users')}
            className={`group flex items-center justify-between p-5 bg-white border rounded-3xl transition-all hover:shadow-xl hover:shadow-emerald-500/5 text-left 
              ${activeView === 'users' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-zinc-100'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl transition-colors ${activeView === 'users' ? 'bg-emerald-500 text-white' : 'bg-emerald-50/50 text-emerald-600'}`}>
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: colors.textMain }}>Manage Account</p>
                <p className="text-[10px] text-emerald-600/40 font-black uppercase tracking-wider">Directory</p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 transition-all ${activeView === 'users' ? 'text-emerald-500 translate-x-1' : 'text-zinc-300'}`} />
          </button>

          {/* DOWNLOAD HISTORY BUTTON */}
          <button 
            onClick={() => setActiveView('history')}
            className={`group flex items-center justify-between p-5 bg-white border rounded-3xl transition-all hover:shadow-xl hover:shadow-emerald-500/5 text-left 
              ${activeView === 'history' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-zinc-100'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl transition-colors ${activeView === 'history' ? 'bg-emerald-500 text-white' : 'bg-emerald-50/50 text-emerald-600'}`}>
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: colors.textMain }}>Download Logs</p>
                <p className="text-[10px] text-emerald-600/40 font-black uppercase tracking-wider">Access Documentation</p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 transition-all ${activeView === 'history' ? 'text-emerald-500 translate-x-1' : 'text-zinc-300'}`} />
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="md:col-span-6">
          {activeView === 'files' ? (
            <BentoCard title="Your Files">
              <div className="bg-white">
                <FileBank role="admin" files={files} />
              </div>
            </BentoCard>
          ) : activeView === 'users' ? (
            <UserManagement />
          ) : (
            <DownloadHistory />
          )}
        </div>

        {/* Activity Log Footer */}
        <BentoCard title="System Activity" className="md:col-span-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs p-4 bg-white rounded-xl border border-emerald-500/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-slate-600">
                Viewing <span className="font-bold uppercase text-emerald-600">{activeView}</span> database. Session secure.
              </p>
              <span className="ml-auto text-[9px] font-black text-emerald-600/30 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </BentoCard>
      </div>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadComplete={handleUploadComplete} 
      />
    </DashboardShell>
  );
}