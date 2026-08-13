"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListing } from "@/lib/hooks/use-listings";
import { useQuery } from "@tanstack/react-query";
import { getListingBids } from "@/lib/api/listings";
import { BidStats } from "./_components/bid-stats";
import { BidList } from "./_components/bid-list";

export default function ListingBidsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: listing, isLoading: listingLoading } = useListing(id);
  const { data: bidsData, isLoading: bidsLoading } = useQuery({
    queryKey: ["listing-bids", id],
    queryFn: () => getListingBids(id),
    enabled: !!id,
  });

  const isLoading = listingLoading || bidsLoading;
  const bids = bidsData?.bids ?? [];
  const highestBid = bidsData?.highestBid ?? null;
  const isLocked = listing?.status !== "ACTIVE";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-16 text-center text-muted">Listing not found.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Bids</h1>
          <p className="text-sm text-muted truncate max-w-xs">
            {listing.title}
          </p>
        </div>
      </div>

      <BidStats bids={bids} highestBid={highestBid} />

      {/* Locked notice */}
      {isLocked && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          This listing is <strong>{listing.status}</strong> — no further actions
          can be taken on bids.
        </div>
      )}

      <BidList
        bids={bids}
        listingId={id}
        highestBid={highestBid}
        isLocked={isLocked}
      />
    </div>
  );
}
