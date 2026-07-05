import { authenticateRequest } from "@/lib/request-auth";
import { NextRequest } from "next/server";

export async function requireAuth(req: NextRequest) {
  return authenticateRequest(req);
}
