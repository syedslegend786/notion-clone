"use client";

import { Document } from "@prisma/client";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import React, {
  ElementRef,
  KeyboardEvent,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useRemoveIconMutation,
  useUpdateDocumentMutation,
} from "@/react-query/hooks";
import { useModals } from "@/hooks/use-modals";

interface ToolbarProps {
  initialData: Document;
  isPreview?: boolean;
}
export function Toolbar({ initialData, isPreview = false }: ToolbarProps) {
  const { onOpen } = useModals();
  const { mutate: removeIconMutation } = useRemoveIconMutation();
  const [data, setdata] = useState({ ...initialData });
  const { mutate } = useUpdateDocumentMutation();
  const [editing, setediting] = useState(false);
  const titleRef = useRef<ElementRef<"textarea">>(null);
  function enableEditing() {
    setediting(true);
    setTimeout(() => {
      titleRef.current?.focus();
    }, 0);
  }
  function stopEditing() {
    setediting(false);
  }
  const handleUpdateTitle = useDebouncedCallback((title: string) => {
    mutate({
      data: {
        title,
      },
      documentId: initialData.id,
    });
  }, 4000);
  function onInputChange(value: string) {
    setdata((prev) => ({ ...prev, title: value }));
    handleUpdateTitle(value);
  }
  function handleChangeIcon(icon: string) {
    setdata((prev) => ({ ...prev, icon }));
    mutate({ documentId: initialData.id, data: { icon: icon } });
  }
  function handleDeleteIcon() {
    setdata((prev) => ({ ...prev, icon: "" }));
    removeIconMutation(initialData.id);
  }
  function handleUploadCover() {
    onOpen("CoverImageModal");
  }
  useEffect(() => {
    setdata({ ...initialData });
  }, [initialData]);
  return (
    <div className="pl-[54px] group relative">
      {!!data.icon && !isPreview && (
        <div className="flex items-center gap-x-2 group/icon text-6xl">
          <IconPicker onChange={() => {}}>
            <p>{data.icon}</p>
          </IconPicker>
          <Button
            onClick={handleDeleteIcon}
            variant={"ghost"}
            className="opacity-0 group-hover/icon:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!!data.icon && isPreview && <p className="text-6xl pt-6">{data.icon}</p>}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!data.icon && !isPreview && (
          <IconPicker onChange={handleChangeIcon}>
            <Button className="" variant={"outline"} size={"sm"}>
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!data.coverImage && !isPreview && (
          <Button onClick={handleUploadCover} variant={"outline"} size={"sm"}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {editing && !isPreview ? (
        <textarea
          ref={titleRef}
          className="text-5xl font-bold w-full  break-words outline-none border-none"
          onBlur={stopEditing}
          value={data.title}
          onChange={(e) => {
            onInputChange(e.target.value);
          }}
        />
      ) : (
        <p onClick={enableEditing} className="text-5xl font-bold">
          {data.title}
        </p>
      )}
    </div>
  );
}
