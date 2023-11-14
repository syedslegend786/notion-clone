import { getServerSession } from "@/lib/actions";
import { cloudinary, cloudinaryFolderName } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { handleBackendErrors } from "@/utils/handleBackendErrors";
import { NextResponse } from "next/server";

type Params = {
  params: {
    documentId: string;
  };
};
export async function POST(request: Request, { params }: Params) {
  try {
    const fileData = await request.formData();
    const file = fileData.get("banner") as unknown as File | null;
    if (!file) {
      return new NextResponse("Banner image missing", { status: 400 });
    }
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }
    const dbDocument = await db.document.findFirst({
      where: { id: params.documentId },
    });
    if (!dbDocument) {
      return new NextResponse("Document not found", { status: 400 });
    }
    if (dbDocument.userId !== session.user.id) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes).toString("base64");
    let dataURI = "data:" + file.type + ";base64," + buffer;
    const cloudResponse = await cloudinary.uploader.upload(dataURI, {
      folder: cloudinaryFolderName,
    });
    await db.document.update({
      where: {
        id: params.documentId,
      },
      data: {
        coverImage: cloudResponse.secure_url,
      },
    });
    return new NextResponse(cloudResponse.secure_url, { status: 200 });
  } catch (error: any) {
    return handleBackendErrors(error);
  }
}
