import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { validateFoodPayload } from "@/lib/admin-food";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const validated = validateFoodPayload(body);

  if ("error" in validated) {
    return NextResponse.json(validated.error, { status: validated.status });
  }

  const food = await prisma.food.update({
    where: { id },
    data: validated.value,
    include: { category: true },
  });

  return NextResponse.json({ food });
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;

  await prisma.food.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Food deleted" });
};
