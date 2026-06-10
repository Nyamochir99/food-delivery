"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type OrderSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToHome: () => void;
};

export const OrderSuccessDialog = ({
  open,
  onOpenChange,
  onBackToHome,
}: OrderSuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-109.75 w-166 max-w-166 flex-col items-center justify-between gap-6 rounded-[20px] p-6 sm:max-w-166"
      >
        <DialogHeader className="gap-0 text-center">
          <DialogTitle className="text-2xl font-semibold text-[#09090B]">
            Your order has been successfully placed!
          </DialogTitle>
          <DialogDescription className="sr-only">
            Your order was placed successfully
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 items-center justify-center">
          <Image
            src="/icons/logo.svg"
            alt="Order success"
            width={160}
            height={160}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onBackToHome}
          className="h-9 cursor-pointer text-sm font-medium text-[#09090B] hover:bg-transparent hover:underline"
        >
          Back to home
        </Button>
      </DialogContent>
    </Dialog>
  );
};
