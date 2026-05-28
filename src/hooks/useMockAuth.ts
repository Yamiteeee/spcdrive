'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { SPCUser, UserRole } from '@/types/auth';

export function useMockAuth() {
  const [user, setUser] = useState<SPCUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // 1. Monitor Active Auth Session State
  useEffect(() => {
    const bootstrapSession = async () => {
      setLoading(true);
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, role, status')
        .eq('id', authUser.id)
        .maybeSingle(); // Safer parsing than .single() during hot-reloads

      if (profileError || !profile) {
        setError("PROFILE SEED ERROR: Security directory record missing.");
        setUser(null);
      } else if (profile.status !== 'active') {
        setError(`ACCESS DENIED: Account status is currently '${profile.status}'.`);
        setUser(null);
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          name: profile.name,
          role: profile.role as UserRole,
        });
      }
      setLoading(false);
    };

    bootstrapSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/dashboard/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  // 2. Real Login Stream Engine
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    // CRITICAL: Flush out any stale, broken session states before hitting the gate
    await supabase.auth.signOut();

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      setError(`SECURITY BREACH: ${loginError.message.toUpperCase()}`);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("AUTHENTICATION ERROR: User data could not be parsed.");
      setLoading(false);
      return;
    }

    // Give the database a brief moment to update before making the check
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Fetch parameters directly using the verified UUID returned from login session
    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('name, role, status')
      .eq('id', data.user.id)
      .maybeSingle();

    // 🔍 TESTING TELEMETRY: Open your F12 Browser Developer Console to inspect this!
    console.log("=== USER LOGIN DEBUG LOG ===");
    console.log("Authenticated User ID:", data.user.id);
    console.log("Fetched Profile Data Row:", profile);
    console.log("Fetch Error Context:", profileFetchError);

    if (profileFetchError || !profile) {
      setError("ACCESS DENIED: Database profile record not found.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile.status !== 'active') {
      setError(`ACCESS DENIED: Account authorization pending. Current status: '${profile.status}'`);
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Success: Hydrate local user state and route directly past the blocker
    setUser({
      id: data.user.id,
      email: data.user.email!,
      name: profile.name,
      role: profile.role as UserRole,
    });

    router.push(profile.role === 'admin' ? '/dashboard' : '/dashboard/user');
    setLoading(false);
  };

  // 📥 NEW: Sign Up/Registration Stream Engine
  const signUp = async (email: string, password: string, name: string = "New Operative") => {
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (signUpError) {
      setError(`REGISTRATION FAILURE: ${signUpError.message.toUpperCase()}`);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.status === 'active') {
        router.push(profile.role === 'admin' ? '/dashboard' : '/dashboard/user');
      } else {
        setError("REGISTRATION SUCCESSFUL. ACCESS PENDING ADMIN APPROVAL.");
      }
    }
    
    setLoading(false);
  };

  // 3. Clear Active Instance Sessions
  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/dashboard/auth');
  };

  return { user, loading, error, login, signUp, logout };
}