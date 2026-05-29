'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserManagementData } from '@/types/dashboard';
import { createClient } from '@/utils/supabase/client';

export function useUserManagement() {
  const [users, setUsers] = useState<UserManagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagementData | null>(null);

  const supabase = createClient();

  // 1. FETCH USERS: Pulls directory list directly from your public.profiles table
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, email, role, status')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err: any) {
      console.error('Failed to load user directory:', err);
      setError(err.message || 'Could not synchronize user database.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Synchronize on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 2. TOGGLE STATUS: Suspends or activates users directly in PostgreSQL
  const toggleStatus = async (id: string) => {
    try {
      setError(null);
      const currentUser = users.find(u => u.id === id);
      if (!currentUser) return;

      const nextStatus = currentUser.status === 'active' ? 'disabled' : 'active';

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ status: nextStatus })
        .eq('id', id);

      if (dbError) throw dbError;

      // Optimistic state updates
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    } catch (err: any) {
      console.error('Status modification failed:', err);
      setError(err.message || 'Failed to update user account status.');
    }
  };

  // 3. APPROVE USER: Toggles a pending user account to active instantly
  const approveUser = async (id: string) => {
    try {
      setError(null);
      
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', id);

      if (dbError) throw dbError;

      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
    } catch (err: any) {
      console.error('User approval failed:', err);
      setError(err.message || 'Failed to execute user validation change.');
    }
  };

  // 4. UPDATE USER DETAILS: Saves administrative edits safely to the profiles relation
  const updateUserDetails = async (updatedUser: UserManagementData) => {
    try {
      setLoading(true);
      setError(null);

      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          status: updatedUser.status
        })
        .eq('id', updatedUser.id);

      if (dbError) throw dbError;

      // Merge backend changes into current local state
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
      closeEdit();
    } catch (err: any) {
      console.error('Profile adjustment transaction rejected:', err);
      setError(err.message || 'Failed to apply profile changes to database.');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (user: UserManagementData) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const closeEdit = () => {
    setSelectedUser(null);
    setIsEditing(false);
  };

  return {
    users,
    loading,
    error,
    isEditing,
    selectedUser,
    toggleStatus,
    approveUser,
    updateUserDetails,
    openEdit,
    closeEdit,
    refreshUsers: fetchUsers
  };
}