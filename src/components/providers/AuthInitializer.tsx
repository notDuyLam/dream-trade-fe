'use client';

import { useEffect } from 'react';
import { authService } from '@/services/auth/authService';
import { useAuthStore } from '@/stores/authStore';

/**
 * AuthInitializer - Verifies session validity on app mount
 *
 * This component runs once when the app loads and checks if the user
 * has a valid session by calling the profile API endpoint.
 *
 * Flow:
 * 1. Check if Zustand has persisted user (isAuthenticated)
 * 2. If yes, verify httpOnly cookies are still valid
 * 3. Update auth state based on API response
 */
export function AuthInitializer() {
  const { isAuthenticated, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    // Only verify if user appears to be authenticated (from persisted state)
    if (!isAuthenticated) {
      return;
    }

    // Verify session by calling profile endpoint
    const verifySession = async () => {
      try {
        const user = await authService.getProfile();
        // Session is valid, update/sync user data
        setAuth(user);
      } catch (error) {
        // Session is invalid (401) or expired, clear auth state
        console.warn('Session verification failed, clearing auth:', error);
        clearAuth();
      }
    };

    verifySession();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This component doesn't render anything
  return null;
}
