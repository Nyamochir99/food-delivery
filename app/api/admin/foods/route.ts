import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { validateFoodPayload } from "@/lib/admin-food";
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
  const validated = validateFoodPayload(body);

  if ("error" in validated) {
    return NextResponse.json(validated.error, { status: validated.status });
  }

  const food = await prisma.food.create({
    data: validated.value,
    include: { category: true },
  });

  return NextResponse.json({ food });
};
