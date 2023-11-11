import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json("Fields missing", { status: 400 });
    }
    const dbUser = await db.user.findFirst({ where: { email } });
    if (dbUser) {
      return NextResponse.json("Email has been taken", { status: 400 });
    }
    await db.user.create({
      data: {
        email,
        password,
      },
    });
    return NextResponse.json("okay", { status: 200 });
  } catch (error: any) {
    console.log("REGISTER_ERROR", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
