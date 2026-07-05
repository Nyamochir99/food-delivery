import { prisma } from "@/lib/prisma";
import { createAccessToken, createRefreshToken } from "@/lib/auth";
import { isValidEmail, isValidOtp } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  if (!isValidEmail(body.email)) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  if (!body.otp) {
    return NextResponse.json({ message: "OTP is required" }, { status: 400 });
  }

  if (!isValidOtp(body.otp)) {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: body.email } });

  if (!user) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }
  if (user.otpTries >= 5) {
    return NextResponse.json(
      { message: "Too many attempts. Please request a new OTP." },
      { status: 403 },
    );
  }

  try {
    if (!user.otp) throw new Error("No OTP requested");
    const payload = jwt.verify(user.otp, process.env.SIGNIN_OTP!) as {
      otp: string;
    };
    if (payload.otp != body.otp) {
      await prisma.user.update({
        where: { email: body.email },
        data: { otpTries: user.otpTries + 1 },
      });
      return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ message: "OTP Expired" }, { status: 401 });
  }

  await prisma.user.update({
    where: { email: body.email },
    data: {
      otpTries: 0,
      otp: null,
    },
  });

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  return NextResponse.json({ message: "Success!", accessToken, refreshToken });
};
