import apiClient from "./client";
import { UpdateProfilePayload, User } from "@/types";

export async function getMyProfile(): Promise<User> {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const { data } = await apiClient.patch<User>("/users/me", payload);
  return data;
}
