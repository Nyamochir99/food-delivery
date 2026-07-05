import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mail";
import { getTestAccount } from "@/lib/test-auth";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const generateOtp = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(body.email)) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { email: body.email } });

  const testAccount = getTestAccount(body.email);
  const otp = testAccount?.otp ?? generateOtp();

  const token = jwt.sign({ otp }, process.env.SIGNIN_OTP!, {
    expiresIn: "5m",
  });

  const userData = {
    otp: token,
    otpTries: 0,
    ...(testAccount ? { role: testAccount.role } : {}),
  };

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: body.email,
        ...userData,
      },
    });
  } else {
    user = await prisma.user.update({
      where: {
        email: body.email,
      },
      data: userData,
    });
  }

  if (!testAccount) {
    try {
      await sendOtpEmail(body.email, String(otp));
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      return NextResponse.json(
        { message: "Failed to send verification email. Please try again." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    message: testAccount
      ? `Test account ready. Use OTP: ${testAccount.otp}`
      : "Success! Check your email",
  });
};
