'use client';

export function NotificationsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Cài đặt thông báo
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Quản lý các loại thông báo bạn muốn nhận
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
          <svg className="h-8 w-8 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
          Tính năng sắp ra mắt
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Chức năng quản lý thông báo đang được phát triển và sẽ có trong phiên bản sau
        </p>
      </div>
    </div>
  );
}
