import type { AiInsight } from '@/types/trading';
import React from 'react';

// Inline Icons
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

type DetailedExplanationsProps = {
  insight: AiInsight;
};

export const DetailedExplanations: React.FC<DetailedExplanationsProps> = ({ insight }) => {
  const { events, leadLag, analysisSummary } = insight;

  if ((!events || events.length === 0) && !leadLag && !analysisSummary?.causal_relationships?.length) {
    return null;
  }

  const formatTime = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-slate-900/50 p-4">
      {/* 1. Significant Events Timeline */}
      {events && events.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <TrendingUpIcon className="h-4 w-4 text-purple-400" />
            Recent Significant Events
          </h3>

          <div className="relative space-y-4 border-l-2 border-slate-700 pl-4">
            {events.slice(0, 5).map((event, idx) => (
              <div key={idx} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute top-1 -left-[21px] h-3 w-3 rounded-full border-2 border-slate-900 ${
                    event.type === 'sentiment_spike' ? 'bg-purple-500' : 'bg-emerald-500'
                  }`}
                />

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono">{formatTime(event.timestamp)}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        event.type === 'sentiment_spike'
                          ? 'bg-purple-500/10 text-purple-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-slate-200">
                    {event.description}
                  </p>

                  <div className="text-xs text-slate-500">
                    Impact Score:
                    <span className="ml-1 text-slate-300">
                      {event.score.toFixed(2)}
                      σ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Causal Analysis & Lead Lag */}
      {(leadLag || (analysisSummary?.causal_relationships?.length ?? 0) > 0) && (
        <div className="space-y-3 border-t border-slate-800 pt-2">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <TrendingUpIcon className="h-4 w-4 text-blue-400" />
            Predictive Analysis
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Lead Lag Insight */}
            {leadLag && (
              <div className="rounded bg-slate-800/50 p-3">
                <div className="text-xs text-slate-400">Lead-Lag Relationship</div>
                <div className="mt-1 text-sm font-medium text-slate-200">
                  {leadLag.sentiment_lead > 0
                    ? (
                        <>
                          Sentiment leads Price by
                          <span className="ml-1 text-blue-400">
                            {leadLag.sentiment_lead}
                            h
                          </span>
                        </>
                      )
                    : (
                        'No clear lead-lag pattern detected'
                      )}
                </div>
                {leadLag.max_correlation && (
                  <div className="mt-1 text-xs text-slate-500">
                    Correlation strength:
                    {' '}
                    {leadLag.max_correlation.toFixed(3)}
                  </div>
                )}
              </div>
            )}

            {/* Granger Causality Note */}
            {insight.grangerCausality?.sentiment_to_price && (
              <div className="rounded bg-slate-800/50 p-3">
                <div className="text-xs text-slate-400">Causal Validation (Granger)</div>
                <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-200">
                  {insight.grangerCausality.sentiment_to_price.is_causal
                    ? (
                        <>
                          <ArrowUpRightIcon className="h-4 w-4 text-emerald-400" />
                          <span>Confirmed Causal Link</span>
                        </>
                      )
                    : (
                        <span className="text-slate-400">No strong causal link yet</span>
                      )}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  P-value:
                  {' '}
                  {insight.grangerCausality.sentiment_to_price.p_value.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
