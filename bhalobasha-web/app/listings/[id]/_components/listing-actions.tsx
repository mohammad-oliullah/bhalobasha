"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Phone, Pencil, CheckCircle } from "lucide-react";
import { Listing, ListingStatus } from "@/types";

interface ListingActionsProps {
  listing: Listing;
  isOwner: boolean;
  onContactClick: () => void;
}

export function ListingActions({
  listing,
  isOwner,
  onContactClick,
}: ListingActionsProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {!listing.isBiddingEnabled && (
        <Button size="lg" onClick={onContactClick}>
          <Phone className="h-5 w-5" />
          Contact Owner
        </Button>
      )}

      {isOwner && (
        <>
          <Button asChild variant="outline" size="lg">
            <Link href={`/dashboard/listings/${listing.id}/edit`}>
              <Pencil className="h-5 w-5" />
              Edit Listing
            </Link>
          </Button>
          {listing.status === ListingStatus.ACTIVE && (
            <Button
              variant="secondary"
              size="lg"
              onClick={async () => {
                try {
                  const { markListingFilled } =
                    await import("@/lib/api/listings");
                  await markListingFilled(listing.id);
                  toast.success("Marked as filled");
                  window.location.reload();
                } catch {
                  toast.error("Failed to update");
                }
              }}
            >
              <CheckCircle className="h-5 w-5" />
              Mark as Filled
            </Button>
          )}
        </>
      )}
    </div>
  );
}
