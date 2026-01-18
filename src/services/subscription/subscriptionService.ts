import type { BillingHistoryItem, PricingPlan, SubscriptionInfo } from '@/types/subscription';
import { apiRequest } from '../api/client';
import { pricingPlans } from './mockSubscriptionData';

/**
 * Get current user subscription
 * API automatically gets userId from JWT token
 */
export async function getUserSubscription(): Promise<SubscriptionInfo> {
  return apiRequest<SubscriptionInfo>({
    path: '/subscriptions/me',
    method: 'GET',
  });
}

/**
 * Check if current user is VIP
 */
export async function isVip(): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    return subscription?.plan === 'vip' && subscription?.status === 'active';
  } catch (error) {
    console.error('Failed to check VIP status:', error);
    return false;
  }
}

/**
 * Get available pricing plans
 */
export async function getAvailablePlans(): Promise<PricingPlan[]> {
  try {
    return apiRequest<PricingPlan[]>({
      path: '/subscriptions/plans',
      method: 'GET',
    });
  } catch (error) {
    console.error('Failed to fetch plans, using fallback:', error);
    // Fallback to hardcoded plans if API fails
    return pricingPlans;
  }
}

/**
 * Get plan by ID
 */
export async function getPlanById(planId: string): Promise<PricingPlan | undefined> {
  try {
    return apiRequest<PricingPlan>({
      path: `/subscriptions/plans/${planId}`,
      method: 'GET',
    });
  } catch (error) {
    console.error('Failed to fetch plan, using fallback:', error);
    // Fallback to hardcoded plans if API fails
    return pricingPlans.find(plan => plan.id === planId);
  }
}

/**
 * Upgrade current user to VIP
 * API automatically gets userId from JWT token
 */
export async function upgradeToVip(): Promise<SubscriptionInfo> {
  return apiRequest<SubscriptionInfo>({
    path: '/subscriptions/upgrade',
    method: 'POST',
    body: { plan: 'vip' },
  });
}

/**
 * Cancel current user subscription
 * API automatically gets userId from JWT token
 */
export async function cancelSubscription(): Promise<SubscriptionInfo> {
  return apiRequest<SubscriptionInfo>({
    path: '/subscriptions/cancel',
    method: 'POST',
  });
}

/**
 * Get billing history for current user
 * API automatically gets userId from JWT token
 */
export async function getBillingHistory(): Promise<BillingHistoryItem[]> {
  return apiRequest<BillingHistoryItem[]>({
    path: '/subscriptions/billing-history',
    method: 'GET',
  });
}
