"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWithdrawBid } from "@/lib/hooks/use-bids";
import { formatBDT, formatDate } from "@/lib/utils/format";
import {
  LISTING_TYPE_COLORS,
  LISTING_TYPE_LABELS,
} from "@/lib/utils/constants";
import { Bid } from "@/types";

const bidStatusConfig = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "Accepted 🎉", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-600" },
  WITHDRAWN: { label: "Withdrawn", className: "bg-muted/20 text-gray-500" },
  EXPIRED: { label: "Expired", className: "bg-muted/20 text-gray-400" },
};

export function MyBidCard({ bid }: { bid: Bid }) {
  const router = useRouter();
  const withdraw = useWithdrawBid(bid.listingId);
  const config = bidStatusConfig[bid.status];
  const listing = bid.listing;

  const handleWithdraw = async () => {
    try {
      await withdraw.mutateAsync(bid.id);
      toast.success("Bid withdrawn");
    } catch (err: unknown) {
      const message = (() => {
        if (typeof err === "object" && err !== null) {
          const response = (err as { response?: unknown }).response;
          if (
            typeof response === "object" &&
            response !== null &&
            "data" in response
          ) {
            const data = (response as { data?: unknown }).data;
            if (
              typeof data === "object" &&
              data !== null &&
              "message" in data &&
              typeof (data as { message?: unknown }).message === "string"
            ) {
              return (data as { message: string }).message;
            }
          }
        }
        if (err instanceof Error) {
          return err.message;
        }
        return "Failed to withdraw";
      })();
      toast.error(message);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {listing?.type && (
                <Badge className={LISTING_TYPE_COLORS[listing.type]}>
                  {LISTING_TYPE_LABELS[listing.type]}
                </Badge>
              )}
              <Badge className={config.className}>{config.label}</Badge>
            </div>

            <p
              className="font-semibold hover:text-primary cursor-pointer"
              onClick={() =>
                listing?.id && router.push(`/listings/${listing.id}`)
              }
            >
              {listing?.title ?? "Listing unavailable"}
            </p>

            {listing?.area && (
              <p className="text-xs text-muted">
                {listing.area.thana?.name}, {listing.area.name}
              </p>
            )}

            <p className="text-xs text-muted">
              Bid placed on {formatDate(bid.createdAt)}
            </p>

            {bid.status === "ACCEPTED" && (
              <p className="text-xs text-green-600 font-medium">
                🎉 Your bid was accepted! The owner will contact you shortly.
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-xs text-muted">Your bid</p>
              <p className="text-2xl font-bold text-primary">
                {formatBDT(bid.amount)}
              </p>
              {listing?.rent && (
                <p className="text-xs text-muted">
                  Listed at {formatBDT(listing.rent)}
                </p>
              )}
            </div>

            {bid.status === "PENDING" && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleWithdraw}
                disabled={withdraw.isPending}
              >
                {withdraw.isPending ? "..." : "Withdraw"}
              </Button>
            )}

            {listing?.id && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push(`/listings/${listing.id}`)}
              >
                View Listing
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
