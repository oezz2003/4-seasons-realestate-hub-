'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyToken, logout } from '@/store/slices/authSlice';
import { tokenStorage } from '@/lib/auth-api';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = tokenStorage.get();
    if (storedToken && !isAuthenticated && !isLoading) {
      dispatch(verifyToken(storedToken));
    }
  }, [dispatch, isAuthenticated, isLoading]);

  const handleLogout = () => {
    dispatch(logout());
    // Clear any additional stored data
    localStorage.removeItem('authToken');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    logout: handleLogout,
  };
}

