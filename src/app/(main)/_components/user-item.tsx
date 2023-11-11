"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { MIN_WIDTH } from "./utils";
import { ChevronsUpDownIcon } from "lucide-react";

export function UserItem() {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={`flex items-center gap-4 p-3 pr-10 cursor-pointer `}>
          <Avatar className="h-6 w-6">
            {session?.user?.image ? (
              <AvatarImage src={session.user.image} alt="@shadcn" />
            ) : (
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            )}
            <AvatarFallback className="cursor-pointer  text-xs">
              {session?.user?.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="truncate text-xs">
            {session?.user?.email}&apos;s Jotion
          </p>
          <ChevronsUpDownIcon className="h-4 w-4 shrink-0 text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" forceMount>
        <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
