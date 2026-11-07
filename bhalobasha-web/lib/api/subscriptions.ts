import apiClient from "./client";

export interface SubscriptionPlan {
  durationDays: number;
  amountBdt: number;
  label: string;
}

export interface SubscriptionPlans {
  fixed: SubscriptionPlan[];
  custom: {
    minDays: number;
    maxDays: number;
    baseDurationDays: number;
    basePriceBdt: number;
    priceFormula: string;
  };
}

export interface SubscriptionStatus {
  expiresAt: string | null;
  isActive: boolean;
  isUnlimited: boolean;
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlans> {
  const { data } = await apiClient.get<SubscriptionPlans>(
    "/subscriptions/plans",
  );
  return data;
}

export async function getMySubscription(): Promise<SubscriptionStatus> {
  const { data } = await apiClient.get<SubscriptionStatus>("/subscriptions/me");
  return data;
}

export async function startSubscriptionCheckout(payload: {
  durationDays: number;
  address: string;
  city: string;
  postcode: string;
}): Promise<{ redirectUrl: string }> {
  const { data } = await apiClient.post<{ redirectUrl: string }>(
    "/subscriptions/checkout",
    payload,
  );
  return data;
}
