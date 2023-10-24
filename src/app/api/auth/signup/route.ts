import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { name, lastname, email, password, confirmPassword } =
    await request.json();

  //validar que los campos no esten vacios
  if (!name || !lastname || !email || !password || !confirmPassword) {
    return NextResponse.json(
      {
        message: "Todos los campos son obligatorios",
      },
      {
        status: 400,
      }
    );
  }

  //validar email
  const regexEmail = /\S+@\S+\.\S+/;
  if (!regexEmail.test(email)) {
    return NextResponse.json(
      {
        message: "El email no es valido",
      },
      {
        status: 400,
      }
    );
  }

  //validar que el password de mas de 6 caracteres
  if (password.length < 6) {
    return NextResponse.json(
      {
        message: "El password debe ser de al menos 6 caracteres",
      },
      {
        status: 400,
      }
    );
  }

  //validar que el password y el confirmPassword sean iguales
  if (password !== confirmPassword) {
    return NextResponse.json(
      {
        message: "Los passwords no coinciden",
      },
      {
        status: 400,
      }
    );
  }

  try {
    //validar que el email no este registrado
    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userFound) {
      return NextResponse.json(
        {
          message: "El email ya esta registrado",
        },
        {
          status: 400,
        }
      );
    }

    //encriptar el password
    const hashedPassword = await bcrypt.hash(password, 12);

    //crear usuario
    const User = await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      id: User.id,
      name: User.name,
      lastname: User.lastname,
      email: User.email,
      isTemp: User.isTemp,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
