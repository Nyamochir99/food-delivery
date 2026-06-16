import { prisma } from "@/lib/prisma";
import { getTestAccount } from "@/lib/test-auth";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    await resend.emails.send({
      from: "noreply@resend.dev",
      to: body.email,
      subject: "Your OTP code",
      html: `<p>OTP code: <strong>${otp}</strong></p>`,
    });
  }

  return NextResponse.json({
    message: testAccount
      ? `Test account ready. Use OTP: ${testAccount.otp}`
      : "Success! Check your email",
  });
};
