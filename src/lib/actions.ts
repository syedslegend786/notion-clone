import { getServerSession as ServerSession } from "next-auth/next";
import { authOption } from "./authOptions";
export async function getServerSession() {
  try {
    const session = await ServerSession(authOption);
    if (!session) {
      return null;
    }
    return session;
  } catch (error) {
    return null;
  }
}
