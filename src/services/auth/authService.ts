import { removeAccessToken, saveAccessToken } from '@/utils/auth';
import { apiRequest } from '../api/client';

export type LoginRequest = {
  email: string;
  password: string;
  deviceType?: string;
  ipAddress?: string;
  userAgent?: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
  refreshToken: string;
};

/**
 * Login user
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>({
    path: '/auth/login',
    method: 'POST',
    body: credentials,
  });

  // Save access token to localStorage
  if (response.accessToken) {
    saveAccessToken(response.accessToken);
  }

  return response;
}

/**
 * Register new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>({
    path: '/auth/register',
    method: 'POST',
    body: data,
  });

  // Save access token to localStorage
  if (response.accessToken) {
    saveAccessToken(response.accessToken);
  }

  return response;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiRequest({
      path: '/auth/logout',
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove token from localStorage
    removeAccessToken();
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await apiRequest<{ accessToken: string; refreshToken: string }>({
    path: '/auth/refresh',
    method: 'POST',
    body: { refreshToken },
  });

  // Save new access token
  if (response.accessToken) {
    saveAccessToken(response.accessToken);
  }

  return response;
}
