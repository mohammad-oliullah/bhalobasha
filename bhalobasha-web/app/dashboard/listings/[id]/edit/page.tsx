"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListing, useUpdateListing } from "@/lib/hooks/use-listings";
import { useAreas } from "@/lib/hooks/use-locations";
import {
  GenderPreference,
  ListingType,
  TenantPolicy,
} from "@/types";
import {
  LISTING_TYPE_LABELS,
  TENANT_POLICY_LABELS,
} from "@/lib/utils/constants";
import { PhoneInput } from "@/components/auth/phone-input";

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

type FormData = z.infer<typeof schema>;

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: listing, isLoading } = useListing(id);
  const updateListing = useUpdateListing();

  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const thanaId = listing?.area.thanaId;

  const { data: areas = [] } = useAreas(thanaId);

  useEffect(() => {
    if (listing) {
      form.reset({
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
      });
    }
  }, [listing, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateListing.mutateAsync({
        id,
        payload: {
          ...data,
          availableFrom: new Date(data.availableFrom).toISOString(),
        },
      });
      toast.success("Listing updated");
      router.push("/dashboard/listings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!listing) {
    return <p>Listing not found</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Listing</h1>
        <p className="text-muted">Update your listing details</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input {...form.register("title")} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea {...form.register("description")} rows={4} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(v) => form.setValue("type", v as ListingType)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(ListingType).map((t) => (
                  <SelectItem key={t} value={t}>{LISTING_TYPE_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tenant Policy</Label>
            <Select
              value={form.watch("tenantPolicy")}
              onValueChange={(v) => form.setValue("tenantPolicy", v as TenantPolicy)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(TenantPolicy).map((p) => (
                  <SelectItem key={p} value={p}>{TENANT_POLICY_LABELS[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Area</Label>
          <Select
            value={form.watch("areaId")?.toString()}
            onValueChange={(v) => form.setValue("areaId", Number(v))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
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
          <Textarea {...form.register("address")} rows={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Rent (৳)</Label>
            <Input type="number" {...form.register("rent", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Advance (৳)</Label>
            <Input type="number" {...form.register("advanceAmount", { valueAsNumber: true })} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label>Negotiable</Label>
          <Switch
            checked={form.watch("negotiable")}
            onCheckedChange={(v) => form.setValue("negotiable", v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Furnished</Label>
          <Switch
            checked={form.watch("isFurnished")}
            onCheckedChange={(v) => form.setValue("isFurnished", v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Utilities Included</Label>
          <Switch
            checked={form.watch("utilitiesIncluded")}
            onCheckedChange={(v) => form.setValue("utilitiesIncluded", v)}
          />
        </div>
        <div className="space-y-2">
          <Label>Available From</Label>
          <Input type="date" {...form.register("availableFrom")} />
        </div>
        <div className="space-y-2">
          <Label>Contact Phone</Label>
          <PhoneInput
            value={form.watch("contactPhone")}
            onChange={(v) => form.setValue("contactPhone", v)}
          />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateListing.isPending} className="flex-1">
            {updateListing.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
