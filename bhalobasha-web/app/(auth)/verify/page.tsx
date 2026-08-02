"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { useAuth } from "@/lib/hooks/use-auth";
import { formatPhone } from "@/lib/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const email = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { verifyOtp, sendOtp } = useAuth();
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);

  // Must have either phone or email
  useEffect(() => {
    if (!phone && !email) router.replace("/login");
  }, [phone, email, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    try {
      await verifyOtp.mutateAsync({
        ...(phone ? { phone } : { email }),
        code,
      });
      toast.success("Login successful!");
      router.push(redirect);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp.mutateAsync(phone ? { phone } : { email });
      setCountdown(60);
      toast.success("OTP resent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend OTP");
    }
  };

  // Display label — show email or formatted phone
  const contactLabel = email || formatPhone(phone);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verify OTP</CardTitle>
        <p className="text-sm text-muted">
          Code sent to{" "}
          <span className="font-medium text-foreground">{contactLabel}</span>
        </p>
        <Link href="/login" className="text-sm text-primary hover:underline">
          {email ? "Change email" : "Change phone number"}
        </Link>
      </CardHeader>

      <CardContent className="space-y-6">
        <OtpInput
          value={code}
          onChange={setCode}
          disabled={verifyOtp.isPending}
        />

        <Button
          className="w-full"
          size="lg"
          onClick={handleVerify}
          disabled={verifyOtp.isPending || code.length !== 6}
        >
          {verifyOtp.isPending ? "Verifying..." : "Verify & Login"}
        </Button>

        <div className="text-center text-sm text-muted">
          {countdown > 0 ? (
            <span>Resend OTP in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-primary hover:underline"
              disabled={sendOtp.isPending}
            >
              Resend OTP
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-muted">Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
