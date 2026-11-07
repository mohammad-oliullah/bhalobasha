"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { AlertCircle, CheckCircle2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getMySubscription,
  getSubscriptionPlans,
  startSubscriptionCheckout,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/lib/api/subscriptions";
import { useAuth } from "@/lib/hooks/use-auth";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [customPricing, setCustomPricing] = useState({
    minDays: 1,
    maxDays: 3650,
    baseDurationDays: 30,
    basePriceBdt: 50,
  });
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null,
  );
  const [durationDays, setDurationDays] = useState(30);
  const [customDays, setCustomDays] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getSubscriptionPlans(), getMySubscription()])
      .then(([availablePlans, currentSubscription]) => {
        setPlans(availablePlans.fixed);
        setCustomPricing(availablePlans.custom);
        setSubscription(currentSubscription);
      })
      .catch(() => toast.error("Could not load subscription information"))
      .finally(() => setIsLoading(false));
  }, []);

  const [paymentResult, setPaymentResult] = useState<string | null>(null);
  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("payment");
    if (["success", "failed", "cancelled"].includes(result ?? "")) {
      setPaymentResult(result);
    }
  }, []);

  const customDuration = customDays ? Number(customDays) : null;
  const selectedDuration = customDuration || durationDays;
  const selectedPlan = plans.find(
    (plan) => plan.durationDays === selectedDuration,
  );
  const customPrice =
    customDuration && !selectedPlan
      ? Math.ceil(
          (customDuration * customPricing.basePriceBdt) /
            customPricing.baseDurationDays,
        )
      : null;

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !Number.isInteger(selectedDuration) ||
      selectedDuration < customPricing.minDays ||
      selectedDuration > customPricing.maxDays
    ) {
      toast.error(
        `Choose a duration between ${customPricing.minDays} and ${customPricing.maxDays} days`,
      );
      return;
    }
    if (!user?.email || !user.phone) {
      toast.error("Add both an email and phone number to your profile first");
      return;
    }

    setIsSubmitting(true);
    try {
      const checkout = await startSubscriptionCheckout({
        durationDays: selectedDuration,
        address,
        city,
        postcode,
      });
      window.location.assign(checkout.redirectUrl);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;
      toast.error(
        typeof message === "string"
          ? message
          : "Could not start payment. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="mt-1 text-sm text-muted">
          Subscribe to create listings, bid, and access contact details.
        </p>
        {(!user?.email || !user.phone) && (
          <p className="mt-2 text-sm text-amber-700">
            Add both an email and phone number to your{" "}
            <Link href="/dashboard/profile" className="underline">
              profile
            </Link>{" "}
            before subscribing.
          </p>
        )}
      </div>

      {paymentResult && (
        <div
          className="rounded-lg border p-4 text-sm"
          role="status"
          aria-live="polite"
        >
          {paymentResult === "success" ? (
            <p className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Payment verified and subscription activated.
            </p>
          ) : (
            <p className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-4 w-4" />
              {paymentResult === "cancelled"
                ? "Payment was cancelled and your subscription was not activated. Check your bank or wallet for any pending hold."
                : "Payment was not completed. If you were charged, please contact support."}
            </p>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current access</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted">Loading subscription status…</p>
          ) : subscription?.isUnlimited ? (
            <p className="font-medium text-green-700">
              Unlimited access — this admin/demo account does not need a
              subscription.
            </p>
          ) : subscription?.isActive ? (
            <p>
              Active until{" "}
              <strong>
                {new Date(subscription.expiresAt!).toLocaleString()}
              </strong>
            </p>
          ) : (
            <p className="text-sm text-muted">No active subscription</p>
          )}
        </CardContent>
      </Card>

      {!subscription?.isUnlimited && (
        <form onSubmit={submitCheckout} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select a duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {plans.map((plan) => (
                  <label
                    key={plan.durationDays}
                    className="flex cursor-pointer items-center justify-between rounded-lg border p-4"
                  >
                    <span>
                      <span className="block font-medium">{plan.label}</span>
                      <span className="text-sm text-muted">
                        BDT {plan.amountBdt}
                      </span>
                    </span>
                    <input
                      type="radio"
                      name="duration"
                      value={plan.durationDays}
                      checked={
                        !customDays && durationDays === plan.durationDays
                      }
                      onChange={() => {
                        setCustomDays("");
                        setDurationDays(plan.durationDays);
                      }}
                      aria-label={`${plan.label}, BDT ${plan.amountBdt}`}
                    />
                  </label>
                ))}
              </div>

              <label className="block space-y-2 text-sm font-medium">
                Custom days ({customPricing.minDays}–{customPricing.maxDays}),
                pro-rated at BDT {customPricing.basePriceBdt} per{" "}
                {customPricing.baseDurationDays} days
                <input
                  type="number"
                  min={customPricing.minDays}
                  max={customPricing.maxDays}
                  value={customDays}
                  onChange={(event) => setCustomDays(event.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>
              {customDays && customPrice !== null && (
                <p className="text-sm font-medium">
                  Custom subscription: {selectedDuration} days — BDT{" "}
                  {customPrice}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium sm:col-span-2">
                Address
                <input
                  required
                  maxLength={200}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                City
                <input
                  required
                  maxLength={100}
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Postcode
                <input
                  required
                  maxLength={20}
                  value={postcode}
                  onChange={(event) => setPostcode(event.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-semibold">
              Total: BDT {selectedPlan?.amountBdt ?? customPrice ?? "—"}
            </p>
            <Button
              type="submit"
              disabled={
                isSubmitting || isLoading || (!selectedPlan && !customPrice)
              }
            >
              <CreditCard className="h-4 w-4" />
              {isSubmitting ? "Starting payment…" : "Continue to SSLCommerz"}
            </Button>
          </div>
          <p className="text-xs text-muted">
            Payments are processed by SSLCommerz. Supported options depend on
            your gateway checkout availability.
          </p>
        </form>
      )}
    </div>
  );
}
