'use client';

import { NewsSection } from '@/components/news/NewsSection';

export default function NewsPage() {
  return (
    <div className="h-full w-full overflow-auto bg-white px-4 py-4 md:px-6 dark:bg-slate-950">
      <NewsSection
        initialArticles={[]}
        initialTotal={0}
        initialPage={1}
      />
    </div>
  );
}
