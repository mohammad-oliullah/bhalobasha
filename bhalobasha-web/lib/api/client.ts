import axios from "axios";

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
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
