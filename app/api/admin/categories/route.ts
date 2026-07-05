import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  categoryWithCountInclude,
  validateCategoryName,
} from "@/lib/admin-category";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const categories = await prisma.foodCategory.findMany({
    include: categoryWithCountInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ categories });
};

export const POST = async (req: NextRequest) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();
  const validated = validateCategoryName(body.categoryName);

  if ("error" in validated) {
    return NextResponse.json(validated.error, { status: validated.status });
  }

  const maxSortOrder = await prisma.foodCategory.aggregate({
    _max: { sortOrder: true },
  });

  const category = await prisma.foodCategory.create({
    data: {
      categoryName: validated.value,
      sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1,
    },
    include: categoryWithCountInclude,
  });

  return NextResponse.json({ category });
};
