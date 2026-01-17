'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-8 shadow-2xl shadow-black/40">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">DREAM TRADE</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Sign in</p>
        </header>

        {error && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error.message || 'Login failed'}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300 uppercase">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 ring-0 outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300 uppercase">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 ring-0 outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 dark:bg-slate-900/70 px-2 text-slate-600 dark:text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <div className="space-y-2">
          <GoogleLoginButton
            onSuccess={user => {
              console.log('Google login successful:', user);
            }}
            onError={error => {
              console.error('Google login failed:', error);
            }}
          />
        </div>

        <p className="text-center text-xs text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <a href="/sign-up" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
