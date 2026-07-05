import type { FoodOrderStatus } from "@/lib/generated/prisma/client";
import { formatDateParts } from "@/lib/date-utils";

export const ORDER_STATUS_LABELS: Record<FoodOrderStatus, string> = {
  PENDING: "Pending",
  DELIVERED: "Delivered",
  CANCELED: "Cancelled",
};

export const ORDER_STATUS_STYLES: Record<FoodOrderStatus, string> = {
  PENDING: "border-[#EF4444] text-[#EF4444]",
  DELIVERED: "border-[#22C55E] text-[#22C55E]",
  CANCELED: "border-[#18181B] text-[#18181B]",
};

export const formatOrderDate = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  return formatDateParts(date, "/");
};
