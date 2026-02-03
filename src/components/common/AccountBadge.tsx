'use client';

import React from 'react';

type AccountType = 'regular' | 'vip';

interface AccountBadgeProps {
  accountType: AccountType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Component hiển thị badge cho account type (VIP/Regular)
 */
export const AccountBadge: React.FC<AccountBadgeProps> = ({ 
  accountType, 
  className = '',
  size = 'md' 
}) => {
  const isVip = accountType === 'vip';
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const baseClasses = 'inline-flex items-center gap-1 font-semibold rounded-full transition-all duration-200';
  
  const variantClasses = isVip
    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/70'
    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses} ${className}`}>
      <span>{isVip ? '👑' : '👤'}</span>
      <span>{isVip ? 'VIP' : 'Regular'}</span>
    </span>
  );
};

/**
 * Hook để check account type
 */
export const useAccountType = (accountType?: AccountType) => {
  return {
    isVip: accountType === 'vip',
    isRegular: accountType === 'regular',
    badge: accountType === 'vip' ? '👑 VIP' : '👤 Regular',
    color: accountType === 'vip' ? 'gold' : 'gray',
  };
};
