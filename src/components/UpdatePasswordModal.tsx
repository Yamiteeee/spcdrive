'use client';

import { useState, useEffect } from 'react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { Loader2, Lock, X, CheckCircle2 } from 'lucide-react';
import { UserManagementData } from '@/types/dashboard';

//  INLINE STABLE INTERFACE (No extra file required!)
interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserManagementData | null;
  onConfirmPasswordReset: (userId: string, newPasswordString: string) => Promise<void>;
  isProcessing: boolean;
}

export function UpdatePasswordModal({
  isOpen,
  onClose,
  user,
  onConfirmPasswordReset,
  isProcessing
}: UpdatePasswordModalProps) {
  const { colors, radius } = useSPCTheme();
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset states when the modal visibility toggles
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setValidationError(null);
      setIsSuccess(false);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password.trim().length < 6) {
      setValidationError("Security policy requires passwords to be at least 6 characters.");
      return;
    }

    try {
      await onConfirmPasswordReset(user.id, password.trim());
      setIsSuccess(true); // Switch smoothly to inline success layout frame
    } catch (err: any) {
      setValidationError(err?.message || "Failed to update authentication credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md border p-6 relative shadow-2xl transition-all duration-300 transform scale-100"
        style={{ 
          backgroundColor: colors.card, 
          borderColor: colors.border,
          borderRadius: radius.base 
        }}
      >
        {!isSuccess ? (
          <>
            {/* Close Button Row */}
            <button 
              onClick={onClose}
              disabled={isProcessing}
              className="absolute top-4 right-4 p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              style={{ color: colors.textMain }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Segment */}
            <div className="flex items-center gap-3 mb-5">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
              >
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black tracking-tight" style={{ color: colors.textMain }}>
                  Reset Credentials
                </h3>
                <p className="text-xs opacity-60 mt-0.5" style={{ color: colors.textMain }}>
                  Updating access keys for <span className="font-bold">{user.name}</span>
                </p>
              </div>
            </div>

            <hr className="mb-5" style={{ borderColor: colors.border }} />

            {/* Input Form Submission Pipeline */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-2">
                <label 
                  className="text-[10px] font-black uppercase tracking-wider" 
                  style={{ color: colors.primary }}
                >
                  New Account Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isProcessing}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border text-sm transition-all focus:outline-none focus:ring-2 bg-transparent"
                  style={{ 
                    borderRadius: radius.base, 
                    borderColor: colors.border,
                    color: colors.textMain,
                  }}
                />
              </div>

              {/* Validation Alert Message Frame */}
              {validationError && (
                <div className="p-3 rounded text-xs border bg-red-500/10 border-red-500/20 text-red-400 font-medium text-left">
                  ⚠️ {validationError}
                </div>
              )}

              {/* Action Trigger Buttons Container */}
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-bold border transition-colors hover:bg-neutral-100/10 disabled:opacity-40"
                  style={{ 
                    borderRadius: radius.base, 
                    borderColor: colors.border,
                    color: colors.textMain 
                  }}
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                  {isProcessing ? "Propagating..." : "Apply New Password"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* 🌟 BEAUTIFUL EMBEDDED SUCCESS VIEW FRAME */
          <div className="py-6 flex flex-col items-center text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 mb-4 border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-black tracking-tight mb-2" style={{ color: colors.textMain }}>
              Password Updated Successfully
            </h3>
            
            <p className="text-sm max-w-xs mb-6 opacity-70" style={{ color: colors.textMain }}>
              New security tokens have been mapped onto <span className="font-bold">{user.name}</span>'s identity records.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 text-sm font-black tracking-wider uppercase text-white transition-opacity hover:opacity-90"
              style={{ 
                backgroundColor: colors.primary,
                borderRadius: radius.base 
              }}
            >
              All Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}