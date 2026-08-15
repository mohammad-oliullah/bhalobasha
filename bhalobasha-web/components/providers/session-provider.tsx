"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { getMyProfile } from "@/lib/api/users";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    getMyProfile()
      .then((user) => {
        useAuthStore.getState().setAuth(user);
      })
      .catch(() => {
        // Just update state — do NOT redirect here
        // Middleware handles protecting /dashboard
        // Public pages should remain accessible
        useAuthStore.getState().clearAuth();
      });
  }, []);

  return <>{children}</>;
}
