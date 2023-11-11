"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LucideIcon,
  PlusIcon,
  Trash,
} from "lucide-react";
import React from "react";
import * as z from "zod";
import { createDocumentSchema } from "@/app/api/documents/utils";
import { queryKeys } from "@/react-query/query-keys";
import { queryClient } from "@/react-query/query-client-provider";
import { handleApiError } from "@/utils/handleApiError";
import { useCreateDocumentMutation } from "@/react-query/hooks";
interface ItemProps {
  id?: string;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}
export function Item({
  icon: Icon,
  label,
  onClick,
  active,
  documentIcon,
  expanded,
  id,
  isSearch,
  level = 0,
  onExpand,
}: ItemProps) {
  const { mutate: createDocumentMutation } = useCreateDocumentMutation();

  const { mutate: archiveDocumentMutaion } = useMutation({
    mutationKey: [queryKeys.ARCHIVE_DOCUMENT],
    mutationFn: (documentId: string) => {
      return axios.patch(`/documents/sidebar/archive`, {
        documentId,
      });
    },
    onError: (error) => {
      const err = handleApiError(error);
      alert(err);
    },
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: [queryKeys.FETCH_SIDEBAR_DOCUMENTS],
      });
    },
  });
  function handleExpand(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    onExpand?.();
  }
  const ChevronIcon = expanded ? ChevronDownIcon : ChevronRightIcon;
  async function handleNewDocument(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    e.stopPropagation();
    e.preventDefault();
    createDocumentMutation({ title: "Untitled", parentId: id });
  }
  async function handleArchiveDocument(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    e.stopPropagation();
    e.preventDefault();
    if (!id) {
      return;
    }
    archiveDocumentMutaion(id);
  }
  return (
    <div
      role="button"
      onClick={onClick}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        `group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground
      font-medium`,
        {
          "bg-primary/5 text-primary": active,
        }
      )}
    >
      {!!id && (
        <div role="button" onClick={handleExpand}>
          <ChevronIcon className="h-4 w-4 shrink-0" />
        </div>
      )}
      <Icon className="h-5 w-5 pr-2 flex-shrink-0 " />
      <span className="truncate text-sm">{label}</span>
      {!!isSearch && (
        <div className="rounded w-max ml-auto  text-[8px] bg-gray-50 dark:bg-neutral-500 p-[2px]">
          CTRL + K
        </div>
      )}
      {!!id && (
        <div className="flex gap-2 ml-auto">
          <div
            role="button"
            onClick={handleArchiveDocument}
            className="flex items-center gap-x-2"
          >
            <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 ">
              <Trash className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </div>
          <div
            role="button"
            onClick={handleNewDocument}
            className="flex items-center gap-x-2"
          >
            <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 ">
              <PlusIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  function calculatePaddingLeft() {
    if (!level) {
      return 0;
    }
    return level * 12;
  }
  return (
    <div
      // @ts-ignore
      style={{
        paddingLeft: level ? `${12 + calculatePaddingLeft()}px` : "12px",
      }}
      className={cn(`flex gap-x-2 py-[3px]`)}
    >
      <Skeleton className="h-4 w-4 " />
      <Skeleton className="h-4 w-[30%] " />
    </div>
  );
};
