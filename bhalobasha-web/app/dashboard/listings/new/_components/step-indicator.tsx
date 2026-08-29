import { cn } from "@/lib/utils";

const STEPS = ["Basic Info", "Location & Details", "Photos"];

export function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted/20 text-muted",
            )}
          >
            {i + 1}
          </div>
          <span
            className={cn(
              "hidden text-sm sm:block",
              i <= step ? "font-medium" : "text-muted",
            )}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div className="hidden h-px flex-1 bg-border sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}
