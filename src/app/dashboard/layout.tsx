import type { ReactNode } from 'react';

export default function DashboardLayout(props: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col gap-8 bg-slate-950 px-4 py-8 md:px-8">
      {props.children}
    </div>
  );
}
