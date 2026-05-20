"use client";

import Image from "next/image";
import { useState } from "react";

export const Search = () => {
  const [input, setInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const handleClear = () => {
    setInput("");
  };
  return (
    <div
      className={`h-9 w-63 bg-white rounded-full flex py-2 px-3 gap-1 border ${isFocused ? "border-[#EF4444]" : "border-white"} transition-colors ease-in-out duration-200`}
    >
      <Image src="/icons/map.svg" alt="map" width={20} height={20} />
      <div className="relative flex gap-1 w-full">
        {!isFocused && input === "" && (
          <div className="gap-1 flex top-0 left-0 items-center pointer-events-none absolute">
            <span className="flex gap-1 w-46">
              <span className="text-xs font-normal text-[#EF4444]">
                Delivery address:
              </span>
              <span className="text-xs font-normal text-[#71717A]">
                Add Location
              </span>
            </span>
            <Image src="/icons/arrow.svg" alt="arrow" width={20} height={20} />
          </div>
        )}
        <input
          className="w-46 border-none outline-none bg-transparent text-xs font-normal text-[#18181B] placeholder:text-xs placeholder:font-normal placeholder:text-[#71717A]"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? "Add Location" : ""}
        />
        {input ? (
          <Image
            className="cursor-pointer"
            onClick={handleClear}
            src="/icons/clear.svg"
            alt="clear"
            width={20}
            height={20}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
