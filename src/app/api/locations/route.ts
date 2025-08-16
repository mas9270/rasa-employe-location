import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
// import prisma from "@/utils/prismaConfig";
const prisma = new PrismaClient();

export async function GET() {
    const locations = await prisma.locations.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            lat: true,
            lng: true,
            pathId: true
        }
    });
    return NextResponse.json(locations);
}

export async function POST(req: Request) {
    const data = await req.json();
    const newLocation = await prisma.locations.create({
        data: {
            name: data.name,
            description: data.description,
            lat: data.lat,
            lng: data.lng,
            pathId: data.path,
        }
    });
    return NextResponse.json(newLocation);
}

export async function PUT(req: Request) {
    const locations = await prisma.locations.findMany();
    const paths = await prisma.paths.findMany();
    const newLocations: any = locations.map((item) => ({ ...item, pathName: paths.find((item1) => item1.id === item.pathId)?.name }))
    return NextResponse.json(newLocations);
}
