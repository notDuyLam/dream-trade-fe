import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'regular' | 'vip';
  isVerified?: boolean;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,

      setAuth: user =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearAuth: () => {
        // Clear all browser storage
        if (typeof window !== 'undefined') {
          // 1. Clear localStorage (legacy - tokens are now in httpOnly cookies)
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('auth-storage');

          // 2. Clear sessionStorage
          sessionStorage.clear();

          // Note: httpOnly cookies are cleared by backend /auth/logout endpoint
          // JavaScript cannot access or delete httpOnly cookies
        }

        // 3. Clear Zustand state
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: userData =>
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
