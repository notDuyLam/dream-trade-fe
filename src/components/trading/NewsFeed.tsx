import type { NewsArticle } from '@/types/trading';

type NewsFeedProps = {
  articles: NewsArticle[];
};

export const NewsFeed = (props: NewsFeedProps) => {
  return (
    <div className="space-y-4">
      {props.articles.map(article => (
        <article
          key={article._id}
          className="rounded-2xl border border-slate-300 bg-slate-100 p-4 text-sm text-slate-700 shadow-lg shadow-black/20 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
        >
          <div className="flex items-center justify-between text-xs tracking-[0.2em] text-slate-500 uppercase">
            <span>{article.source}</span>
            <span>{new Date(article.published_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900 dark:text-white">{article.title}</h3>
          <p className="mt-1 line-clamp-2 text-slate-600 dark:text-slate-400">{article.excerpt || article.description}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            {article.category && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 dark:text-emerald-400">
                {article.category.toUpperCase()}
              </span>
            )}

            {article.tags?.slice(0, 2).map(tag => (
              <span
                key={`${article._id}-tag-${tag}`}
                className="rounded-full border border-slate-300 px-3 py-1 text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                #
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
};
