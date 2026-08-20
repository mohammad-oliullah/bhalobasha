import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
  getMyFavoriteIds,
} from "@/lib/api/favorites";
import { useAuthStore } from "@/lib/store/auth.store";

export function useMyFavoriteIds() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["favorite-ids"],
    queryFn: getMyFavoriteIds,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useMyFavorites() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getMyFavorites,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useToggleFavorite(listingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFavorited: boolean) => {
      if (isFavorited) {
        await removeFavorite(listingId);
      } else {
        await addFavorite(listingId);
      }
    },

    // Optimistic update
    onMutate: async (isFavorited: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["favorite-ids"] });

      const previous = queryClient.getQueryData<string[]>(["favorite-ids"]);

      queryClient.setQueryData<string[]>(["favorite-ids"], (old = []) => {
        if (isFavorited) {
          return old.filter((id) => id !== listingId);
        } else {
          return [...old, listingId];
        }
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Roll back on error
      if (context?.previous) {
        queryClient.setQueryData(["favorite-ids"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-ids"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
