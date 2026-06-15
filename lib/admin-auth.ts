import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function requireAdmin(req: NextRequest) {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      error: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    };
  }

  try {
    const { id } = verifyAccessToken(authorization.split(" ")[1]);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user || user.role !== "ADMIN") {
      return {
        error: NextResponse.json({ message: "Forbidden 403" }, { status: 403 }),
      };
    }

    return { user };
  } catch {
    return {
      error: NextResponse.json({ message: "Token expired" }, { status: 401 }),
    };
  }
}
