'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useSearch } from '@/hooks/useSearch';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useFileManagement } from '@/hooks/useFileManagement';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { useDownloadFile } from '@/hooks/useDownloadFile'; // 🌟 EDIT 1: Import your new hook

// UI Components
import { Button } from '@/components/ui/Button';
import { BentoCard } from '@/components/ui/BentoCard';
import { DashboardShell } from '@/components/shells/DashboardShell';
import { FileBank } from '@/components/FileBank';
import { UploadModal } from '@/components/UploadModal';
import { UserManagement } from '@/components/UserManagement';
import { DownloadHistory } from '@/components/DownloadHistory';

// Utilities & Data
import { 
  Upload, UserCircle, Download, ArrowRight, 
  LayoutDashboard, Loader2 
} from 'lucide-react';

export default function AdminDashboard() {
  // 1. Hook Initializations
  const { user, logout, loading } = useMockAuth();
  const { colors, radius } = useSPCTheme();
  const router = useRouter();
  
  const dash = useAdminDashboard();
  const userManager = useUserManagement();
  const fileManager = useFileManagement();
  
  // 🌟 EDIT 2: Initialize your new downloader hook mechanics
  const { downloadAsset } = useDownloadFile(); 
  
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  // 2. Search & Filtering Logic
  const { 
    query: searchQuery, 
    setQuery: setSearchQuery, 
    filteredData: filteredFiles 
  } = useSearch(fileManager.files, ['name', 'type']);

  const userSearch = useSearch(userManager.users, ['name', 'email']);

  // 3. Auth Guard
  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/dashboard/auth');
      else if (user.role !== 'admin') router.push('/dashboard/user');
    }
  }, [user, loading, router]);

  if (!user || loading || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: colors.background }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: colors.primary }} />
      </div>
    );
  }

  // 4. Action Handlers
  const handleUpload = async (file: File) => {
    setIsProcessingUpload(true);
    setTimeout(() => {
      fileManager.uploadFile(file);
      setIsProcessingUpload(false);
      dash.toggleUpload(false);
    }, 1200);
  };

  return (
    <DashboardShell 
      title={dash.activeView === 'files' ? "File Manager" : dash.activeView === 'users' ? "User Management" : "System Logs"} 
      role="Administrator" 
      userName={user.name} 
      onLogout={logout}
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        
        {/* --- PROFILE & PRIMARY ACTION CARD --- */}
        <BentoCard className="md:col-span-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
                  Secure Admin Session
                </p>
              </div>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.textMain }}>
                {user.name}
              </h2>
            </div>
            
            <Button 
              size="lg"
              onClick={() => dash.activeView === 'files' ? dash.toggleUpload(true) : dash.setView('files')}
              leftIcon={dash.activeView === 'files' ? <Upload className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
            >
              {dash.activeView === 'files' ? "Upload Asset" : "Return to Files"}
            </Button>
          </div>
        </BentoCard>

        {/* --- NAVIGATION STACK --- */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {[
            { id: 'users', label: 'Accounts', sub: 'DIRECTORY', icon: UserCircle },
            { id: 'history', label: 'Access Logs', sub: 'DOCUMENTATION', icon: Download }
          ].map((btn) => {
            const isActive = dash.activeView === btn.id;
            return (
              <button 
                key={btn.id}
                onClick={() => dash.setView(btn.id as any)}
                className="flex items-center justify-between p-5 border transition-all duration-300"
                style={{ 
                  backgroundColor: colors.card,
                  borderColor: isActive ? colors.primary : colors.border,
                  borderRadius: radius.base,
                  boxShadow: isActive ? `0 0 20px ${colors.primary}10` : 'none'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl transition-colors"
                    style={{ 
                      backgroundColor: isActive ? colors.primary : `${colors.primary}10`,
                      color: isActive ? '#fff' : colors.primary 
                    }}
                  >
                    <btn.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold" style={{ color: colors.textMain }}>{btn.label}</p>
                    <p className="text-[9px] font-black opacity-40 tracking-widest" style={{ color: colors.primary }}>
                      {btn.sub}
                    </p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : 'opacity-20'}`} />
              </button>
            );
          })}
        </div>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <div className="md:col-span-6">
          {dash.activeView === 'files' ? (
            <BentoCard title="Operative Repository">
              <FileBank 
                role="admin" 
                files={filteredFiles}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onUpdate={fileManager.updateFile}
                onDelete={fileManager.deleteFile}
                onDownload={downloadAsset} // 🌟 EDIT 3: Connect your clean hook download function directly!
              />
            </BentoCard>
          ) : dash.activeView === 'users' ? (
            <UserManagement 
              users={userSearch.filteredData}
              isEditing={userManager.isEditing}
              selectedUser={userManager.selectedUser}
              onApprove={userManager.approveUser}
              onToggleStatus={userManager.toggleStatus}
              onEdit={userManager.openEdit}
              onCloseEdit={userManager.closeEdit}
              onSave={userManager.updateUserDetails}
            />
          ) : (
            <DownloadHistory />
          )}
        </div>
      </div>

      {/* --- GLOBALS --- */}
      <UploadModal 
        isOpen={dash.isUploadOpen} 
        isProcessing={isProcessingUpload}
        onClose={() => dash.toggleUpload(false)} 
        onUpload={handleUpload} 
      />
    </DashboardShell>
  );
}