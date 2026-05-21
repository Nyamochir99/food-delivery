import React from "react";
import Marquee from "react-fast-marquee";
import { Logo } from "./Logo";
import Image from "next/image";

export const Footer = () => {
  return (
    <div className="w-full flex flex-col items-center bg-[#18181B] pt-15 pb-28 gap-19">
      <div className="w-full flex items-center py-7 bg-[#EF4444] overflow-hidden">
        <Marquee speed={50} gradient={false} autoFill={true}>
          <span className="text-3xl font-semibold text-[#FAFAFA] mx-4">
            Fresh fast delivered
          </span>
        </Marquee>
      </div>
      <div className="w-7xl flex flex-col gap-26">
        <div className="w-full flex justify-between">
          <Logo isVertical={true} />
          <div className="flex gap-28 text-base font-normal">
            <div className="flex flex-col gap-4 w-30.5">
              <span className="text-[#71717A]">NOMNOM</span>
              <span className="text-[#FAFAFA] cursor-pointer">Home</span>
              <span className="text-[#FAFAFA] cursor-pointer">Contact us</span>
              <span className="text-[#FAFAFA] cursor-pointer">
                Delivery zone
              </span>
            </div>
            <div className="flex gap-14">
              <div className="flex flex-col gap-4">
                <span className="text-[#71717A]">MENU</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#71717A] h-6"></span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
                <span className="text-[#FAFAFA] cursor-pointer">Category</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#71717A]">FOLLOW US</span>
              <div className="flex gap-4">
                <Image
                  className="cursor-pointer"
                  src="/icons/facebook.svg"
                  alt="facebook"
                  width={28}
                  height={28}
                />
                <Image
                  className="cursor-pointer"
                  src="/icons/instagram.svg"
                  alt="instagram"
                  width={28}
                  height={28}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex py-8 border-t border-t-[#71717A] gap-12 justify-start text-sm font-normal text-[#71717A]">
          <span>Copy right 2026 © Nomnom LLC</span>
          <span>Privacy policy </span>
          <span>Terms and conditoin</span>
          <span>Cookie policy</span>
        </div>
      </div>
    </div>
  );
};
