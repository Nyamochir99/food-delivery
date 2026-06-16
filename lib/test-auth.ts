import type { UserRole } from "@/lib/generated/prisma/client";

type TestAccount = {
  otp: string;
  role: UserRole;
};

const TEST_ACCOUNTS: Record<string, TestAccount> = {
  "test@customer.mail": { otp: "000000", role: "USER" },
  "test@admin.mail": { otp: "999999", role: "ADMIN" },
};

export const isTestAuthEnabled = () =>
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_TEST_AUTH === "true";

export const getTestAccount = (email: string): TestAccount | null => {
  if (!isTestAuthEnabled()) return null;

  return TEST_ACCOUNTS[email.trim().toLowerCase()] ?? null;
};
