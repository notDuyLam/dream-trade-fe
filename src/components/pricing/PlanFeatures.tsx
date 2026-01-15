import type { PlanFeature } from '@/types/subscription';

type PlanFeaturesProps = {
  features: PlanFeature[];
};

export const PlanFeatures = ({ features }: PlanFeaturesProps) => {
  return (
    <ul className="space-y-3">
      {features.map(feature => (
        <li key={feature.id} className="flex items-start gap-3">
          {feature.included
            ? (
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )
            : (
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
          <span
            className={feature.included
              ? 'text-sm text-slate-300'
              : 'text-sm text-slate-500 line-through'}
          >
            {feature.name}
          </span>
        </li>
      ))}
    </ul>
  );
};
