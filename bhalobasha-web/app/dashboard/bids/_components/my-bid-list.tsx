"use client";

import { useRouter } from "next/navigation";
import { MyBidCard } from "./my-bid-card";
import { Bid } from "@/types";

interface MyBidListProps {
  bids: Bid[];
}

export function MyBidList({ bids }: MyBidListProps) {
  const router = useRouter();

  const pendingBids = bids.filter((b) => b.status === "PENDING");
  const otherBids = bids.filter((b) => b.status !== "PENDING");

  if (bids.length === 0) {
    return (
      <div className="py-16 text-center text-muted">
        {"You haven't placed any bids yet."}
        <span
          className="text-primary cursor-pointer hover:underline"
          onClick={() => router.push("/listings")}
        >
          Browse listings
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingBids.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Active Bids ({pendingBids.length})
          </h2>
          {pendingBids.map((bid) => (
            <MyBidCard key={bid.id} bid={bid} />
          ))}
        </div>
      )}

      {otherBids.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Past Bids ({otherBids.length})
          </h2>
          {otherBids.map((bid) => (
            <MyBidCard key={bid.id} bid={bid} />
          ))}
        </div>
      )}
    </div>
  );
}
