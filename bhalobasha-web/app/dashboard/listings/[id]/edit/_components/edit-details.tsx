import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EditFormData } from "./edit-listing-form";

export function EditDetails({ form }: { form: UseFormReturn<EditFormData> }) {
  const { register, watch, setValue } = form;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Rooms</Label>
          <Input
            type="number"
            {...register("totalRooms", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label>Baths</Label>
          <Input
            type="number"
            {...register("totalBaths", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label>Floor</Label>
          <Input
            type="number"
            {...register("floor", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label>Furnished</Label>
        <Switch
          checked={watch("isFurnished") ?? false}
          onCheckedChange={(v) =>
            setValue("isFurnished", v, { shouldDirty: true })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Utilities Included</Label>
        <Switch
          checked={watch("utilitiesIncluded") ?? false}
          onCheckedChange={(v) =>
            setValue("utilitiesIncluded", v, { shouldDirty: true })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Available From</Label>
        <Input type="date" {...register("availableFrom")} />
      </div>
    </div>
  );
}
