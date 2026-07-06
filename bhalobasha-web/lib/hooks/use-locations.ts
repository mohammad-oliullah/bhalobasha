"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDivisions,
  getDistricts,
  getThanas,
  getAreas,
} from "@/lib/api/locations";

export function useDivisions() {
  return useQuery({
    queryKey: ["divisions"],
    queryFn: getDivisions,
    staleTime: 1000 * 60 * 60,
  });
}

export function useDistricts(divisionId?: number) {
  return useQuery({
    queryKey: ["districts", divisionId],
    queryFn: () => getDistricts(divisionId!),
    enabled: !!divisionId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useThanas(districtId?: number) {
  return useQuery({
    queryKey: ["thanas", districtId],
    queryFn: () => getThanas(districtId!),
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useAreas(thanaId?: number) {
  return useQuery({
    queryKey: ["areas", thanaId],
    queryFn: () => getAreas(thanaId!),
    enabled: !!thanaId,
    staleTime: 1000 * 60 * 60,
  });
}
