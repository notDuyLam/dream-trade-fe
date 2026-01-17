import { apiRequest } from '@/services/api/client';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  // Tokens are now in httpOnly cookies, not returned in response
}

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
   * Get user profile (authentication via cookie)
   */
  async getProfile(): Promise<User> {
    return apiRequest<User>({ path: '/auth/profile', method: 'GET' });
  },

  /**
   * Logout user (cookies cleared by backend)
   */
  async logout(): Promise<void> {
    await apiRequest<void>({
      path: '/auth/logout',
      method: 'POST',
    });
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
};
