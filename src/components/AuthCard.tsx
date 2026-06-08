'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AuthForm } from '@/components/ui/AuthForm';
import { AuthCardProps } from '@/types/auth';
import { useSPCTheme } from '@/providers/ThemeProvider';

export function AuthCard(props: AuthCardProps) {
  // 🌟 Clean mapping: Ensure we match your controller hooks perfectly
  const { isLogin, onToggle, onAuth, switching } = props;
  const { colors, radius } = useSPCTheme();

  return (
    <div className={`w-full max-w-md transition-all duration-500 ${switching ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
      
      {/* Brand Header */}
      <div className="flex justify-center mb-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div 
            className="relative w-11 h-11 border shadow-lg overflow-hidden transition-transform group-hover:scale-105"
            style={{ 
              backgroundColor: `${colors.card}33`, // 20% opacity card white
              borderColor: `${colors.card}33`,
              borderRadius: '1rem' 
            }}
          >
            <Image 
              src="/assets/SPCLOGO.avif" 
              alt="Logo" 
              fill 
              sizes="44px" 
              className="object-contain p-2" 
            />
          </div>
          <span className="font-black text-xl tracking-tight text-white drop-shadow-md">
            SPC <span style={{ color: colors.primary }}>Drive</span>
          </span>
        </Link>
      </div>

      {/* Main Auth Form UI */}
      <AuthForm 
        {...props} //  Automatically flows name, setName, email, and password down!
        title={isLogin ? 'Welcome back' : 'Join SPC Drive'}
        subtitle={isLogin ? 'Sign in to workspace' : 'Create workspace'}
        submitLabel={isLogin ? 'ACCESS SYSTEM' : 'INITIALIZE ACCOUNT'}
        onAuth={onAuth} // Explicitly safeguards callback routing context
        footerAction={
          <button 
            onClick={onToggle} // Explicitly safeguards view toggling callback routing context
            className="text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            style={{ color: `${colors.card}66` }} 
            onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = `${colors.card}66`}
          >
            {isLogin ? "Generate new credentials?" : "Existing operative? Sign in"}
          </button>
        }
      />
      
      {/* Security Disclaimer */}
      <p 
        className="text-center mt-8 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30"
        style={{ color: colors.card }}
      >
        Encrypted Node Access • Protocol v4.0
      </p>
    </div>
  );
}