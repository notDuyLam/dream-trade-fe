import type { PricingPlan, SubscriptionInfo } from '@/types/subscription';
import { mockBillingHistory, mockSubscriptions, pricingPlans } from './mockSubscriptionData';

/**
 * Get user subscription
 * Currently uses mock data, ready to replace with API call
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  // Mock implementation
  const subscription = mockSubscriptions[userId] ?? mockSubscriptions['default-user'];

  // Future: Replace with API call
  // return apiRequest<SubscriptionInfo>({
  //   path: `/api/subscriptions/${userId}`,
  //   method: 'GET',
  // });

  return subscription ?? null;
}

/**
 * Check if user is VIP
 */
export async function isVip(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription?.plan === 'vip' && subscription?.status === 'active';
}

/**
 * Get available pricing plans
 */
export function getAvailablePlans(): PricingPlan[] {
  return pricingPlans;
}

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find(plan => plan.id === planId);
}

/**
 * Upgrade user to VIP
 * Currently uses mock data, ready to replace with API call
 */
export async function upgradeToVip(userId: string): Promise<SubscriptionInfo> {
  // Mock implementation
  const now = new Date().toISOString();
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const newSubscription: SubscriptionInfo = {
    id: `sub-vip-${Date.now()}`,
    userId,
    plan: 'vip',
    status: 'active',
    startDate: now,
    endDate: nextYear.toISOString(),
    renewalDate: nextYear.toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  // Update mock data
  mockSubscriptions[userId] = newSubscription;

  // Future: Replace with API call
  // return apiRequest<SubscriptionInfo>({
  //   path: '/api/subscriptions/upgrade',
  //   method: 'POST',
  //   body: { plan: 'vip' },
  // });

  return newSubscription;
}

/**
 * Cancel subscription
 * Currently uses mock data, ready to replace with API call
 */
export async function cancelSubscription(userId: string): Promise<SubscriptionInfo> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Mock implementation - downgrade to free
  const updatedSubscription: SubscriptionInfo = {
    ...subscription,
    plan: 'free',
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  };

  mockSubscriptions[userId] = updatedSubscription;

  // Future: Replace with API call
  // return apiRequest<SubscriptionInfo>({
  //   path: `/api/subscriptions/${userId}/cancel`,
  //   method: 'POST',
  // });

  return updatedSubscription;
}

/**
 * Get billing history for user
 * Currently uses mock data, ready to replace with API call
 */
export async function getBillingHistory(userId: string) {
  // Mock implementation
  const history = mockBillingHistory[userId] ?? [];

  // Future: Replace with API call
  // return apiRequest({
  //   path: `/api/subscriptions/${userId}/billing-history`,
  //   method: 'GET',
  // });

  return history;
}
