"use client";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAcceptBid, useRejectBid } from "@/lib/hooks/use-bids";
import { formatBDT, formatDate } from "@/lib/utils/format";
import { Bid } from "@/types";

const bidStatusConfig = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "Accepted", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-600" },
  WITHDRAWN: { label: "Withdrawn", className: "bg-muted/20 text-muted-foreground" },
  EXPIRED: { label: "Expired", className: "bg-muted/20 text-muted" },
};

interface BidCardProps {
  bid: Bid;
  listingId: string;
  isHighest: boolean;
  isLocked: boolean;
}

export function BidCard({ bid, listingId, isHighest, isLocked }: BidCardProps) {
  const acceptBid = useAcceptBid(listingId);
  const rejectBid = useRejectBid(listingId);
  const config = bidStatusConfig[bid.status];

  const handleAccept = async () => {
    try {
      await acceptBid.mutateAsync(bid.id);
      toast.success("Bid accepted — listing marked as filled");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message ?? "Failed to accept bid");
    }
  };

  const handleReject = async () => {
    try {
      await rejectBid.mutateAsync(bid.id);
      toast.success("Bid rejected");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message ?? "Failed to reject bid");
    }
  };

  return (
    <Card
      className={`transition-shadow hover:shadow-md ${
        isHighest && bid.status === "PENDING"
          ? "border-green-300 bg-green-50"
          : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Seeker info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                {bid.seeker?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="font-medium">
                  {bid.seeker?.name ?? "Unknown User"}
                </p>
                <p className="text-xs text-muted">
                  {bid.seeker?.phone ? bid.seeker?.phone : bid.seeker?.email}
                </p>
              </div>
              {isHighest && bid.status === "PENDING" && (
                <Badge className="bg-green-100 text-green-700 ml-1">
                  Highest
                </Badge>
              )}
            </div>

            {bid.message && (
              <p className="rounded-lg bg-surface-muted px-3 py-2 text-sm text-muted-foreground italic">
                {bid.message}
              </p>
            )}

            <p className="text-xs text-muted">
              Placed on {formatDate(bid.createdAt)}
            </p>
          </div>

          {/* Amount + actions */}
          <div className="flex flex-col items-end gap-3">
            <p className="text-2xl font-bold text-primary">
              {formatBDT(bid.amount)}
            </p>
            <Badge className={config.className}>{config.label}</Badge>

            {bid.status === "PENDING" && !isLocked && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={handleReject}
                  disabled={rejectBid.isPending}
                >
                  {rejectBid.isPending ? "..." : "Reject"}
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleAccept}
                  disabled={acceptBid.isPending}
                >
                  {acceptBid.isPending ? "..." : "Accept"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
