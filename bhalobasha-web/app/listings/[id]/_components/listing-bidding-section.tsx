"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBidSummary, useMyBids } from "@/lib/hooks/use-bids";
import { Listing } from "@/types";
import { BidSummaryCard } from "@/components/bids/BidSummary";
import { MyBidStatus } from "./../../../../components/bids/MyBidStatus";
import { PlaceBidModal } from "./../../../../components/bids/PlaceBidModal";

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

  const { data: bidSummary } = useBidSummary(listing.id);
  const { data: myBids = [] } = useMyBids();

  if (!listing.isBiddingEnabled || !bidSummary) return null;

  const myBid = myBids.find((b) => b.listingId === listing.id) ?? null;
  const biddingDeadlinePassed =
    listing.biddingDeadline && new Date() > new Date(listing.biddingDeadline);

  return (
    <div className="mt-8 space-y-3">
      <BidSummaryCard summary={bidSummary} />

      {isOwner && (
        <Button
          className="w-full bg-[#1a6b3c] hover:bg-[#145c32]"
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
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
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
          onClick={() => router.push("/login")}
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
