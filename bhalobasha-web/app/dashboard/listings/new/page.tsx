"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateListing } from "@/lib/hooks/use-listings";
import { StepIndicator } from "./_components/step-indicator";
import {
  Step1BasicInfo,
  step1Schema,
  Step1Data,
} from "./_components/step1-basic-info";
import {
  Step2LocationDetails,
  step2Schema,
  Step2Data,
} from "./_components/step2-location-details";
import { Step3Photos } from "./_components/step3-photos";
import { GenderPreference, ListingType, TenantPolicy } from "@/types";

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
      isBiddingEnabled: false,
      minimumBid: 1,
      biddingDeadline: new Date().toISOString(),
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

  const handleSubmit = async () => {
    if (!step1Data || !step2Data) return;

    if (photos.length < 1) {
      toast.error("Upload at least 1 photo");
      return;
    }

    const payload = {
      // Step 1
      title: step1Data.title,
      description: step1Data.description,
      type: step1Data.type,
      tenantPolicy: step1Data.tenantPolicy,
      genderPreference: step1Data.genderPreference,
      rent: step1Data.rent,
      advanceAmount: step1Data.advanceAmount,
      negotiable: step1Data.negotiable,

      isBiddingEnabled: step1Data.isBiddingEnabled,
      minimumBid: step1Data.minimumBid,
      biddingDeadline: step1Data.biddingDeadline
        ? new Date(step1Data.biddingDeadline).toISOString()
        : undefined,

      // Step 2
      totalRooms: step2Data.totalRooms,
      totalBaths: step2Data.totalBaths,
      floor: step2Data.floor,
      isFurnished: step2Data.isFurnished,
      utilitiesIncluded: step2Data.utilitiesIncluded,
      availableFrom: new Date(step2Data.availableFrom).toISOString(),
      contactPhone: step2Data.contactPhone,
      address: step2Data.address,
      areaId: step2Data.areaId,

      photos: photos.map((p) => p.url),
    };

    try {
      // console.log(JSON.stringify(payload, null, 2));

      await createListing.mutateAsync(payload);

      toast.success("Listing posted successfully!");
      router.push("/dashboard/listings");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create listing",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Post New Listing</h1>
        <p className="text-muted">Share your property with renters</p>
      </div>

      <StepIndicator step={step} />

      {step === 0 && (
        <Step1BasicInfo
          form={step1Form}
          onNext={step1Form.handleSubmit((data) => {
            setStep1Data(data);
            setStep(1);
          })}
        />
      )}

      {step === 1 && (
        <Step2LocationDetails
          form={step2Form}
          onNext={step2Form.handleSubmit((data) => {
            setStep2Data(data);
            setStep(2);
          })}
          onBack={() => setStep(0)}
        />
      )}

      {step === 2 && (
        <Step3Photos
          photos={photos}
          onChange={setPhotos}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          isSubmitting={createListing.isPending}
        />
      )}
    </div>
  );
}
