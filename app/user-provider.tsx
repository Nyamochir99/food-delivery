"use client";
import { create } from "zustand";
import { useEffect } from "react";
import axios from "axios";
import { User } from "@/lib/generated/prisma/client";
import { persist } from "zustand/middleware";

type UseUserStore = {
  accessToken: string;
  user: User | null;
  loading: boolean;
  _hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
};

const useUserStore = create<UseUserStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      loading: true,
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setLoading: (loading) => set({ loading }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logout: () => set({ user: null, accessToken: "", loading: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useUser = () => {
  const { user, accessToken, loading, setAccessToken, logout } = useUserStore();
  return { user, accessToken, loading, setAccessToken, logout };
};

export const UserProvider = () => {
  const { accessToken, setUser, setLoading, logout, _hasHydrated } =
    useUserStore();
  useEffect(() => {
    if (!_hasHydrated) return;

    if (accessToken) {
      setLoading(true);
      axios
        .get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("Auth error:", err);
          logout();
          if (err.response?.data?.message) {
            alert(err.response.data.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [_hasHydrated, accessToken, setUser, setLoading, logout]);

  return null;
};
