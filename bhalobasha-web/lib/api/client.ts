import axios from "axios";
import { useAuthStore } from "@/lib/store/auth.store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
});

apiClient.interceptors.request.use(async (config) => {
  const { getAuthToken } = await import("@/lib/actions/get-token");
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      const { clearAuthCookie } = await import("@/lib/actions/auth");
      await clearAuthCookie();
      useAuthStore.getState().clearAuth();

      // Only redirect to login if on a protected route
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/dashboard")
      ) {
        window.location.href = "/login";
      }
      // On public pages (/, /listings, /listings/:id) — do nothing
      // Just clear the state silently
    }
    return Promise.reject(error);
  },
);

export default apiClient;