'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserManagementData } from '@/types/dashboard';
import { createClient } from '@/utils/supabase/client';
import { adminResetUserPassword } from '@/actions/adminAuth'; // 🌟 Import our new Server Action brain layer

const supabase = createClient();

interface SearchSyncParams {
  query?: string;
  setQuery?: (q: string) => void;
}

export function useUserManagement(searchSync?: SearchSyncParams) {
  const [users, setUsers] = useState<UserManagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagementData | null>(null);
  const [isActionProcessing, setIsActionProcessing] = useState(false); 

  const [formData, setFormData] = useState<UserManagementData | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // 1. FETCH USERS: Pulls direct directory lists from public.profiles
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, email, role, status')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      console.log("🚨 [STEP 1] RAW DATABASE PAYLOAD FROM SUPABASE:", data);

      const normalizedUsers = (data || []).map(user => ({
        id: user.id,
        name: user.name?.trim() || 'Pending Registration',
        email: user.email?.trim() || 'No Email Provided',
        role: user.role || 'user',
        status: (user.status || 'pending').toLowerCase().trim() as any
      }));

      console.log("🚨 [STEP 2] FRONTEND NORMALIZED USERS ARRAY:", normalizedUsers);

      const pendingCount = normalizedUsers.filter(u => u.status === 'pending').length;
      console.log(`💡 [DIAGNOSTIC] Found ${pendingCount} pending accounts in normalized array.`);

      setUsers(normalizedUsers);
    } catch (err: any) {
      console.error('Failed to load user directory:', err);
      setError(err.message || 'Could not synchronize user database.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Synchronize database records on component lifecycle mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    console.log("🚨 [STEP 3] SEARCH LAYOUT INTERACTION:", {
      hasSearchSyncObj: !!searchSync,
      currentSearchValue: searchSync?.query,
      isSetQueryAFunction: typeof searchSync?.setQuery === 'function'
    });

    if (searchSync && typeof searchSync.setQuery === 'function') {
      if (searchSync.query && searchSync.query.trim() !== '') {
        console.log(`⚡ Syncing active search query cache: "${searchSync.query}"`);
        searchSync.setQuery(searchSync.query);
      }
    }
  }, [users, searchSync]);

  // Monitor current working user target updates to synchronize form staging fields
  useEffect(() => {
    if (selectedUser) {
      setFormData({ ...selectedUser });
      setNewPassword(''); 
    } else {
      setFormData(null);
      setNewPassword('');
    }
  }, [selectedUser]);

  // 2. TOGGLE STATUS: Suspends or activates user access privileges
  const toggleStatus = async (id: string) => {
    try {
      setError(null);
      setIsActionProcessing(true);
      const currentUser = users.find(u => u.id === id);
      if (!currentUser) return;

      const nextStatus = currentUser.status === 'active' ? 'disabled' : 'active';

      const { data: updatedRows, error: dbError } = await supabase
        .from('profiles')
        .update({ status: nextStatus })
        .eq('id', id)
        .select();

      if (dbError) throw dbError;
      
      if (updatedRows && updatedRows.length > 0) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedRows[0] } : u));
      }
    } catch (err: any) {
      console.error('Status modification failed:', err);
      setError(err.message || 'Failed to update user account status.');
    } finally {
      setIsActionProcessing(false);
    }
  };

  // 3. APPROVE/ACTIVATE USER: Switches a pending registration to active status instantly
  const approveUser = async (id: string) => {
    try {
      setError(null);
      setIsActionProcessing(true);
      
      const { data: updatedRows, error: dbError } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', id)
        .select();

      if (dbError) throw dbError;

      if (!updatedRows || updatedRows.length === 0) {
        throw new Error("No record data rows were modified. Verify permissions layout.");
      }

      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedRows[0] } : u));
      alert("Operative account verified and activated successfully.");
    } catch (err: any) {
      console.error('User approval failed:', err);
      setError(err.message || 'Failed to execute user validation change.');
      alert(`Approval Failed: ${err.message}`);
    } finally {
      setIsActionProcessing(false);
    }
  };

  // 4. UPDATE USER DETAILS: Handles administrative profiling updates
  const updateUserDetails = async (updatedUser: UserManagementData) => {
    try {
      setIsActionProcessing(true);
      setError(null);

      const { data: updatedRows, error: dbError } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          role: updatedUser.role,
          status: updatedUser.status
        })
        .eq('id', updatedUser.id)
        .select();

      if (dbError) throw dbError;

      if (!updatedRows || updatedRows.length === 0) {
        throw new Error("No database rows were modified. Check Row-Level Security parameters.");
      }

      setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedRows[0] } : u));
      closeEdit();
    } catch (err: any) {
      console.error('Profile adjustment transaction rejected:', err);
      setError(err.message || 'Failed to apply profile changes to database.');
      alert(`Save Rejected: ${err.message}`);
    } finally {
      setIsActionProcessing(false);
    }
  };

 const updateUserPassword = async (userId: string, newPasswordString: string) => {
    try {
      setIsActionProcessing(true);
      setError(null);

      if (newPasswordString.trim().length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser && authUser.id === userId) {
        const { error: authError } = await supabase.auth.updateUser({
          password: newPasswordString
        });
        if (authError) throw authError;
      } else {
        const result = await adminResetUserPassword(userId, newPasswordString);
        if (!result.success) {
          throw new Error(result.message);
        }
      }

      // 🛑 REMOVED THE OLD WINDOW.ALERT() LINE FROM HERE!

    } catch (err: any) {
      console.error('Password reset credentials rejected:', err);
      setError(err.message || 'Security credential propagation failed.');
      // alert(`Password Error: ${err.message}`); // 🛑 Also remove this error alert since modal handles it!
      throw err;
    } finally {
      setIsActionProcessing(false);
    }
  };

  const commitAdministrativeChanges = async () => {
    if (!formData) return;
    try {
      await updateUserDetails(formData);
      if (newPassword.trim() !== '') {
        await updateUserPassword(formData.id, newPassword.trim());
      }
      await fetchUsers();
    } catch (err) {
      console.error("Hook administrative save execution failed:", err);
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
    isActionProcessing,
    formData,
    setFormData,
    newPassword,
    setNewPassword,
    toggleStatus,
    approveUser,
    updateUserDetails,
    updateUserPassword, 
    commitChanges: commitAdministrativeChanges,
    openEdit,
    closeEdit,
    refreshUsers: fetchUsers
  };
}