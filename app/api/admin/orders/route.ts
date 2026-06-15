import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import type { FoodOrderStatus } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 10;
const VALID_STATUSES = new Set<FoodOrderStatus>([
  "PENDING",
  "DELIVERED",
  "CANCELED",
]);

const parseDate = (value: string | null, endOfDay = false) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
};

export const GET = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const sortBy = searchParams.get("sortBy") === "status" ? "status" : "date";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const startDate = parseDate(searchParams.get("startDate"));
  const endDate = parseDate(searchParams.get("endDate"), true);

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
      include: {
        user: { select: { email: true } },
        foodOrderItems: {
          include: {
            food: {
              select: { foodName: true, image: true },
            },
          },
        },
      },
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

  if (!status || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  await prisma.foodOrder.updateMany({
    where: { id: { in: orderIds } },
    data: { status },
  });

  return NextResponse.json({ message: "Orders updated" });
};
