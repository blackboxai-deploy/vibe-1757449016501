'use client';

import { useState, useCallback } from 'react';
import { User } from '@/types';
import { mockUsers, currentUserId } from '@/lib/mockData';

export function useUsers() {
  const [users] = useState<User[]>(mockUsers);
  const [currentUser] = useState<User>(mockUsers.find(u => u.id === currentUserId)!);

  const getUserById = useCallback((id: string): User | undefined => {
    return users.find(user => user.id === id);
  }, [users]);

  const getOtherUsers = useCallback((): User[] => {
    return users.filter(user => user.id !== currentUserId);
  }, [users]);

  const getUsersById = useCallback((ids: string[]): User[] => {
    return users.filter(user => ids.includes(user.id));
  }, [users]);

  const getOnlineUsers = useCallback((): User[] => {
    return users.filter(user => user.status === 'online' && user.id !== currentUserId);
  }, [users]);

  return {
    users,
    currentUser,
    getUserById,
    getOtherUsers,
    getUsersById,
    getOnlineUsers
  };
}