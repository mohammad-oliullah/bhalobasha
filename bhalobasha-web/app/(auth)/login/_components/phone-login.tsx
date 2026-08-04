import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/auth/phone-input";

export function PhoneLogin() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p className="font-medium">📵 Phone OTP is currently unavailable</p>
        <p className="mt-1 text-xs text-red-500">
          SMS gateway is not configured in the production environment. Please
          use Email or Demo login instead.
        </p>
      </div>
      <div className="space-y-2 opacity-50 pointer-events-none">
        <Label>Phone Number</Label>
        <PhoneInput value="" onChange={() => {}} disabled />
      </div>
      <Button className="w-full" size="lg" disabled>
        Send OTP
      </Button>
    </div>
  );
}
