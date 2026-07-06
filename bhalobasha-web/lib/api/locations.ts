import apiClient from "./client";
import { Area, District, Division, Thana } from "@/types";

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

export async function getThanas(districtId: number): Promise<Thana[]> {
  const { data } = await apiClient.get<Thana[]>("/locations/thanas", {
    params: { districtId },
  });
  return data;
}

export async function getAreas(thanaId: number): Promise<Area[]> {
  const { data } = await apiClient.get<Area[]>("/locations/areas", {
    params: { thanaId },
  });
  return data;
}
