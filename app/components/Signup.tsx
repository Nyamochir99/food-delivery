import Link from "next/link";
import React from "react";

export const Signup = () => {
  return (
    <Link href="/signin" className="flex gap-3">
      <div className="py-2 px-3 items-center justify-center rounded-full bg-[#EF4444] text-sm font-medium text-[#FAFAFA] h-9 cursor-pointer">
        Sign in
      </div>
    </Link>
  );
};
