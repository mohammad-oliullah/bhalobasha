import apiClient from "./client";
import {
  BidsResponse,
  BidSummary,
  CreateListingPayload,
  Listing,
  ListingFilters,
  ListingStatus,
} from "@/types";

export async function getListings(
  filters?: ListingFilters,
): Promise<Listing[]> {
  const { data } = await apiClient.get<Listing[]>("/listings", {
    params: filters,
  });
  return data;
}

export async function getMyListings(ownerId: string): Promise<Listing[]> {
  const statuses = [
    ListingStatus.ACTIVE,
    ListingStatus.FILLED,
    ListingStatus.EXPIRED,
    ListingStatus.DRAFT,
  ];
  const results = await Promise.all(
    statuses.map((status) => getListings({ status })),
  );
  return results.flat().filter((l) => l.ownerId === ownerId);
}

export async function getListing(id: string): Promise<Listing> {
  const { data } = await apiClient.get<Listing>(`/listings/${id}`);
  return data;
}

export async function createListing(
  payload: CreateListingPayload,
): Promise<Listing> {
  const { data } = await apiClient.post<Listing>("/listings", payload);
  return data;
}

export async function updateListing(
  id: string,
  payload: Partial<CreateListingPayload>,
): Promise<Listing> {
  const { data } = await apiClient.patch<Listing>(`/listings/${id}`, payload);
  return data;
}

export async function deleteListing(id: string): Promise<void> {
  await apiClient.delete(`/listings/${id}`);
}

export async function markListingFilled(id: string): Promise<Listing> {
  const { data } = await apiClient.patch<Listing>(
    `/listings/${id}/mark-filled`,
  );
  return data;
}

export async function getListingBidSummary(
  listingId: string,
): Promise<BidSummary> {
  const { data } = await apiClient.get<BidSummary>(
    `/listings/${listingId}/bids/summary`,
  );
  return data;
}

export async function getListingBids(listingId: string): Promise<BidsResponse> {
  const { data } = await apiClient.get<BidsResponse>(
    `/listings/${listingId}/bids`,
  );
  return data;
}
