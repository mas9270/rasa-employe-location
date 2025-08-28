// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// // import prisma from "@/utils/prismaConfig";
// const prisma = new PrismaClient();

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//     const data = await req.json();
//     const updated = await prisma.locations.update({
//         where: { id: Number(params.id) },
//         data
//     });
//     return NextResponse.json(updated);
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {


//     const isUsers = await prisma.users.findMany({
//         where: {
//             locationId: Number(params.id),
//         },
//     });

//     if (isUsers && isUsers.length !== 0) {
//         return NextResponse.json({ message: "تعدادی از کارمندان به این چایگاه نسبت داده شده اند", done: false });
//     }
//     else {
//         await prisma.locations.delete({
//             where: { id: Number(params.id) }
//         });
//         return NextResponse.json({ message: "عملیات حذف با موفقیت انجام شد", done: true });
//     }
// }

// export async function POST(req: Request) {
//     const { id } = await req.json();
//     const pathInfo = await prisma.paths.findUnique({ where: { id: Number(id) } });
//     return NextResponse.json(pathInfo);
// }
