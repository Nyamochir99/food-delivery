"use client";

import axios, { type AxiosRequestConfig } from "axios";
import { useUserStore } from "@/app/user-store";

let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken, setAccessToken, setRefreshToken, logout } =
    useUserStore.getState();

  if (!refreshToken) {
    logout();
    return null;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios
    .post("/api/auth/refresh", { refreshToken })
    .then((res) => {
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      return res.data.accessToken as string;
    })
    .catch(() => {
      logout();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const authRequest = async <T>(config: AxiosRequestConfig) => {
  const { accessToken } = useUserStore.getState();

  if (!accessToken) {
    const error = new Error("Unauthorized") as Error & {
      response?: { status: number };
    };
    error.response = { status: 401 };
    throw error;
  }

  try {
    return await axios<T>({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }

    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      throw error;
    }

    return axios<T>({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }
};
