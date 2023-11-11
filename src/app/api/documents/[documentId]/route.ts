import { getServerSession } from "@/lib/actions";
import { db } from "@/lib/db";
import { handleBackendErrors } from "@/utils/handleBackendErrors";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const documentId = params.documentId;
    const dbDocument = await db.document.findFirst({
      where: {
        id: documentId,
      },
    });
    if (!dbDocument) {
      return new NextResponse("Document not found");
    }
    if (dbDocument.isPublished) {
      return NextResponse.json(dbDocument, { status: 200 });
    }
    const session = await getServerSession();
    if (dbDocument.userId !== session?.user.id) {
      return new NextResponse("UnAuthorized");
    }
    return NextResponse.json(dbDocument, { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
