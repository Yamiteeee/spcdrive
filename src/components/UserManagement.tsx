'use client';

import { UserCircle, ShieldCheck, UserMinus, Edit3, Check, KeyRound } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { BentoCard } from '@/components/ui/BentoCard';
import { Table } from '@/components/ui/Table';
import { UserManagementData } from '@/types/dashboard';

interface UserManagementProps {
  users: UserManagementData[];
  onApprove: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (user: UserManagementData) => void;
  onPasswordResetTrigger: (user: UserManagementData) => void;
}

export function UserManagement({ 
  users, 
  onApprove, 
  onToggleStatus, 
  onEdit, 
  onPasswordResetTrigger 
}: UserManagementProps) {
  const { colors } = useSPCTheme();

  const columns = [
    {
      header: 'Identity',
      render: (u: UserManagementData) => (
        <div className="flex items-center gap-3 pl-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center border"
            style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textMuted }}
          >
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: colors.textMain }}>{u.name}</p>
            <p className="text-[11px] font-medium" style={{ color: colors.textMuted }}>{u.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Permissions',
      render: (u: UserManagementData) => (
        <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border"
          style={{ 
            backgroundColor: u.role === 'admin' ? `${colors.primary}10` : colors.background,
            color: u.role === 'admin' ? colors.primary : colors.textMuted,
            borderColor: u.role === 'admin' ? `${colors.primary}20` : colors.border
          }}>
          {u.role}
        </span>
      )
    },
    {
      header: 'Status',
      render: (u: UserManagementData) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'animate-pulse' : ''}`} 
               style={{ backgroundColor: u.status === 'active' ? colors.primary : '#f59e0b' }} />
          <span className="text-[11px] font-bold uppercase tracking-tight" style={{ color: colors.textMain }}>{u.status}</span>
        </div>
      )
    },
    {
      header: 'Protocols',
      align: 'right' as const,
      render: (u: UserManagementData) => (
        <div className="flex justify-end items-center gap-1 pr-4">
          {u.status === 'pending' && (
            <button 
              onClick={() => onApprove(u.id)} 
              className="p-2 transition-transform hover:scale-125 text-amber-500 hover:text-emerald-500"
              title="Grant Access Clearance"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500 animate-bounce" />
            </button>
          )}

          {/* Password Credentials Reset Overlay Trigger */}
          <button 
            onClick={() => onPasswordResetTrigger(u)} 
            className="p-2 hover:scale-110 transition-transform text-neutral-400 hover:text-amber-500"
            title="Reset Access Credentials"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          {/* Profile Name & Meta Configurations Overlay Trigger */}
          <button 
            onClick={() => onEdit(u)} 
            className="p-2 hover:scale-110 transition-transform text-neutral-400 hover:text-primary" 
            title="Edit Identity Configuration"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button 
            onClick={() => onToggleStatus(u.id)} 
            className="p-2 hover:scale-110 transition-transform" 
            style={{ color: u.status === 'disabled' ? colors.primary : colors.danger }}
            title={u.status === 'disabled' ? "Enable Account Access" : "Suspend Account Access"}
          >
            {u.status === 'disabled' ? <Check className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="md:col-span-6 relative">
      <BentoCard title="System Operative Directory">
        <Table data={users} columns={columns} />
      </BentoCard>
    </div>
  );
}