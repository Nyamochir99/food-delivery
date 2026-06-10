"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FoodItem } from "@/app/components/FoodDetailDialog";
import { showAddedToCartAlert } from "@/lib/show-cart-alert";

export type CartItem = FoodItem & { quantity: number };

type CartStore = {
  items: CartItem[];
  addItem: (food: FoodItem, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (food, quantity) => {
        const existing = get().items.find((item) => item.id === food.id);
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === food.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({ items: [...get().items, { ...food, quantity }] });
        }
        showAddedToCartAlert(food.name, quantity);
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
);

export const useCart = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart } =
    useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return { items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart };
};
