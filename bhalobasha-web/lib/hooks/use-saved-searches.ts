import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSavedSearch,
  CreateSavedSearchPayload,
  deleteSavedSearch,
  getSavedSearches,
  updateSavedSearchAlerts,
} from "@/lib/api/saved-searches";
import { useAuthStore } from "@/lib/store/auth.store";

export function useSavedSearches() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["saved-searches"],
    queryFn: getSavedSearches,
    enabled: isAuthenticated,
  });
}

export function useCreateSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSavedSearchPayload) =>
      createSavedSearch(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] }),
  });
}

export function useUpdateSavedSearchAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      alertsEnabled,
    }: {
      id: string;
      alertsEnabled: boolean;
    }) => updateSavedSearchAlerts(id, alertsEnabled),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] }),
  });
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSavedSearch,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] }),
  });
}
