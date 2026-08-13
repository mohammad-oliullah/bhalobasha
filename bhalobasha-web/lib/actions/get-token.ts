"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "bhalobasha_token";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}
