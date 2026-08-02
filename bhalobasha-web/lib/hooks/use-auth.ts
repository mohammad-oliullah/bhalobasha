"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtp } from "@/lib/api/auth";
import { setAuthCookie, clearAuthCookie } from "@/lib/actions/auth";
import { useAuthStore } from "@/lib/store/auth.store";
import { User } from "@/types";

interface SendOtpPayload {
  phone?: string;
  email?: string;
}

interface VerifyOtpPayload {
  phone?: string;
  email?: string;
  code: string;
}

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, clearAuth, setUser } =
    useAuthStore();

  const sendOtpMutation = useMutation({
    mutationFn: (payload: SendOtpPayload) => sendOtp(payload),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
    onSuccess: async (data) => {
      await setAuthCookie(data.accessToken);
      setAuth(data.user as User, data.accessToken);
    },
  });

  const logout = async () => {
    await clearAuthCookie();
    clearAuth();
    router.push("/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    setUser,
    logout,
    sendOtp: sendOtpMutation,
    verifyOtp: verifyOtpMutation,
  };
}
