"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { placeBid } from "@/lib/api/bids";
import { formatBDT } from "@/lib/utils/format";
import { BidSummary } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PlaceBidModalProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  summary: BidSummary;
  onSuccess: () => void;
}

export function PlaceBidModal({
  open,
  onClose,
  listingId,
  listingTitle,
  summary,
  onSuccess,
}: PlaceBidModalProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const schema = z.object({
    amount: z
      .number({ error: "Enter a valid amount" })
      .min(summary.minimumBid ?? 1, {
        message: `Minimum bid is ${formatBDT(summary.minimumBid ?? 1)}`,
      }),
    message: z.string().max(300).optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await placeBid(listingId, {
        amount: data.amount,
        message: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["bid-summary", listingId] });
      queryClient.invalidateQueries({ queryKey: ["public-bids", listingId] });
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      toast.success("Bid placed successfully!");
      reset();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? ((err as { response?: { data?: { message?: string } } }).response
              ?.data?.message as string | undefined)
          : undefined;

      toast.error(message ?? "Failed to place bid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
          <p className="text-sm text-gray-500 truncate">{listingTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Current highest bid info */}
          {summary.highestBid && (
            <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
              Current highest bid:{" "}
              <span className="font-semibold">
                {formatBDT(summary.highestBid)}
              </span>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-1">
            <Label htmlFor="amount">
              Your Bid Amount (BDT)
              {summary.minimumBid && (
                <span className="ml-1 text-xs text-gray-400">
                  (min {formatBDT(summary.minimumBid)})
                </span>
              )}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                ৳
              </span>
              <Input
                id="amount"
                type="number"
                className="pl-7"
                placeholder="e.g. 12000"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1">
            <Label htmlFor="message">
              Message to Owner{" "}
              <span className="text-xs text-gray-400">(optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself — profession, move-in date, references..."
              rows={3}
              className="resize-none"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#1a6b3c] hover:bg-[#145c32]"
              disabled={loading}
            >
              {loading ? "Placing..." : "Place Bid"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
