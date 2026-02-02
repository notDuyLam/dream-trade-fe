'use client';

import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="px-8 py-12 lg:px-16 xl:px-24">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo & Social */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">DreamTrade</span>
            </div>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Look first / Then leap.
            </p>
            
            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              <a href="#" className="text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Sản phẩm
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Biểu đồ</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Bộ lọc</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Cơ phiếu</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Tiền điện tử</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Forex</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Tính năng
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Tính năng</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Trả phí</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Dữ liệu thị trường</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Tổng quan</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Cộng đồng
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Mạng xã hội</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Bức tường Tinh yếu</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Giới thiệu bạn</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Người đầu hành</Link></li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Doanh nghiệp
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Tiện ích</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Thư viện biểu đồ</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Biểu đồ Hàng cao</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Quảng cáo</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row dark:text-slate-400">
            <p>© {new Date().getFullYear()} DreamTrade. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Điều khoản</Link>
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Quyền riêng tư</Link>
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Cookie</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
