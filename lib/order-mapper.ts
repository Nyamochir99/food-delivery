import type { FoodOrderStatus } from "@/lib/generated/prisma/client";
import { formatOrderDate } from "@/lib/order-status";

export type OrderItem = {
  name: string;
  quantity: number;
};

export type OrderStatus = "Pending" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  date: string;
  address: string;
};

export type DbOrder = {
  id: string;
  totalPrice: number;
  address: string;
  status: FoodOrderStatus;
  createdAt: string;
  foodOrderItems: {
    quantity: number;
    food: {
      foodName: string;
    };
  }[];
};

const mapStatus = (status: FoodOrderStatus): OrderStatus => {
  if (status === "DELIVERED") return "Delivered";
  if (status === "CANCELED") return "Cancelled";
  return "Pending";
};

export const mapDbOrderToOrder = (order: DbOrder): Order => ({
  id: order.id,
  orderNumber: order.id.slice(-5).toUpperCase(),
  total: order.totalPrice,
  status: mapStatus(order.status),
  items: order.foodOrderItems.map((item) => ({
    name: item.food.foodName,
    quantity: item.quantity,
  })),
  date: formatOrderDate(order.createdAt),
  address: order.address,
});
