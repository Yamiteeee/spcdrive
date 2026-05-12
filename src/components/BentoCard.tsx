'use client';
import { ReactNode, CSSProperties } from 'react';

export interface BentoProps {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: CSSProperties; 
}

export function BentoCard({ children, title, className = '', style }: BentoProps) {
  return (
    <div 
      style={style}
      className={`
        relative overflow-hidden p-8 rounded-[2.5rem] 
        border border-white bg-white/70 backdrop-blur-md
        shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 
        transition-all duration-500
        ${className}
      `}
    >
      {/* Subtle Soft Glow */}
      <div className="absolute inset-px rounded-[2.4rem] border border-white/50 pointer-events-none" />
      
      {title && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              {title}
            </h3>
          </div>
          <div className="h-[1px] flex-grow ml-4 bg-slate-100/50" />
        </div>
      )}
      
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}