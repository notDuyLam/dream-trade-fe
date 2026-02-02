import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Dream Trade',
  description: 'Application settings and preferences',
};

export default function SettingsPage() {
  return (
    <main className="flex h-full flex-1 flex-col items-center justify-center overflow-hidden bg-white px-4 py-6 md:px-8 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Coming soon - Customize your  trading experience
        </p>
      </div>
    </main>
  );
}
