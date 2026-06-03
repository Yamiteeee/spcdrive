'use client';

import { User, FileText, Globe, Clock, RefreshCw } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { Table } from '@/components/ui/Table';
import { DownloadLog } from '@/types/dashboard';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { useDownloadHistory } from '@/hooks/useDownloadHistory'; 

export function DownloadHistory() {
  const { colors } = useSPCTheme();
  // Pull the live database stream and tracking states directly into the component
  const { logs, loading, error, refreshLogs } = useDownloadHistory();

  const columns = [
    {
      header: 'Agent',
      render: (log: DownloadLog) => (
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          <span className="text-sm font-bold" style={{ color: colors.textMain }}>
            {log.user}
          </span>
        </div>
      )
    },
    {
      header: 'Asset Retrieved',
      render: (log: DownloadLog) => (
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />
          <span className="text-xs font-medium" style={{ color: colors.textMain }}>
            {log.file}
          </span>
        </div>
      )
    },
    {
      header: 'Network ID',
      render: (log: DownloadLog) => (
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 opacity-40" style={{ color: colors.textMuted }} />
          <code 
            className="text-[10px] px-1.5 py-0.5 rounded font-mono border"
            style={{ 
              backgroundColor: colors.background, 
              color: colors.textMuted,
              borderColor: colors.border
            }}
          >
            {log.ip}
          </code>
        </div>
      )
    },
    {
      header: 'Timestamp',
      render: (log: DownloadLog) => (
        <div className="flex items-center justify-end gap-2 opacity-60" style={{ color: colors.textMuted }}>
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-bold tabular-nums uppercase">
            {log.timestamp}
          </span>
        </div>
      )
    }
  ];

  // 1. Live Database Loading State Skeleton View
  if (loading && logs.length === 0) {
    return (
      <BentoCard title="Download Documentation" className="md:col-span-6">
        <div 
          className="flex flex-col items-center justify-center rounded-lg border border-dashed"
          style={{ 
            borderColor: colors.border, 
            backgroundColor: `${colors.background}80`,
            height: '200px' 
          }}
        >
          <RefreshCw className="w-5 h-5 animate-spin mb-2" style={{ color: colors.primary }} />
          <p className="text-[11px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Synchronizing Audit Logs...
          </p>
        </div>
      </BentoCard>
    );
  }

  // 2. Database Policy / Error Catch View
  if (error) {
    return (
      <BentoCard title="Download Documentation" className="md:col-span-6">
        <div 
          className="flex flex-col items-center justify-center rounded-lg border text-center p-4"
          style={{ 
            borderColor: colors.border, 
            backgroundColor: colors.background,
            height: '200px' 
          }}
        >
          <span className="text-[10px] font-mono text-red-500 mb-1">⚠️ AUDIT_LOG_STREAM_EXCEPTION</span>
          <p className="text-xs font-medium max-w-xs mb-3" style={{ color: colors.textMain }}>
            {error}
          </p>
          <button
            onClick={() => refreshLogs()}
            className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tight transition-all"
            style={{ backgroundColor: colors.primary, color: colors.background }}
          >
            Retry Connection
          </button>
        </div>
      </BentoCard>
    );
  }

  // 3. Complete Data Render View
  return (
    <BentoCard title="Download Documentation" className="md:col-span-6">
      {/* 🌟 FIX: Outer Flexbox engine combined with an explicit scroll viewport container */}
      <div className="flex flex-col h-full space-y-4">
        
        {/* Scrollable table bounding viewport */}
        <div className="grow overflow-y-auto max-h-105 pr-2 custom-scrollbar">
          <Table data={logs} columns={columns} />
        </div>
        
        {/* Specific Domain Footer - kept cleanly outside the scroll zone */}
        <div 
          className="pt-6 border-t flex items-center justify-between shrink-0"
          style={{ borderColor: colors.border }}
        >
          <p 
            className="text-[9px] font-black uppercase tracking-widest"
            style={{ color: `${colors.primary}66` }} 
          >
            Autosave: Documentation_Protocol_v4.log
          </p>
          
          <div className="flex items-center gap-2">
            {/* Live Status Indicator */}
            <div 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ 
                backgroundColor: colors.primary,
                boxShadow: `0 0 8px ${colors.primary}` 
              }} 
            />
            <span 
              className="text-[9px] font-bold uppercase tracking-tighter"
              style={{ color: colors.textMuted }}
            >
              Live Audit Active
            </span>
          </div>
        </div>

      </div>
    </BentoCard>
  );
}