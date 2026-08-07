import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/auth/phone-input";
import { useAreas } from "@/lib/hooks/use-locations";
import { EditFormData } from "./edit-listing-form";

export function EditLocation({
  form,
  thanaId,
}: {
  form: UseFormReturn<EditFormData>;
  thanaId: number;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const { data: areas = [] } = useAreas(thanaId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Area</Label>
        <Select
          value={watch("areaId")?.toString()}
          onValueChange={(v) =>
            setValue("areaId", Number(v), { shouldDirty: true })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {areas.map((a) => (
              <SelectItem key={a.id} value={a.id.toString()}>
                {a.nameBn} / {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Textarea {...register("address")} rows={2} />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Contact Phone</Label>
        <PhoneInput
          value={watch("contactPhone") ?? ""}
          onChange={(v) => setValue("contactPhone", v, { shouldDirty: true })}
        />
        {errors.contactPhone && (
          <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
        )}
      </div>
    </div>
  );
}
