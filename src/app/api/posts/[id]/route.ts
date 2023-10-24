import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { Prisma } from "@prisma/client";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    //buscar los post del usuario con su id
    const posts = await prisma.post.findMany({
      where: {
        authorId: Number(params.id),
      },
    });

    return NextResponse.json(posts);
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

export async function POST(request: Request, { params }: Params) {
  const { title, content } = await request.json();

  //validar que el title no este vacio
  if (!title) {
    return NextResponse.json(
      {
        message: "Title is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: title as string,
        content: content as string,
        authorId: Number(params.id),
      },
    });

    return NextResponse.json(post);
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
    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(params.id),
      },
    });

    if (!deletedPost) {
      return NextResponse.json(
        {
          message: "Post no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(deletedPost);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            message: "Post no encontrado",
          },
          {
            status: 404,
          }
        );
      }
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

export async function PUT(request: Request, { params }: Params) {
  try {
    const { title, content } = await request.json();
    const updatedPost = await prisma.post.update({
      where: {
        id: Number(params.id),
      },
      data: {
        title: title as string,
        content: content as string,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            message: "Post no encontrado",
          },
          {
            status: 404,
          }
        );
      }

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
