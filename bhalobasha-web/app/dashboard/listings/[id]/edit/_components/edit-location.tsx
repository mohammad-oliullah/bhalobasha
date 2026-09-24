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
import { LocationPicker } from "../../../new/_components/location-picker";

export function EditLocation({
  form,
  thanaId,
  initialLatitude,
  initialLongitude,
}: {
  form: UseFormReturn<EditFormData>;
  thanaId: number;
  initialLatitude?: number;
  initialLongitude?: number;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const { data: areas = [] } = useAreas(thanaId);
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const selectedArea = areas.find((area) => area.id === watch("areaId"));

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
        <Label>
          Pin Your Property Location{" "}
          <span className="text-xs text-muted">(optional)</span>
        </Label>
        <LocationPicker
          lat={latitude ?? initialLatitude}
          lng={longitude ?? initialLongitude}
          centerLat={selectedArea?.latitude ?? 23.8103}
          centerLng={selectedArea?.longitude ?? 90.4125}
          onChange={(nextLatitude, nextLongitude) => {
            setValue("latitude", nextLatitude, { shouldDirty: true });
            setValue("longitude", nextLongitude, { shouldDirty: true });
          }}
        />
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
