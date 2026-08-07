"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useListing } from "@/lib/hooks/use-listings";
import { EditListingForm } from "./_components/edit-listing-form";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading } = useListing(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!listing) {
    return <p className="text-center text-muted py-16">Listing not found</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Listing</h1>
        <p className="text-muted">Update your listing details</p>
      </div>
      <EditListingForm key={listing.id} listing={listing} />
    </div>
  );
}
