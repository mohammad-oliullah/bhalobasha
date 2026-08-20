import apiClient from "./client";
import { Listing } from "@/types";

export async function addFavorite(listingId: string): Promise<void> {
  await apiClient.post(`/listings/${listingId}/favorite`);
}

export async function removeFavorite(listingId: string): Promise<void> {
  await apiClient.delete(`/listings/${listingId}/favorite`);
}

export async function getMyFavorites(): Promise<Listing[]> {
  const { data } = await apiClient.get<Listing[]>("/users/me/favorites");
  return data;
}

export async function getMyFavoriteIds(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>("/users/me/favorites/ids");
  return data;
}
