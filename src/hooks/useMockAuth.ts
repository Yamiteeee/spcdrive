import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SPCUser } from '@/types/auth';

export const useMockAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SPCUser | null>(null);
  const [error, setError] = useState<string | null>(null); // Added for feedback
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('spc_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Added 'password' parameter to the login function
  const login = async (role: 'admin' | 'user', password?: string) => {
    setLoading(true);
    setError(null);
    
    // Artificial delay for that "system processing" feel
    await new Promise(res => setTimeout(res, 800));
    
    // PASSWORD VALIDATION
    if (password !== '123123') {
      setError("INVALID ACCESS KEY");
      setLoading(false);
      return false; // Return false so the UI knows login failed
    }

    const mockUser: SPCUser = {
      id: role === 'admin' ? '1' : '2',
      email: role === 'admin' ? 'jason@spc.drive' : 'guest@spc.drive',
      name: role === 'admin' ? 'Jason Adrian' : 'Guest User',
      role: role,
    };

    localStorage.setItem('spc_session', JSON.stringify(mockUser));
    setUser(mockUser);
    router.push('/dashboard');
    setLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('spc_session');
    setUser(null);
    router.push('/dashboard/auth');
  };

  return { user, login, logout, loading, error };
};