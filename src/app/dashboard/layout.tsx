import type { ReactNode } from 'react';
import { DashboardNav } from '@/components/navigation/DashboardNav';

export default function DashboardLayout(props: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen max-h-screen flex-col overflow-hidden bg-slate-950 text-white antialiased">
      {/* Mesh Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[40%] w-[60%] rounded-full bg-slate-800/20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <DashboardNav />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {props.children}
        </div>
      </div>
    </div>
  );
}
