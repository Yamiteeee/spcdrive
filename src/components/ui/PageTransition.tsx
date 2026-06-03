'use client';

import { motion, Variants } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Global, reusable workspace animation presets
const workspaceVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10, // Subtle slide-up to feel clean, crisp, and high-tech
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1], // Custom sleek cubic-bezier easing curve
    },
  },
  exit: {
    opacity: 0,
    y: -8, // Subtle slide-out upward
    transition: {
      duration: 0.18,
      ease: 'easeIn',
    },
  },
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={workspaceVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}