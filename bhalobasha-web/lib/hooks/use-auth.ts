"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtp } from "@/lib/api/auth";
import { setAuthCookie, clearAuthCookie } from "@/lib/actions/auth";
import { useAuthStore } from "@/lib/store/auth.store";
import { SendOtpPayload, VerifyOtpPayload } from "@/types";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth, setUser } = useAuthStore();

  const sendOtpMutation = useMutation({
    mutationFn: (payload: SendOtpPayload) => sendOtp(payload),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
    onSuccess: async (data) => {
      await setAuthCookie(data.accessToken); // token → httpOnly cookie
      setAuth(data.user); // user data → Zustand memory only
    },
  });

  const logout = async () => {
    await clearAuthCookie();
    clearAuth();
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    setAuth,
    setUser,
    logout,
    sendOtp: sendOtpMutation,
    verifyOtp: verifyOtpMutation,
  };
}
