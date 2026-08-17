"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingPhotos } from "@/components/listings/listing-photos";
import { ContactOwnerModal } from "@/components/listings/contact-owner-modal";
import { ListingGrid } from "@/components/listings/listing-grid";
import { ListingHeader } from "./listing-header";
import { ListingDetailsGrid } from "./listing-details-grid";
import { ListingLocation } from "./listing-location";
import { ListingActions } from "./listing-actions";
import { ListingBiddingSection } from "./listing-bidding-section";
import { useListing, useListings } from "@/lib/hooks/use-listings";
import { useAuth } from "@/lib/hooks/use-auth";
import { ListingStatus } from "@/types";

export function ListingDetail({ id }: { id: string }) {
  const { data: listing, isLoading } = useListing(id);
  const { user, isAuthenticated } = useAuth();
  const [contactOpen, setContactOpen] = useState(false);

  const { data: allListings = [] } = useListings(
    listing
      ? {
          thanaId: listing.area.thanaId,
          type: listing.type,
          status: ListingStatus.ACTIVE,
        }
      : undefined,
  );

  const similar = allListings.filter((l) => l.id !== id).slice(0, 3);
  const isOwner = user?.id === listing?.ownerId;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <Skeleton className="aspect-[16/7] max-h-[420px] w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-lg font-medium">Listing not found</p>
        <Button asChild className="mt-4">
          <Link href="/listings">Back to listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <ListingPhotos photos={listing.photos} title={listing.title} />
      <ListingHeader listing={listing} />
      <ListingDetailsGrid listing={listing} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Description</h2>
        <p className="mt-2 whitespace-pre-wrap text-muted leading-relaxed">
          {listing.description}
        </p>
      </div>

      <ListingLocation listing={listing} />
      <ListingBiddingSection
        listing={listing}
        isOwner={isOwner}
        isAuthenticated={isAuthenticated}
      />
      <ListingActions
        listing={listing}
        isOwner={isOwner}
        onContactClick={() => setContactOpen(true)}
      />

      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold">Similar Listings</h2>
          <ListingGrid listings={similar} />
        </section>
      )}

      <ContactOwnerModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        contactPhone={listing.contactPhone}
        listingTitle={listing.title}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
