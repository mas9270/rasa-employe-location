import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
// import prisma from "@/utils/prismaConfig";
const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const data = await req.json();
    const updated = await prisma.paths.update({
        where: { id: Number(params.id) },
        data
    });
    return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await prisma.paths.delete({
        where: { id: Number(params.id) }
    });
    return NextResponse.json({ message: "Deleted" });
}