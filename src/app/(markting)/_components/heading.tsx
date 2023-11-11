"use client";

import { Button } from "@/components/ui/button";
import { URLS } from "@/utils/URLS";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function Heading() {
  const { data: session } = useSession();
  return (
    <div className="max-w-3xl space-y-3 mx-auto">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-center">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">Jotion</span>
      </h1>
      <h3 className="text-center text-base sm:text-xl md:text-xl">
        Jotion is the connected workspace where <br />
        better, faster work happens.
      </h3>
      <div className="flex items-center justify-center">
        {session && (
          <Link href={URLS.DOCUMENTS}>
            <Button className="mx-auto">
              Enter Jotion <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
