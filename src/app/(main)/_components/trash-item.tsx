import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { mutationKeys, queryKeys } from "@/react-query/query-keys";
import { Document } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Trash, Undo } from "lucide-react";
import { axios } from "@/lib/axios";
import { handleApiError } from "@/utils/handleApiError";
import { queryClient } from "@/react-query/query-client-provider";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import {
  useDeleteDocumentMutation,
  useUndoArchiveDocumentMutation,
} from "@/react-query/hooks";
interface TrashItemProps {
  document: Document;
}
export function TrashItem({ document }: TrashItemProps) {
  const { mutate: deleteDocumentMutation } = useDeleteDocumentMutation();
  const { mutate } = useUndoArchiveDocumentMutation();
  async function handleUndoDocument() {
    mutate(document.id);
  }
  function handleDelete() {
    deleteDocumentMutation({
      documentId: document.id,
    });
  }
  return (
    <div className="flex items-center justify-between">
      <h1 className="truncate">{document.title}</h1>
      <div className="flex items-center gap-3">
        <div
          onClick={handleUndoDocument}
          role="button"
          className="hover:bg-gray-200 rounded p-1 dark:hover:bg-neutral-500"
        >
          <Undo className="w-4 h-4" />
        </div>
        <ConfirmModal onConfirm={handleDelete}>
          <div
            role="button"
            className="hover:bg-gray-200 dark:hover:bg-neutral-500 rounded p-1"
          >
            <Trash className="w-4 h-4" />
          </div>
        </ConfirmModal>
      </div>
    </div>
  );
}

TrashItem.Skeleton = function TrashSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-[60%] " />
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
    </div>
  );
};
