export type SubscriptionPlan = 'free' | 'vip';

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired';

export type SubscriptionInfo = {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string (for VIP)
  renewalDate?: string; // ISO date string (for VIP)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type PlanFeature = {
  id: string;
  name: string;
  included: boolean; // Whether this feature is included in the plan
};

export type PricingPlan = {
  id: SubscriptionPlan;
  name: string;
  price: number; // Monthly price in USD
  priceDisplay: string; // Formatted price (e.g., "$9.99/month")
  description: string;
  features: PlanFeature[];
  popular?: boolean; // Highlight this plan
  ctaText: string; // Button text
};

export type BillingHistoryItem = {
  id: string;
  date: string; // ISO date string
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  plan: SubscriptionPlan;
};
