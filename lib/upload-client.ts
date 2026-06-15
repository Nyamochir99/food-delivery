"use client";

import { useUserStore } from "@/app/user-store";
import { refreshAccessToken } from "@/lib/auth-client";
import { isVercelBlobUrl } from "@/lib/blob-utils";

type BlobUploadResponse = {
  url: string;
};

export class UploadError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

const sendAuthorizedRequest = async (
  input: RequestInfo,
  init: RequestInit,
) => {
  const send = (token: string) =>
    fetch(input, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  const { accessToken } = useUserStore.getState();
  let response = await send(accessToken);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      throw new UploadError("Unauthorized", 401);
    }
    response = await send(newToken);
  }

  if (response.status === 403) {
    throw new UploadError("Forbidden 403", 403);
  }

  return response;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await sendAuthorizedRequest("/upload", {
    method: "PUT",
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as
    | BlobUploadResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    const message =
      data && "message" in data && data.message
        ? data.message
        : "Upload failed";
    throw new UploadError(message, response.status);
  }

  if (!data || !("url" in data) || !data.url) {
    throw new UploadError("Upload failed");
  }

  return data.url;
};

export const deleteBlobImage = async (url: string) => {
  if (!isVercelBlobUrl(url)) return;

  const response = await sendAuthorizedRequest(
    `/upload?url=${encodeURIComponent(url)}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new UploadError(data?.message || "Delete failed", response.status);
  }
};
