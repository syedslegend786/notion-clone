import { getServerSession } from "@/lib/actions";
import { db } from "@/lib/db";
import { handleBackendErrors } from "@/utils/handleBackendErrors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized");
    }
    const archived = await db.document.findMany({
      where: {
        isArchived: true,
      },
    });
    return NextResponse.json(archived, { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
