"use client";

import { Badge } from "@/components/ui/badge";
import { formatBDT, formatDate } from "@/lib/utils/format";
import { Bid } from "@/types";
import { Crown } from "lucide-react";

interface PublicBidsListProps {
  bids: Bid[];
  highestBid: number | null;
  myBidId?: string | null;
}

export function PublicBidsList({
  bids,
  highestBid,
  myBidId,
}: PublicBidsListProps) {
  if (bids.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-gray-50 px-4 py-8 text-center text-sm text-muted">
        No bids yet. Be the first to place one!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">
        Current Bids ({bids.length})
      </h3>
      <div className="space-y-2">
        {bids.map((bid, index) => {
          const isHighest = bid.amount === highestBid;
          const isMine = bid.id === myBidId;

          return (
            <div
              key={bid.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                isHighest
                  ? "border-green-200 bg-green-50"
                  : isMine
                    ? "border-amber-200 bg-amber-50"
                    : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/20 text-xs font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {bid.seeker?.name ?? "Anonymous Bidder"}
                    </p>
                    {isMine && (
                      <Badge className="bg-amber-100 text-amber-700 text-xs">
                        You
                      </Badge>
                    )}
                    {isHighest && (
                      <Badge className="bg-green-100 text-green-700 text-xs gap-1">
                        <Crown className="h-3 w-3" />
                        Highest
                      </Badge>
                    )}
                  </div>
                  {bid.message && (
                    <p className="text-xs text-muted truncate italic mt-0.5">
                      {bid.message}
                    </p>
                  )}
                  <p className="text-xs text-muted mt-0.5">
                    {formatDate(bid.createdAt)}
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-primary shrink-0 ml-3">
                {formatBDT(bid.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
