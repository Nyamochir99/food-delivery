"use client";

import { showSuccessToast } from "@/lib/show-app-toast";

export const showAddedToCartAlert = (foodName: string, quantity = 1) => {
  showSuccessToast(
    "Added to cart",
    `${quantity > 1 ? `${quantity}x ` : ""}${foodName} has been added to your cart.`,
    3000,
  );
};
