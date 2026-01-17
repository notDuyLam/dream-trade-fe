'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppConfig } from '@/utils/AppConfig';

const LanguageSelector = dynamic(() => import('@/components/common/LanguageSelector').then(mod => ({ default: mod.LanguageSelector })), {
  ssr: false,
});

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/landing.jpg" alt="Dream Trade Landing" fill priority className="object-cover" quality={100} />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Language Selector - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm tracking-[0.4em] text-emerald-400 uppercase animate-fade-in">{AppConfig.name}</p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-2xl">{AppConfig.tagline}</h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-200 md:text-xl drop-shadow-lg">{AppConfig.description}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link
              href="/sign-in"
              className="rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-emerald-500/50 transition-all hover:bg-emerald-400 hover:scale-105"
            >
              {t('landing.getStarted')}
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/20 hover:border-white/50"
            >
              {t('landing.viewWorkspace')}
            </Link>
            <Link
              href="/market"
              className="rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/20 hover:border-white/50"
            >
              {t('landing.exploreMarket')}
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 pt-16 md:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-black/30 backdrop-blur-md p-6 shadow-xl">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('landing.features.realtime')}</h3>
              <p className="text-sm text-slate-300">{t('landing.features.realtimeDesc')}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-black/30 backdrop-blur-md p-6 shadow-xl">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('landing.features.ai')}</h3>
              <p className="text-sm text-slate-300">{t('landing.features.aiDesc')}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-black/30 backdrop-blur-md p-6 shadow-xl">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('landing.features.secure')}</h3>
              <p className="text-sm text-slate-300">{t('landing.features.secureDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
