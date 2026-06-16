"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Loader2,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Soup,
  X,
} from "lucide-react";
import Image from "next/image";
import { LogoImage } from "./Logo";
import { OrderHistorySkeleton } from "./skeletons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authRequest } from "@/lib/auth-client";
import { useCart } from "@/app/cart-provider";
import { useOrders } from "@/app/order-provider";
import { useUser } from "@/app/user-provider";
import { User } from "@/lib/generated/prisma/client";
import { AddressDialog } from "./AddressDialog";
import { OrderSuccessDialog } from "./OrderSuccessDialog";

const SHIPPING_FEE = 0.99;

export const CartIcon = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"cart" | "order">("cart");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } =
    useCart();
  const { orders, loading: ordersLoading, placeOrder } = useOrders();
  const { user, setUser } = useUser();

  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);
  const isEmpty = items.length === 0;
  const deliveryAddress = user?.address ?? "";
  const hasAddress = Boolean(user?.address?.trim());

  const completeOrder = async (address: string) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      setCheckoutLoading(true);
      await placeOrder({
        items: items.map((item) => ({
          foodId: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
        address,
        total,
      });
      clearCart();
      setTab("order");
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleBackToHome = () => {
    setSuccessDialogOpen(false);
    setSheetOpen(false);
    router.push("/");
  };

  const saveAddress = async (address: string) => {
    const res = await authRequest<{ user: User }>({
      url: "/api/user/address",
      method: "PATCH",
      data: { address },
    });
    setUser(res.data.user);
  };

  const handleCheckout = () => {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (hasAddress) {
      void completeOrder(deliveryAddress);
      return;
    }
    setAddressDialogOpen(true);
  };

  const handleAddressComplete = async (address: string) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      await saveAddress(address);
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <button
          onClick={() => setTab("cart")}
          type="button"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F4F4F5]"
        >
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-medium text-[#FAFAFA]">
              {itemCount}
            </span>
          )}
          <Image src="/icons/cart.svg" alt="cart" height={16} width={16} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex min-w-133.75 flex-col gap-6 border-none bg-[#404040] p-8 sm:max-w-133.75"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="flex items-center gap-3 text-xl font-semibold text-[#FAFAFA]">
            <ShoppingCart className="h-6 w-6" />
            Order detail
          </SheetTitle>
          <SheetDescription className="sr-only">
            View your cart items, payment details, and order history
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-11 w-full items-center gap-2 rounded-full bg-white p-2">
          <button
            type="button"
            onClick={() => setTab("cart")}
            className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-full text-lg font-normal transition-all duration-200 ${
              tab === "cart"
                ? "bg-[#EF4444] text-[#FAFAFA]"
                : "bg-white text-[#09090B]"
            }`}
          >
            Cart
          </button>
          <button
            type="button"
            onClick={() => setTab("order")}
            className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-full text-lg font-normal transition-all duration-200 ${
              tab === "order"
                ? "bg-[#EF4444] text-[#FAFAFA]"
                : "bg-white text-[#09090B]"
            }`}
          >
            Order
          </button>
        </div>

        {tab === "cart" ? (
          <div className="flex min-h-0 flex-1 flex-col gap-6">
            <div className="flex min-h-0 flex-1 flex-col rounded-[20px] bg-white p-6">
              <ScrollArea className="min-h-0 flex-1">
                <div className="flex flex-col gap-6 pr-3">
                  <h3 className="text-xl font-semibold text-[#09090B]">
                    My cart
                  </h3>

                  {isEmpty ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl bg-[#F4F4F5] px-6 py-10 text-center">
                      <LogoImage alt="empty cart" className="h-12 w-auto" />
                      <p className="text-base font-semibold text-[#09090B]">
                        Your cart is empty
                      </p>
                      <p className="text-sm font-normal text-[#71717A]">
                        Hungry? 🍔 Add some delicious dishes to your cart and
                        satisfy your cravings!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="relative flex gap-4 border-b border-dashed border-[#E4E4E7] pb-6 last:border-none last:pb-0"
                        >
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() => removeItem(item.id)}
                            className="absolute top-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#EF4444]"
                          >
                            <X className="size-3.5 text-white" />
                          </button>
                          <div
                            className="size-25 shrink-0 rounded-xl bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                          <div className="flex min-w-0 flex-1 flex-col gap-3">
                            <div className="flex min-w-0 flex-col gap-1 pr-8">
                              <span className="truncate text-base font-semibold text-[#EF4444]">
                                {item.name}
                              </span>
                              <span className="truncate text-xs font-normal text-[#71717A]">
                                {item.description}
                              </span>
                            </div>
                            <div className="flex items-end justify-between">
                              <div className="flex min-w-30.25 items-center justify-between">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white transition duration-200 hover:bg-[#f8f8f8]"
                                >
                                  <Minus className="size-4 text-[#09090B]" />
                                </button>
                                <span className="text-lg font-semibold text-[#09090B]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white transition duration-200 hover:bg-[#f8f8f8]"
                                >
                                  <Plus className="size-4 text-[#09090B]" />
                                </button>
                              </div>
                              <span className="text-base font-semibold text-[#09090B]">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex shrink-0 flex-col gap-4 rounded-[20px] bg-white p-6">
              <h3 className="text-xl font-semibold text-[#09090B]">
                Payment info
              </h3>
              <div className="flex flex-col gap-2 text-sm font-normal text-[#09090B]">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{isEmpty ? "-" : `$${subtotal.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{isEmpty ? "-" : `$${SHIPPING_FEE.toFixed(2)}`}</span>
                </div>
                <Separator className="border-dashed bg-transparent" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{isEmpty ? "-" : `$${total.toFixed(2)}`}</span>
                </div>
              </div>
              <button
                type="button"
                disabled={isEmpty || checkoutLoading}
                onClick={handleCheckout}
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-sm font-medium text-[#FAFAFA] transition disabled:cursor-not-allowed disabled:bg-[#FDA4AF] enabled:bg-[#EF4444] enabled:hover:bg-[#EF4444]/90"
              >
                {checkoutLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  "Checkout"
                )}
              </button>
            </div>

            <AddressDialog
              open={addressDialogOpen}
              onOpenChange={setAddressDialogOpen}
              onComplete={handleAddressComplete}
              initialAddress={deliveryAddress ?? ""}
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col rounded-[20px] bg-white p-6">
            <ScrollArea className="min-h-0 flex-1">
              <div className="flex flex-col gap-6 pr-3">
                <h3 className="text-xl font-semibold text-[#09090B]">
                  Order history
                </h3>
                {ordersLoading ? (
                  <OrderHistorySkeleton />
                ) : !user ? (
                  <p className="text-sm font-normal text-[#71717A]">
                    Sign in to view your order history.
                  </p>
                ) : orders.length === 0 ? (
                  <p className="text-sm font-normal text-[#71717A]">
                    No orders yet. Checkout your cart to place an order.
                  </p>
                ) : (
                  orders.map((order, index) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-4 border-b border-dashed border-[#E4E4E7] pb-6 last:border-none last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-[#09090B]">
                          ${order.total.toFixed(2)} (#{order.orderNumber})
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            order.status === "Pending"
                              ? "border border-[#EF4444] text-[#EF4444]"
                              : order.status === "Delivered"
                                ? "border border-[#22C55E] text-[#22C55E]"
                                : "border border-[#18181B] text-[#18181B]"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm text-[#09090B]"
                          >
                            <div className="flex items-center gap-2">
                              <Soup className="size-4 text-[#71717A]" />
                              <span>{item.name}</span>
                            </div>
                            <span className="text-[#71717A]">
                              x {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#71717A]">
                        <Clock className="size-4 shrink-0" />
                        <span>{order.date}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-[#71717A]">
                        <MapPin className="mt-0.5 size-4 shrink-0" />
                        <span>{order.address}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>

      <OrderSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onBackToHome={handleBackToHome}
      />
    </Sheet>
  );
};
