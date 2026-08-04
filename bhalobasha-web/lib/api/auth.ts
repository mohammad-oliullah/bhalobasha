import { SendOtpPayload, VerifyOtpPayload, VerifyOtpResponse } from "@/types";
import apiClient from "./client";

export async function sendOtp(payload: SendOtpPayload): Promise<void> {
  await apiClient.post("/auth/send-otp", payload);
}

export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> {
  const { data } = await apiClient.post<VerifyOtpResponse>(
    "/auth/verify-otp",
    payload,
  );
  return data;
}
