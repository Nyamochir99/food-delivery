import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import type { FoodOrderStatus } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = new Set<FoodOrderStatus>([
  "PENDING",
  "DELIVERED",
  "CANCELED",
]);

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const status = body.status as FoodOrderStatus | undefined;

  if (!status || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.foodOrder.update({
    where: { id },
    data: { status },
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
  });

  return NextResponse.json({ order });
};
