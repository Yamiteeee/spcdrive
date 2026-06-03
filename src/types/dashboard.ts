import { ReactNode, CSSProperties } from 'react';
import { UserRole } from './auth';

// Component Props
export interface BentoProps {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export interface DashboardShellProps {
  children: ReactNode;
  title: string;
  role: UserRole;
  userName: string;
  onLogout: () => void;
}

// Data Models

// 1. Fixed: Only one clean FileItem declaration containing the url property
export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;        
  category: string;
  updatedAt: string;
}

export interface DownloadLog {
  id: number;
  user: string;
  file: string;
  timestamp: string;
  ip: string;
  status: 'verified' | 'failed';
}

// 2. Restored: UserManagementData is back so your user hooks can read it!
export interface UserManagementData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'disabled';
}

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (fileData: FileItem) => void;
}