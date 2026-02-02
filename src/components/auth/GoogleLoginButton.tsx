'use client';

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useGoogleLogin } from '@/hooks/useAuth';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

type GoogleLoginButtonProps = {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
};

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const { mutate: googleLogin, isPending } = useGoogleLogin();

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (isPending) {
      return;
    }

    googleLogin(credentialResponse.credential, {
      onSuccess: (response) => {
        onSuccess?.(response.user);
      },
      onError: (error) => {
        onError?.(error instanceof Error ? error.message : 'Google login failed');
      },
    });
  };

  const handleGoogleError = () => {
    console.error('Google login error');
    onError?.('Google login failed');
  };

  if (!GOOGLE_CLIENT_ID) {
    // Google login is optional, return null quietly
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="relative w-full">
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-slate-900/50">
            <div className="text-sm text-white">Loading...</div>
          </div>
        )}
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap text="continue_with" width="100%" />
      </div>
    </GoogleOAuthProvider>
  );
}
