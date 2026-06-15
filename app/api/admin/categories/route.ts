import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const categories = await prisma.foodCategory.findMany({
    include: { _count: { select: { foods: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ categories });
};

export const POST = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();

  if (!body.categoryName?.trim()) {
    return NextResponse.json(
      { message: "Category name is required" },
      { status: 400 },
    );
  }

  const maxSortOrder = await prisma.foodCategory.aggregate({
    _max: { sortOrder: true },
  });

  const category = await prisma.foodCategory.create({
    data: {
      categoryName: body.categoryName.trim(),
      sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1,
    },
    include: { _count: { select: { foods: true } } },
  });

  return NextResponse.json({ category });
};
