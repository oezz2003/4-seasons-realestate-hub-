import { useSession, signOut } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
  };
}

