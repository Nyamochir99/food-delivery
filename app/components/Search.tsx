"use client";

import * as React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

type LocationItem = {
  podcode: string;
  podph: string;
  bairname: string;
  city: string;
  horoo: string;
  podtoktok: string;
  latitude: string;
  podkfc: string;
  geopoint: string;
  lon: string;
  full_address: string;
  bairnote: string;
  district: string;
  id: string;
  lat: string;
  longitude: string;
};

export const Search = () => {
  const [input, setInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [address, setAddress] = useState<LocationItem[]>([]);

  useEffect(() => {
    if (!input.trim()) {
      return;
    }
    axios
      .get(
        `/api/kfcsort/searchByAddress?address=${input.replaceAll(" ", "%20")}`,
      )
      .then((res) => {
        setAddress(res.data.data);
      });
  }, [input]);

  const handleClear = () => {
    setInput("");
  };
  return (
    <div className="flex flex-col relative h-9">
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
              <Image
                src="/icons/arrow.svg"
                alt="arrow"
                width={20}
                height={20}
              />
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
      {isFocused && input && address.length > 0 && (
        <ScrollArea className="w-63 h-auto max-h-70 rounded-xl bg-white shadow-xl absolute top-2 left-0 z-50">
          <div className="p-4">
            {address.map((add, index) => (
              <React.Fragment key={index}>
                <div
                  className="text-xs text-[#09090B] font-normal cursor-pointer hover:bg-[#f8f8f8] transition duration-300"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setInput(`${add.full_address} | ${add.bairnote}`);
                    setIsFocused(false);
                  }}
                >
                  {add.full_address} | {add.bairnote}
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
