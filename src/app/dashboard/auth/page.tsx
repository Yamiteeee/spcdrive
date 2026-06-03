'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AuthCard } from '@/components/AuthCard';
import { useAuthForm } from '@/hooks/useAuthForm';
import { ThemeProvider, useSPCTheme } from '@/providers/ThemeProvider';

function AuthContent() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const form = useAuthForm();
  const theme = useSPCTheme();
  
  // 🌟 Instantiate local state tracking for registration names
  const [name, setName] = useState('');

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    /* We use bg-transparent here to ensure the 
        ThemeProvider doesn't block the Image 
    */
    <main 
      className="relative min-h-screen flex items-center justify-center px-6 font-sans overflow-hidden bg-transparent"
      onKeyDown={form.handleKeyDown}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 -z-20">
        <Image 
          src="/assets/green.png" 
          alt="Background" 
          fill 
          priority 
          sizes="100vw"
          className="object-cover scale-105" 
        />
      </div>

      {/* Dark Blur Overlay Layer */}
      <div 
        className="absolute inset-0 -z-10 backdrop-blur-[2px]"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }} 
      />

      {/* Auth Card Content */}
      <div className={`w-full flex justify-center transition-all duration-1000 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <AuthCard
          isLogin={form.isLogin}
          email={form.email}
          setEmail={form.setEmail}
          password={form.password}
          setPassword={form.setPassword}
          name={name}        // 🌟 Binds your new local string state variable
          setName={setName}  // 🌟 Binds your new React state state dispatcher hook
          loading={form.loading}
          error={form.error}
          switching={form.switching}
          onAuth={form.handleAuth}
          onToggle={form.toggleMode}
          onKeyDown={form.handleKeyDown}
        />
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-40">
        <div 
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: '#ffffff' }}
        />
        <span 
          className="text-[10px] font-black uppercase tracking-[0.4em]"
          style={{ color: '#ffffff' }}
        >
          Secure Access Protocol Active
        </span>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    /* We force the background color to transparent on the wrapper 
       so it doesn't cover your asset image.
    */
    <div style={{ backgroundColor: 'transparent' }}>
      <ThemeProvider mode="auth">
        <style jsx global>{`
          .theme-wrapper {
            background-color: transparent !important;
          }
        `}</style>
        <AuthContent />
      </ThemeProvider>
    </div>
  );
}