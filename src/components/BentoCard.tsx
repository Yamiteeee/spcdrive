import { ReactNode, CSSProperties } from 'react'; // 1. Import CSSProperties

interface BentoProps {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: CSSProperties; // 2. Add this line here
}

export function BentoCard({ children, title, className, style }: BentoProps) {
  return (
    <div 
      style={style} // 3. Pass the style prop to the div
      className={`p-8 rounded-[2.5rem] border ${className}`}
    >
      {title && (
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}