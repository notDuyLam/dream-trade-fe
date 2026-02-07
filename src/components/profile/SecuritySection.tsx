'use client';

import { ChangePasswordForm } from './ChangePasswordForm';

export function SecuritySection() {
  return (
    <div className="space-y-8">
      {/* Change Password */}
      <ChangePasswordForm />

      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-700" />

      {/* Two-Factor Authentication - Placeholder */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Xác thực hai yếu tố (2FA)
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Tăng cường bảo mật tài khoản với xác thực hai yếu tố
          </p>
        </div>
        
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
              <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-900 dark:text-white">
                Chưa kích hoạt
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Tính năng này sẽ được cập nhật trong phiên bản sau
              </p>
              <button
                type="button"
                disabled
                className="mt-3 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              >
                Sắp ra mắt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-700" />

      {/* Active Sessions - Placeholder */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Phiên đăng nhập
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Quản lý các thiết bị đang đăng nhập vào tài khoản
          </p>
        </div>
        
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-900 dark:text-white">
                Thiết bị hiện tại
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Trình duyệt web • Đăng nhập lúc {new Date().toLocaleString('vi-VN')}
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
