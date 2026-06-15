"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/generated/prisma/client";

type UseUserStore = {
  accessToken: string;
  refreshToken: string;
  user: User | null;
  loading: boolean;
  _hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
};

export const useUserStore = create<UseUserStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      refreshToken: "",
      loading: true,
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setLoading: (loading) => set({ loading }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logout: () =>
        set({
          user: null,
          accessToken: "",
          refreshToken: "",
          loading: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
