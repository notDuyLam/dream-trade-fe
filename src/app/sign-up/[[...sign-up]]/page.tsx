'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRegister } from '@/hooks/useAuth';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    register(formData);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-300 bg-slate-50 p-8 shadow-2xl shadow-black/40 dark:border-slate-800 dark:bg-slate-900/70">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Sign up to start trading</p>
        </header>

        {error && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error.message || 'Registration failed'}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                First name
              </label>
              <input
                id="firstName"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-0 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50 dark:focus:border-emerald-400"
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                Last name
              </label>
              <input
                id="lastName"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-0 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50 dark:focus:border-emerald-400"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-0 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50 dark:focus:border-emerald-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-0 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50 dark:focus:border-emerald-400"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 dark:text-slate-400">
          Already have an account?
          {' '}
          <Link href="/sign-in" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
