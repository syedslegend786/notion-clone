import { getServerSession } from "@/lib/actions";
import { db } from "@/lib/db";
import { handleBackendErrors } from "@/utils/handleBackendErrors";
import { NextResponse } from "next/server";

type Params = { params: { documentId: string } };
export async function POST(request: Request, { params }: Params) {
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
    await db.document.update({
      where: {
        id: params.documentId,
      },
      data: {
        icon: {
          unset: true,
        },
      },
    });
    return new NextResponse("okay", { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
