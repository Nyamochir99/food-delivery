"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/app/cart-provider";
import { FoodDetailDialog, type FoodItem } from "./FoodDetailDialog";

export const Card = ({ food }: { food: FoodItem }) => {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-85.5 w-100 cursor-pointer flex-col gap-5 rounded-[20px] bg-white p-4"
      >
        <div
          className="flex h-52.5 w-full items-end justify-end overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat p-5"
          style={{ backgroundImage: `url(${food.image})` }}
        >
          <button
            type="button"
            aria-label={`Add ${food.name} to cart`}
            className="group flex size-11 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm transition duration-150 select-none touch-manipulation hover:bg-[#f8f8f8] active:scale-90 active:bg-[#EF4444] active:shadow-inner"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.vibrate) {
                navigator.vibrate(10);
              }
              addItem(food, 1);
            }}
          >
            <Image
              src="/icons/plus.svg"
              alt=""
              height={16}
              width={16}
              className="pointer-events-none transition duration-150 group-active:brightness-0 group-active:invert"
            />
          </button>
        </div>
        <div className="flex h-20 w-full flex-col gap-2">
          <div className="flex w-full justify-between">
            <div className="cursor-pointer text-2xl font-semibold text-[#EF4444]">
              {food.name}
            </div>
            <div className="text-lg font-semibold text-[#09090B]">
              ${food.price.toFixed(2)}
            </div>
          </div>
          <div className="text-sm line-clamp-2 font-normal text-[#09090B]">
            {food.description}
          </div>
        </div>
      </div>

      <FoodDetailDialog food={food} open={open} onOpenChange={setOpen} />
    </>
  );
};
