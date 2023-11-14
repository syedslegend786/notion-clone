"use client";
import { URLS } from "@/utils/URLS";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { Navigation } from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";
import { ModalProvider } from "@/providers/modal-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin h-4 w-4" />
      </div>
    );
  }
  if (!session) {
    return redirect(URLS.HOME);
  }
  return (
    <div className="flex h-full dark:bg-background-dark">
      <Navigation />
      <aside className="h-full flex-1">
        <SearchCommand />
        <ModalProvider />
        {children}
      </aside>
    </div>
  );
};

export default MainLayout;
