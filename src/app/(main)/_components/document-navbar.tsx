"use client";

import { useGetSingleDocument } from "@/react-query/hooks";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./title";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "./banner";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";

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
      <div className="bg-background dark:bg-background-dark px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className={cn("hidden h-6 w-6 text-muted-foreground", {
              "inline-block": (!isMobile && isCollapsed) || isMobile,
            })}
          />
        )}
        <div className="flex items-center justify-between flex-1">
          {isFetching ? (
            <Title.Skeleton />
          ) : (
            <Title initialText={data?.title ?? ""} />
          )}
        </div>
      </div>
      {data?.isArchived && <Banner documentId={data.id} />}
    </div>
  );
}
