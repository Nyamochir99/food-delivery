"use client";

import Image from "next/image";
import { useState } from "react";
import { FoodDetailDialog, type FoodItem } from "./FoodDetailDialog";

export const Card = ({ food }: { food: FoodItem }) => {
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
          <div
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white transition duration-200 hover:bg-[#f8f8f8]"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <Image src="/icons/plus.svg" alt="plus" height={16} width={16} />
          </div>
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
          <div className="text-sm font-normal text-[#09090B]">
            {food.description}
          </div>
        </div>
      </div>

      <FoodDetailDialog food={food} open={open} onOpenChange={setOpen} />
    </>
  );
};
