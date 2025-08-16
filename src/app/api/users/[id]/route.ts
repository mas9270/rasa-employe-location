import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const data = await req.json();
    const updated = await prisma.users.update({
        where: { id: Number(params.id) },
        data
    });
    return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {

    await prisma.users.delete({
        where: { id: Number(params.id) }
    });

    return NextResponse.json({ message: "عملیات حذف با موفقیت انجام شد", done: true });

}