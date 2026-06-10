"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  formatLocationAddress,
  type LocationItem,
} from "@/lib/location";

type AddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (address: string) => void;
  initialAddress?: string;
};

export const AddressDialog = ({
  open,
  onOpenChange,
  onComplete,
  initialAddress = "",
}: AddressDialogProps) => {
  const [input, setInput] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (open) {
      setInput(initialAddress);
      setSuggestions([]);
    }
  }, [open, initialAddress]);

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    axios
      .get(
        `/api/kfcsort/searchByAddress?address=${input.replaceAll(" ", "%20")}`,
      )
      .then((res) => {
        setSuggestions(res.data.data);
      });
  }, [input]);

  const handleComplete = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onComplete(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 rounded-[20px] p-6 sm:max-w-md">
        <DialogHeader className="gap-2 text-left">
          <DialogTitle className="text-xl font-semibold text-[#09090B]">
            Delivery address
          </DialogTitle>
          <DialogDescription className="text-sm font-normal text-[#71717A]">
            Please share your complete address
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex flex-col gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Add Location"
            className="h-11 w-full rounded-xl border border-[#E4E4E7] px-4 text-sm font-normal text-[#09090B] outline-none placeholder:text-[#71717A] focus-visible:border-[#EF4444]"
          />

          {isFocused && input && suggestions.length > 0 && (
            <ScrollArea className="max-h-70 rounded-xl border border-[#E4E4E7] bg-white shadow-xl">
              <div className="p-4">
                {suggestions.map((item, index) => (
                  <React.Fragment key={item.id || index}>
                    <button
                      type="button"
                      className="w-full cursor-pointer text-left text-xs font-normal text-[#09090B] transition hover:bg-[#f8f8f8]"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setInput(formatLocationAddress(item));
                        setIsFocused(false);
                      }}
                    >
                      {formatLocationAddress(item)}
                    </button>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <Button
          type="button"
          disabled={!input.trim()}
          onClick={handleComplete}
          className="h-11 w-full rounded-full bg-[#EF4444] text-sm font-medium text-[#FAFAFA] hover:bg-[#EF4444]/90 disabled:bg-[#FDA4AF]"
        >
          Complete
        </Button>
      </DialogContent>
    </Dialog>
  );
};
