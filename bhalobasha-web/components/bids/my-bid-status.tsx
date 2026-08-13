/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Bid } from "@/types";
import { useReactivateBid, useWithdrawBid } from "@/lib/hooks/use-bids";
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

const UNDO_SECONDS = 10;

interface MyBidStatusProps {
  bid: Bid;
  listingId: string;
}

export function MyBidStatus({ bid, listingId }: MyBidStatusProps) {
  const { mutate: withdraw, isPending } = useWithdrawBid(listingId);
  const config = statusConfig[bid.status];

  const [justWithdrawn, setJustWithdrawn] = useState(false);
  const [countdown, setCountdown] = useState(UNDO_SECONDS);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = useRef<string | number | null>(null);
  const { mutate: reactivate } = useReactivateBid(listingId);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    };
  }, []);

  function clearUndo() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    setJustWithdrawn(false);
    setCountdown(UNDO_SECONDS);
  }

  function handleUndo() {
    clearUndo();
    reactivate(bid.id, {
      onSuccess: () => toast.success("Bid reactivated successfully"),
      onError: (error: any) =>
        toast.error(
          error?.response?.data?.message ?? "Failed to reactivate bid",
        ),
    });
  }

  function startUndoWindow() {
    setJustWithdrawn(true);
    setCountdown(UNDO_SECONDS);

    toastIdRef.current = toast("Bid withdrawn", {
      duration: UNDO_SECONDS * 1000,
      position: "bottom-right",
      description: "You can re-bid on this listing anytime.",
      action: {
        label: "Undo",
        onClick: handleUndo,
      },
    });

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setJustWithdrawn(false);
          return UNDO_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleWithdraw() {
    withdraw(bid.id, {
      onSuccess: () => startUndoWindow(),
      onError: (error: any) =>
        toast.error(error?.response?.data?.message ?? "Failed to withdraw bid"),
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

      {/* PENDING — show withdraw button */}
      {bid.status === "PENDING" && !justWithdrawn && (
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

      {/* Undo window — shown for 10 seconds after withdraw */}
      {justWithdrawn && (
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-2">
          <p className="text-sm text-gray-600">
            Bid withdrawn.{" "}
            <span className="text-xs text-gray-400">
              Auto-closing in {countdown}s
            </span>
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
            onClick={handleUndo}
          >
            ↩ Undo Withdraw
          </Button>
        </div>
      )}

      {/* WITHDRAWN — undo window expired, inform they can re-bid */}
      {bid.status === "WITHDRAWN" && !justWithdrawn && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            You withdrew this bid. Reactivate it or place a new bid.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-green-200 text-green-700 hover:bg-green-50"
            onClick={() =>
              reactivate(bid.id, {
                onSuccess: () => toast.success("Bid reactivated successfully"),
                onError: (error: any) =>
                  toast.error(
                    error?.response?.data?.message ??
                      "Failed to reactivate bid",
                  ),
              })
            }
          >
            ↩ Reactivate Bid
          </Button>
        </div>
      )}
      {/* ACCEPTED */}
      {bid.status === "ACCEPTED" && (
        <p className="text-xs text-green-600 font-medium">
          The owner accepted your bid. They will contact you shortly.
        </p>
      )}
    </div>
  );
}
