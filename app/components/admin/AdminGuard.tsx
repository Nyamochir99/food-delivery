"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/user-provider";
import { FORBIDDEN_MESSAGE, handleForbiddenAccess } from "@/lib/admin-client";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "ADMIN") {
      handleForbiddenAccess(router);
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F5] text-sm text-[#71717A]">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F5] text-sm font-medium text-[#EF4444]">
        {FORBIDDEN_MESSAGE}
      </div>
    );
  }

  return children;
};
