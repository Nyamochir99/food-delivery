import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const getUserIdFromRequest = (req: NextRequest) => {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const payload = verifyAccessToken(authorization.split(" ")[1]);
    return payload.id;
  } catch {
    return null;
  }
};

export const PATCH = async (req: NextRequest) => {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.address?.trim()) {
    return NextResponse.json({ message: "Address is required" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { address: body.address.trim() },
  });

  const { otp: _, otpTries: __, ...safeUser } = user;

  return NextResponse.json({ message: "Success!", user: safeUser });
};

export const DELETE = async (req: NextRequest) => {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { address: null },
  });

  const { otp: _, otpTries: __, ...safeUser } = user;

  return NextResponse.json({ message: "Success!", user: safeUser });
};
