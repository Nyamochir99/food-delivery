"use client";

import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleCheckIcon } from "lucide-react";

export const showAddedToCartAlert = (foodName: string, quantity = 1) => {
  toast.custom(
    () => (
      <Alert className="w-88 border-[#E4E4E7] bg-white shadow-xl">
        <CircleCheckIcon className="text-[#EF4444]" />
        <AlertTitle className="text-[#09090B]">Added to cart</AlertTitle>
        <AlertDescription className="text-[#71717A]">
          {quantity > 1 ? `${quantity}x ` : ""}
          {foodName} has been added to your cart.
        </AlertDescription>
      </Alert>
    ),
    { duration: 3000 },
  );
};
