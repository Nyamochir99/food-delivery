import { authenticateRequest } from "@/lib/request-auth";
import { NextRequest } from "next/server";

export async function requireAdmin(req: NextRequest) {
  return authenticateRequest(req, { requireAdmin: true });
}
