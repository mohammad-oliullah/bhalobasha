"use client";

import { toast } from "sonner";
import { Bid } from "@/types";
import { useWithdrawBid } from "@/lib/hooks/use-bids";
import { formatBDT } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "Accepted 🎉", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-600" },
  WITHDRAWN: { label: "Withdrawn", className: "bg-gray-100 text-gray-500" },
  EXPIRED: { label: "Expired", className: "bg-gray-100 text-gray-400" },
};

interface MyBidStatusProps {
  bid: Bid;
  listingId: string;
}

export function MyBidStatus({ bid, listingId }: MyBidStatusProps) {
  const { mutate: withdraw, isPending } = useWithdrawBid(listingId);
  const config = statusConfig[bid.status];

  function handleWithdraw() {
    withdraw(bid.id, {
      onSuccess: () => toast.success("Bid withdrawn"),
      onError: (error: Error) =>
        toast.error(error?.message ?? "Failed to withdraw bid"),
    });
  }

  return (
    <div className="rounded-xl border bg-white p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Your Bid</span>
        <Badge className={config.className}>{config.label}</Badge>
      </div>

      <p className="text-2xl font-bold text-[#1a6b3c]">
        {formatBDT(bid.amount)}
      </p>

      {bid.message && (
        <p className="text-xs text-gray-500 italic">{bid.message}</p>
      )}

      {bid.status === "PENDING" && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-red-500 border-red-200 hover:bg-red-50"
          onClick={handleWithdraw}
          disabled={isPending}
        >
          {isPending ? "Withdrawing..." : "Withdraw Bid"}
        </Button>
      )}

      {bid.status === "ACCEPTED" && (
        <p className="text-xs text-green-600 font-medium">
          The owner accepted your bid. They will contact you shortly.
        </p>
      )}
    </div>
  );
}
