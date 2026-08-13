import axios from "axios";
import { ApiResponse } from "@/types";
import { getAuthToken } from "../actions/get-token";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = await getAuthToken();
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4040";

  const response = await axios.post<ApiResponse<{ url: string }>>(
    `${baseURL}/api/v1/media/upload`,
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
