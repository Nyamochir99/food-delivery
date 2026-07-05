import { toSafeUser } from "@/lib/user-utils";
import { requireAuth } from "@/lib/user-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth.error) return auth.error;

  return NextResponse.json({ message: "Success!", user: toSafeUser(auth.user) });
};
