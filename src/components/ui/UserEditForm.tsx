'use client';

import { User as UserIcon, Lock } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { UserManagementData } from '@/types/dashboard';

interface UserEditFormProps {
  formData: UserManagementData | null;
  setFormData: (data: UserManagementData | null) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  onCommit: () => void;
}

export function UserEditForm({ 
  formData, 
  setFormData, 
  newPassword, 
  setNewPassword, 
  onCommit 
}: UserEditFormProps) {
  const { colors, radius } = useSPCTheme();

  if (!formData) return null;

  return (
    <div className="space-y-5 pt-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">
          Full Name
        </label>
        <div className="relative">
          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
          <input 
            type="text" 
            value={formData.name || ''} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full pl-11 pr-4 py-4 outline-none font-bold text-sm border transition-all" 
            style={{ 
              backgroundColor: colors.background, 
              borderColor: colors.border, 
              borderRadius: radius.base, 
              color: colors.textMain 
            }}
          />
        </div>
      </div>

      {/* Password Override Field */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">
          Access Key (New Password)
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-11 pr-4 py-4 outline-none font-mono text-sm border tracking-widest transition-all" 
            style={{ 
              backgroundColor: colors.background, 
              borderColor: colors.border, 
              borderRadius: radius.base, 
              color: colors.primary 
            }}
          />
        </div>
        <p className="text-[10px] font-medium px-1 opacity-50" style={{ color: colors.textMuted }}>
          Leave blank to maintain current authentication keys. Minimum 6 characters.
        </p>
      </div>

      {/* Commit Execution Button */}
      <button 
        onClick={onCommit} 
        className="w-full py-4 text-white font-black uppercase tracking-widest shadow-lg active:scale-95 hover:brightness-110 transition-all mt-4"
        style={{ backgroundColor: colors.primary, borderRadius: radius.base }}
      >
        Commit Changes
      </button>
    </div>
  );
}