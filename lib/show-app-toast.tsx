"use client";

import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

export const showSuccessToast = (title: string, description?: string) => {
  toast.custom(
    () => (
      <Alert className="w-88 border-[#E4E4E7] bg-white shadow-xl">
        <CircleCheckIcon className="text-[#EF4444]" />
        <AlertTitle className="text-[#09090B]">{title}</AlertTitle>
        {description ? (
          <AlertDescription className="text-[#71717A]">
            {description}
          </AlertDescription>
        ) : null}
      </Alert>
    ),
    { duration: 4000 },
  );
};

export const showErrorToast = (title: string, description?: string) => {
  toast.custom(
    () => (
      <Alert className="w-88 border-[#E4E4E7] bg-white shadow-xl">
        <CircleAlertIcon className="text-[#EF4444]" />
        <AlertTitle className="text-[#09090B]">{title}</AlertTitle>
        {description ? (
          <AlertDescription className="text-[#71717A]">
            {description}
          </AlertDescription>
        ) : null}
      </Alert>
    ),
    { duration: 4000 },
  );
};
