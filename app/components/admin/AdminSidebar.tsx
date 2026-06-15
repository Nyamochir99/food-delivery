"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Truck } from "lucide-react";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const isFoodMenu = pathname === "/admin";
  const isOrders = pathname.startsWith("/admin/orders");

  return (
    <aside className="flex min-h-full w-60 shrink-0 flex-col border-r border-[#E4E4E7] bg-white px-4 py-6">
      <Link href="/" className="mb-10 flex items-center gap-3 px-2">
        <Image src="/icons/logo.svg" alt="NomNom" width={46} height={38} />
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-[#09090B]">
            Nom<span className="text-[#EF4444]">Nom</span>
          </span>
          <span className="text-xs font-normal text-[#71717A]">
            Swift delivery
          </span>
        </div>
      </Link>

      <nav className="flex flex-col gap-2">
        <Link
          href="/admin"
          className={`flex h-10 items-center gap-3 rounded-full px-4 text-sm font-medium transition ${
            isFoodMenu
              ? "bg-[#18181B] text-[#FAFAFA]"
              : "text-[#71717A] hover:bg-[#F4F4F5]"
          }`}
        >
          <LayoutGrid className="size-4" />
          Food menu
        </Link>
        <Link
          href="/admin/orders"
          className={`flex h-10 items-center gap-3 rounded-full px-4 text-sm font-medium transition ${
            isOrders
              ? "bg-[#18181B] text-[#FAFAFA]"
              : "text-[#71717A] hover:bg-[#F4F4F5]"
          }`}
        >
          <Truck className="size-4" />
          Orders
        </Link>
      </nav>
    </aside>
  );
};
