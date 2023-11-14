import { updateContentSchema } from "../../utils";
import { getServerSession } from "@/lib/actions";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { handleBackendErrors } from "@/utils/handleBackendErrors";

type Params = {
  params: { documentId: string };
};
export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const args = await updateContentSchema.parseAsync(body);
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }
    const dbDocument = await db.document.findUnique({
      where: {
        id: params.documentId,
      },
    });
    if (!dbDocument) {
      return new NextResponse("Document not found", { status: 400 });
    }
    if (session.user.id !== dbDocument.userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    await db.document.update({
      where: {
        id: params.documentId,
      },
      data: {
        content: args.content,
      },
    });
    return new NextResponse("okay", { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
