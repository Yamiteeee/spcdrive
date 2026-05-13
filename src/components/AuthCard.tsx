'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AuthForm } from '@/components/ui/AuthForm';
import { AuthCardProps } from '@/types/auth';

export function AuthCard(props: AuthCardProps) {
  const { isLogin, onToggle, switching } = props;

  return (
    <div className={`w-full max-w-md transition-all duration-300 ${switching ? 'opacity-0 scale-95' : 'opacity-100'}`}>
      {/* Brand Header */}
      <div className="flex justify-center mb-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-white/20 border border-white/20 shadow-lg overflow-hidden transition-transform group-hover:scale-105">
            <Image src="/assets/SPCLOGO.avif" alt="Logo" fill className="object-contain p-2" />
          </div>
          <span className="font-black text-xl tracking-tight text-white drop-shadow">
            SPC <span className="text-emerald-300">Drive</span>
          </span>
        </Link>
      </div>

      {/* Using the Generic UI */}
      <AuthForm 
        {...props}
        title={isLogin ? 'Welcome back' : 'Join SPC Drive'}
        subtitle={isLogin ? 'Sign in to workspace' : 'Create workspace'}
        submitLabel={isLogin ? 'ACCESS SYSTEM' : 'INITIALIZE ACCOUNT'}
        footerAction={
          <button 
            onClick={onToggle} 
            className="text-xs font-black text-white/40 hover:text-emerald-300 uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Generate new credentials?" : "Existing operative? Sign in"}
          </button>
        }
      />
    </div>
  );
}