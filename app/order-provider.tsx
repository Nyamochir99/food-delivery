"use client";

import { create } from "zustand";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { authRequest } from "@/lib/auth-client";
import {
  mapDbOrderToOrder,
  type DbOrder,
  type Order,
} from "@/lib/order-mapper";
import { useUserStore } from "./user-store";

export type { Order, OrderItem, OrderStatus } from "@/lib/order-mapper";

type PlaceOrderInput = {
  items: { name: string; quantity: number; foodId?: string }[];
  address: string;
  total: number;
};

type OrderStore = {
  orders: Order[];
  loading: boolean;
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  loading: false,
  setOrders: (orders) => set({ orders }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ orders: [], loading: false }),
}));

const fetchOrdersFromApi = async () => {
  const { accessToken, user } = useUserStore.getState();
  if (!accessToken || !user) {
    return [];
  }

  const res = await authRequest<{ orders: DbOrder[] }>({
    url: "/api/orders",
    method: "GET",
  });

  return res.data.orders.map(mapDbOrderToOrder);
};

const isUnauthorizedError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    return true;
  }

  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 401
  );
};

export const OrderProvider = () => {
  const { user, _hasHydrated } = useUserStore();
  const { setOrders, setLoading, reset } = useOrderStore();

  useEffect(() => {
    localStorage.removeItem("order-storage");
    localStorage.removeItem("guest-address-storage");
  }, []);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!user) {
      reset();
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      const { accessToken } = useUserStore.getState();
      if (!accessToken) {
        reset();
        return;
      }

      setLoading(true);
      try {
        const orders = await fetchOrdersFromApi();
        if (cancelled || !useUserStore.getState().user) return;
        setOrders(orders);
      } catch (err) {
        if (cancelled) return;
        if (isUnauthorizedError(err)) {
          reset();
          return;
        }
        console.error("Failed to load orders:", err);
        setOrders([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user, _hasHydrated, setOrders, setLoading, reset]);

  return null;
};

export const useOrders = () => {
  const { orders, loading, setOrders, setLoading } = useOrderStore();
  const user = useUserStore((state) => state.user);

  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    setLoading(true);
    try {
      const nextOrders = await fetchOrdersFromApi();
      if (!useUserStore.getState().user) {
        setOrders([]);
        return;
      }
      setOrders(nextOrders);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        setOrders([]);
        return;
      }
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [user, setOrders, setLoading]);

  const placeOrder = useCallback(
    async (input: PlaceOrderInput) => {
      const res = await authRequest<{ order: DbOrder }>({
        url: "/api/orders",
        method: "POST",
        data: {
          address: input.address,
          totalPrice: input.total,
          items: input.items.map((item) => ({
            foodId: item.foodId,
            name: item.name,
            quantity: item.quantity,
          })),
        },
      });

      const order = mapDbOrderToOrder(res.data.order);
      setOrders([order, ...useOrderStore.getState().orders]);
      return order;
    },
    [setOrders],
  );

  return { orders, loading, placeOrder, loadOrders };
};
