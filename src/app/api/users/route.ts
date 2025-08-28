import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      nationalCode: true,
      description: true,
      lat: true,
      lng: true,
      pathId: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newUsers = await prisma.users.create({
    data: {
      name: data.name,
      nationalCode: data.nationalCode,
      description: data.description,
      pathId: data.pathId,
      lat: data.lat,
      lng: data.lng,
    },
  });
  return NextResponse.json(newUsers);
}

export async function PUT(req: Request) {
  const users = await prisma.users.findMany();
  const locations = await prisma.paths.findMany();
  const newUsers: any = users.map((item) => ({
    ...item,
    pathName: locations.find((item1) => item1.id === item.pathId)?.name,
  }));
  return NextResponse.json(newUsers);
}

export async function PATCH(req: Request) {
  const { name } = await req.json();
  const users = await prisma.users.findMany({
    where: {
      name: {
        contains: name, // هر اسمی که داخلش "ali" باشه
        mode: "insensitive", // حروف بزرگ/کوچک فرقی نکنه
      },
    },
  });
  return NextResponse.json(users);
}
