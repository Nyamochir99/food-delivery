import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/user-auth";
import { NextRequest, NextResponse } from "next/server";

type OrderItemInput = {
  foodId?: string;
  name?: string;
  quantity: number;
};

export const POST = async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth.error) return auth.error;

  const body = await req.json();
  const items = body.items as OrderItemInput[] | undefined;
  const address = body.address?.trim();
  const totalPrice = Number(body.totalPrice);

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "Order items are required" }, { status: 400 });
  }

  if (!address) {
    return NextResponse.json({ message: "Address is required" }, { status: 400 });
  }

  if (Number.isNaN(totalPrice) || totalPrice <= 0) {
    return NextResponse.json({ message: "Invalid total price" }, { status: 400 });
  }

  const orderItems: { foodId: string; quantity: number }[] = [];

  for (const item of items) {
    const quantity = Number(item.quantity);
    if (Number.isNaN(quantity) || quantity <= 0) {
      return NextResponse.json({ message: "Invalid item quantity" }, { status: 400 });
    }

    let food =
      item.foodId &&
      (await prisma.food.findUnique({ where: { id: item.foodId } }));

    if (!food && item.name?.trim()) {
      food = await prisma.food.findFirst({
        where: { foodName: item.name.trim() },
      });
    }

    if (!food) {
      return NextResponse.json(
        { message: `Food not found: ${item.name || item.foodId}` },
        { status: 400 },
      );
    }

    orderItems.push({ foodId: food.id, quantity });
  }

  const order = await prisma.foodOrder.create({
    data: {
      userId: auth.user.id,
      totalPrice,
      address,
      foodOrderItems: {
        create: orderItems,
      },
    },
    include: {
      user: { select: { email: true } },
      foodOrderItems: {
        include: {
          food: {
            select: { foodName: true, image: true, price: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ order });
};

export const GET = async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth.error) return auth.error;

  const orders = await prisma.foodOrder.findMany({
    where: { userId: auth.user.id },
    include: {
      foodOrderItems: {
        include: {
          food: {
            select: { foodName: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
};
