import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const CartIcon = ({ orderCount }: { orderCount: number }) => {
  const [tab, setTab] = useState<string>("cart");
  return (
    <Sheet>
      <SheetTrigger>
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#F4F4F5] cursor-pointer relative">
          {orderCount > 0 && (
            <div className="w-5 h-5 flex items-center rounded-full justify-center text-[10px] text-[#FAFAFA] font-medium absolute -top-1.5 -right-1.5 bg-[#EF4444] z-30">
              {orderCount}
            </div>
          )}
          <Image src="/icons/cart.svg" alt="cart" height={16} width={16} />
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="p-8 bg-[#404040] gap-6 min-w-134 border-none"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-xl font-semibold text-[#FAFAFA]">
            <ShoppingCart className="h-6 w-6" /> Order detail
          </SheetTitle>
        </SheetHeader>
        <div className="w-full h-11 flex p-4 rounded-full bg-white">
          <div></div>
          <div></div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
