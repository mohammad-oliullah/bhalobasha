"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBidSummary, useMyBids, usePublicBids } from "@/lib/hooks/use-bids";
import { Listing } from "@/types";
import { PublicBidsList } from "@/components/bids/public-bids-list";
import { MyBidStatus } from "@/components/bids/my-bid-status";
import { PlaceBidModal } from "@/components/bids/place-bid-modal";
import { BidSummaryCard } from "@/components/bids/bid-summary";

interface ListingBiddingSectionProps {
  listing: Listing;
  isOwner: boolean;
  isAuthenticated: boolean;
}

export function ListingBiddingSection({
  listing,
  isOwner,
  isAuthenticated,
}: ListingBiddingSectionProps) {
  const router = useRouter();
  const [bidModalOpen, setBidModalOpen] = useState(false);

  const { data: bidSummary, isLoading: summaryLoading } = useBidSummary(
    listing.id,
  );
  const { data: publicBidsData, isLoading: bidsLoading } = usePublicBids(
    listing.id,
    listing.isBiddingEnabled,
  );
  const { data: myBids = [] } = useMyBids();

  if (!listing.isBiddingEnabled) return null;

  const myBid = myBids.find((b) => b.listingId === listing.id) ?? null;
  const biddingDeadlinePassed =
    listing.biddingDeadline && new Date() > new Date(listing.biddingDeadline);

  const publicBids = publicBidsData?.bids ?? [];
  const highestBid = publicBidsData?.highestBid ?? null;

  if (summaryLoading) {
    return (
      <div className="mt-8 space-y-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (!bidSummary?.isBiddingEnabled) return null;

  return (
    <div className="mt-8 space-y-4">
      <BidSummaryCard summary={bidSummary} />

      {bidsLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : (
        <PublicBidsList
          bids={publicBids}
          highestBid={highestBid}
          myBidId={myBid?.id}
        />
      )}

      {isOwner && (
        <Button
          className="w-full"
          onClick={() => router.push(`/dashboard/listings/${listing.id}/bids`)}
        >
          <Gavel className="h-4 w-4 mr-2" />
          Manage Bids ({bidSummary.totalBids})
        </Button>
      )}

      {!isOwner && isAuthenticated && (
        <>
          {myBid ? (
            <MyBidStatus bid={myBid} listingId={listing.id} />
          ) : (
            !biddingDeadlinePassed && (
              <Button
                className="w-full bg-amber-500 text-amber-950 hover:bg-amber-400"
                onClick={() => setBidModalOpen(true)}
              >
                <Gavel className="h-4 w-4 mr-2" />
                Place a Bid
              </Button>
            )
          )}
        </>
      )}

      {!isAuthenticated && !biddingDeadlinePassed && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/login?redirect=/listings/${listing.id}`)}
        >
          Login to Place a Bid
        </Button>
      )}

      <PlaceBidModal
        open={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
        summary={bidSummary}
        onSuccess={() => setBidModalOpen(false)}
      />
    </div>
  );
}
