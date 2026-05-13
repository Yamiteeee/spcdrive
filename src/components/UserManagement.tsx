'use client';
import { UserCircle, ShieldCheck, UserMinus, Edit3, Check, User as UserIcon } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { BentoCard } from '@/components/ui/BentoCard';
import { Table } from '@/components/ui/Table';
import { SlidePanel } from '@/components/ui/SlidePanel';
import { UserManagementData } from '@/types/dashboard';

interface UserManagementProps {
  users: UserManagementData[];
  isEditing: boolean;
  selectedUser: UserManagementData | null;
  onApprove: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (user: UserManagementData) => void;
  onCloseEdit: () => void;
}

export function UserManagement({ 
  users, isEditing, selectedUser, onApprove, onToggleStatus, onEdit, onCloseEdit 
}: UserManagementProps) {
  const { colors } = useSPCTheme();

  const columns = [
    {
      header: 'Identity',
      render: (u: UserManagementData) => (
        <div className="flex items-center gap-3 pl-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
            <UserCircle />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{u.name}</p>
            <p className="text-xs text-slate-400">{u.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Permissions',
      render: (u: UserManagementData) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
          u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
        }`}>
          {u.role}
        </span>
      )
    },
    {
      header: 'Status',
      render: (u: UserManagementData) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            u.status === 'active' ? 'bg-emerald-500' : u.status === 'pending' ? 'bg-amber-500' : 'bg-slate-300'
          }`} />
          <span className="text-xs capitalize">{u.status}</span>
        </div>
      )
    },
    {
      header: 'Protocols',
      align: 'right' as const,
      render: (u: UserManagementData) => (
        <div className="flex justify-end gap-2 pr-4">
          {u.status === 'pending' && (
            <button onClick={() => onApprove(u.id)} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all">
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => onEdit(u)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-lg transition-all">
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onToggleStatus(u.id)} 
            className={`p-2 rounded-lg transition-all ${u.status === 'disabled' ? 'hover:bg-emerald-50 text-emerald-600' : 'hover:bg-red-50 text-red-400'}`}
          >
            {u.status === 'disabled' ? <Check className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="md:col-span-6 relative">
      <BentoCard title="User Directory">
        <Table data={users} columns={columns} />
      </BentoCard>

      <SlidePanel 
        isOpen={isEditing} 
        onClose={onCloseEdit} 
        title="Edit Identity" 
        subtitle="Protocol: Update_User_V2"
      >
        <div className="space-y-6">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              defaultValue={selectedUser?.name} 
              className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium" 
            />
          </div>
          <button 
            onClick={onCloseEdit} 
            style={{ backgroundColor: colors.primary }} 
            className="w-full py-4 text-white rounded-2xl font-bold shadow-lg active:scale-95 hover:brightness-110 transition-all"
          >
            Commit Changes
          </button>
        </div>
      </SlidePanel>
    </div>
  );
}