"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { authRequest } from "@/lib/auth-client";
import { handleAdminRequestError } from "@/lib/admin-client";
import {
  formatOrderDate,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/lib/order-status";
import type { FoodOrderStatus } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrdersTableSkeleton } from "@/app/components/skeletons";

type OrderItem = {
  quantity: number;
  food: {
    foodName: string;
    image: string;
  };
};

type AdminOrder = {
  id: string;
  totalPrice: number;
  address: string;
  status: FoodOrderStatus;
  createdAt: string;
  user: { email: string };
  foodOrderItems: OrderItem[];
};

type OrdersResponse = {
  orders: AdminOrder[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const STATUS_OPTIONS: FoodOrderStatus[] = ["DELIVERED", "PENDING", "CANCELED"];

const formatInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const createDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);

  return {
    start: formatInputDate(start),
    end: formatInputDate(end),
  };
};

const DEFAULT_DATE_RANGE = createDefaultDateRange();

type OrdersQuery = {
  page: number;
  sortBy: "date" | "status";
  sortOrder: "asc" | "desc";
  startDate: string;
  endDate: string;
};

const requestOrders = (query: OrdersQuery) =>
  authRequest<OrdersResponse>({
    url: "/api/admin/orders",
    method: "GET",
    params: query,
  }).then((res) => res.data);

type OrderFoodItem = {
  quantity: number;
  food: {
    foodName: string;
    image: string;
  };
};

const OrderFoodItemsPopover = ({
  items,
  foodCount,
}: {
  items: OrderFoodItem[];
  foodCount: number;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 text-[#09090B]"
      >
        {foodCount} foods
        <ChevronDown className="size-4 text-[#71717A]" />
      </button>
    </TooltipTrigger>
    <TooltipContent
      side="bottom"
      align="start"
      sideOffset={8}
      className="w-72 max-w-72 border border-[#E4E4E7] bg-white p-0 text-[#09090B] shadow-xl"
    >
      <ScrollArea className="max-h-60">
        <div className="flex flex-col gap-3 p-3 pr-4">
          {items.map((item, itemIndex) => (
            <div
              key={`${item.food.foodName}-${itemIndex}`}
              className="flex items-start gap-3"
            >
              <div
                className="size-10 shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${item.food.image})`,
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium wrap-break-word text-[#09090B]">
                  {item.food.foodName}
                </p>
                <p className="text-xs text-[#71717A]">x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </TooltipContent>
  </Tooltip>
);

export const OrdersContent = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<FoodOrderStatus>("DELIVERED");
  const [savingBulk, setSavingBulk] = useState(false);
  const [startDate, setStartDate] = useState(DEFAULT_DATE_RANGE.start);
  const [endDate, setEndDate] = useState(DEFAULT_DATE_RANGE.end);

  const loadOrders = useCallback(
    async (query: OrdersQuery, options?: { showLoading?: boolean }) => {
      if (options?.showLoading ?? true) {
        setLoading(true);
      }

      try {
        const data = await requestOrders(query);

        setOrders(data.orders);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setSelectedIds((current) =>
          current.filter((id) => data.orders.some((order) => order.id === id)),
        );
      } catch (err) {
        if (handleAdminRequestError(err, router)) return;
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    let cancelled = false;

    requestOrders({
      page: 1,
      sortBy: "date",
      sortOrder: "desc",
      startDate: DEFAULT_DATE_RANGE.start,
      endDate: DEFAULT_DATE_RANGE.end,
    })
      .then((data) => {
        if (cancelled) return;

        setOrders(data.orders);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setSelectedIds([]);
      })
      .catch((err) => {
        if (cancelled) return;
        if (handleAdminRequestError(err, router)) return;
        console.error("Failed to load orders:", err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const allSelected = orders.length > 0 && selectedIds.length === orders.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : orders.map((order) => order.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleSort = (column: "date" | "status") => {
    if (sortBy === column) {
      const nextSortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(nextSortOrder);
      void loadOrders({
        page,
        sortBy,
        sortOrder: nextSortOrder,
        startDate,
        endDate,
      });
      return;
    }

    setSortBy(column);
    setSortOrder("desc");
    setPage(1);
    void loadOrders({
      page: 1,
      sortBy: column,
      sortOrder: "desc",
      startDate,
      endDate,
    });
  };

  const updateOrderStatus = async (
    orderId: string,
    status: FoodOrderStatus,
  ) => {
    try {
      await authRequest({
        url: `/api/admin/orders/${orderId}`,
        method: "PATCH",
        data: { status },
      });
      await loadOrders({
        page,
        sortBy,
        sortOrder,
        startDate,
        endDate,
      });
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to update order status:", err);
    }
  };

  const handleBulkSave = async () => {
    if (selectedIds.length === 0) return;

    try {
      setSavingBulk(true);
      await authRequest({
        url: "/api/admin/orders",
        method: "PATCH",
        data: {
          orderIds: selectedIds,
          status: bulkStatus,
        },
      });
      setBulkDialogOpen(false);
      setSelectedIds([]);
      await loadOrders({
        page,
        sortBy,
        sortOrder,
        startDate,
        endDate,
      });
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to bulk update orders:", err);
    } finally {
      setSavingBulk(false);
    }
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages, page]);
    if (page > 2) pages.add(page - 1);
    if (page < totalPages - 1) pages.add(page + 1);
    pages.add(2);
    pages.add(totalPages - 1);

    return Array.from(pages).sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col gap-6">
        <section className="rounded-[20px] bg-white p-6">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#09090B]">Orders</h1>
              <div className="mt-1 text-sm text-[#71717A]">
                {loading ? (
                  <Skeleton className="h-4 w-16 rounded-md bg-[#E4E4E7]" />
                ) : (
                  `${total} items`
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E4E4E7] px-4 text-sm text-[#09090B]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    const nextStartDate = event.target.value;
                    setStartDate(nextStartDate);
                    setPage(1);
                    void loadOrders({
                      page: 1,
                      sortBy,
                      sortOrder,
                      startDate: nextStartDate,
                      endDate,
                    });
                  }}
                  className="h-8 rounded-lg border border-[#E4E4E7] px-2 text-sm outline-none"
                  aria-label="Start date"
                />
                <span className="text-[#71717A]">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => {
                    const nextEndDate = event.target.value;
                    setEndDate(nextEndDate);
                    setPage(1);
                    void loadOrders({
                      page: 1,
                      sortBy,
                      sortOrder,
                      startDate,
                      endDate: nextEndDate,
                    });
                  }}
                  className="h-8 rounded-lg border border-[#E4E4E7] px-2 text-sm outline-none"
                  aria-label="End date"
                />
              </div>
              <Button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => setBulkDialogOpen(true)}
                className="h-11 rounded-full bg-[#18181B] px-5 text-white hover:bg-[#18181B]/90 disabled:bg-[#E4E4E7] disabled:text-[#71717A]"
              >
                Change delivery state
                {selectedIds.length > 0 ? (
                  <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#18181B]">
                    {selectedIds.length}
                  </span>
                ) : null}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-left text-sm text-[#71717A]">
                  <th className="px-3 py-4 font-medium">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="size-4 rounded border-[#E4E4E7]"
                      aria-label="Select all orders"
                    />
                  </th>
                  <th className="px-3 py-4 font-medium">№</th>
                  <th className="px-3 py-4 font-medium">Customer</th>
                  <th className="px-3 py-4 font-medium">Food</th>
                  <th className="px-3 py-4 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort("date")}
                      className="inline-flex items-center gap-1"
                    >
                      Date
                      <ArrowDownUp className="size-3.5" />
                    </button>
                  </th>
                  <th className="px-3 py-4 font-medium">Total</th>
                  <th className="px-3 py-4 font-medium">Delivery Address</th>
                  <th className="px-3 py-4 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort("status")}
                      className="inline-flex items-center gap-1"
                    >
                      Delivery state
                      <ArrowDownUp className="size-3.5" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <OrdersTableSkeleton />
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-sm text-[#71717A]"
                    >
                      No orders found for this date range.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => {
                    const foodCount = order.foodOrderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    );

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-[#E4E4E7] text-sm text-[#09090B] last:border-none"
                      >
                        <td className="px-3 py-4 align-middle">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(order.id)}
                            onChange={() => toggleSelect(order.id)}
                            className="size-4 rounded border-[#E4E4E7]"
                            aria-label={`Select order ${index + 1}`}
                          />
                        </td>
                        <td className="px-3 py-4 align-middle">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-3 py-4 align-middle">
                          {order.user.email}
                        </td>
                        <td className="px-3 py-4 align-middle">
                          <OrderFoodItemsPopover
                            items={order.foodOrderItems}
                            foodCount={foodCount}
                          />
                        </td>
                        <td className="px-3 py-4 align-middle">
                          {formatOrderDate(order.createdAt)}
                        </td>
                        <td className="px-3 py-4 align-middle">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="max-w-56 truncate px-3 py-4 align-middle">
                          {order.address}
                        </td>
                        <td className="px-3 py-4 align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className={`inline-flex h-8 items-center gap-1 rounded-full border px-3 text-sm font-medium ${ORDER_STATUS_STYLES[order.status]}`}
                              >
                                {ORDER_STATUS_LABELS[order.status]}
                                <ChevronDown className="size-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="min-w-36"
                            >
                              {STATUS_OPTIONS.map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() =>
                                    void updateOrderStatus(order.id, status)
                                  }
                                >
                                  {ORDER_STATUS_LABELS[status]}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => {
                  const nextPage = Math.max(1, page - 1);
                  setPage(nextPage);
                  void loadOrders({
                    page: nextPage,
                    sortBy,
                    sortOrder,
                    startDate,
                    endDate,
                  });
                }}
                className="flex size-9 items-center justify-center rounded-full text-[#71717A] transition hover:bg-[#F4F4F5] disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>

              {pageNumbers.map((pageNumber, index) => {
                const previous = pageNumbers[index - 1];
                const showEllipsis = previous && pageNumber - previous > 1;

                return (
                  <span key={pageNumber} className="flex items-center gap-2">
                    {showEllipsis ? (
                      <span className="px-1 text-sm text-[#71717A]">...</span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setPage(pageNumber);
                        void loadOrders({
                          page: pageNumber,
                          sortBy,
                          sortOrder,
                          startDate,
                          endDate,
                        });
                      }}
                      className={`flex size-9 items-center justify-center rounded-full text-sm transition ${
                        page === pageNumber
                          ? "bg-[#18181B] text-white"
                          : "text-[#71717A] hover:bg-[#F4F4F5]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </span>
                );
              })}

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => {
                  const nextPage = Math.min(totalPages, page + 1);
                  setPage(nextPage);
                  void loadOrders({
                    page: nextPage,
                    sortBy,
                    sortOrder,
                    startDate,
                    endDate,
                  });
                }}
                className="flex size-9 items-center justify-center rounded-full text-[#71717A] transition hover:bg-[#F4F4F5] disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : null}
        </section>

        <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
          <DialogContent className="gap-6 rounded-[20px] p-6 sm:max-w-md">
            <DialogHeader className="gap-2 text-left">
              <DialogTitle className="text-xl font-semibold text-[#09090B]">
                Change delivery state
              </DialogTitle>
              <DialogDescription className="sr-only">
                Update delivery state for selected orders
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-3">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setBulkStatus(status)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    bulkStatus === status
                      ? ORDER_STATUS_STYLES[status]
                      : "border-[#E4E4E7] bg-[#FAFAFA] text-[#71717A]"
                  }`}
                >
                  {ORDER_STATUS_LABELS[status]}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                disabled={savingBulk}
                onClick={() => void handleBulkSave()}
                className="h-11 rounded-full bg-[#18181B] px-6 text-white hover:bg-[#18181B]/90"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};
