'use client';
import { useState } from 'react';
import { UserCircle, ShieldCheck, UserMinus, Edit3, Check, X, Lock, Mail, User, Loader2 } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { BentoCard } from './BentoCard';
import { motion, AnimatePresence } from 'framer-motion';

export function UserManagement() {
  const { colors } = useSPCTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@spc.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@spc.com', role: 'user', status: 'pending' },
    { id: '3', name: 'Mike Ross', email: 'mike@spc.com', role: 'user', status: 'disabled' },
  ]);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'disabled' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const approveUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
  };

  const openEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  return (
    <div className="md:col-span-6 relative">
      <BentoCard title="User Directory">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Permissions</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Protocols</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={u.id} 
                  className="group"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'active' ? 'bg-emerald-500' : u.status === 'pending' ? 'bg-amber-500' : 'bg-slate-300'
                        }`} 
                      />
                      <span className="text-xs font-medium text-slate-600 capitalize">{u.status}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {u.status === 'pending' && (
                        <button 
                          onClick={() => approveUser(u.id)}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all active:scale-90"
                          title="Approve Account"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => openEdit(u)}
                        className="p-2 hover:bg-slate-50 text-slate-400 rounded-lg transition-all active:scale-90"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleStatus(u.id)}
                        className={`p-2 rounded-lg transition-all active:scale-90 ${
                          u.status === 'disabled' ? 'hover:bg-emerald-50 text-emerald-600' : 'hover:bg-red-50 text-red-400'
                        }`}
                        title={u.status === 'disabled' ? "Enable Account" : "Disable Account"}
                      >
                        {u.status === 'disabled' ? <Check className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      {/* EDIT DRAWER */}
      <AnimatePresence>
        {isEditing && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[110]"
            />
            {/* Slide-over Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[120] p-8 border-l border-slate-100"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Identity</h3>
                  <p className="text-[10px] font-bold text-emerald-600/40 uppercase tracking-widest">Protocol: Update_User_V2</p>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      defaultValue={selectedUser?.name}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="password" 
                      placeholder="Enter new password"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setIsEditing(false)}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full py-4 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all active:scale-95"
                  >
                    Commit Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}