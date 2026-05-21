import React from "react";
import { Logo } from "./Logo";
import { Signup } from "./Signup";
import { LoggedIn } from "./LoggedIn";

export const Header = ({ user }: { user: boolean }) => {
  return (
    <div className="flex justify-center w-full bg-[#18181B]">
      <div className="w-7xl py-3 flex justify-between items-center">
        <Logo isVertical={false} />
        {user ? <LoggedIn /> : <Signup />}
      </div>
    </div>
  );
};
