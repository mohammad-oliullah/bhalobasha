/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUpdateListing } from "@/lib/hooks/use-listings";
import { GenderPreference, Listing, ListingType, TenantPolicy } from "@/types";
import { EditBasicInfo } from "./edit-basic-info";
import { EditPricing } from "./edit-pricing";
import { EditDetails } from "./edit-details";
import { EditLocation } from "./edit-location";

const schema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  type: z.nativeEnum(ListingType),
  tenantPolicy: z.nativeEnum(TenantPolicy),
  genderPreference: z.nativeEnum(GenderPreference),
  rent: z.number().min(0),
  advanceAmount: z.number().min(0).optional(),
  negotiable: z.boolean(),
  areaId: z.number().min(1),
  address: z.string().min(10),
  totalRooms: z.number().min(1).optional(),
  totalBaths: z.number().min(1).optional(),
  floor: z.number().optional(),
  isFurnished: z.boolean(),
  utilitiesIncluded: z.boolean(),
  availableFrom: z.string(),
  contactPhone: z.string().regex(/^01[3-9]\d{8}$/),
});

export type EditFormData = z.infer<typeof schema>;

export function EditListingForm({ listing }: { listing: Listing }) {
  const router = useRouter();
  const updateListing = useUpdateListing();

  const form = useForm<EditFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      type: listing.type,
      tenantPolicy: listing.tenantPolicy,
      genderPreference: listing.genderPreference,
      rent: listing.rent,
      advanceAmount: listing.advanceAmount ?? undefined,
      negotiable: listing.negotiable,
      areaId: listing.areaId,
      address: listing.address,
      totalRooms: listing.totalRooms ?? undefined,
      totalBaths: listing.totalBaths ?? undefined,
      floor: listing.floor ?? undefined,
      isFurnished: listing.isFurnished,
      utilitiesIncluded: listing.utilitiesIncluded,
      availableFrom: listing.availableFrom.split("T")[0],
      contactPhone: listing.contactPhone,
    },
  });

  const {
    formState: { dirtyFields, isDirty },
  } = form;

  const onSubmit = form.handleSubmit(async (data) => {
    // Only send fields the user actually changed
    if (!isDirty) {
      toast.info("No changes to save");
      return;
    }

    const changedFields = Object.keys(dirtyFields) as (keyof EditFormData)[];
    const payload = changedFields.reduce((acc, key) => {
      acc[key] = data[key] as any;
      return acc;
    }, {} as Partial<EditFormData>);

    // availableFrom needs ISO conversion if changed
    if (payload.availableFrom) {
      payload.availableFrom = new Date(payload.availableFrom).toISOString();
    }
    // console.log(payload, "payload");

    try {
      await updateListing.mutateAsync({ id: listing.id, payload });
      toast.success("Listing updated");
      router.push("/dashboard/listings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Basic Info
        </h2>
        <EditBasicInfo form={form} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Pricing
        </h2>
        <EditPricing form={form} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Details
        </h2>
        <EditDetails form={form} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Location & Contact
        </h2>
        <EditLocation form={form} thanaId={listing.area.thanaId} />
      </section>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateListing.isPending || !isDirty}
          className="flex-1"
        >
          {updateListing.isPending
            ? "Saving..."
            : isDirty
              ? "Save Changes"
              : "No Changes"}
        </Button>
      </div>
    </form>
  );
}
