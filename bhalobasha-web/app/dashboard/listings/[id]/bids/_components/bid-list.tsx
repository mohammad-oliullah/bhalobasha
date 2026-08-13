import { BidCard } from "./bid-card";
import { Bid } from "@/types";

interface BidListProps {
  bids: Bid[];
  listingId: string;
  highestBid: number | null;
  isLocked: boolean;
}

export function BidList({
  bids,
  listingId,
  highestBid,
  isLocked,
}: BidListProps) {
  const pendingBids = bids.filter((b) => b.status === "PENDING");
  const otherBids = bids.filter((b) => b.status !== "PENDING");

  if (bids.length === 0) {
    return (
      <div className="py-16 text-center text-muted">
        No bids yet on this listing.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingBids.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted uppercase tracking-wide">
            Pending ({pendingBids.length})
          </h2>
          {pendingBids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              listingId={listingId}
              isHighest={bid.amount === highestBid}
              isLocked={isLocked}
            />
          ))}
        </div>
      )}

      {otherBids.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted uppercase tracking-wide">
            Closed Bids ({otherBids.length})
          </h2>
          {otherBids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              listingId={listingId}
              isHighest={false}
              isLocked={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
