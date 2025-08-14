import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const existingUser = await prisma.admin.findMany({ where: { username, password } });
    if (existingUser) {
        return NextResponse.json({ error: "ایمیل تکراری است" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.admin.create({
        data: { username, password: hashedPassword },
    });

    return NextResponse.json({ message: "ثبت‌نام موفق", userId: user.id });
}