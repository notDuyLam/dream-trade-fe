import type { BillingHistoryItem } from '@/types/subscription';

type BillingHistoryProps = {
  history: BillingHistoryItem[];
};

export const BillingHistory = ({ history }: BillingHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center">
        <p className="text-slate-400">No billing history available</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Billing History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Description
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Amount
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {history.map(item => (
              <tr key={item.id} className="hover:bg-slate-900/40">
                <td className="px-4 py-3 text-sm text-slate-300">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {item.description}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                  {item.currency}
                  {' '}
                  {item.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={[
                      'rounded-full px-2 py-1 text-xs font-semibold',
                      item.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-rose-500/20 text-rose-400',
                    ].join(' ')}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
