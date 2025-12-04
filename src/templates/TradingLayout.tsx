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
        <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-5 shadow-lg shadow-black/10">
          {props.header}
          {props.controls && (
            <div className="mt-6 border-t border-slate-800 pt-6">
              {props.controls}
            </div>
          )}
        </div>

        <div className="rounded-[40px] border border-slate-800 bg-slate-950/40 p-4 shadow-2xl shadow-black/40">
          {props.primaryPanel}
        </div>

        {props.footer && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-5 shadow-lg shadow-black/10">
            {props.footer}
          </div>
        )}
      </div>

      <div className="space-y-6 lg:ml-auto lg:max-w-sm">
        {props.secondaryPanel ?? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-300 shadow-lg shadow-black/20">
            No sidebar widgets configured yet.
          </div>
        )}
      </div>
    </section>
  );
};
