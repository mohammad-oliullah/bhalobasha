import apiClient from "./client";
import {
  BidsResponse,
  BidSummary,
  CreateListingPayload,
  Listing,
  ListingFilters,
  ListingStatus,
} from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

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

export async function markListingUnFilled(id: string): Promise<Listing> {
  const { data } = await apiClient.patch<Listing>(
    `/listings/${id}/mark-unfilled`,
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

export async function getPublicListingBids(
  listingId: string,
): Promise<BidsResponse> {
  const { data } = await apiClient.get<BidsResponse>(
    `/listings/${listingId}/bids/public`,
  );
  return data;
}

export async function getListingServer(id: string): Promise<Listing> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/listings/${id}`,
    {
      next: { revalidate: 60 }, // cache for 60 seconds
    },
  );

  if (!res.ok) throw new Error("Listing not found");

  const json: ApiResponse<Listing> = await res.json();
  return json.data;
}
