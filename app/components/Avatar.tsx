"use client";

import Image from "next/image";
import { LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "../user-provider";

export const Avatar = () => {
  const { user, logout } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-9 w-9 rounded-full bg-[#EF4444] flex items-center justify-center cursor-pointer outline-none">
          <Image src="/icons/avatar.svg" alt="avatar" width={16} height={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="bottom"
        sideOffset={8}
        className="min-w-40 max-w-150 w-auto h-27 rounded-xl p-4"
      >
        <DropdownMenuItem className="justify-center text-base font-medium h-9 cursor-pointer">
          <UserIcon />
          {user?.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          variant="destructive"
          className="justify-center cursor-pointer"
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
