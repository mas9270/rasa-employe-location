import { jwtVerify, SignJWT } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

export async function generateAccessToken(userId: string) {
  // ایجاد JWT
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // یک ساعت
    .sign(ACCESS_TOKEN_SECRET);
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return payload;
  } catch (err) {
    console.log("JWT verification error:", err);
    return false; // توکن نامعتبر یا منقضی شده
  }
}