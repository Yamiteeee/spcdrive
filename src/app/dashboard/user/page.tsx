'use client';

import { useUserDashboard } from '@/hooks/useUserDashboard';
import { useFileManagement } from '@/hooks/useFileManagement';
import { useSearch } from '@/hooks/useSearch';
import { useDownloadFile } from '@/hooks/useDownloadFile'; // Integrated live downloader
import { useSPCTheme } from '@/providers/ThemeProvider';

// Layout and Global Workspace Animations
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';

// UI Components
import { BentoCard } from '@/components/ui/BentoCard';
import { DashboardShell } from '@/components/shells/DashboardShell';
import { Button } from '@/components/ui/Button';
import { FileBank } from '@/components/FileBank';

import { Loader2, ShieldCheck, HardDrive } from 'lucide-react';

export default function UserDashboard() {
  const { user, logout, loading } = useUserDashboard();
  const { colors, radius } = useSPCTheme();
  const fileManager = useFileManagement();
  const { downloadAsset } = useDownloadFile(); // Initialized secure download action stream

  const { 
    query: searchQuery, 
    setQuery: setSearchQuery, 
    filteredData: filteredFiles 
  } = useSearch(fileManager.files, ['name', 'type']);

  if (!user || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: colors.background }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: colors.primary }} />
      </div>
    );
  }

  return (
    <DashboardShell 
      title={searchQuery ? `Search: ${searchQuery}` : "User Drive"} 
      role="Standard Operative"
      userName={user.name}
      onLogout={logout}
    >
      {/* Wrapped inside AnimatePresence with an explicit key bound to user session parameters.
        This forces your page layout components to fade and slide up cleanly on view mount.
      */}
      <AnimatePresence mode="wait">
        <PageTransition key={`user-panel-${user.name}`}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            
            {/* --- PROFILE CARD (Matches Admin Layout) --- */}
            <BentoCard className="md:col-span-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div 
                    className="w-14 h-14 flex items-center justify-center text-white font-black text-xl shadow-lg"
                    style={{ 
                      backgroundColor: colors.primary,
                      boxShadow: `0 10px 15px -3px ${colors.primary}40`,
                      borderRadius: radius.base
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
                        Active Node
                      </p>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.textMain }}>
                      {user.name}
                    </h2>
                  </div>
                </div>
                
                {/* User-Specific Retrieval Action */}
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-1">Last Sync</p>
                   <p className="text-xs font-mono font-bold" style={{ color: colors.textMain }}>
                     {new Date().toLocaleDateString()}
                   </p>
                </div>
              </div>
            </BentoCard>

            {/* --- QUICK STATS CARD --- */}
            <BentoCard className="md:col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                        <HardDrive size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-40">Storage Utilization</p>
                        <p className="text-lg font-black" style={{ color: colors.textMain }}>
                            {fileManager.files.length} Assets <span className="text-xs opacity-40 font-normal">/ Unlimited</span>
                        </p>
                    </div>
                </div>
            </BentoCard>

            {/* --- MAIN REPOSITORY --- */}
            <div className="md:col-span-6">
              <BentoCard title="Operative Repository">
                <FileBank 
                  role="user" 
                  files={filteredFiles} 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onDownload={downloadAsset} // Hooked up the functional downloadAsset logic
                  onUpdate={() => {}} 
                  onDelete={() => {}}
                />
              </BentoCard>
            </div>

            {/* --- SECURITY FOOTER --- */}
            <div className="md:col-span-6">
                <BentoCard className="bg-opacity-50 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="w-5 h-5" style={{ color: colors.primary }} />
                            <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                                Clearance Level: <span style={{ color: colors.primary }}>Standard</span>. You are in Read-Only mode.
                            </p>
                        </div>
                        <Button variant="ghost" size="sm">Request Elevation</Button>
                    </div>
                </BentoCard>
            </div>

          </div>
        </PageTransition>
      </AnimatePresence>
    </DashboardShell>
  );
}