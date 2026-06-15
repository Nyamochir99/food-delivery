import { prisma } from "@/lib/prisma";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.refreshToken) {
    return NextResponse.json(
      { message: "Refresh token is required" },
      { status: 400 },
    );
  }

  try {
    const { id } = verifyRefreshToken(body.refreshToken);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Success!",
      accessToken: createAccessToken(user.id),
      refreshToken: createRefreshToken(user.id),
    });
  } catch {
    return NextResponse.json(
      { message: "Refresh token expired" },
      { status: 401 },
    );
  }
};
