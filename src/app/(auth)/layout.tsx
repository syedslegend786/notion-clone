import { getServerSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
import { NavBar } from "../(markting)/_components/navbar";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="h-full dark:bg-background-dark">
      <NavBar hideOnMobile={false} />
      {children}
    </div>
  );
};

export default AuthLayout;
