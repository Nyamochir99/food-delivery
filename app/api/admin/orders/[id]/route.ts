import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  adminOrderInclude,
  VALID_ORDER_STATUSES,
} from "@/lib/order-queries";
import type { FoodOrderStatus } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const status = body.status as FoodOrderStatus | undefined;

  if (!status || !VALID_ORDER_STATUSES.has(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.foodOrder.update({
    where: { id },
    data: { status },
    include: adminOrderInclude,
  });

  return NextResponse.json({ order });
};
