import apiClient from "./client";
import { SavedSearch } from "@/types";

export type CreateSavedSearchPayload = Omit<
  SavedSearch,
  "id" | "createdAt" | "updatedAt" | "alertsEnabled" | "status"
>;

export async function getSavedSearches(): Promise<SavedSearch[]> {
  const { data } = await apiClient.get<SavedSearch[]>("/saved-searches");
  return data;
}

export async function createSavedSearch(
  payload: CreateSavedSearchPayload,
): Promise<SavedSearch> {
  const { data } = await apiClient.post<SavedSearch>(
    "/saved-searches",
    payload,
  );
  return data;
}

export async function updateSavedSearchAlerts(
  id: string,
  alertsEnabled: boolean,
): Promise<SavedSearch> {
  const { data } = await apiClient.patch<SavedSearch>(`/saved-searches/${id}`, {
    alertsEnabled,
  });
  return data;
}

export async function deleteSavedSearch(id: string): Promise<void> {
  await apiClient.delete(`/saved-searches/${id}`);
}
