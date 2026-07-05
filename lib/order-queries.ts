import type { FoodOrderStatus } from "@/lib/generated/prisma/client";

export const adminOrderInclude = {
  user: { select: { email: true } },
  foodOrderItems: {
    include: {
      food: {
        select: { foodName: true, image: true },
      },
    },
  },
} as const;

export const VALID_ORDER_STATUSES = new Set<FoodOrderStatus>([
  "PENDING",
  "DELIVERED",
  "CANCELED",
]);

export const ORDER_STATUS_OPTIONS: FoodOrderStatus[] = [
  "DELIVERED",
  "PENDING",
  "CANCELED",
];
