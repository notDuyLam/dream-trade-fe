import type { Metadata } from 'next';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { Footer } from '@/components/common/Footer';
import { AppProviders } from '@/components/providers/AppProviders';
import { QueryProvider } from '@/libs/QueryProvider';
import { AppConfig } from '@/utils/AppConfig';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    default: AppConfig.name,
    template: `%s | ${AppConfig.name}`,
  },
  description: AppConfig.description,
  icons: {
    icon: [
      { url: '/analysis_16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/analysis_32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/analysis.png', type: 'image/png' },
    ],
    shortcut: '/favico.ico',
    apple: '/analysis.png',
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-slate-900 antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50">
        <QueryProvider>
          <AppProviders>
            <PostHogProvider>
              <div className="flex min-h-screen w-full flex-col">
                <div className="flex-1">{props.children}</div>
                <Footer />
              </div>
            </PostHogProvider>
          </AppProviders>
        </QueryProvider>
      </body>
    </html>
  );
}
