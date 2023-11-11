import { authOption } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
