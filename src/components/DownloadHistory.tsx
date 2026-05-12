'use client';
import { motion } from 'framer-motion';
import { Download, User, FileText, Globe, Clock } from 'lucide-react';
import { BentoCard } from './BentoCard';

const downloadLogs = [
  { id: 1, user: 'Sarah Smith', file: 'SPC_System_Core_v2.bin', timestamp: '2026-05-12 14:20:01', ip: '192.168.1.45', status: 'verified' },
  { id: 2, user: 'Mike Ross', file: 'Database_Backup_May.sql', timestamp: '2026-05-12 12:05:44', ip: '102.44.12.190', status: 'verified' },
  { id: 3, user: 'John Doe', file: 'UI_Brand_Guidelines.pdf', timestamp: '2026-05-11 09:15:30', ip: '172.16.254.1', status: 'verified' },
  { id: 4, user: 'Sarah Smith', file: 'UI_Brand_Guidelines.pdf', timestamp: '2026-05-11 08:30:12', ip: '192.168.1.45', status: 'verified' },
];

export function DownloadHistory() {
  return (
    <BentoCard title="Download Documentation" className="md:col-span-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-50">
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Agent</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Retrieved</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Network ID</th>
              <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {downloadLogs.map((log, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={log.id} 
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-900">{log.user}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-600 font-medium">{log.file}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-slate-300" />
                    <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                      {log.ip}
                    </code>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold tabular-nums uppercase">{log.timestamp}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Documentation Footer */}
      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
        <p className="text-[9px] font-black text-emerald-600/40 uppercase tracking-widest">
          Autosave: Documentation_Protocol_v4.log
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Live Audit Active</span>
        </div>
      </div>
    </BentoCard>
  );
}