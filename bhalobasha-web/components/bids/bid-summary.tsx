"use client";

import { BidSummary } from "@/types";
import { formatBDT } from "@/lib/utils/format";
import { Clock, TrendingUp, Users } from "lucide-react";

interface BidSummaryProps {
  summary: BidSummary;
}

export function BidSummaryCard({ summary }: BidSummaryProps) {
  if (!summary.isBiddingEnabled) return null;

  const deadline = summary.biddingDeadline
    ? new Date(summary.biddingDeadline)
    : null;

  const isExpired = deadline ? new Date() > deadline : false;

  const timeLeft = deadline ? getTimeLeft(deadline) : null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
      <h3 className="font-semibold text-amber-800">Bidding Open</h3>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-lg bg-white p-3 shadow-sm">
          <Users className="h-4 w-4 text-amber-500 mb-1" />
          <span className="text-lg font-bold text-gray-800">
            {summary.totalBids}
          </span>
          <span className="text-xs text-gray-500">Bids</span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-white p-3 shadow-sm">
          <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
          <span className="text-lg font-bold text-gray-800">
            {summary.highestBid ? formatBDT(summary.highestBid) : "—"}
          </span>
          <span className="text-xs text-gray-500">Highest</span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-white p-3 shadow-sm">
          <Clock className="h-4 w-4 text-red-400 mb-1" />
          <span className="text-sm font-bold text-gray-800">
            {isExpired ? "Ended" : (timeLeft ?? "—")}
          </span>
          <span className="text-xs text-gray-500">Left</span>
        </div>
      </div>

      {summary.minimumBid && (
        <p className="text-xs text-amber-700">
          Minimum bid: {formatBDT(summary.minimumBid)}
        </p>
      )}

      {isExpired && (
        <p className="text-xs text-red-500 font-medium">
          Bidding has closed for this listing.
        </p>
      )}
    </div>
  );
}

function getTimeLeft(deadline: Date): string {
  const diff = deadline.getTime() - new Date().getTime();
  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
