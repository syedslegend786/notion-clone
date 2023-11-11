import { NextResponse } from "next/server";
import { archiveDocumentSchema } from "../../utils";
import { db } from "@/lib/db";
import * as z from "zod";
import { handleBackendErrors } from "@/utils/handleBackendErrors";
async function archiveAllChildren(parentId: string) {
  const children = await db.document.findMany({
    where: {
      parentId: parentId,
    },
  });
  for (let i = 0; i < children.length; i++) {
    const dbDocument = await db.document.update({
      data: {
        isArchived: true,
      },
      where: {
        id: children[i].id,
      },
    });
    await archiveAllChildren(dbDocument.id);
  }
}
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const args = await archiveDocumentSchema.parseAsync(body);

    const dbDocument = await db.document.findUnique({
      where: {
        id: args.documentId,
      },
    });
    if (!dbDocument || dbDocument?.isArchived) {
      return new NextResponse("success", { status: 200 });
    }

    await archiveAllChildren(dbDocument.id);
    await db.document.update({
      where: {
        id: dbDocument.id,
      },
      data: {
        isArchived: true,
      },
    });
    return new NextResponse("success", { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
