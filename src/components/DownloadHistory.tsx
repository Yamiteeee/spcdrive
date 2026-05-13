'use client';
import { User, FileText, Globe, Clock } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { Table } from '@/components/ui/Table'; // Import our generic table
import { DownloadLog } from '@/types/dashboard';

interface DownloadHistoryProps {
  logs: DownloadLog[];
}

export function DownloadHistory({ logs }: DownloadHistoryProps) {
  // Define columns for our generic table
  const columns = [
    {
      header: 'Agent',
      render: (log: DownloadLog) => (
        <div className="flex items-center gap-2">
          <User className="w-3 h-3 text-emerald-500" />
          <span className="text-sm font-bold text-slate-900">{log.user}</span>
        </div>
      )
    },
    {
      header: 'Asset Retrieved',
      render: (log: DownloadLog) => (
        <div className="flex items-center gap-2">
          <FileText className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-600 font-medium">{log.file}</span>
        </div>
      )
    },
    {
      header: 'Network ID',
      render: (log: DownloadLog) => (
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-slate-300" />
          <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
            {log.ip}
          </code>
        </div>
      )
    },
    {
      header: 'Timestamp',
      render: (log: DownloadLog) => (
        <div className="flex items-center justify-end gap-2 text-slate-400">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-bold tabular-nums uppercase">{log.timestamp}</span>
        </div>
      )
    }
  ];

  return (
    <BentoCard title="Download Documentation" className="md:col-span-6">
      {/* Generic UI Table component handles the layout & animations */}
      <Table data={logs} columns={columns} />
      
      {/* Specific Domain Footer - Keep this here! */}
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