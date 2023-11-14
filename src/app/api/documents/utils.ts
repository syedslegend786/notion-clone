import * as z from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  parentId: z.string().optional(),
});
export const archiveDocumentSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
});

export const undoTrashItemsSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
});

export const deleteDocumentSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
});
export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  icon: z.string().optional(),
  isPublished: z.boolean().optional(),
});
export const updateContentSchema = z.object({
  content: z.string(),
});
