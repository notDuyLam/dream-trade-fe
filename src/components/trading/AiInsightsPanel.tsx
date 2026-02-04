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

function getCorrelationStrengthColor(correlation: number): string {
  const abs = Math.abs(correlation);
  if (abs >= 0.7) {
    return 'text-emerald-400 font-semibold';
  }
  if (abs >= 0.4) {
    return 'text-blue-400 font-medium';
  }
  if (abs >= 0.3) {
    return 'text-amber-400';
  }
  return 'text-slate-400';
}

function formatPValue(pValue: number): string {
  if (pValue < 0.001) {
    return '< 0.001';
  }
  return pValue.toFixed(4);
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
          {/* Symbol + timeframe header */}
          <div className="flex items-center justify-between text-xs tracking-[0.3em] text-slate-500 uppercase">
            <span className="font-bold">{insight.displaySymbol ?? insight.symbol}</span>
            <span>{insight.timeframe}</span>
          </div>

          {/* Analysis Summary Section */}
          {insight.analysisSummary && (
            <div className="mt-4 space-y-3">
              {/* Actionable Insights - Highlighted */}
              {insight.analysisSummary.actionable_insights.length > 0 && (
                <div className="rounded-lg border-2 border-blue-500/40 bg-blue-500/10 p-3">
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-blue-400 uppercase">
                    💡 Actionable Insights
                  </h4>
                  <ul className="space-y-1">
                    {insight.analysisSummary.actionable_insights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                      >
                        <span className="mt-0.5 text-blue-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Findings */}
              {insight.analysisSummary.key_findings.length > 0 && (
                <div className="rounded-lg border border-slate-400/30 bg-slate-200/50 p-3 dark:bg-slate-800/50">
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                    📊 Key Findings
                  </h4>
                  <ul className="space-y-1">
                    {insight.analysisSummary.key_findings.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <span className="mt-0.5 text-slate-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Causal Relationships */}
              {insight.analysisSummary.causal_relationships.length > 0 && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    🔗 Causal Relationships
                  </h4>
                  <ul className="space-y-1">
                    {insight.analysisSummary.causal_relationships.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                      >
                        <span className="mt-0.5 text-emerald-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Lead-Lag Analysis */}
          {insight.leadLag && (
            <div className="mt-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
              <h4 className="mb-2 text-xs font-bold tracking-wider text-purple-400 uppercase">
                ⏱️ Lead-Lag Analysis
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sentiment Lead</p>
                  <p className="text-lg font-bold text-purple-400">
                    {insight.leadLag.sentiment_lead}
                    {' '}
                    periods
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Max Correlation</p>
                  <p className={`text-lg font-bold ${getCorrelationStrengthColor(insight.leadLag.max_correlation)}`}>
                    {insight.leadLag.max_correlation.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Granger Causality Tests */}
          {insight.grangerCausality && (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <h4 className="mb-2 text-xs font-bold tracking-wider text-amber-400 uppercase">
                🔬 Granger Causality Tests
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    Sentiment → Price
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        insight.grangerCausality.sentiment_to_price.is_causal
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {insight.grangerCausality.sentiment_to_price.is_causal ? '✓ Causal' : '✗ Not Causal'}
                    </span>
                    <span className="text-xs text-slate-500">
                      (p=
                      {formatPValue(insight.grangerCausality.sentiment_to_price.p_value)}
                      , lag=
                      {insight.grangerCausality.sentiment_to_price.best_lag}
                      )
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    Fear & Greed → Price
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        insight.grangerCausality.fear_greed_to_price.is_causal
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {insight.grangerCausality.fear_greed_to_price.is_causal ? '✓ Causal' : '✗ Not Causal'}
                    </span>
                    <span className="text-xs text-slate-500">
                      (p=
                      {formatPValue(insight.grangerCausality.fear_greed_to_price.p_value)}
                      , lag=
                      {insight.grangerCausality.fear_greed_to_price.best_lag}
                      )
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Significant Correlations */}
          {insight.correlations && insight.correlations.significant_pairs.length > 0 && (
            <div className="mt-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
              <h4 className="mb-2 text-xs font-bold tracking-wider text-cyan-400 uppercase">
                📈 Significant Correlations (
                {insight.correlations.method}
                )
              </h4>
              <div className="space-y-2">
                {insight.correlations.significant_pairs.map((pair, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {pair.var1.replace(/_/g, ' ')}
                      {' '}
                      ↔
                      {pair.var2.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getCorrelationStrengthColor(pair.correlation)}`}>
                        {pair.correlation.toFixed(3)}
                      </span>
                      <span className="rounded border border-slate-500/40 px-1.5 py-0.5 text-[10px] text-slate-500">
                        {pair.strength}
                      </span>
                      <span className="text-xs text-slate-500">
                        (p=
                        {formatPValue(pair.p_value)}
                        )
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stationarity Tests */}
          {insight.stationarity && (
            <div className="mt-4 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3">
              <h4 className="mb-2 text-xs font-bold tracking-wider text-indigo-400 uppercase">
                📉 Stationarity Tests (ADF)
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {Object.entries(insight.stationarity).map(([key, test]) => (
                  <div key={key} className="rounded bg-slate-800/30 p-2">
                    <p className="text-xs font-semibold text-slate-600 capitalize dark:text-slate-300">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        test.is_stationary ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {test.interpretation}
                    </p>
                    <p className="text-xs text-slate-500">
                      ADF:
                      {' '}
                      {test.adf_statistic.toFixed(3)}
                    </p>
                    <p className="text-xs text-slate-500">
                      p-value:
                      {' '}
                      {formatPValue(test.p_value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Statistics */}
          {insight.dataStats && (
            <div className="mt-4 rounded-lg border border-slate-400/30 bg-slate-200/30 p-3 dark:bg-slate-800/30">
              <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                📊 Data Statistics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Observations</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {insight.dataStats.observations}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Frequency</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {insight.dataStats.resample_frequency}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Start Date</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {new Date(insight.dataStats.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">End Date</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {new Date(insight.dataStats.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Legacy fields - Short-term outlook */}
          {!insight.analysisSummary && (
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
          )}

          {/* Plain-language summary */}
          {insight.userSummary && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {insight.userSummary}
            </p>
          )}

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
            {insight.hoursBack && (
              <span className="rounded-full border border-slate-700 px-3 py-1">
                Analysis Period:
                {' '}
                {insight.hoursBack}
                h
              </span>
            )}
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
