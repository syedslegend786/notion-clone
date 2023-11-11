import { getServerSession } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { parentDocumentId } = await request.json();
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    let documents;
    if (parentDocumentId) {
      documents = await db.document.findMany({
        where: {
          userId: session.user.id,
          parentId: parentDocumentId,
          isArchived: false,
        },
      });
    } else {
      documents = await db.document.findMany({
        where: {
          userId: session.user.id,
          parentId: {
            isSet: false,
          },
          isArchived: false,
        },
      });
    }
    console.log("documents--->", documents);
    return NextResponse.json(documents, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
