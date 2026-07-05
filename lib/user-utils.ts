import type { User } from "@/lib/generated/prisma/client";

export const toSafeUser = ({
  otp: _otp,
  otpTries: _otpTries,
  ...safeUser
}: User) => safeUser;
