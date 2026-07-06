import apiClient from "./client";
import { AuthVerifyResponse } from "@/types";

export async function sendOtp(phone: string): Promise<void> {
  await apiClient.post("/auth/send-otp", { phone });
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<AuthVerifyResponse> {
  const { data } = await apiClient.post<AuthVerifyResponse>("/auth/verify-otp", {
    phone,
    code,
  });
  return data;
}
