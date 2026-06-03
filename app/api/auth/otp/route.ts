import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(body.email)) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  if (!body.otp) {
    return NextResponse.json({ message: "OTP is required" }, { status: 400 });
  }

  const otpRegex = /^\d{6}$/;

  if (!otpRegex.test(body.otp)) {
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
    if (payload.otp !== body.otp) {
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

  const accessToken = jwt.sign(user, process.env.TOKEN_KEY!, {
    expiresIn: "1h",
  });

  return NextResponse.json({ message: "Success!", accessToken });
};
