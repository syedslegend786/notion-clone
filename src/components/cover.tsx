"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useUpdateDocumentBannerMutation } from "@/react-query/hooks";
import { useModals } from "@/hooks/use-modals";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
  coverUrl: string;
  isPreview?: boolean;
}
export function Cover({ coverUrl, isPreview = false }: CoverProps) {
  const { onOpen } = useModals();
  return (
    <div
      className={cn(`relative w-full  h-[12vh] group`, {
        "h-[35vh] bg-muted": coverUrl.length > 0,
      })}
    >
      {coverUrl && (
        <Image src={coverUrl} fill alt="" className="object-cover" />
      )}
      {coverUrl && !isPreview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 w-max flex items-center gap-x-2 p-2">
          <Button
            onClick={() => {
              onOpen("CoverImageModal");
            }}
            variant={"outline"}
            size={"sm"}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Change cover
          </Button>
          <Button variant={"outline"} size={"sm"}>
            <X className="w-4 h-4 mr-2" /> Remove cover
          </Button>
        </div>
      )}
    </div>
  );
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[35vh] w-full" />;
};
