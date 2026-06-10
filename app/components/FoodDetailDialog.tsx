"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/cart-provider";

export type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

type FoodDetailDialogProps = {
  food: FoodItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const FoodDetailDialog = ({
  food,
  open,
  onOpenChange,
}: FoodDetailDialogProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setQuantity(1);
    }
    onOpenChange(next);
  };

  const totalPrice = (food.price * quantity).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-103 w-full min-w-206.5 gap-6 rounded-[20px] p-6">
        <div
          className="h-91 w-94.25 rounded-xl bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${food.image})` }}
        />
        <div className="flex h-91 w-94.25 flex-col justify-between">
          <DialogHeader className="gap-3 text-left">
            <DialogTitle className="text-3xl font-semibold text-[#EF4444]">
              {food.name}
            </DialogTitle>
            <DialogDescription className="text-base font-normal text-[#09090B]">
              {food.description}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1 w-94.25">
                <span className="text-base font-normal text-[#09090B]">
                  Total price
                </span>
                <span className="text-2xl font-semibold text-[#09090B]">
                  ${totalPrice}
                </span>
              </div>
              <div className="flex min-w-30.25 items-center justify-between">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex w-11 h-11 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white transition duration-200 hover:bg-[#f8f8f8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="size-4 text-[#09090B]" />
                </button>
                <span className="text-lg font-semibold text-[#09090B]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex w-11 h-11 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white transition duration-200 hover:bg-[#f8f8f8]"
                >
                  <Plus className="size-4 text-[#09090B]" />
                </button>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => {
                addItem(food, quantity);
                onOpenChange(false);
              }}
              className="h-11 w-full cursor-pointer rounded-full bg-[#18181B] text-sm font-medium text-[#FAFAFA] hover:bg-[#18181B]/90"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
