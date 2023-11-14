import { getServerSession } from "@/lib/actions";
import { db } from "@/lib/db";
import { handleBackendErrors } from "@/utils/handleBackendErrors";
import { NextResponse } from "next/server";
import { updateDocumentSchema } from "../utils";
type Params = { params: { documentId: string } };
export async function GET(request: Request, { params }: Params) {
  try {
    const documentId = params.documentId;
    const dbDocument = await db.document.findFirst({
      where: {
        id: documentId,
      },
    });
    if (!dbDocument) {
      return new NextResponse("Document not found", { status: 400 });
    }
    if (dbDocument.isPublished) {
      return NextResponse.json(dbDocument, { status: 200 });
    }
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("UnAuthorized", { status: 400 });
    }
    if (dbDocument.userId !== session?.user.id) {
      return new NextResponse("UnAuthorized", { status: 400 });
    }
    return NextResponse.json(dbDocument, { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized");
    }
    const dbDocument = await db.document.findUnique({
      where: { id: params.documentId },
    });
    if (!dbDocument) {
      return new NextResponse("Document not found");
    }
    if (dbDocument.userId !== session.user.id) {
      return new NextResponse("Unauthorized");
    }
    const body = await request.json();
    const args = await updateDocumentSchema.parseAsync(body);

    await db.document.update({
      where: {
        id: params.documentId,
      },
      data: {
        ...args,
      },
    });
    return new NextResponse("okay", { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
