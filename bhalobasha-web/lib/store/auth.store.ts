import { create } from "zustand";

interface User {
  id: string;
  phone: string | null;
  email: string | null;
  name: string | null;
  role: string;
  isVerified: boolean;
  profilePhoto: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // ← starts true until session check completes
  setAuth: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  setUser: (user) => set({ user }),
  clearAuth: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));