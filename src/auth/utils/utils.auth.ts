import { UnauthorizedException } from "@nestjs/common";

export function decodeJwtPayload<T = any>(token: string): T {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new UnauthorizedException("Invalid JWT token");
  }

  const payloadBase64 = parts[1];
  const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
  return JSON.parse(payloadJson) as T;
}
