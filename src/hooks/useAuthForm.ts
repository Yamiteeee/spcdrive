'use client';

import { useState } from 'react';
import { useMockAuth } from './useMockAuth';

export function useAuthForm() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [switching, setSwitching] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { login, signUp, loading, error: authError } = useMockAuth();

  const handleAuth = async (): Promise<void> => {
    setLocalError(null);
    
    // 1. Client-Side Validation Guards
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setLocalError("Please fill out all required authentication fields.");
      return;
    }

    if (!isLogin && !name.trim()) {
      setLocalError("An operations identity name is required for registration.");
      return;
    }

    try {
      if (isLogin) {
        // Execute the cache-purged login engine stream
        await login(cleanEmail, cleanPassword);
      } else {
        // Pass clean parameters for fresh account registration
        await signUp(cleanEmail, cleanPassword, name.trim());
      }
    } catch (err: any) {
      console.error("Critical Exception during Form Submission:", err);
      setLocalError("CRITICAL NET HANDSHAKE ERROR: Connection interrupted.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !loading) {
      handleAuth();
    }
  };

  const toggleMode = (): void => {
    setSwitching(true);
    setLocalError(null);
    setTimeout(() => {
      setIsLogin((p) => !p);
      // Clean sensitive credentials dynamically across mode swaps
      setPassword('');
      setName('');
      setSwitching(false);
    }, 200);
  };

  // Combine hook errors and local client-side validation errors seamlessly
  const displayError = localError || authError;

  return {
    isLogin, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    name, 
    setName,
    switching, 
    loading, 
    error: displayError, // Binds unified errors right to your UI alert display components
    handleAuth, 
    toggleMode, 
    handleKeyDown
  };
}