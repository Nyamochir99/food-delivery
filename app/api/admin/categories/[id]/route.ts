import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();

  if (!body.categoryName?.trim()) {
    return NextResponse.json(
      { message: "Category name is required" },
      { status: 400 },
    );
  }

  const category = await prisma.foodCategory.update({
    where: { id },
    data: { categoryName: body.categoryName.trim() },
    include: { _count: { select: { foods: true } } },
  });

  return NextResponse.json({ category });
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;

  await prisma.$transaction([
    prisma.food.deleteMany({ where: { categoryId: id } }),
    prisma.foodCategory.delete({ where: { id } }),
  ]);

  return NextResponse.json({ message: "Category deleted" });
};
