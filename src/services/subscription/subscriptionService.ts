import { subscriptionRequest } from '@/services/api/client';

export type SubscriptionPlan = 'free' | 'vip';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired';

export type PlanFeature = {
  id: string;
  name: string;
  included: boolean;
};

export type PricingPlan = {
  id: SubscriptionPlan;
  name: string;
  price: number;
  priceDisplay: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  ctaText: string;
};

export type SubscriptionInfo = {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type BillingHistoryItem = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  plan: SubscriptionPlan;
};

const BASE = '/subscriptions';

export const subscriptionService = {
  /** GET /subscriptions/me – current user subscription */
  getMySubscription(): Promise<SubscriptionInfo> {
    return subscriptionRequest<SubscriptionInfo>({ path: `${BASE}/me`, method: 'GET' });
  },

  /** GET /subscriptions/plans – available pricing plans */
  getPlans(): Promise<PricingPlan[]> {
    return subscriptionRequest<PricingPlan[]>({ path: `${BASE}/plans`, method: 'GET' });
  },

  /** GET /subscriptions/plans/:id – plan by ID (free | vip) */
  getPlanById(id: string): Promise<PricingPlan> {
    return subscriptionRequest<PricingPlan>({ path: `${BASE}/plans/${encodeURIComponent(id)}`, method: 'GET' });
  },

  /** POST /subscriptions/upgrade – upgrade to VIP */
  upgrade(body: { plan: 'vip' }): Promise<SubscriptionInfo> {
    return subscriptionRequest<SubscriptionInfo>({ path: `${BASE}/upgrade`, method: 'POST', body });
  },

  /** POST /subscriptions/cancel – cancel subscription (downgrade to free) */
  cancel(): Promise<SubscriptionInfo> {
    return subscriptionRequest<SubscriptionInfo>({ path: `${BASE}/cancel`, method: 'POST' });
  },

  /** GET /subscriptions/billing-history – billing history for current user */
  getBillingHistory(): Promise<BillingHistoryItem[]> {
    return subscriptionRequest<BillingHistoryItem[]>({ path: `${BASE}/billing-history`, method: 'GET' });
  },
};
