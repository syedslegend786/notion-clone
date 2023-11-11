"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mutationKeys, queryKeys } from "./query-keys";
import { axios } from "@/lib/axios";
import {
  createDocumentSchema,
  deleteDocumentSchema,
} from "@/app/api/documents/utils";
import { queryClient } from "./query-client-provider";
import * as z from "zod";
import { Document } from "@prisma/client";
import { handleApiError } from "@/utils/handleApiError";
import { useParams } from "next/navigation";
export function useCreateDocumentMutation() {
  return useMutation({
    mutationKey: [queryKeys.DOCUMENT_CREATE],
    mutationFn: (newDocument: z.infer<typeof createDocumentSchema>) => {
      return axios.post("/documents", {
        ...newDocument,
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.FETCH_SIDEBAR_DOCUMENTS],
      });
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
