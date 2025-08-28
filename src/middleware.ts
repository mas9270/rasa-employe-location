// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/jwt";


export async function middleware(req: NextRequest) {
  const token = req.cookies.get("rasatoken")?.value;
  const url = new URL(req.url);

  const protectedPaths = ["/locations", "/users", "/users-location"];
  const isProtected = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  try {
    if (!token) {
      if (isProtected) return NextResponse.redirect(new URL("/", req.url));
      return NextResponse.next();
    }

    const payload = await verifyAccessToken(token);

    if (!payload) {
      if (isProtected) return NextResponse.redirect(new URL("/", req.url));
      return NextResponse.next();
    }

    // ریدایرکت کاربر لاگین شده از صفحه اصلی
    if (url.pathname === "/") {
      return NextResponse.redirect(new URL("/users-location", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    if (isProtected) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/locations/:path*",
    "/users/:path*",
    "/users-location/:path*",
  ],
};
