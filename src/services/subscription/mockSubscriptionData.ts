import type { BillingHistoryItem, PricingPlan, SubscriptionInfo } from '@/types/subscription';

// Mock subscription data - keyed by userId
export const mockSubscriptions: Record<string, SubscriptionInfo> = {
  // Default free user
  'default-user': {
    id: 'sub-free-1',
    userId: 'default-user',
    plan: 'free',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // VIP user for testing
  'vip-user': {
    id: 'sub-vip-1',
    userId: 'vip-user',
    plan: 'vip',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-01-01T00:00:00Z',
    renewalDate: '2025-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
};

// Pricing plans configuration
export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: '$0/month',
    description: 'Perfect for getting started with crypto trading',
    features: [
      { id: 'market-data', name: 'Real-time market data', included: true },
      { id: 'basic-charts', name: 'Basic trading charts', included: true },
      { id: 'watchlist', name: 'Watchlist (up to 10 coins)', included: true },
      { id: 'news-feed', name: 'News feed', included: true },
      { id: 'ai-forecast', name: 'AI Forecast', included: false },
      { id: 'advanced-charts', name: 'Advanced charting tools', included: false },
      { id: 'priority-support', name: 'Priority support', included: false },
    ],
    ctaText: 'Get Started',
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 29.99,
    priceDisplay: '$29.99/month',
    description: 'Unlock advanced features and AI-powered insights',
    features: [
      { id: 'market-data', name: 'Real-time market data', included: true },
      { id: 'basic-charts', name: 'Basic trading charts', included: true },
      { id: 'watchlist', name: 'Unlimited watchlist', included: true },
      { id: 'news-feed', name: 'News feed', included: true },
      { id: 'ai-forecast', name: 'AI Forecast', included: true },
      { id: 'advanced-charts', name: 'Advanced charting tools', included: true },
      { id: 'priority-support', name: 'Priority support', included: true },
    ],
    popular: true,
    ctaText: 'Upgrade to VIP',
  },
];

// Mock billing history
export const mockBillingHistory: Record<string, BillingHistoryItem[]> = {
  'default-user': [],
  'vip-user': [
    {
      id: 'bill-1',
      date: '2024-01-01T00:00:00Z',
      amount: 29.99,
      currency: 'USD',
      description: 'VIP Subscription - January 2024',
      status: 'completed',
      plan: 'vip',
    },
    {
      id: 'bill-2',
      date: '2024-02-01T00:00:00Z',
      amount: 29.99,
      currency: 'USD',
      description: 'VIP Subscription - February 2024',
      status: 'completed',
      plan: 'vip',
    },
  ],
};
