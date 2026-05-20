import Image from "next/image";

export const CartIcon = ({ orderCount }: { orderCount: number }) => {
  return (
    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#F4F4F5] cursor-pointer relative">
      {orderCount > 0 && (
        <div className="w-5 h-5 flex items-center rounded-full justify-center text-[10px] text-[#FAFAFA] font-medium absolute -top-1.5 -right-1.5 bg-[#EF4444] z-30">
          {orderCount}
        </div>
      )}
      <Image src="/icons/cart.svg" alt="cart" height={16} width={16} />
    </div>
  );
};
