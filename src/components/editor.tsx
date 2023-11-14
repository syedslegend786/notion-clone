"use client";
import "@blocknote/core/style.css";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { axios } from "@/lib/axios";
import {
  BlockNoteEditor,
  PartialBlock,
  uploadToTmpFilesDotOrg_DEV_ONLY,
} from "@blocknote/core";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { useUpdateContentMutation } from "@/react-query/hooks";
import { useParams } from "next/navigation";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}
export default function Editor({
  onChange,
  initialContent,
  editable,
}: EditorProps) {
  const isEditing = useRef(false);
  const params = useParams();
  const [content, setcontent] = useState("");
  const debouncedValue = useDebounce<string>(content, 2000);
  const { mutate: updateContentMutation } = useUpdateContentMutation();
  const { resolvedTheme } = useTheme();
  async function handleUploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post("/upload-file", formData);
      return data as string;
    } catch (error) {
      return "";
    }
  }
  const editor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange(newContent) {
      const _c = JSON.stringify(newContent.topLevelBlocks, null, 2);
      if (!isEditing.current && _c !== initialContent) {
        isEditing.current = true;
      }
      setcontent(_c);
    },
    uploadFile: handleUploadFile,
  });
  console.log({ editing: isEditing.current });
  useEffect(() => {
    if (isEditing.current && editable) {
      updateContentMutation({
        data: { content: debouncedValue },
        documentId: params?.documentId as string,
      });
    }
  }, [
    isEditing,
    debouncedValue,
    params?.documentId,
    updateContentMutation,
    editable,
  ]);
  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
