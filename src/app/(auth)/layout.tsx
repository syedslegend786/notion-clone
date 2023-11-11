import { getServerSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();
  if (session) {
    return redirect("/");
  }
  return <>{children}</>;
};

export default AuthLayout;
