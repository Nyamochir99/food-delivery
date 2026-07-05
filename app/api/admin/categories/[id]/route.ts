import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  categoryWithCountInclude,
  validateCategoryName,
} from "@/lib/admin-category";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const validated = validateCategoryName(body.categoryName);

  if ("error" in validated) {
    return NextResponse.json(validated.error, { status: validated.status });
  }

  const category = await prisma.foodCategory.update({
    where: { id },
    data: { categoryName: validated.value },
    include: categoryWithCountInclude,
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
