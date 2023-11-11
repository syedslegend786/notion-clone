"use client";

import { URLS } from "@/utils/URLS";
import { handleApiError } from "@/utils/handleApiError";
import { Document } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { axios } from "@/lib/axios";
import { Item } from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { queryKeys } from "@/react-query/query-keys";
interface DocumentList {
  parentDocumentId?: string;
  level?: number;
  data?: Document[];
}
async function fetchDocuments(parentId: DocumentList["parentDocumentId"]) {
  const response = await axios.post(`/documents/sidebar`, {
    parentDocumentId: parentId,
  });
  return response.data as Document[];
}
export function DocumentList({
  data,
  level = 0,
  parentDocumentId,
}: DocumentList) {
  const params = useParams();
  const router = useRouter();
  const [expanded, setexpanded] = useState<Record<string, boolean>>({});
  function onExpand(documentId: string) {
    setexpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  }
  function onRedirect(documentId: string) {
    router.push(URLS.SINGLE_DOCUMENT(documentId));
  }
  const {
    data: documentsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [queryKeys.FETCH_SIDEBAR_DOCUMENTS, parentDocumentId],
    queryFn: () => fetchDocuments(parentDocumentId),
  });
  if (isLoading) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level == 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  function calculatePadding() {
    if (!level) {
      return 0;
    }
    return level * 12;
  }
  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${calculatePadding() + 25}px` : undefined,
        }}
        className={cn(`hidden text-sm font-medium text-muted-foreground/80`, {
          "last:block": expanded,
          hidden: level === 0,
        })}
      >
        No pages inside
      </p>
      {documentsData?.map((item, index) => (
        <div key={index}>
          <Item
            id={item.id}
            onClick={() => onRedirect(item.id)}
            label={item.title}
            icon={FileIcon}
            documentIcon={item.icon ?? ""}
            active={params.documentId === item.id}
            level={level}
            onExpand={() => onExpand(item.id)}
            expanded={expanded[item.id]}
          />
          {expanded[item.id] && (
            <DocumentList parentDocumentId={item.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
}
