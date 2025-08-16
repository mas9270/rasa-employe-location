import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const users = await prisma.users.findMany();
    return NextResponse.json(users);
}

export async function POST(req: Request) {
    const data = await req.json();
    const newUsers = await prisma.users.create({
        data: {
            name: data.name,
            nationalCode: data.nationalCode,
            description: data.description,
            locationId: data.locationId
        }
    });
    return NextResponse.json(newUsers);
}

export async function PUT(req: Request) {
    const users = await prisma.users.findMany();
    const locations = await prisma.locations.findMany();
    const newUsers: any = users.map((item) => ({ ...item, locationName: locations.find((item1) => item1.id === item.locationId)?.name }))
    return NextResponse.json(newUsers);
}

