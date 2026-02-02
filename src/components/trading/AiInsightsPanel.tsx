'use client';

import type { AiInsight } from '@/types/trading';
import { useLanguage } from '@/contexts/LanguageContext';

type AiInsightsPanelProps = {
  insights: AiInsight[];
};

const directionKeys: Record<AiInsight['direction'], string> = {
  up: 'news.outlookUpside',
  down: 'news.outlookDownside',
  range: 'news.outlookRange',
};

const directionAccent: Record<AiInsight['direction'], string> = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  range: 'text-amber-300',
};

const sentimentBadgeClass: Record<string, string> = {
  bullish: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  bearish: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
};

function fearGreedLabel(score: number): string {
  if (score >= 75) {
    return 'Extreme greed';
  }
  if (score >= 55) {
    return 'Greed';
  }
  if (score >= 45) {
    return 'Neutral';
  }
  if (score >= 25) {
    return 'Fear';
  }
  return 'Extreme fear';
}

export const AiInsightsPanel = (props: AiInsightsPanelProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {props.insights.map(insight => (
        <article
          key={insight.id}
          className="rounded-2xl border border-slate-300 bg-slate-100 p-5 text-sm text-slate-700 shadow-lg shadow-black/20 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
        >
          {/* Symbol + timeframe (displaySymbol = coin from API, e.g. ETHUSDT) */}
          <div className="flex items-center justify-between text-xs tracking-[0.3em] text-slate-500 uppercase">
            <span>{insight.displaySymbol ?? insight.symbol}</span>
            <span>{insight.timeframe}</span>
          </div>

          {/* Short-term outlook (main prediction) */}
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <p
              className={`text-lg font-semibold ${directionAccent[insight.direction]}`}
            >
              {t('news.outlookShortTerm')}
              :
              {' '}
              {t(directionKeys[insight.direction])}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {(insight.confidence * 100).toFixed(0)}
              %
              {' '}
              {t('news.outlookConfidence')}
            </p>
          </div>

          {/* Plain-language summary for users */}
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {insight.userSummary ?? insight.summary}
          </p>

          {/* Fear & Greed + Sentiment distribution */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {typeof insight.fearGreedScore === 'number' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">
                  {t('news.marketMood')}
                </span>
                <span
                  className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  title={fearGreedLabel(insight.fearGreedScore)}
                >
                  {Math.round(insight.fearGreedScore)}
                  /100 ·
                  {' '}
                  {fearGreedLabel(insight.fearGreedScore)}
                </span>
              </div>
            )}
            {insight.sentimentDistribution && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {t('news.sentimentSplit')}
                  :
                </span>
                <span className="text-emerald-500 dark:text-emerald-400">
                  Bullish
                  {' '}
                  {insight.sentimentDistribution.bullish}
                </span>
                <span>·</span>
                <span className="text-rose-500 dark:text-rose-400">
                  Bearish
                  {' '}
                  {insight.sentimentDistribution.bearish}
                </span>
                <span>·</span>
                <span>
                  Neutral
                  {insight.sentimentDistribution.neutral}
                </span>
              </div>
            )}
          </div>

          {/* Key drivers: top articles */}
          {insight.topArticles && insight.topArticles.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                {t('news.keyDrivers')}
              </p>
              <ul className="space-y-2">
                {insight.topArticles.map(a => (
                  <li
                    key={`${insight.id}-${a.title}-${a.explanation ?? ''}`}
                    className="flex flex-col gap-0.5 text-xs"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {a.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {a.sentiment && (
                        <span
                          className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                            sentimentBadgeClass[a.sentiment.toLowerCase()]
                            ?? 'border-slate-500/40 text-slate-400'
                          }`}
                        >
                          {a.sentiment}
                        </span>
                      )}
                      {a.explanation && (
                        <span className="line-clamp-1 text-slate-500 dark:text-slate-400">
                          {a.explanation}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer badges */}
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase">
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Sentiment:
              {' '}
              {insight.sentiment}
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
              {t('news.outlookWindow')}
              :
              {t('news.next60Mins')}
            </span>
            {typeof insight.articlesCount === 'number'
              && insight.articlesCount > 0 && (
              <span className="rounded-full border border-slate-700 px-3 py-1">
                {insight.articlesCount}
                {' '}
                {t('news.articlesAnalyzed')}
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};
