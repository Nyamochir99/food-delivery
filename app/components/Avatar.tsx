"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { LayoutGrid, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "../user-provider";

export const Avatar = () => {
  const { user, logout } = useUser();
  const emailRef = useRef<HTMLSpanElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEmailTruncated, setIsEmailTruncated] = useState(false);

  const checkEmailTruncation = useCallback(() => {
    const emailElement = emailRef.current;
    if (!emailElement) return;

    setIsEmailTruncated(emailElement.scrollWidth > emailElement.clientWidth);
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen) return;

    const frame = requestAnimationFrame(() => {
      checkEmailTruncation();
    });

    return () => cancelAnimationFrame(frame);
  }, [menuOpen, user?.email, checkEmailTruncation]);

  return (
    <DropdownMenu modal={false} open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#EF4444] outline-none">
          <Image src="/icons/avatar.svg" alt="avatar" width={16} height={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-64 rounded-xl p-2"
      >
        <TooltipProvider delayDuration={200}>
          <DropdownMenuLabel className="flex items-center gap-3 p-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EF4444]">
              <Image src="/icons/avatar.svg" alt="" width={16} height={16} />
            </span>
            <div className="min-w-0 flex-1">
              <Tooltip open={isEmailTruncated ? undefined : false}>
                <TooltipTrigger asChild>
                  <span
                    ref={emailRef}
                    className="block w-full truncate text-sm font-medium text-[#09090B]"
                  >
                    {user?.email}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={4}
                  className="z-100 max-w-xs break-all"
                >
                  {user?.email}
                </TooltipContent>
              </Tooltip>
              <span className="text-xs text-[#71717A]">
                {user?.role === "ADMIN" ? "Admin" : ""}
              </span>
            </div>
          </DropdownMenuLabel>
        </TooltipProvider>
        <DropdownMenuSeparator />
        {user?.role === "ADMIN" ? (
          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm text-[#09090B] focus:bg-[#F4F4F5]"
          >
            <Link href="/admin">
              <LayoutGrid />
              Admin panel
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onClick={logout}
          variant="destructive"
          className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm"
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
