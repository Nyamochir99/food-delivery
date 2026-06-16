"use client";

import axios, { type AxiosRequestConfig } from "axios";
import { useUserStore } from "@/app/user-store";

let refreshPromise: Promise<string | null> | null = null;

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export const isUnauthorizedError = (error: unknown) => {
  if (error instanceof UnauthorizedError) {
    return true;
  }

  if (axios.isAxiosError(error) && error.response?.status === 401) {
    return true;
  }

  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 401
  );
};

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
    throw new UnauthorizedError();
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
    if (!isUnauthorizedError(error)) {
      throw error;
    }

    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      throw new UnauthorizedError();
    }

    try {
      return await axios<T>({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } catch (retryError) {
      if (isUnauthorizedError(retryError)) {
        useUserStore.getState().logout();
        throw new UnauthorizedError();
      }

      throw retryError;
    }
  }
};
