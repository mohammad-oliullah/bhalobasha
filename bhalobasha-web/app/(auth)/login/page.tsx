"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/auth/phone-input";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp } = useAuth();
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      toast.error("Enter a valid Bangladesh mobile number");
      return;
    }
    try {
      await sendOtp.mutateAsync(phone);
      toast.success("OTP sent successfully");
      router.push(`/verify?phone=${phone}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
            ভা
          </div>
          <CardTitle className="text-2xl">Welcome to Bhalobasha</CardTitle>
          <p className="text-sm text-muted">
            Enter your phone number to login or sign up
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                disabled={sendOtp.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={sendOtp.isPending}
            >
              {sendOtp.isPending ? "Sending..." : "Send OTP"}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted">
            By continuing, you agree to Bhalobasha&apos;s terms of service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
