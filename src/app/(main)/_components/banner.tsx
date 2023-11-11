"use client";

import { Button } from "@/components/ui/button";
import {
  useDeleteDocumentMutation,
  useUndoArchiveDocumentMutation,
} from "@/react-query/hooks";
import { URLS } from "@/utils/URLS";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: string;
}
export function Banner({ documentId }: BannerProps) {
  const router = useRouter();
  const { mutateAsync } = useUndoArchiveDocumentMutation();
  const { mutateAsync: deleteDocumentMutation } = useDeleteDocumentMutation();
  function handleRestore() {
    toast.promise(mutateAsync(documentId), {
      loading: "Undoing the document",
      error: "Something went wrong",
      success() {
        router.refresh();
        return "Restored successfully";
      },
    });
  }
  function handleDeleteDocument() {
    toast.promise(deleteDocumentMutation({ documentId }), {
      loading: "Deleting document",
      error: "Something went wrong",
      success: () => {
        router.push(URLS.DOCUMENTS);
        return "Deleted successfully";
      },
    });
  }
  return (
    <div className="flex w-full items-center justify-center p-2 bg-rose-500 text-white gap-x-4">
      <p>This page is in the trash.</p>
      <Button onClick={handleRestore}>Restore page</Button>
      <Button onClick={handleDeleteDocument}>Delete forever</Button>
    </div>
  );
}
