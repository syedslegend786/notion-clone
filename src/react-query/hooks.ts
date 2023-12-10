"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mutationKeys, queryKeys } from "./query-keys";
import { axios } from "@/lib/axios";
import {
  createDocumentSchema,
  deleteDocumentSchema,
  updateContentSchema,
  updateDocumentSchema,
} from "@/app/api/documents/utils";
import { queryClient } from "./query-client-provider";
import * as z from "zod";
import { Document } from "@prisma/client";
import { handleApiError } from "@/utils/handleApiError";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useModals } from "@/hooks/use-modals";
import { URLS } from "@/utils/URLS";
export function useCreateDocumentMutation() {
  const router = useRouter();
  return useMutation({
    mutationKey: [queryKeys.DOCUMENT_CREATE],
    mutationFn: (newDocument: z.infer<typeof createDocumentSchema>) => {
      return axios.post("/documents", {
        ...newDocument,
      });
    },
    onSuccess: async (response) => {
      await queryClient.refetchQueries({
        queryKey: [queryKeys.FETCH_SIDEBAR_DOCUMENTS],
      });
      router.push(URLS.SINGLE_DOCUMENT(response.data));
    },
  });
}

export function useDeleteDocumentMutation() {
  const params = useParams();
  return useMutation({
    mutationKey: [mutationKeys.DELETE_DOCUMENT],
    mutationFn(data: z.infer<typeof deleteDocumentSchema>) {
      return axios.delete(`/documents?documentId=${data.documentId}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.TRASH_DOCUMENTS],
      });
    },
  });
}

export function useGetSingleDocument(documentId: string) {
  return useQuery({
    queryKey: [queryKeys.GET_SINGLE_DOCUMENT, documentId],
    queryFn: async () => {
      const { data } = await axios.get(`/documents/${documentId}`);
      return data as Document;
    },
    staleTime: 0,
  });
}

export function useUndoArchiveDocumentMutation() {
  const params = useParams();
  return useMutation({
    mutationKey: [mutationKeys.UNDO_DOCUMENT],
    mutationFn: (documentId: string) => {
      return axios.post("/documents/trash/undo-trash", {
        documentId: documentId,
      });
    },
    onError(error) {
      const err = handleApiError(error);
      alert(err);
    },
    onSuccess(_, documentId) {
      queryClient.refetchQueries({
        queryKey: [queryKeys.TRASH_DOCUMENTS],
        type: "active",
      });
      queryClient.refetchQueries({
        queryKey: [queryKeys.FETCH_SIDEBAR_DOCUMENTS],
        type: "active",
      });
      if (params?.documentId && params.documentId === documentId) {
        queryClient.refetchQueries({
          queryKey: [queryKeys.GET_SINGLE_DOCUMENT],
          type: "active",
        });
      }
    },
  });
}
interface UseUpdateDocumentMutation {
  documentId: string;
  data: z.infer<typeof updateDocumentSchema>;
}
export function useUpdateDocumentMutation() {
  return useMutation({
    mutationKey: [mutationKeys.UPDATE_DOCUMENT],
    mutationFn: (args: UseUpdateDocumentMutation) => {
      return axios.patch(`/documents/${args.documentId}`, {
        ...args.data,
      });
    },
    onSuccess() {
      queryClient.refetchQueries({
        type: "active",
        queryKey: [queryKeys.FETCH_SIDEBAR_DOCUMENTS],
      });
    },
  });
}

export function useRemoveIconMutation() {
  return useMutation({
    mutationKey: [mutationKeys.DELETE_ICON],
    mutationFn(documentId: string) {
      return axios.post(`/documents/${documentId}/remove-icon`);
    },
    onSuccess() {
      // queryClient.refetchQueries({
      //   type: "active",
      //   queryKey: [queryKeys.GET_SINGLE_DOCUMENT],
      // });
    },
  });
}
type UseUpdateDocumentBanner = {
  documentId: string;
  data: FormData;
};
export function useUpdateDocumentBannerMutation() {
  const { onClose } = useModals();
  return useMutation({
    mutationKey: [mutationKeys.UPDATE_BANNER],
    mutationFn(args: UseUpdateDocumentBanner) {
      return axios.post(
        `/documents/${args.documentId}/update-banner`,
        args.data
      );
    },
    onError(error) {
      const err = handleApiError(error);
      toast.error(err);
    },
    onSuccess() {
      onClose();
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_SINGLE_DOCUMENT],
        type: "active",
      });
    },
  });
}

type UseUpdateContent = {
  documentId: string;
  data: z.infer<typeof updateContentSchema>;
};
export function useUpdateContentMutation() {
  return useMutation({
    mutationKey: [mutationKeys.UPDATE_CONTENT],
    mutationFn(args: UseUpdateContent) {
      return axios.post(
        `/documents/${args.documentId}/update-content`,
        args.data
      );
    },
    onError(error) {
      const err = handleApiError(error);
      toast.error(err);
    },
  });
}

export function useGetPublishedDocument(documentId: string) {
  return useQuery({
    queryKey: [queryKeys.GET_SINGLE_DOCUMENT, documentId],
    queryFn: async () => {
      const { data } = await axios.get(`/documents/public/${documentId}`);
      return data as Document;
    },
    staleTime: 0,
  });
}
