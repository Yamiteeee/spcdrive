export type UserRole = 'admin' | 'user';

export interface SPCUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface AuthState {
  user: SPCUser | null;
  loading: boolean;
  error: string | null;
}

export interface AuthCardProps {
  isLogin: boolean;
  email: string;
  setEmail: (val: string) => void;
  password: string; // 🌟 ADDED NAME STATE CAPABILITIES BELOW:
  setPassword: (val: string) => void;
  name: string;               
  setName: (val: string) => void; 
  loading: boolean;
  error: string | null;
  switching: boolean;
  onAuth: () => void;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void; 
}