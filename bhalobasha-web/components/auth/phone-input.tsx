"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, className, disabled }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
      onChange(digits);
    };

    return (
      <div className={cn("flex", className)}>
        <div className="flex h-10 items-center rounded-l-lg border border-r-0 border-border bg-gray-50 px-3 text-sm font-medium text-muted">
          +880
        </div>
        <Input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          placeholder="1XXXXXXXXX"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="rounded-l-none"
          maxLength={11}
        />
      </div>
    );
  },
);
PhoneInput.displayName = "PhoneInput";
