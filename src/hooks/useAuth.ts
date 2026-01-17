import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/authService';
import { useAuthStore } from '@/stores/authStore';

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

/**
 * Hook để register user mới
 */
export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: response => {
      // Chỉ lưu user info, tokens đã trong httpOnly cookie
      setAuth(response.user);

      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Register failed:', error);
    },
  });
}

/**
 * Hook để login user
 */
export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: response => {
      // Chỉ lưu user info, tokens đã trong httpOnly cookie
      setAuth(response.user);

      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
    },
  });
}

/**
 * Hook để logout user
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore(state => state.clearAuth);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear auth state
      clearAuth();

      // Clear all queries
      queryClient.clear();

      // Redirect to login
      router.push('/sign-in');
    },
    onError: (error: Error) => {
      console.error('Logout failed:', error);
      // Still clear auth even if API call fails
      clearAuth();
      router.push('/sign-in');
    },
  });
}

/**
 * Hook để get user profile
 */
export function useProfile() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook để check authentication status
 */
export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();

  return {
    user,
    isAuthenticated,
  };
}
