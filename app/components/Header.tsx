"use client";

import React from "react";
import { Logo } from "./Logo";
import { Signup } from "./Signup";
import { LoggedIn } from "./LoggedIn";
import { HeaderAuthSkeleton } from "./skeletons";
import { useUser } from "../user-provider";

export const Header = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="fixed top-0 flex h-16 w-full justify-center bg-[#18181B]">
        <div className="flex w-7xl items-center justify-between py-3">
          <Logo isVertical={false} />
          <HeaderAuthSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full bg-[#18181B] fixed top-0">
      <div className="w-7xl py-3 flex justify-between items-center">
        <Logo isVertical={false} />
        {user ? <LoggedIn /> : <Signup />}
      </div>
    </div>
  );
};
