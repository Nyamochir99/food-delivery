import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { parseOrderFilterDate } from "@/lib/date-utils";
import {
  adminOrderInclude,
  VALID_ORDER_STATUSES,
} from "@/lib/order-queries";
import type { FoodOrderStatus } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 10;

export const GET = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const sortBy = searchParams.get("sortBy") === "status" ? "status" : "date";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const startDate = parseOrderFilterDate(searchParams.get("startDate"));
  const endDate = parseOrderFilterDate(searchParams.get("endDate"), true);

  const where = {
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          },
        }
      : {}),
  };

  const [total, orders] = await Promise.all([
    prisma.foodOrder.count({ where }),
    prisma.foodOrder.findMany({
      where,
      include: adminOrderInclude,
      orderBy:
        sortBy === "status"
          ? { status: sortOrder }
          : { createdAt: sortOrder },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json({
    orders,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  });
};

export const PATCH = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();
  const orderIds = body.orderIds as string[] | undefined;
  const status = body.status as FoodOrderStatus | undefined;

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return NextResponse.json(
      { message: "Order ids are required" },
      { status: 400 },
    );
  }

  if (!status || !VALID_ORDER_STATUSES.has(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  await prisma.foodOrder.updateMany({
    where: { id: { in: orderIds } },
    data: { status },
  });

  return NextResponse.json({ message: "Orders updated" });
};
