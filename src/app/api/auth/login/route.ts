import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken } from "@/lib/jwt"; // نسخه jose
const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const user = await prisma.admin.findUnique({ where: { username } });

    if (!user) {
        return NextResponse.json(
            { error: "نام کاربری به درستی وارد نشده است" },
            { status: 404 }
        );
    }

    // بررسی رمز عبور
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //     return NextResponse.json(
    //         { error: "کلمه عبور به درستی وارد نشده است" },
    //         { status: 404 }
    //     );
    // }

    if (user.password !== password) {
        return NextResponse.json(
            { error: "کلمه عبور به درستی وارد نشده است" },
            { status: 404 }
        );
    }

    // تولید توکن با jose
    const accessToken = await generateAccessToken(user.username);

    const response = NextResponse.json({ accessToken, username });

    // تنظیم کوکی با مقدار string واقعی
    response.cookies.set({
        name: "rasatoken",
        value: accessToken,
        httpOnly: true,
        maxAge: 60 * 60, // 1 ساعت
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}