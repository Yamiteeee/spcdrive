'use client';

import { Layers, Clock, ArrowLeft, Terminal, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { updatesRegistry } from '@/data/updatesLog'; 
import { PageTransition } from '@/components/ui/PageTransition'; //  Imported your wrapper here

export default function VersionUpdatesPage() {
  const { colors, radius } = useSPCTheme();
  const router = useRouter();

  // Color mappings for each modification status pill
  const getTypeColors = (type: string) => {
    switch (type) {
      case 'feature': return { bg: `${colors.primary}15`, text: colors.primary, border: `${colors.primary}30` };
      case 'patch': return { bg: '#eab30815', text: '#eab308', border: '#eab30830' }; // Amber
      case 'security': return { bg: `${colors.danger}15`, text: colors.danger, border: `${colors.danger}30` };
      default: return { bg: `${colors.textMuted}15`, text: colors.textMuted, border: colors.border };
    }
  };

  return (
    <PageTransition> {/* 🌟 Wrapped whole content layout here */}
      <div className="space-y-6 flex flex-col h-full w-full max-w-full overflow-hidden p-4 sm:p-6">
        
        {/* Page Layout Header block */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center w-full border-b pb-4" style={{ borderColor: `${colors.border}60` }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 border transition-all active:scale-95 shrink-0"
              style={{ borderColor: colors.border, borderRadius: radius.base, color: colors.textMuted, backgroundColor: colors.card }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: colors.textMain }}>System Ledger</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: colors.textMuted }}>
                Deployment history, code optimizations, and structural change logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 border font-mono text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: `${colors.primary}30`, backgroundColor: `${colors.primary}05`, color: colors.primary, borderRadius: radius.base }}>
            <Terminal className="w-3.5 h-3.5" /> Core Release Framework: Active
          </div>
        </div>

        {/* Main Content Workspace Viewport Wrapper */}
        <div className="grow overflow-y-auto pr-1 sm:pr-2 custom-scrollbar space-y-4">
          {updatesRegistry.map((log) => (
            <div 
              key={log.id}
              className="border p-4 sm:p-5 relative transition-all"
              style={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.large }}
            >
              {/* Version Metadata Tag Header Line */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-3 mb-4" style={{ borderColor: `${colors.border}40` }}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 font-mono tracking-tight" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary, borderRadius: radius.base }}>
                    {log.version}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    Deployed: {log.deploymentDate}
                  </span>
                </div>
                <div className="text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 border self-start sm:self-auto" style={{ borderColor: colors.border, color: colors.textMuted, borderRadius: '4px' }}>
                  ENV // {log.environment}
                </div>
              </div>

              {/* Change Brief Section */}
              <div className="space-y-5">
                <div>
                  <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1" style={{ color: colors.textMuted }}>Release Summary</h4>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: colors.textMain }}>{log.summary}</p>
                </div>

                {/* Individual Detailed Technical Logs mapping */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>System Modification Logs</h4>
                  <div className="space-y-2">
                    {log.modifications.map((mod, i) => {
                      const statusColors = getTypeColors(mod.type);
                      return (
                        <div 
                          key={i} 
                          className="text-xs p-3 border font-mono flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 leading-relaxed wrap-break-word"
                          style={{ backgroundColor: `${colors.textMuted}05`, borderColor: colors.border, borderRadius: radius.base }}
                        >
                          {/* Tags and Context Labels */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span 
                              className="text-[9px] font-black uppercase px-1.5 py-0.5 tracking-tight border text-center min-w-16.25" 
                              style={{ backgroundColor: statusColors.bg, borderColor: statusColors.border, color: statusColors.text, borderRadius: '3px' }}
                            >
                              {mod.type}
                            </span>
                            <span className="font-bold whitespace-nowrap" style={{ color: colors.textMain }}>[{mod.scope}]</span>
                          </div>
                          
                          {/* Description text container */}
                          <div className="flex-1 min-w-0 md:pl-1 text-[11px] sm:text-xs font-medium" style={{ color: colors.textMain }}>
                            {mod.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}