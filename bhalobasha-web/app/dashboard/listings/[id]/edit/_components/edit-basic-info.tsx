import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GENDER_LABELS,
  LISTING_TYPE_LABELS,
  TENANT_POLICY_LABELS,
} from "@/lib/utils/constants";
import { GenderPreference, ListingType, TenantPolicy } from "@/types";
import { EditFormData } from "./edit-listing-form";

export function EditBasicInfo({ form }: { form: UseFormReturn<EditFormData> }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea {...register("description")} rows={4} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={watch("type")}
            onValueChange={(v) =>
              setValue("type", v as ListingType, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ListingType).map((t) => (
                <SelectItem key={t} value={t}>
                  {LISTING_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tenant Policy</Label>
          <Select
            value={watch("tenantPolicy")}
            onValueChange={(v) =>
              setValue("tenantPolicy", v as TenantPolicy, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TenantPolicy).map((p) => (
                <SelectItem key={p} value={p}>
                  {TENANT_POLICY_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gender Preference</Label>
        <Select
          value={watch("genderPreference")}
          onValueChange={(v) =>
            setValue("genderPreference", v as GenderPreference, {
              shouldDirty: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(GenderPreference).map((g) => (
              <SelectItem key={g} value={g}>
                {GENDER_LABELS[g]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
