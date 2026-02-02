export const NewsCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-slate-100/80 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
      {/* Image Skeleton */}
      <div className="h-48 w-full animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title Skeleton */}
        <div className="mb-3 space-y-2">
          <div className="h-5 w-4/5 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
          <div className="h-5 w-3/5 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Description Skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Tags Skeleton */}
        <div className="mb-4 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-20 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-14 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Meta Skeleton */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};
