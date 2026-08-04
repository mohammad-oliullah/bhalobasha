/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/use-auth";

const DEMO_ROLES = [
  {
    email: "demo-seeker@bhalobasha.com",
    icon: "👤",
    label: "Seeker",
    description: "Browse listings, place bids, contact owners",
  },
  {
    email: "demo-owner@bhalobasha.com",
    icon: "🏠",
    label: "Owner",
    description: "Post listings, manage bids, mark as filled",
  },
  {
    email: "demo-admin@bhalobasha.com",
    icon: "🛡️",
    label: "Admin",
    description: "Manage users, moderate listings, full access",
  },
];

export function DemoLogin() {
  const router = useRouter();
  const { verifyOtp } = useAuth();

  const handleDemoLogin = async (demoEmail: string) => {
    try {
      await verifyOtp.mutateAsync({
        email: demoEmail,
        code: "123456",
        isDemoLogin: true,
      });
      toast.success("Demo login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Demo login failed. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-semibold">🎯 Recruiter Demo Access</p>
        <p className="mt-1 text-xs text-amber-600">
          Click any role below to log in instantly — no email or OTP needed.
        </p>
      </div>

      <div className="space-y-2">
        {DEMO_ROLES.map((role) => (
          <button
            key={role.email}
            type="button"
            onClick={() => handleDemoLogin(role.email)}
            disabled={verifyOtp.isPending}
            className="w-full rounded-lg border border-amber-200 bg-white px-4 py-3 text-left transition-all hover:border-amber-400 hover:bg-amber-50 disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{role.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{role.label}</p>
                <p className="text-xs text-muted">{role.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {verifyOtp.isPending && (
        <p className="text-center text-sm text-muted animate-pulse">
          Logging in...
        </p>
      )}
    </div>
  );
}
