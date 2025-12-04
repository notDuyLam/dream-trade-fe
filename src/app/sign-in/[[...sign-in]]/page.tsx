import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Access your DreamTrade workspace. (Mock UI only, auth disabled)',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/40">
        <header className="space-y-1 text-center">
          <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">
            Authentication disabled
          </p>
          <h1 className="text-2xl font-semibold text-white">Mock sign-in</h1>
          <p className="text-xs text-slate-400">
            This project is frontend-only. Replace this screen with your real auth later.
          </p>
        </header>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 ring-0 outline-none focus:border-emerald-400"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 ring-0 outline-none focus:border-emerald-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
          >
            Continue (mock)
          </button>
        </form>
      </div>
    </div>
  );
}
