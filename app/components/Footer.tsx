import Link from "next/link";
import Marquee from "react-fast-marquee";
import { Logo } from "./Logo";
import Image from "next/image";
import { getFooterCategories } from "@/lib/menu";

export const Footer = async () => {
  const categories = await getFooterCategories();
  const useTwoColumns = categories.length > 5;
  const firstColumn = useTwoColumns ? categories.slice(0, 5) : categories;
  const secondColumn = useTwoColumns ? categories.slice(5) : [];

  return (
    <div className="flex w-full flex-col items-center gap-19 bg-[#18181B] pt-15 pb-28">
      <div className="flex w-full items-center overflow-hidden bg-[#EF4444] py-7">
        <Marquee speed={50} gradient={false} autoFill={true}>
          <span className="mx-4 text-3xl font-semibold text-[#FAFAFA]">
            Fresh fast delivered
          </span>
        </Marquee>
      </div>
      <div className="flex w-7xl flex-col gap-26">
        <div className="flex w-full justify-between">
          <Logo isVertical={true} />
          <div className="flex gap-28 text-base font-normal">
            <div className="flex w-30.5 flex-col gap-4">
              <span className="text-[#71717A]">NOMNOM</span>
              <Link href="/" className="cursor-pointer text-[#FAFAFA]">
                Home
              </Link>
              <span className="cursor-pointer text-[#FAFAFA]">Contact us</span>
              <span className="cursor-pointer text-[#FAFAFA]">
                Delivery zone
              </span>
            </div>
            <div className="flex gap-14">
              <div className="flex flex-col gap-4">
                <span className="text-[#71717A]">MENU</span>
                {firstColumn.map((category) => (
                  <div
                    key={category.id}
                    className="cursor-pointer text-[#FAFAFA]"
                  >
                    {category.categoryName}
                  </div>
                ))}
              </div>
              {secondColumn.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <span className="h-6 text-[#71717A]"></span>
                  {secondColumn.map((category) => (
                    <Link
                      key={category.id}
                      href={`/#category-${category.id}`}
                      className="cursor-pointer text-[#FAFAFA]"
                    >
                      {category.categoryName}
                    </Link>
                  ))}
                </div>
              ) : null}
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
        <div className="flex justify-start gap-12 border-t border-t-[#71717A] py-8 text-sm font-normal text-[#71717A]">
          <span>Copy right 2026 © Nomnom LLC</span>
          <span>Privacy policy </span>
          <span>Terms and conditoin</span>
          <span>Cookie policy</span>
        </div>
      </div>
    </div>
  );
};
