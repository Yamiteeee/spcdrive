export type UserRole = 'admin' | 'user';

export interface SPCUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}