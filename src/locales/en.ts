export const en = {
  // Navigation
  'nav.workspace': 'Workspace',
  'nav.insights': 'Insights',
  'nav.news': 'News',
  'nav.subscription': 'Subscription',
  'nav.settings': 'Settings',

  // Account Dropdown
  'account.theme': 'Dark Mode',
  'account.language': 'Language',
  'account.logout': 'Logout',
  'account.holder': 'Account Holder',

  // Account Info
  'account.overview': 'Account Overview',
  'account.live': 'Live',
  'account.totalBalance': 'Total Balance',
  'account.totalPnL': 'Total P&L',
  'account.availableBalance': 'Available Balance',
  'account.inOrders': 'In Orders',
  'account.available': 'Available',
  'account.locked': 'Locked',
  'account.deposit': 'Deposit',
  'account.withdraw': 'Withdraw',
  'account.signInToView': 'Please sign in to view your account information',

  // Landing Page
  'landing.getStarted': 'Get Started',
  'landing.viewWorkspace': 'View Workspace',
  'landing.exploreMarket': 'Explore Market',
  'landing.features.realtime': 'Real-Time Data',
  'landing.features.realtimeDesc': 'Live market data and streaming prices',
  'landing.features.ai': 'AI Analytics',
  'landing.features.aiDesc': 'Advanced AI-powered market analysis',
  'landing.features.secure': 'Secure Trading',
  'landing.features.secureDesc': 'Enterprise-grade security and control',

  // Languages
  'language.en': 'English',
  'language.vi': 'Tiếng Việt',
  'language.ja': '日本語',
  'language.ko': '한국어',

  // Trading Workspace
  'trading.dreamTrade': 'Dream Trade',
  'trading.intelligence': 'Trading Intelligence',
  'trading.priceChart': 'Price Chart',
  'trading.updated': 'Updated',
  'trading.loadingData': 'Loading data…',
  'trading.watchlist': 'Watchlist',
  'trading.realtime': 'Realtime',
  'trading.details': 'Details',
  'trading.open': 'Open',
  'trading.close': 'Close',
  'trading.high': 'High',
  'trading.low': 'Low',
  'trading.volume': 'Volume',
  'trading.timeframe': 'Timeframe',
  'trading.dataUpdatedAt': 'Data updated at',
  'trading.candles': 'Candles',
  'trading.line': 'Line',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.confirm': 'Confirm',
  'common.cancel': 'Cancel',

  // News Section
  'news.title': 'Market News',
  'news.subtitle': 'Latest news and analysis updates',
  'news.search': 'Search news...',
  'news.noResults': 'No news found',
  'news.loadMore': 'Load More',
  'news.loading': 'Loading news...',
  'news.readMore': 'Read More',
  'news.minRead': 'min read',
  'news.source': 'Source',
  'news.category': 'Category',
  'news.allCategories': 'All',
  'news.sortBy': 'Sort by',
  'news.newest': 'Newest',
  'news.oldest': 'Oldest',
  'news.publishedAt': 'Published at',
  'news.author': 'Author',

  // News – AI Analysis
  'news.aiAnalysis': 'AI Analysis',
  'news.analysisDescription': 'Analyze sentiment and trends for the selected coin (VIP only).',
  'news.analysisCoinHint': 'Analysis will use the coin selected in the filter above.',
  'news.chooseCoin': 'Select a coin in the filter above to analyze, or use default BTC.',
  'news.runAnalysis': 'Run AI Analysis',
  'news.analysisLoading': 'Analyzing...',
  'news.vipOnly': 'AI analysis is for VIP users only. Please upgrade your subscription.',
  'news.analysisUnavailable': 'Analysis is temporarily unavailable. Please try again later.',
  'news.retry': 'Retry',
  'news.upgradeCta': 'Upgrade to VIP',

  // News – AI Outlook (result card)
  'news.outlookShortTerm': 'Short-term outlook',
  'news.outlookUpside': 'Upside bias',
  'news.outlookDownside': 'Downside risk',
  'news.outlookRange': 'Range-bound',
  'news.outlookConfidence': 'confidence',
  'news.marketMood': 'Market mood',
  'news.sentimentSplit': 'Sentiment split',
  'news.keyDrivers': 'Key drivers (from recent news)',
  'news.outlookWindow': 'Outlook window',
  'news.next60Mins': 'next 60 mins',
  'news.articlesAnalyzed': 'articles analyzed',

  // Subscription
  'subscription.title': 'Subscription',
  'subscription.subtitle': 'Manage your plan and billing',
  'subscription.currentPlan': 'Current plan',
  'subscription.availablePlans': 'Available plans',
  'subscription.upgrade': 'Upgrade to VIP',
  'subscription.cancel': 'Cancel subscription',
  'subscription.billingHistory': 'Billing history',
  'subscription.signInRequired': 'Please sign in to view your subscription',
  'subscription.upgradeSuccess': 'Upgraded to VIP successfully',
  'subscription.cancelSuccess': 'Subscription cancelled',
  'subscription.error': 'Something went wrong',
  'subscription.status': 'Status',
  'subscription.plan': 'Plan',
  'subscription.startDate': 'Start date',
  'subscription.endDate': 'End date',
  'subscription.renewalDate': 'Renewal date',
  'subscription.noBillingHistory': 'No billing history yet',

  // VIP Upgrade Popup
  'upgrade.popupTitle': 'Unlock AI Analysis',
  'upgrade.popupDesc': 'Upgrade to VIP to access AI-powered market insights and advanced analytics.',
  'upgrade.popupCta': 'Upgrade Now',
};

export type TranslationKeys = keyof typeof en;
