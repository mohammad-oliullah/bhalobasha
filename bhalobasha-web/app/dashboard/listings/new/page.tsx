"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { PhotoUploader } from "@/components/listings/photo-uploader";
import { useCreateListing } from "@/lib/hooks/use-listings";
import {
  useDivisions,
  useDistricts,
  useThanas,
  useAreas,
} from "@/lib/hooks/use-locations";
import {
  GenderPreference,
  ListingType,
  TenantPolicy,
} from "@/types";
import {
  GENDER_LABELS,
  LISTING_TYPE_LABELS,
  TENANT_POLICY_LABELS,
} from "@/lib/utils/constants";
import { PhoneInput } from "@/components/auth/phone-input";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const step1Schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.nativeEnum(ListingType),
  tenantPolicy: z.nativeEnum(TenantPolicy),
  genderPreference: z.nativeEnum(GenderPreference),
  rent: z.number().min(0, "Rent must be positive"),
  advanceAmount: z.number().min(0).optional(),
  negotiable: z.boolean(),
});

const step2Schema = z.object({
  divisionId: z.number().min(1, "Select division"),
  districtId: z.number().min(1, "Select district"),
  thanaId: z.number().min(1, "Select thana"),
  areaId: z.number().min(1, "Select area"),
  address: z.string().min(10, "Enter full address"),
  totalRooms: z.number().min(1).optional(),
  totalBaths: z.number().min(1).optional(),
  floor: z.number().optional(),
  isFurnished: z.boolean(),
  utilitiesIncluded: z.boolean(),
  availableFrom: z.string().min(1, "Select available date"),
  contactPhone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid phone number"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const STEPS = ["Basic Info", "Location & Details", "Photos"];

export default function NewListingPage() {
  const router = useRouter();
  const createListing = useCreateListing();
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [photos, setPhotos] = useState<{ url: string; id: string }[]>([]);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      negotiable: false,
      type: ListingType.FULL_FLAT,
      tenantPolicy: TenantPolicy.ANY,
      genderPreference: GenderPreference.ANY,
    },
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      isFurnished: false,
      utilitiesIncluded: false,
      contactPhone: "",
      availableFrom: new Date().toISOString().split("T")[0],
    },
  });

  const divisionId = step2Form.watch("divisionId");
  const districtId = step2Form.watch("districtId");
  const thanaId = step2Form.watch("thanaId");

  const { data: divisions = [] } = useDivisions();
  const { data: districts = [] } = useDistricts(divisionId);
  const { data: thanas = [] } = useThanas(districtId);
  const { data: areas = [] } = useAreas(thanaId);

  const onStep1 = step1Form.handleSubmit((data) => {
    setStep1Data(data);
    setStep(1);
  });

  const onStep2 = step2Form.handleSubmit((data) => {
    setStep2Data(data);
    setStep(2);
  });

  const onSubmit = async () => {
    if (!step1Data || !step2Data) return;
    if (photos.length < 1) {
      toast.error("Upload at least 1 photo");
      return;
    }

    try {
      await createListing.mutateAsync({
        ...step1Data,
        ...step2Data,
        availableFrom: new Date(step2Data.availableFrom).toISOString(),
        photos: photos.map((p) => p.url),
      });
      toast.success("Listing posted successfully!");
      router.push("/dashboard/listings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create listing");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Post New Listing</h1>
        <p className="text-muted">Share your property with renters</p>
      </div>

      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                i <= step
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted",
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
              <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <form onSubmit={onStep1} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...step1Form.register("title")} placeholder="Spacious 2BHK in Mirpur" />
            {step1Form.formState.errors.title && (
              <p className="text-sm text-red-500">{step1Form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...step1Form.register("description")} rows={4} placeholder="Describe your property..." />
            {step1Form.formState.errors.description && (
              <p className="text-sm text-red-500">{step1Form.formState.errors.description.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={step1Form.watch("type")}
                onValueChange={(v) => step1Form.setValue("type", v as ListingType)}
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
                value={step1Form.watch("tenantPolicy")}
                onValueChange={(v) => step1Form.setValue("tenantPolicy", v as TenantPolicy)}
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
            <Label>Gender Preference</Label>
            <Select
              value={step1Form.watch("genderPreference")}
              onValueChange={(v) => step1Form.setValue("genderPreference", v as GenderPreference)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(GenderPreference).map((g) => (
                  <SelectItem key={g} value={g}>{GENDER_LABELS[g]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Monthly Rent (৳)</Label>
              <Input type="number" {...step1Form.register("rent", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Advance Amount (৳)</Label>
              <Input type="number" {...step1Form.register("advanceAmount", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Negotiable</Label>
            <Switch
              checked={step1Form.watch("negotiable")}
              onCheckedChange={(v) => step1Form.setValue("negotiable", v)}
            />
          </div>
          <Button type="submit" className="w-full">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={onStep2} className="space-y-4">
          <div className="space-y-2">
            <Label>Division</Label>
            <Select
              value={divisionId?.toString() || ""}
              onValueChange={(v) => {
                step2Form.setValue("divisionId", Number(v));
                step2Form.setValue("districtId", 0 as unknown as number);
                step2Form.setValue("thanaId", 0 as unknown as number);
                step2Form.setValue("areaId", 0 as unknown as number);
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>{d.nameBn} / {d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {divisionId > 0 && (
            <div className="space-y-2">
              <Label>District</Label>
              <Select
                value={districtId?.toString() || ""}
                onValueChange={(v) => {
                  step2Form.setValue("districtId", Number(v));
                  step2Form.setValue("thanaId", 0 as unknown as number);
                  step2Form.setValue("areaId", 0 as unknown as number);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id.toString()}>{d.nameBn} / {d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {districtId > 0 && (
            <div className="space-y-2">
              <Label>Thana</Label>
              <Select
                value={thanaId?.toString() || ""}
                onValueChange={(v) => {
                  step2Form.setValue("thanaId", Number(v));
                  step2Form.setValue("areaId", 0 as unknown as number);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select thana" /></SelectTrigger>
                <SelectContent>
                  {thanas.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>{t.nameBn} / {t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {thanaId > 0 && (
            <div className="space-y-2">
              <Label>Area</Label>
              <Select
                value={step2Form.watch("areaId")?.toString() || ""}
                onValueChange={(v) => step2Form.setValue("areaId", Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>{a.nameBn} / {a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Full Address</Label>
            <Textarea {...step2Form.register("address")} rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Rooms</Label>
              <Input type="number" {...step2Form.register("totalRooms", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Baths</Label>
              <Input type="number" {...step2Form.register("totalBaths", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Input type="number" {...step2Form.register("floor", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Furnished</Label>
            <Switch
              checked={step2Form.watch("isFurnished")}
              onCheckedChange={(v) => step2Form.setValue("isFurnished", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Utilities Included</Label>
            <Switch
              checked={step2Form.watch("utilitiesIncluded")}
              onCheckedChange={(v) => step2Form.setValue("utilitiesIncluded", v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Available From</Label>
            <Input type="date" {...step2Form.register("availableFrom")} />
          </div>
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <PhoneInput
              value={step2Form.watch("contactPhone")}
              onChange={(v) => step2Form.setValue("contactPhone", v)}
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(0)}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="submit" className="flex-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <PhotoUploader photos={photos} onChange={setPhotos} />
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button
              className="flex-1"
              onClick={onSubmit}
              disabled={createListing.isPending}
            >
              {createListing.isPending ? "Posting..." : "Post Listing"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
