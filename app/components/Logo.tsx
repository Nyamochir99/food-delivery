import Image from "next/image";
import React from "react";

const LOGO_WIDTH = 46;
const LOGO_HEIGHT = 38;

type LogoImageProps = {
  alt: string;
  className?: string;
};

export const LogoImage = ({
  alt,
  className = "h-[38px] w-auto",
}: LogoImageProps) => (
  <Image
    src="/icons/logo.svg"
    alt={alt}
    width={LOGO_WIDTH}
    height={LOGO_HEIGHT}
    className={className}
  />
);

export const Logo = ({ isVertical }: { isVertical: boolean }) => {
  return (
    <div
      className={`flex cursor-pointer gap-3 items-center ${isVertical ? "flex-col" : ""}`}
    >
      <LogoImage alt="Logo" />
      <div className="flex flex-col items-center">
        <div className="text-xl font-semibold text-[#FAFAFA]">
          Nom<span className="text-[#EF4444]">Nom</span>
        </div>
        <div className="text-xs font-normal text-[#F4F4F5]">Swift delivery</div>
      </div>
    </div>
  );
};
