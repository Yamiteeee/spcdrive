'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useSearch } from '@/hooks/useSearch';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useFileManagement } from '@/hooks/useFileManagement';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { useDownloadFile } from '@/hooks/useDownloadFile'; 
import { useUserApproval } from '@/hooks/useUserApproval'; 
import { createClient } from '@/utils/supabase/client'; 
import { UserManagementData } from '@/types/dashboard';

// UI Components
import { Button } from '@/components/ui/Button';
import { BentoCard } from '@/components/ui/BentoCard';
import { DashboardShell } from '@/components/shells/DashboardShell';
import { FileBank } from '@/components/FileBank';
import { UploadModal } from '@/components/UploadModal';
import { UserManagement } from '@/components/UserManagement';
import { DownloadHistory } from '@/components/DownloadHistory';
import { UserApprovalModal } from '@/components/UserApprovalModal'; 
import { UpdatePasswordModal } from '@/components/UpdatePasswordModal'; 
import { UpdateUserModal } from '@/components/UpdateUserModal';

import { 
  Upload, UserCircle, Download, ArrowRight, 
  LayoutDashboard, Loader2 
} from 'lucide-react';

export default function AdminDashboard() {
  const { colors, radius } = useSPCTheme();
  const router = useRouter();
  const supabase = createClient();
  
  const [currentUserProfile, setCurrentUserProfile] = useState<{name: string; role: string} | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Local state tracking for the focused password target record
  const [resettingPasswordUser, setResettingPasswordUser] = useState<UserManagementData | null>(null);

  const dash = useAdminDashboard();
  const fileManager = useFileManagement();
  const { downloadAsset } = useDownloadFile(); 
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const fileSearch = useSearch(fileManager.files, ['name', 'type']);

  const userManager = useUserManagement({
    query: userSearchQuery,
    setQuery: setUserSearchQuery
  });

  const userSearch = useSearch(userManager.users, ['name', 'email']);

  // Initialize administrative user access approval logic states
  const approval = useUserApproval({
    allUsers: userManager.users,
    filteredUsers: userSearch.filteredData,
    onConfirmApprove: userManager.approveUser
  });

  useEffect(() => {
    async function verifyAdminSession() {
      try {
        setIsAuthLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/dashboard/auth');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          router.push('/dashboard/user');
          return;
        }

        setCurrentUserProfile(profile);
      } catch (err) {
        router.push('/dashboard/auth');
      } finally {
        setIsAuthLoading(false);
      }
    }
    
    verifyAdminSession();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/dashboard/auth');
  };

  if (isAuthLoading || !currentUserProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: colors.background }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: colors.primary }} />
      </div>
    );
  }

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
      userName={currentUserProfile.name} 
      onLogout={handleLogout}
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        
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
                {currentUserProfile.name}
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

        <div className="md:col-span-6">
          {dash.activeView === 'files' ? (
            <BentoCard title="Operative Repository">
              <FileBank 
                role="admin" 
                files={fileSearch.filteredData}
                searchQuery={fileSearch.query}
                setSearchQuery={fileSearch.setQuery}
                onUpdate={fileManager.updateFile}
                onDelete={fileManager.deleteFile}
                onDownload={downloadAsset} 
              />
            </BentoCard>
          ) : dash.activeView === 'users' ? (
            /* 🌟 Perfectly Cleaned, Modular User Directory List Presentation Layer */
            <UserManagement 
              users={userSearch.filteredData}
              onApprove={approval.openApproval}
              onToggleStatus={userManager.toggleStatus}
              onEdit={userManager.openEdit}
              onPasswordResetTrigger={(user: UserManagementData) => setResettingPasswordUser(user)}
            />
          ) : (
            <DownloadHistory />
          )}
        </div>
      </div>

      {/* Asset Repository Upload Overlay Component Framework */}
   {/* 🌟 Update this specific block around line 224 */}
        <UploadModal 
          isOpen={dash.isUploadOpen} 
          isProcessing={isProcessingUpload}
          onClose={() => dash.toggleUpload(false)} 
          onUpload={handleUpload} 
        />

      {/* 🌟 Profile Identity Remap Modification Management Modal Layer */}
      <UpdateUserModal 
        isOpen={userManager.isEditing} 
        onClose={userManager.closeEdit}
        user={userManager.formData} 
        formData={userManager.formData}
        setFormData={userManager.setFormData}
        onConfirmUpdate={async () => {
          await userManager.commitChanges();
        }}
        isProcessing={userManager.isActionProcessing}
      />

      {/* Account Verification & Registration Authorization Review Modal Layer */}
      <UserApprovalModal 
        isOpen={approval.isOpen}
        onClose={approval.closeApproval}
        user={approval.approvingUser}
        onConfirmApprove={userManager.approveUser}
        isProcessing={userManager.isActionProcessing}
      />

      {/* Access Keys and Security Credentials Modification Modal Layer */}
      <UpdatePasswordModal 
        isOpen={resettingPasswordUser !== null}
        onClose={() => setResettingPasswordUser(null)}
        user={resettingPasswordUser}
        onConfirmPasswordReset={userManager.updateUserPassword}
        isProcessing={userManager.isActionProcessing}
      />
    </DashboardShell>
  );
}