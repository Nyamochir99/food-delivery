import Image from "next/image";
import React from "react";

export const Card = () => {
  return (
    <div className="w-100 h-85.5 p-4 gap-5 flex flex-col rounded-[20px] bg-white">
      <div
        className="h-52.5 w-full rounded-xl overflow-hidden p-5 flex justify-end items-end bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(https://placehold.co/366x210)" }}
      >
        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white cursor-pointer hover:bg-[#f8f8f8] transition duration-200">
          <Image src="/icons/plus.svg" alt="plus" height={16} width={16} />
        </div>
      </div>
      <div className="w-full h-20 gap-2 flex flex-col">
        <div className="w-full flex justify-between">
          <div className="text-2xl font-semibold text-[#EF4444] cursor-pointer">
            Food Name
          </div>
          <div className="text-lg font-semibold text-[#09090B]">$99.99</div>
        </div>
        <div className="text-sm font-normal text-[#09090B]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero, eaque.
        </div>
      </div>
    </div>
  );
};
