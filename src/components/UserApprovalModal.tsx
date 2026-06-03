'use client';

import { Modal } from '@/components/ui/Modal'; // Adjust import route to your project structure
import { useSPCTheme } from '@/providers/ThemeProvider';
import { UserManagementData } from '@/types/dashboard';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface UserApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserManagementData | null;
  onConfirmApprove: (id: string) => Promise<void> | void;
  isProcessing: boolean;
}

export function UserApprovalModal({
  isOpen,
  onClose,
  user,
  onConfirmApprove,
  isProcessing
}: UserApprovalModalProps) {
  const { colors, radius } = useSPCTheme();

  // 🌟 SECURITY GUARD: Prevent rendering structural blocks if user data structure isn't supplied
  if (!isOpen) return null;

  const handleApprovalAction = async () => {
    if (!user?.id) return;
    await onConfirmApprove(user.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Operative Account"
      subtitle="Administrative Security Override"
    >
      <div className="p-6 space-y-6">
        {/* Informative Body Content Container */}
        <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: `${colors.primary}08` }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold" style={{ color: colors.textMain }}>
              Grant System Authorization?
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
              You are modifying security layouts to activate the following operator. This will provision standard database access rights instantly.
            </p>
          </div>
        </div>

        {/* User Detail Target Summary Panel */}
        <div 
          className="p-4 rounded-xl space-y-3 border"
          style={{ borderColor: colors.border, backgroundColor: `${colors.background}50` }}
        >
          {/* 🌟 FULL NAME ROW */}
          <div className="flex justify-between items-center text-xs min-h-6">
            <span className="font-medium" style={{ color: colors.textMuted }}>Full Name:</span>
            <span className="font-black text-sm" style={{ color: colors.textMain }}>
              {user?.name || <span className="opacity-40 italic font-normal">Pending decryption...</span>}
            </span>
          </div>
          
          {/* 🌟 EMAIL REGISTRY ROW */}
          <div className="flex justify-between items-center text-xs border-t pt-2 min-h-8" style={{ borderColor: `${colors.border}40` }}>
            <span className="font-medium" style={{ color: colors.textMuted }}>Email Registry:</span>
            <span className="font-mono font-bold" style={{ color: colors.textMain }}>
              {user?.email || <span className="opacity-40 italic font-sans font-normal">Pending registry lookup...</span>}
            </span>
          </div>
          
          {/* 🌟 ASSIGNED PRIVILEGE ROW */}
          <div className="flex justify-between items-center text-xs border-t pt-2 min-h-8" style={{ borderColor: `${colors.border}40` }}>
            <span className="font-medium" style={{ color: colors.textMuted }}>Assigned Privilege:</span>
            {user?.role ? (
              <span className="uppercase font-extrabold tracking-wider px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                {user.role}
              </span>
            ) : (
              <span className="opacity-40 italic font-normal">Unassigned Node</span>
            )}
          </div>
        </div>

        {/* Action Button Controls Footer */}
        <div className="flex gap-3 justify-end items-center pt-2">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
            style={{ 
              borderRadius: radius.base, 
              color: colors.textMuted,
              backgroundColor: `${colors.border}40`
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.border}80`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${colors.border}40`}
          >
            Cancel
          </button>
          
          <button
            onClick={handleApprovalAction}
            disabled={isProcessing || !user} // Safeguards button click sequence if row dataset isn't loaded
            className="px-5 py-2.5 text-xs font-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-sm text-white"
            style={{ 
              borderRadius: radius.base, 
              backgroundColor: colors.primary
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Activating Profile...
              </>
            ) : (
              'Confirm Activation'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}