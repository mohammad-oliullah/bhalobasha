"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtp } from "@/lib/api/auth";
import { setAuthCookie, clearAuthCookie } from "@/lib/actions/auth";
import { useAuthStore } from "@/lib/store/auth.store";

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, clearAuth, setUser } =
    useAuthStore();

  const sendOtpMutation = useMutation({
    mutationFn: (phone: string) => sendOtp(phone),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      verifyOtp(phone, code),
    onSuccess: async (data) => {
      await setAuthCookie(data.accessToken);
      setAuth(data.user, data.accessToken);
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
