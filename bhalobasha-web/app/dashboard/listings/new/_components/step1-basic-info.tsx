import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { ChevronRight } from "lucide-react";
import { z } from "zod";

export const step1Schema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    type: z.nativeEnum(ListingType),
    tenantPolicy: z.nativeEnum(TenantPolicy),
    genderPreference: z.nativeEnum(GenderPreference),
    rent: z.number().min(0, "Rent must be positive"),
    advanceAmount: z.number().min(0).optional(),
    negotiable: z.boolean(),

    isBiddingEnabled: z.boolean(),

    minimumBid: z.number().min(1).optional(),

    biddingDeadline: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isBiddingEnabled) {
      if (data.minimumBid == null || Number.isNaN(data.minimumBid)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["minimumBid"],
          message: "Minimum bid is required when bidding is enabled",
        });
      }

      if (!data.biddingDeadline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["biddingDeadline"],
          message: "Bidding deadline is required when bidding is enabled",
        });
      }
    }
  });

export type Step1Data = z.infer<typeof step1Schema>;

interface Step1Props {
  form: UseFormReturn<Step1Data>;
  onNext: () => void;
}

export function Step1BasicInfo({ form, onNext }: Step1Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input {...register("title")} placeholder="Spacious 2BHK in Mirpur" />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          {...register("description")}
          rows={4}
          placeholder="Describe your property..."
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={watch("type")}
            onValueChange={(v) => setValue("type", v as ListingType)}
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
            onValueChange={(v) => setValue("tenantPolicy", v as TenantPolicy)}
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
            setValue("genderPreference", v as GenderPreference)
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Monthly Rent (৳)</Label>
          <Input type="number" {...register("rent", { valueAsNumber: true })} />
          {errors.rent && (
            <p className="text-sm text-red-500">{errors.rent.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Advance Amount (৳)</Label>
          <Input
            type="number"
            {...register("advanceAmount", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label>Negotiable</Label>
        <Switch
          checked={watch("negotiable")}
          onCheckedChange={(v) => setValue("negotiable", v)}
        />
      </div>

      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <Label>Enable Bidding</Label>
          <p className="text-sm text-muted-foreground">
            Allow tenants to place bids instead of accepting only the fixed
            rent.
          </p>
        </div>

        <Switch
          checked={watch("isBiddingEnabled")}
          onCheckedChange={(v) => setValue("isBiddingEnabled", v)}
        />
      </div>

      {watch("isBiddingEnabled") && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Minimum Bid (৳)</Label>
            <Input
              type="number"
              {...register("minimumBid", {
                valueAsNumber: true,
              })}
            />
            {errors.minimumBid && (
              <p className="text-sm text-red-500">
                {errors.minimumBid.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Bidding Deadline</Label>
            <Input type="datetime-local" {...register("biddingDeadline")} />
            {errors.biddingDeadline && (
              <p className="text-sm text-red-500">
                {errors.biddingDeadline.message}
              </p>
            )}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">
        Next <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </form>
  );
}
