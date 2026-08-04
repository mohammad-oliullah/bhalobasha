/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";

interface EmailLoginProps {
  email: string;
  onChange: (email: string) => void;
}

export function EmailLogin({ email, onChange }: EmailLoginProps) {
  const router = useRouter();
  const { sendOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    try {
      await sendOtp.mutateAsync({ email });
      toast.success("OTP sent to your email");
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to send OTP. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        <p className="font-medium">⚠️ Email OTP has limited availability</p>
        <p className="mt-1 text-xs text-amber-600">
          Only pre-verified email addresses can receive OTP in production. Use
          Demo login for instant access.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Email Address</Label>
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => onChange(e.target.value)}
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
  );
}
