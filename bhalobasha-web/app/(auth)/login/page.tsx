"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/auth/phone-input";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoginMethod = "phone" | "email";

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp } = useAuth();
  const [method, setMethod] = useState<LoginMethod>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === "phone") {
      if (!/^01[3-9]\d{8}$/.test(phone)) {
        toast.error("Enter a valid Bangladesh mobile number");
        return;
      }
      try {
        await sendOtp.mutateAsync({ phone });
        toast.success("OTP sent to your phone");
        router.push(`/verify?phone=${phone}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send OTP");
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Enter a valid email address");
        return;
      }
      try {
        await sendOtp.mutateAsync({ email });
        toast.success("OTP sent to your email");
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send OTP");
      }
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
          <p className="text-sm text-muted">Login or sign up to continue</p>
        </CardHeader>

        <CardContent>
          {/* Toggle */}
          <div className="mb-6 flex rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setMethod("phone")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                method === "phone"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              📱 Phone
            </button>
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                method === "email"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              ✉️ Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === "phone" ? (
              <>
                <p className="text-red-700 text-sm">
                  Unavailable Now, Please Try With An Email
                </p>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    // disabled={sendOtp.isPending}
                    disabled={true}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sendOtp.isPending}
                />
              </div>
            )}

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
