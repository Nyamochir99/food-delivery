import Image from "next/image";
import React from "react";

export const Logo = ({ isVertical }: { isVertical: boolean }) => {
  return (
    <div className={`flex gap-3 items-center ${isVertical ? "flex-col" : ""}`}>
      <Image src="/icons/logo.svg" alt="Logo" width={46} height={38} />
      <div className="flex flex-col items-center">
        <div className="text-xl font-semibold text-[#FAFAFA]">
          Nom<span className="text-[#EF4444]">Nom</span>
        </div>
        <div className="text-xs font-normal text-[#F4F4F5]">Swift delivery</div>
      </div>
    </div>
  );
};
