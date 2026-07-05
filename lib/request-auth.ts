import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import type { User } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

type AuthResult =
  | { user: User; error?: never }
  | { user?: never; error: NextResponse };

export const authenticateRequest = async (
  req: NextRequest,
  options?: { requireAdmin?: boolean },
): Promise<AuthResult> => {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      error: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    };
  }

  try {
    const { id } = verifyAccessToken(authorization.split(" ")[1]);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return {
        error: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
      };
    }

    if (options?.requireAdmin && user.role !== "ADMIN") {
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
};
