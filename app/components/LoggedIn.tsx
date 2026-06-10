import React from "react";
import { Search } from "./Search";
import { CartIcon } from "./CartIcon";
import { Avatar } from "./Avatar";

export const LoggedIn = () => {
  return (
    <div className="flex gap-3">
      <Search />
      <CartIcon />
      <Avatar />
    </div>
  );
};
