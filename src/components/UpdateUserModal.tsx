'use client';

import { useState, useEffect } from 'react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { Loader2, Edit3, X, CheckCircle2 } from 'lucide-react';
import { UserManagementData } from '@/types/dashboard';

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserManagementData | null;
  onConfirmUpdate: () => Promise<void>;
  formData: UserManagementData | null;
  setFormData: (data: UserManagementData | null) => void;
  isProcessing: boolean;
}

export function UpdateUserModal({
  isOpen,
  onClose,
  user,
  onConfirmUpdate,
  formData,
  setFormData,
  isProcessing
}: UpdateUserModalProps) {
  const { colors, radius } = useSPCTheme();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Synchronize internal layout validation hooks on visibility change events
  useEffect(() => {
    if (isOpen) {
      setValidationError(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !user || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.name || formData.name.trim().length < 2) {
      setValidationError("Identity display designation name must be at least 2 characters.");
      return;
    }

    try {
      await onConfirmUpdate();
      setIsSuccess(true); // Smooth transition inside the current frame container grid to success message
    } catch (err: any) {
      setValidationError(err?.message || "Failed to update user parameters securely.");
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
            {/* Window Management Dismiss Action Bar */}
            <button 
              onClick={onClose}
              disabled={isProcessing}
              className="absolute top-4 right-4 p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              style={{ color: colors.textMain }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Typography Framing Header Row */}
            <div className="flex items-center gap-3 mb-5">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
              >
                <Edit3 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black tracking-tight" style={{ color: colors.textMain }}>
                  Modify Configuration
                </h3>
                <p className="text-xs opacity-60 mt-0.5" style={{ color: colors.textMain }}>
                  Altering registry identifiers for <span className="font-bold">{user.email}</span>
                </p>
              </div>
            </div>

            <hr className="mb-5" style={{ borderColor: colors.border }} />

            {/* Identity Field Mutation Block */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider" style={{ color: colors.primary }}>
                  Display Profile Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isProcessing}
                  placeholder="Agent Name"
                  className="w-full px-4 py-3 border text-sm transition-all focus:outline-none focus:ring-2 bg-transparent"
                  style={{ 
                    borderRadius: radius.base, 
                    borderColor: colors.border,
                    color: colors.textMain,
                  }}
                />
              </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider" style={{ color: colors.primary }}>
                    System Clearances Role
                </label>
                <select
                    value={formData.role || 'user'}
                    // 🌟 FIXED BY ADDING: as UserManagementData['role']
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserManagementData['role'] })}
                    disabled={isProcessing}
                    className="w-full px-4 py-3 border text-sm transition-all focus:outline-none focus:ring-2 bg-transparent"
                    style={{ 
                    borderRadius: radius.base, 
                    borderColor: colors.border,
                    color: colors.textMain,
                    }}
                >
                    <option value="user" className="text-black">User Account</option>
                    <option value="admin" className="text-black">Administrator Access</option>
                </select>
                </div>

              {/* Functional Framework Form Feedback Alerts */}
              {validationError && (
                <div className="p-3 rounded text-xs border bg-red-500/10 border-red-500/20 text-red-400 font-medium text-left">
                  ⚠️ {validationError}
                </div>
              )}

              {/* Execution Action Bar Links */}
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
                  {isProcessing ? "Updating Profile..." : "Save Identity changes"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* Custom Smooth Viewport In-Modal Success Feedback Frame */
          <div className="py-6 flex flex-col items-center text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 mb-4 border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-black tracking-tight mb-2" style={{ color: colors.textMain }}>
              Identity Updated Cleanly
            </h3>
            
            <p className="text-sm max-w-xs mb-6 opacity-70" style={{ color: colors.textMain }}>
              New profile attributes have successfully synced with the master security tables.
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