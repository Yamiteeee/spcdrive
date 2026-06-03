'use client';

import { useState } from 'react';
import { UserManagementData } from '@/types/dashboard';

interface UseUserApprovalProps {
  allUsers: UserManagementData[];
  filteredUsers: UserManagementData[];
  onConfirmApprove: (id: string) => Promise<void> | void;
}

export function useUserApproval({ allUsers, filteredUsers, onConfirmApprove }: UseUserApprovalProps) {
  const [approvingUser, setApprovingUser] = useState<UserManagementData | null>(null);

  const openApproval = (incomingUser: any) => {
    console.log("🎯 Raw Incoming User Row Parameter:", incomingUser);
    
    if (!incomingUser) return;

    let targetId = '';

    // 🌟 BRAIN CORRECTION: Check if incoming parameter is a string ID or a structured object
    if (typeof incomingUser === 'string') {
      targetId = incomingUser;
    } else {
      targetId = incomingUser?.id || incomingUser?.['_id'] || incomingUser?.uid;
    }

    if (!targetId) {
      console.warn("⚠️ No valid ID could be parsed from row parameters!");
      setApprovingUser(incomingUser);
      return;
    }

    // Direct lookup across state arrays using our clean string targetId
    const masterMatch = allUsers?.find((u: any) => (u?.id || u?.['_id']) === targetId);
    const searchMatch = filteredUsers?.find((u: any) => (u?.id || u?.['_id']) === targetId);

    const resolvedUser = masterMatch || searchMatch;

    if (!resolvedUser) {
      console.warn(`⚠️ Could not find user with ID ${targetId} in state arrays. Fallback applied.`);
      // If we only have a string ID and can't find the user profile, create a stub so it doesn't crash
      setApprovingUser({ id: targetId, name: 'Unknown Operator', email: 'N/A', role: 'N/A' } as any);
      return;
    }
    
    console.log("🛡️ Hook Brain Successfully Resolved Profile:", resolvedUser);
    setApprovingUser(resolvedUser);
  };

  const closeApproval = () => {
    setApprovingUser(null);
  };

  return {
    isOpen: approvingUser !== null,
    approvingUser,
    openApproval,
    closeApproval,
  };
}