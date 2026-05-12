'use client';
import { ReactNode, CSSProperties } from 'react';
import { useSPCTheme } from '@/providers/ThemeProvider';

export interface BentoProps {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: CSSProperties; 
}

export function BentoCard({ children, title, className = '', style }: BentoProps) {
  const { colors } = useSPCTheme();

  return (
    <div 
      style={style}
      className={`
        relative overflow-hidden p-8 rounded-4xl 
        border border-white bg-white/70 backdrop-blur-md
        shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 
        transition-all duration-500
        ${className}
      `}
    >
      {/* Subtle Soft Glow - Fixed arbitrary rounded value to match outer card */}
      <div className="absolute inset-px rounded-[calc(2rem-1px)] border border-white/50 pointer-events-none" />
      
      {title && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Using theme primary color for the dot */}
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: `${colors.primary}4d` }} // 30% opacity
            />
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              {title}
            </h3>
          </div>
          {/* Linter Fix: h-px instead of h-[1px], grow instead of flex-grow */}
          <div className="h-px grow ml-4 bg-slate-100/50" />
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}