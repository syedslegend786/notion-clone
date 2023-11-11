import { handleBackendErrors } from "@/utils/handleBackendErrors";
import { NextResponse } from "next/server";
import { undoTrashItemsSchema } from "../../utils";
import { db } from "@/lib/db";
async function undoChildren(parentId: string) {
  const childDocuments = await db.document.findMany({
    where: {
      parentId,
    },
  });
  for (let i = 0; i < childDocuments.length; i++) {
    const singleChild = childDocuments[i];
    await db.document.update({
      where: {
        id: singleChild.id,
      },
      data: {
        isArchived: false,
      },
    });
    await undoChildren(singleChild.id);
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const args = await undoTrashItemsSchema.parseAsync(body);
    const dbDocument = await db.document.findUnique({
      where: {
        id: args.documentId,
      },
    });
    if (!dbDocument) {
      return new NextResponse("No item found");
    }
    await undoChildren(args.documentId);
    if (dbDocument.parentId) {
      await db.document.update({
        where: {
          id: args.documentId,
        },
        data: {
          isArchived: false,
          parentId: {
            unset: true,
          },
        },
      });
    } else {
      await db.document.update({
        where: {
          id: args.documentId,
        },
        data: {
          isArchived: false,
        },
      });
    }

    return new NextResponse("success");
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
