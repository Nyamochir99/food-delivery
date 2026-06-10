import Link from "next/link";
import { CartIcon } from "./CartIcon";

export const Signup = () => {
  return (
    <div className="flex gap-3">
      <CartIcon />
      <Link
        href="/signin"
        className="py-2 px-3 items-center justify-center rounded-full bg-[#EF4444] text-sm font-medium text-[#FAFAFA] h-9 cursor-pointer"
      >
        Sign in
      </Link>
    </div>
  );
};
