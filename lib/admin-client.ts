"use client";

import axios from "axios";
import { toast } from "sonner";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const FORBIDDEN_MESSAGE = "Forbidden 403";

export const isForbiddenError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 403) {
    return true;
  }

  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: number }).status === 403
  );
};

export const handleForbiddenAccess = (router: AppRouterInstance) => {
  toast.error(FORBIDDEN_MESSAGE);
  router.replace("/");
};

export const handleAdminRequestError = (
  error: unknown,
  router: AppRouterInstance,
) => {
  if (isForbiddenError(error)) {
    handleForbiddenAccess(router);
    return true;
  }

  return false;
};
