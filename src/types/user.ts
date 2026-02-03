/**
 * User Account Types for Frontend
 * Types cho phân loại tài khoản thường và VIP
 */

export type AccountType = 'regular' | 'vip';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: AccountType;
  isVerified?: boolean;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UpdateAccountTypeRequest {
  accountType: AccountType;
}

export interface UpdateAccountTypeResponse {
  message: string;
  user: User;
}

/**
 * Helper functions để check account type
 */
export const isVipUser = (user: User | null | undefined): boolean => {
  return user?.accountType === 'vip';
};

export const isRegularUser = (user: User | null | undefined): boolean => {
  return user?.accountType === 'regular';
};

export const getAccountTypeBadge = (accountType: AccountType): string => {
  return accountType === 'vip' ? '👑 VIP' : '👤 Regular';
};

export const getAccountTypeColor = (accountType: AccountType): string => {
  return accountType === 'vip' ? 'gold' : 'gray';
};
