"use client";

import { useTopScroll } from "@/hooks/use-top-scroll";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { URLS } from "@/utils/URLS";

export function NavBar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const { scrolled } = useTopScroll();
  return (
    <div
      className={cn(
        "dark:bg-background-dark h-14 flex items-center px-6 z-50 fixed top-0 w-full bg-background",
        {
          "border-b shadow-sm": scrolled,
        }
      )}
    >
      <Logo />
      <div className="md:ml-auto flex items-center gap-2">
        <Link href={!session ? URLS.LOGIN : URLS.DOCUMENTS}>
          <Button className="mx-auto text-xs" variant={"ghost"}>
            Enter Jotion <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        {session && (
          <Button
            onClick={async () => {
              await signOut();
            }}
            className="mx-auto text-xs group"
            variant={"link"}
          >
            Logout <LogOut className="h-4 w-4 ml-2 group-hover:text-rose-500" />
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
