"use client";
import { useCallback, useEffect } from "react";
import { User } from "@/lib/generated/prisma/client";
import {
  authRequest,
  isUnauthorizedError,
  refreshAccessToken,
} from "@/lib/auth-client";
import { showSuccessToast } from "@/lib/show-app-toast";
import { useUserStore } from "./user-store";

export { useUserStore } from "./user-store";

export const useUser = () => {
  const {
    user,
    accessToken,
    refreshToken,
    loading,
    setAccessToken,
    setRefreshToken,
    setUser,
    logout: storeLogout,
  } = useUserStore();

  const logout = useCallback(() => {
    storeLogout();
    showSuccessToast("Logged out", "You have been signed out successfully.");
  }, [storeLogout]);

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    setAccessToken,
    setRefreshToken,
    setUser,
    logout,
  };
};

export const UserProvider = () => {
  const { accessToken, refreshToken, setUser, setLoading, logout, _hasHydrated } =
    useUserStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    const loadUser = async () => {
      if (!accessToken && !refreshToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        if (accessToken) {
          const res = await authRequest<{ user: User }>({
            url: "/api/auth/me",
            method: "GET",
          });
          setUser(res.data.user);
          return;
        }

        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) return;

        const res = await authRequest<{ user: User }>({
          url: "/api/auth/me",
          method: "GET",
        });
        setUser(res.data.user);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logout();
          return;
        }

        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [_hasHydrated, accessToken, refreshToken, setUser, setLoading, logout]);

  return null;
};
