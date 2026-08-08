"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getListings,
  getListing,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
  markListingFilled,
  markListingUnFilled,
} from "@/lib/api/listings";
import {
  CreateListingPayload,
  ListingFilters,
  UpdateProfilePayload,
} from "@/types";
import { getMyProfile, updateProfile } from "../api/users";

export function useListings(filters?: ListingFilters) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => getListings(filters),
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListing(id),
    enabled: !!id,
  });
}

export function useMyListings(ownerId?: string) {
  return useQuery({
    queryKey: ["my-listings", ownerId],
    queryFn: () => getMyListings(ownerId!),
    enabled: !!ownerId,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateListingPayload) => createListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateListingPayload>;
    }) => updateListing(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", id] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["my-listings"] });
      const previous = queryClient.getQueryData(["my-listings"]);
      queryClient.setQueriesData(
        { queryKey: ["my-listings"] },
        (
          old: ReturnType<typeof getListings> extends Promise<infer T>
            ? T
            : never,
        ) =>
          old?.map((l) =>
            l.id === id ? { ...l, status: "EXPIRED" as const } : l,
          ),
      );
      return { previous };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useMarkListingFilled() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markListingFilled(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["my-listings"] });
      queryClient.setQueriesData(
        { queryKey: ["my-listings"] },
        (
          old: ReturnType<typeof getListings> extends Promise<infer T>
            ? T
            : never,
        ) =>
          old?.map((l) =>
            l.id === id ? { ...l, status: "FILLED" as const } : l,
          ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useMarkListingUnFilled() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markListingUnFilled(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["my-listings"] });
      queryClient.setQueriesData(
        { queryKey: ["my-listings"] },
        (
          old: ReturnType<typeof getListings> extends Promise<infer T>
            ? T
            : never,
        ) =>
          old?.map((l) =>
            l.id === id ? { ...l, status: "ACTIVE" as const } : l,
          ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
