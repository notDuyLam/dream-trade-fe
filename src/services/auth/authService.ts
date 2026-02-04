import { apiRequest } from '@/services/api/client';

export type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'regular' | 'vip';
  isVerified?: boolean;
  avatar?: string;
};

export type AuthResponse = {
  user: User;
  // Tokens are now in httpOnly cookies, not returned in response
};

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiRequest<AuthResponse, RegisterData>({
      path: '/auth/register',
      method: 'POST',
      body: data,
    });
  },

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    return apiRequest<AuthResponse, LoginData>({
      path: '/auth/login',
      method: 'POST',
      body: data,
    });
  },

  /**
   * Refresh access token (uses refreshToken from httpOnly cookie)
   */
  async refreshToken(): Promise<AuthResponse> {
    return apiRequest<AuthResponse>({ 
      path: '/auth/refresh', 
      method: 'POST',
      body: {} // refreshToken lấy từ cookie
    });
  },

  /**
   * Get user profile (authentication via cookie)
   */
  async getProfile(): Promise<User> {
    return apiRequest<User>({ path: '/auth/profile', method: 'GET' });
  },

  /**
   * Logout user (cookies cleared by backend)
   */
  async logout(): Promise<void> {
    try {
      await apiRequest<void>({
        path: '/auth/logout',
        method: 'POST',
      });
    } catch (error) {
      // Ignore 401 errors during logout - user is already logged out
      console.warn('Logout request failed (already logged out?):', error);
    }
  },

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiRequest<void>({
      path: '/auth/change-password',
      method: 'POST',
      body: { oldPassword, newPassword },
    });
  },

  /**
   * Login with Google
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse, { idToken: string }>({
      path: '/auth/google',
      method: 'POST',
      body: { idToken },
    });
  },
};
