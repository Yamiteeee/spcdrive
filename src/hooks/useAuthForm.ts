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
    
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // FALLBACK: If React state is caught in a stale closure, grab it directly from the DOM input element
    let finalName = name.trim();
    if (!isLogin && !finalName && typeof document !== 'undefined') {
      const nameInput = document.querySelector('input[placeholder="e.g., Agent Don"]') as HTMLInputElement;
      if (nameInput && nameInput.value) {
        finalName = nameInput.value.trim();
      }
    }

   

    if (!cleanEmail || !cleanPassword) {
      setLocalError("Please fill out all required authentication fields.");
      return;
    }

    if (!isLogin && !finalName) {
      setLocalError("An operations identity name is required for registration.");
      return;
    }

    try {
      if (isLogin) {
        await login(cleanEmail, cleanPassword);
      } else {
        // Pass the guaranteed extracted final name parameters safely
        await signUp(cleanEmail, cleanPassword, finalName);
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
      setPassword('');
      // REMOVED: setName(''); to stop it from wiping data out during state sync bumps
      setSwitching(false);
    }, 200);
  };

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
    error: displayError, 
    handleAuth, 
    toggleMode, 
    handleKeyDown
  };
}