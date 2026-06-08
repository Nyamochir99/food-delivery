import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const PATCH = async (req: NextRequest) => {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const token = authorization.split(" ")[1];
  let userId: string;

  try {
    const payload = jwt.verify(token, process.env.TOKEN_KEY!) as { id: string };
    userId = payload.id;
  } catch {
    return NextResponse.json({ message: "Token expired" }, { status: 401 });
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
