import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

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
