import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const token = authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.TOKEN_KEY!);
    return NextResponse.json({ message: "Success!", user: payload });
  } catch {
    return NextResponse.json({ message: "Token expired" }, { status: 401 });
  }
};
