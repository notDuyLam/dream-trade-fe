'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileOverview } from '@/components/profile/ProfileOverview';
import { SecuritySection } from '@/components/profile/SecuritySection';
import { NotificationsSection } from '@/components/profile/NotificationsSection';
import { PreferencesSection } from '@/components/profile/PreferencesSection';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Wait for Zustand store to hydrate from localStorage
  useEffect(() => {
    const id = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Redirect if not authenticated (only after hydration)
  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/sign-in');
    }
  }, [isHydrated, user, router]);

  // Show loading while hydrating or redirecting
  if (!isHydrated || !user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-r-transparent" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <ProfileOverview />;
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'preferences':
        return <PreferencesSection />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <ProfileLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </ProfileLayout>
  );
}
