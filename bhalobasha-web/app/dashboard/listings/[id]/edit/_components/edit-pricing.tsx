import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EditFormData } from "./edit-listing-form";

export function EditPricing({ form }: { form: UseFormReturn<EditFormData> }) {
  const { register, watch, setValue } = form;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Rent (৳)</Label>
          <Input type="number" {...register("rent", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Advance (৳)</Label>
          <Input
            type="number"
            {...register("advanceAmount", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label>Negotiable</Label>
        <Switch
          checked={watch("negotiable") ?? false}
          onCheckedChange={(v) =>
            setValue("negotiable", v, { shouldDirty: true })
          }
        />
      </div>
    </div>
  );
}
