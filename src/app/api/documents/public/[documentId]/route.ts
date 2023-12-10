import { db } from "@/lib/db";
import { handleBackendErrors } from "@/utils/handleBackendErrors";
import { NextResponse } from "next/server";
type Params = { params: { documentId: string } };
export async function GET(
  request: Request,
  { params: { documentId } }: Params
) {
  try {
    const dbDocument = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });
    if (!dbDocument) {
      return new NextResponse("Document not found", { status: 400 });
    }
    if (!dbDocument.isPublished) {
      return new NextResponse("Document not found", { status: 400 });
    }
    return NextResponse.json(dbDocument, { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
