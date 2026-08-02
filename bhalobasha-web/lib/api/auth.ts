import apiClient from "./client";

interface SendOtpPayload {
  phone?: string;
  email?: string;
}

interface VerifyOtpPayload {
  phone?: string;
  email?: string;
  code: string;
}

interface VerifyOtpResponse {
  accessToken: string;
  user: {
    id: string;
    phone: string | null;
    email: string | null;
    name: string | null;
    role: string;
    isVerified: boolean;
    profilePhoto: string | null;
    createdAt: string;
  };
}

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
