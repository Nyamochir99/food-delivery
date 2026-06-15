import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const categoryId = req.nextUrl.searchParams.get("categoryId");

  const foods = await prisma.food.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ foods });
};

export const POST = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();

  if (!body.foodName?.trim()) {
    return NextResponse.json(
      { message: "Food name is required" },
      { status: 400 },
    );
  }

  if (!body.categoryId) {
    return NextResponse.json(
      { message: "Category is required" },
      { status: 400 },
    );
  }

  const price = Number(body.price);
  if (Number.isNaN(price) || price <= 0) {
    return NextResponse.json({ message: "Invalid price" }, { status: 400 });
  }

  const food = await prisma.food.create({
    data: {
      foodName: body.foodName.trim(),
      price,
      image: body.image?.trim() || "https://placehold.co/366x210",
      ingredients: body.ingredients?.trim() || "",
      categoryId: body.categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json({ food });
};
