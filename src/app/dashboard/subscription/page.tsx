import type { Metadata } from 'next';
import { SubscriptionPageContent } from './SubscriptionPageContent';

export const metadata: Metadata = {
  title: 'Subscription | Dream Trade',
  description: 'Manage your subscription plan and billing',
};

export default function SubscriptionPage() {
  return (
    <main className="flex h-full flex-1 flex-col overflow-auto bg-white px-4 py-6 md:px-8 dark:bg-slate-950">
      <SubscriptionPageContent />
    </main>
  );
}
