type TradingLayoutProps = {
  header: React.ReactNode;
  controls?: React.ReactNode;
  primaryPanel: React.ReactNode;
  secondaryPanel?: React.ReactNode;
  footer?: React.ReactNode;
};

export const TradingLayout = (props: TradingLayoutProps) => {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 p-5 shadow-lg shadow-black/10 dark:border-slate-800 dark:bg-slate-900/20">
          {props.header}
          {props.controls && <div className="mt-6 border-t border-slate-300 pt-6 dark:border-slate-800">{props.controls}</div>}
        </div>

        <div className="rounded-[40px] border border-slate-300 bg-slate-50 p-4 shadow-2xl shadow-black/40 dark:border-slate-800 dark:bg-slate-950/40">
          {props.primaryPanel}
        </div>

        {props.footer && (
          <div className="rounded-3xl border border-slate-300 bg-slate-100 p-5 shadow-lg shadow-black/10 dark:border-slate-800 dark:bg-slate-900/20">
            {props.footer}
          </div>
        )}
      </div>

      <div className="space-y-6 lg:ml-auto lg:max-w-sm">
        {props.secondaryPanel ?? (
          <div className="rounded-3xl border border-slate-300 bg-slate-100 p-6 text-sm text-slate-600 shadow-lg shadow-black/20 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
            No sidebar widgets configured yet.
          </div>
        )}
      </div>
    </section>
  );
};
