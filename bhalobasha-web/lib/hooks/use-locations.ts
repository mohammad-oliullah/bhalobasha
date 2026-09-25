"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDivisions,
  getDistricts,
  getUPazilas,
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

export function useUpazilas(districtId?: number) {
  return useQuery({
    queryKey: ["upazilas", districtId],
    queryFn: () => getUPazilas(districtId!),
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useAreas(upazilaId?: number) {
  return useQuery({
    queryKey: ["areas", upazilaId],
    queryFn: () => getAreas(upazilaId!),
    enabled: !!upazilaId,
    staleTime: 1000 * 60 * 60,
  });
}
