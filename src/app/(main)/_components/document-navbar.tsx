"use client";

import { useGetSingleDocument } from "@/react-query/hooks";
import { MenuIcon, MoreHorizontalIcon, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./title";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "./banner";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Publish } from "@/components/publish";
type DocumentNavBarProps = {
  isCollapsed: boolean;
  onResetWidth: () => void;
};
export function DocumentNavBar({
  isCollapsed,
  onResetWidth,
}: DocumentNavBarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const params = useParams();
  const { data, isFetching } = useGetSingleDocument(
    params.documentId as string
  );
  return (
    <div className={"w-full"}>
      <div className="bg-background dark:bg-background-dark px-3 py-2 flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className={cn("hidden h-6 w-6 text-muted-foreground", {
              "inline-block": (!isMobile && isCollapsed) || isMobile,
            })}
          />
        )}
        <div className="flex w-full justify-between items-center">
          {isFetching ? (
            <Title.Skeleton />
          ) : (
            <Title initialText={data?.title ?? ""} />
          )}
          <div className="flex items-center gap-x-3 ml-auto">
            <Publish
              documentId={data?.id ?? ""}
              isPublished={data?.isPublished ?? false}
            />
            <Popover>
              <PopoverTrigger>
                <Button size={"icon"} variant={"ghost"} className="">
                  <MoreHorizontalIcon className="h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="px-2 py-4">
                <div className="flex items-center justify-between hover:bg-gray-200 p-2 rounded cursor-pointer">
                  <p className="text-xs font-bold">Delete</p>
                  <Trash className="h-4 w-4 shrink-0" />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {data?.isArchived && <Banner documentId={data.id} />}
    </div>
  );
}
