import React from "react";
import { Logo } from "./Logo";
import { Signup } from "./Signup";

export const Header = ({ user }: { user: boolean }) => {
  return (
    <div className="w-full py-3 px-22 flex justify-between items-center bg-[#18181B]">
      <Logo isVertical={false} />
      {user ? <></> : <Signup />}
    </div>
  );
};
