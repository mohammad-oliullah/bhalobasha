import apiClient from "./client";
import { Bid } from "@/types";

export async function placeBid(
  listingId: string,
  payload: { amount: number; message?: string },
): Promise<Bid> {
  const { data } = await apiClient.post<Bid>(
    `/listings/${listingId}/bids`,
    payload,
  );
  return data;
}

export async function withdrawBid(bidId: string): Promise<Bid> {
  const { data } = await apiClient.delete<Bid>(`/bids/${bidId}`);
  return data;
}

export async function acceptBid(bidId: string): Promise<Bid> {
  const { data } = await apiClient.patch<Bid>(`/bids/${bidId}/accept`);
  return data;
}

export async function rejectBid(bidId: string): Promise<Bid> {
  const { data } = await apiClient.patch<Bid>(`/bids/${bidId}/reject`);
  return data;
}

export async function getMyBids(): Promise<Bid[]> {
  const { data } = await apiClient.get<Bid[]>("/users/me/bids");
  return data;
}

export async function reactivateBid(bidId: string): Promise<Bid> {
  const { data } = await apiClient.patch<Bid>(`/bids/${bidId}/reactivate`);
  return data;
}
