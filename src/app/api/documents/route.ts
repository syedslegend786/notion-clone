import { NextResponse } from "next/server";
import { createDocumentSchema } from "./utils";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/actions";
import { handleBackendErrors } from "@/utils/handleBackendErrors";
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    let body = await req.json();
    const args = await createDocumentSchema.parseAsync(body);
    const newDocument = await db.document.create({
      data: {
        title: args.title,
        userId: session.user.id,
        parentId: args.parentId,
      },
    });
    return new Response(newDocument.id, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");
    if (!documentId) {
      return new NextResponse("Document ID is required");
    }
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const dbDocument = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });
    if (dbDocument?.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.document.delete({
      where: {
        id: documentId,
      },
    });
    return new NextResponse("success");
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const dbDocuments = await db.document.findMany({
      where: {
        userId: session.user.id,
        isArchived: false,
      },
    });
    return NextResponse.json(dbDocuments, { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
