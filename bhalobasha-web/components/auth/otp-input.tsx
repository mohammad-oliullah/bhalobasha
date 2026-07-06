"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRef, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const updateDigit = (index: number, digit: string) => {
    const arr = digits.map((d) => (d === " " ? "" : d));
    arr[index] = digit;
    onChange(arr.join("").replace(/\s/g, ""));
  };

  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    updateDigit(index, digit);
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const nextIndex = Math.min(pasted.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "h-12 w-10 text-center text-lg font-semibold sm:h-14 sm:w-12",
          )}
        />
      ))}
    </div>
  );
}
