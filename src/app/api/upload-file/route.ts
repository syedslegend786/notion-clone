import { cloudinary, cloudinaryFolderName } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const fileData = await request.formData();
    const file = fileData.get("file") as unknown as File | null;
    if (!file) {
      return new NextResponse("");
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes).toString("base64");
    let dataURI = "data:" + file.type + ";base64," + buffer;
    const cloudResponse = await cloudinary.uploader.upload(dataURI, {
      folder: cloudinaryFolderName,
    });
    return new NextResponse(cloudResponse.secure_url);
  } catch (error) {
    return new NextResponse("");
  }
}
