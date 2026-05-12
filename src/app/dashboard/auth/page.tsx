'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useMockAuth } from '@/hooks/useMockAuth';
import { AuthCard } from '@/components/AuthCard';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [switching, setSwitching] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { login, loading, error } = useMockAuth();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleAuth = async () => {
    // Basic logic: jason@test triggers admin, anything else is user
    const role = email.includes('admin') || email === 'jason@test' ? 'admin' : 'user';
    await login(role, password);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleAuth();
  };

  const toggleMode = () => {
    setSwitching(true);
    setTimeout(() => {
      setIsLogin((p) => !p);
      setSwitching(false);
    }, 180);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 font-sans overflow-hidden">
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/green.png"
          alt="Background"
          fill
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ANIMATED WRAPPER */}
      <div
        className={`w-full flex justify-center transition-all duration-700 ease-out 
        ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <AuthCard
          isLogin={isLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          error={error}
          switching={switching}
          onAuth={handleAuth}
          onToggle={toggleMode}
          onKeyDown={handleKeyDown}
        />
      </div>
    </main>
  );
}