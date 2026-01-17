import type { NewsArticle } from '@/types/trading';

type NewsFeedProps = {
  articles: NewsArticle[];
};

const sentimentClasses = {
  bullish: 'text-emerald-400 bg-emerald-500/10',
  bearish: 'text-rose-400 bg-rose-500/10',
  neutral: 'text-slate-300 bg-slate-800/60',
} as const;

export const NewsFeed = (props: NewsFeedProps) => {
  return (
    <div className="space-y-4">
      {props.articles.map(article => (
        <article
          key={article.id}
          className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 p-4 text-sm text-slate-700 dark:text-slate-200 shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between text-xs tracking-[0.2em] text-slate-500 uppercase">
            <span>{article.source}</span>
            <span>{new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{article.title}</h3>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{article.excerpt}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className={`rounded-full px-3 py-1 ${sentimentClasses[article.sentiment]}`}>{article.sentiment.toUpperCase()}</span>

            {article.symbols.map(symbol => (
              <span
                key={`${article.id}-${symbol}`}
                className="rounded-full border border-slate-400 dark:border-slate-700 px-3 py-1 text-slate-600 dark:text-slate-300"
              >
                {symbol}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
};
