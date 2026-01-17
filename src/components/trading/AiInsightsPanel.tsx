import type { AiInsight } from '@/types/trading';

type AiInsightsPanelProps = {
  insights: AiInsight[];
};

const directionCopy: Record<AiInsight['direction'], string> = {
  up: 'Upside bias',
  down: 'Downside risk',
  range: 'Range-bound',
};

const directionAccent: Record<AiInsight['direction'], string> = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  range: 'text-amber-300',
};

export const AiInsightsPanel = (props: AiInsightsPanelProps) => {
  return (
    <div className="space-y-4">
      {props.insights.map(insight => (
        <article
          key={insight.id}
          className="rounded-2xl border border-slate-300 bg-slate-100 p-5 text-sm text-slate-700 shadow-lg shadow-black/20 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
        >
          <div className="flex items-center justify-between text-xs tracking-[0.3em] text-slate-500 uppercase">
            <span>{insight.symbol}</span>
            <span>{insight.timeframe}</span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <p className={`text-lg font-semibold ${directionAccent[insight.direction]}`}>{directionCopy[insight.direction]}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {(insight.confidence * 100).toFixed(0)}
              % confidence
            </p>
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{insight.summary}</p>

          <ul className="mt-3 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            {insight.reasoning.map(point => (
              <li key={point} className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase">
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Sentiment:
              {insight.sentiment}
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Next
              {insight.catalystWindowMinutes}
              {' '}
              mins
            </span>
          </div>
        </article>
      ))}
    </div>
  );
};
