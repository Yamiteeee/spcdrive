'use client';

import { motion, Variants } from 'framer-motion';
import { useSPCTheme } from '@/providers/ThemeProvider';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ icon, label, color, onClick, disabled }: ActionButtonProps) {
  const { colors, radius } = useSPCTheme();
  
  // Slide-in background color tint
  const bgVariants: Variants = {
    initial: { x: '-101%' },
    hover: { 
      x: '0%',
      transition: { type: 'spring', stiffness: 260, damping: 26 }
    },
  };

  // Outer Mask Container - Explicitly mapping states eliminates layout snapping on mount
  const wrapperVariants: Variants = {
    initial: { 
      width: 0, 
      opacity: 0,
      marginLeft: 0,
      transition: { duration: 0.12, ease: 'easeOut' }
    },
    hover: { 
      width: 'auto', 
      opacity: 1,
      marginLeft: 8,
      transition: { type: 'spring', stiffness: 230, damping: 22 }
    },
  };

  // Text sliding up from beneath the container mask 
  const textVariants: Variants = {
    initial: { y: '100%' },
    hover: { 
      y: '0%',
      transition: { type: 'spring', stiffness: 250, damping: 20 }
    },
  };

  return (
    <motion.button
      initial="initial"
      animate="initial" // Forcefully resets child elements to baseline settings on mount
      whileHover={disabled ? "initial" : "hover"} 
      whileTap={disabled ? {} : { scale: 0.95 }} 
      onClick={(e) => {
        e.stopPropagation(); // Prevents row selections or view changes from misfiring
        onClick();
      }}
      disabled={disabled}
      className={`relative flex items-center justify-center px-3 py-2 border overflow-hidden transition-colors duration-200 ${
        disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{ 
        borderRadius: radius.base, 
        borderColor: disabled ? `${colors.border}` : `${color}25`, 
        backgroundColor: colors.background 
      }}
    >
      {/* Slide-in Background Layer */}
      <motion.div 
        variants={bgVariants} 
        className="absolute inset-0 z-0 opacity-[0.08]" 
        style={{ backgroundColor: color }} 
      />

      {/* Icon Frame */}
      <span className="relative z-10 flex items-center justify-center shrink-0" style={{ color: color }}>
        {icon}
      </span>

      {/* Expandable Text Frame Mask */}
      <motion.span 
        variants={wrapperVariants}
        className="relative z-10 overflow-hidden h-2.75 leading-2.75 hidden lg:inline-block" 
        style={{ color: color, whiteSpace: 'nowrap' }}
      >
        <motion.div 
          variants={textVariants}
          className="text-[9px] font-black uppercase tracking-wider select-none"
        >
          {label}
        </motion.div>
      </motion.span>
    </motion.button>
  );
}