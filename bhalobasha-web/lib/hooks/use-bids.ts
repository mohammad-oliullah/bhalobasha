import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListingBidSummary } from "@/lib/api/listings";
import {
  getMyBids,
  placeBid,
  withdrawBid,
  acceptBid,
  rejectBid,
} from "@/lib/api/bids";

export function useBidSummary(listingId: string) {
  return useQuery({
    queryKey: ["bid-summary", listingId],
    queryFn: () => getListingBidSummary(listingId),
    staleTime: 30_000,
  });
}

export function useMyBids() {
  return useQuery({
    queryKey: ["my-bids"],
    queryFn: getMyBids,
    staleTime: 30_000,
  });
}

export function usePlaceBid(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { amount: number; message?: string }) =>
      placeBid(listingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bid-summary", listingId] });
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
    },
  });
}

export function useWithdrawBid(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => withdrawBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bid-summary", listingId] });
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
    },
  });
}

export function useAcceptBid(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => acceptBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bid-summary", listingId] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useRejectBid(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => rejectBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bid-summary", listingId] });
    },
  });
}
