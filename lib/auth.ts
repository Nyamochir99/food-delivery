import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  type?: "access" | "refresh";
};

export function createAccessToken(userId: string) {
  return jwt.sign({ id: userId, type: "access" }, process.env.TOKEN_KEY!, {
    expiresIn: "1h",
  });
}

export function createRefreshToken(userId: string) {
  return jwt.sign({ id: userId, type: "refresh" }, process.env.TOKEN_KEY!, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  const payload = jwt.verify(token, process.env.TOKEN_KEY!) as TokenPayload;

  if (payload.type === "refresh") {
    throw new Error("Invalid token type");
  }

  if (!payload.id) {
    throw new Error("Invalid token");
  }

  return payload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const payload = jwt.verify(token, process.env.TOKEN_KEY!) as TokenPayload;

  if (payload.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  return payload;
}
