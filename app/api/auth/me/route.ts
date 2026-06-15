import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const token = authorization.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { otp: _, otpTries: __, ...safeUser } = user;

    return NextResponse.json({ message: "Success!", user: safeUser });
  } catch {
    return NextResponse.json({ message: "Token expired" }, { status: 401 });
  }
};
