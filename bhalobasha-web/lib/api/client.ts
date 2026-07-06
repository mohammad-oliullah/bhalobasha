import axios from "axios";
import { ApiResponse } from "@/types";
import { useAuthStore } from "@/lib/store/auth.store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const envelope = response.data as ApiResponse<unknown>;
    if (envelope && typeof envelope === "object" && "success" in envelope) {
      response.data = envelope.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
