import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    //ver si el usuario es temporal
    const userTemp = await prisma.user.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    return NextResponse.json(userTemp);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function DELETE(request: Request, { params }: Params) { 
    try {
      const deletedPost = await prisma.post.deleteMany({
        where: {
          authorId: Number(params.id),
        },
      })
        const deleteUser = await prisma.user.delete({
            where: {
                id: Number(params.id),
            },
        });

        if (!deleteUser) {
            return NextResponse.json(
                {
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(deleteUser);
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Algo salio mal',
            },
            {
                status: 500,
            }
        )
    }
}