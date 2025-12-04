type TradingLayoutProps = {
  header: React.ReactNode;
  controls?: React.ReactNode;
  primaryPanel: React.ReactNode;
  secondaryPanel?: React.ReactNode;
  footer?: React.ReactNode;
};

export const TradingLayout = (props: TradingLayoutProps) => {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 shadow-lg shadow-black/20">
          {props.header}
          {props.controls && (
            <div className="mt-6 border-t border-slate-800 pt-6">
              {props.controls}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-4 shadow-2xl shadow-black/30">
          {props.primaryPanel}
        </div>

        {props.footer && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 shadow-lg shadow-black/20">
            {props.footer}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {props.secondaryPanel ?? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-300 shadow-lg shadow-black/20">
            No sidebar widgets configured yet.
          </div>
        )}
      </div>
    </section>
  );
};
