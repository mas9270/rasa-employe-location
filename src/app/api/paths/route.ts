import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
// import prisma from "@/utils/prismaConfig";
const prisma = new PrismaClient();

export async function GET() {
    const locations = await prisma.paths.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            path: true
        }
    });
    return NextResponse.json(locations);
}

export async function POST(req: Request) {
    const data = await req.json();
    const newLocation = await prisma.paths.create({
        data: {
            name: data.name,
            description: data.description,
            path: data.path,
        }
    });
    return NextResponse.json(newLocation);
}