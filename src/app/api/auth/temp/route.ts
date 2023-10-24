import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, lastname, email, password } = await request.json();

  //encriptar el password
  const hashedPassword = await bcrypt.hash(password, 12);

  //crear usuario temporal
    const userTemp = await prisma.user.create({
        data: {
        name,
        lastname,
        email,
        password: hashedPassword,
        isTemp: true,
        },
    });

    return NextResponse.json(userTemp)

}
