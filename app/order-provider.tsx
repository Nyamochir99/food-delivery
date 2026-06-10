"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderItem = {
  name: string;
  quantity: number;
};

export type OrderStatus = "Pending" | "Delivered";

export type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  date: string;
  address: string;
};

type PlaceOrderInput = {
  items: OrderItem[];
  address: string;
  total: number;
};

type OrderStore = {
  orders: Order[];
  placeOrder: (input: PlaceOrderInput) => Order;
};

const generateOrderNumber = () =>
  String(Math.floor(10000 + Math.random() * 90000));

const formatOrderDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: ({ items, address, total }) => {
        const order: Order = {
          id: crypto.randomUUID(),
          orderNumber: generateOrderNumber(),
          total,
          status: "Pending",
          items,
          date: formatOrderDate(),
          address,
        };

        set({ orders: [order, ...get().orders] });
        return order;
      },
    }),
    { name: "order-storage" },
  ),
);

export const useOrders = () => {
  const { orders, placeOrder } = useOrderStore();
  return { orders, placeOrder };
};
