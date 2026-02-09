'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/auth/authService';
import { useAuthStore } from '@/stores/authStore';

/**
 * AuthInitializer - Verifies session validity on app mount
 *
 * This component runs once when the app loads and checks if the user
 * has a valid session by calling the profile API endpoint.
 *
 * Flow:
 * 1. Wait for Zustand persist to finish hydrating from localStorage
 * 2. Check if user was previously authenticated (persisted state)
 * 3. If yes, verify httpOnly cookies are still valid via /auth/profile
 * 4. Update auth state based on API response
 *
 * Note: This component does NOT redirect. Redirects after login are
 * handled by useLogin/useRegister hooks. This only refreshes auth state.
 */
export function AuthInitializer() {
  const [hasHydrated, setHasHydrated] = useState(false);

  // Step 1: Wait for Zustand persist to finish hydrating
  useEffect(() => {
    // If already hydrated before this effect runs
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }

    // Otherwise listen for hydration to complete
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return () => unsub();
  }, []);

  // Step 2: After hydration, verify session (no redirect)
  useEffect(() => {
    if (!hasHydrated) return;

    const { isAuthenticated, setAuth, clearAuth } = useAuthStore.getState();

    if (!isAuthenticated) {
      console.log('[AuthInit] Not authenticated after hydration, skipping');
      return;
    }

    console.log('[AuthInit] Verifying session...');

    const verifySession = async () => {
      try {
        const user = await authService.getProfile();
        console.log('[AuthInit] Session valid, user state refreshed');
        setAuth(user);
      } catch (error) {
        console.warn('[AuthInit] Session expired, clearing auth:', error);
        clearAuth();
      }
    };

    verifySession();
  }, [hasHydrated]);

  return null;
}
