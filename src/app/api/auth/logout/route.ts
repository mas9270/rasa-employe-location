import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // ایجاد پاسخ
    const response = NextResponse.json({ done: true });

    // حذف کوکی JWT
    response.cookies.set({
        name: "rasatoken",
        value: "",       // مقدار خالی برای حذف کوکی
        path: "/",       // مسیر همانند زمان ست کردن کوکی
        httpOnly: true,  // همانند زمان ست کردن
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0        // باعث حذف کوکی می‌شود
    });

    return response;
}