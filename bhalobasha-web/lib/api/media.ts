import axios from "axios";
import { useAuthStore } from "@/lib/store/auth.store";
import { ApiResponse } from "@/types";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = useAuthStore.getState().token;
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const response = await axios.post<ApiResponse<{ url: string }>>(
    `${baseURL}/media/upload`,
    formData,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const envelope = response.data;
  if (envelope && typeof envelope === "object" && "data" in envelope) {
    return (envelope as ApiResponse<{ url: string }>).data.url;
  }
  return (envelope as unknown as { url: string }).url;
}
