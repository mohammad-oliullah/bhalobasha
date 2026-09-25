import apiClient from "./client";
import { Area, District, Division, Upazila, Village } from "@/types";

export async function getDivisions(): Promise<Division[]> {
  const { data } = await apiClient.get<Division[]>("/locations/divisions");
  return data;
}

export async function getDistricts(divisionId: number): Promise<District[]> {
  const { data } = await apiClient.get<District[]>("/locations/districts", {
    params: { divisionId },
  });
  return data;
}

export async function getUPazilas(districtId: number): Promise<Upazila[]> {
  const { data } = await apiClient.get<Upazila[]>("/locations/upazilas", {
    params: { districtId },
  });
  return data;
}

export async function getAreas(upazilaId: number): Promise<Area[]> {
  const { data } = await apiClient.get<Area[]>("/locations/areas", {
    params: { upazilaId },
  });
  return data;
}

export async function getVillages(areaId: number): Promise<Village[]> {
  const { data } = await apiClient.get<Village[]>("/locations/villages", {
    params: { areaId },
  });
  return data;
}
