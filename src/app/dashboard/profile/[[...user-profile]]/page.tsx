import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Mock profile editor for DreamTrade.',
};

export default function UserProfilePage() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-2xl shadow-black/30">
      <header className="mb-6 space-y-1">
        <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">Account</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile (mock only)</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          This is a frontend-only profile form. Persist it to your API or local storage later.
        </p>
      </header>

      <form className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-xs font-semibold tracking-[0.2em] text-slate-600 dark:text-slate-300 uppercase">
            Display name
          </label>
          <input
            id="displayName"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 ring-0 outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
            placeholder="DreamTrader"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold tracking-[0.2em] text-slate-600 dark:text-slate-300 uppercase">
            Contact email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 ring-0 outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="timezone" className="text-xs font-semibold tracking-[0.2em] text-slate-600 dark:text-slate-300 uppercase">
            Trading timezone
          </label>
          <select
            id="timezone"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 ring-0 outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
          >
            <option value="UTC">UTC</option>
            <option value="NY">New York (UTC-5 / UTC-4)</option>
            <option value="LDN">London (UTC+0 / UTC+1)</option>
            <option value="SG">Singapore (UTC+8)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="risk" className="text-xs font-semibold tracking-[0.2em] text-slate-600 dark:text-slate-300 uppercase">
            Risk profile
          </label>
          <select
            id="risk"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 ring-0 outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
          >
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
        >
          Save changes (mock)
        </button>
      </form>
    </div>
  );
}
