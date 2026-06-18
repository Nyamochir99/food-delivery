"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../user-provider";
import { useEffect } from "react";
import { SignInLayoutSkeleton } from "../components/skeletons";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-5">
        <SignInLayoutSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}
