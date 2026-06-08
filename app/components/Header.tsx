"use client";

import React from "react";
import { Logo } from "./Logo";
import { Signup } from "./Signup";
import { LoggedIn } from "./LoggedIn";
import { useUser } from "../user-provider";

export const Header = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center w-full bg-[#18181B] fixed top-0 h-16">
        <div className="w-7xl py-3 flex justify-start items-center">
          <Logo isVertical={false} />
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
