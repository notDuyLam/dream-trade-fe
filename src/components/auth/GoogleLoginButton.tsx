'use client';

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

type GoogleLoginButtonProps = {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
};

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (isLoading) {
      return;
    } // Prevent multiple clicks

    setIsLoading(true);

    // Send ID token to backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        idToken: credentialResponse.credential,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Google login failed');
        }
        return response.json();
      })
      .then((data) => {
        // Store tokens in localStorage (or use context/state management)
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(data.user);
        }

        // Redirect to dashboard
        router.push('/dashboard');
      })
      .catch((error) => {
        console.error('Google login error:', error);
        if (onError) {
          onError(error instanceof Error ? error.message : 'Google login failed');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleError = () => {
    console.error('Google login error');
    if (onError) {
      onError('Google login failed');
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    console.error('Google Client ID is not configured');
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="relative w-full">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-slate-900/50">
            <div className="text-sm text-white">Loading...</div>
          </div>
        )}
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap text="continue_with" width="100%" />
      </div>
    </GoogleOAuthProvider>
  );
}
