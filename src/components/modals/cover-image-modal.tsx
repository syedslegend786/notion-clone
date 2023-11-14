import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModals } from "@/hooks/use-modals";
import { toast } from "sonner";
import { FileIcon, Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { handleApiError } from "@/utils/handleApiError";
import { useUpdateDocumentBannerMutation } from "@/react-query/hooks";
import { useParams } from "next/navigation";

export function CoverImageModal() {
  const params = useParams();
  const { mutate, isPending } = useUpdateDocumentBannerMutation();
  const [file, setfile] = useState<File | null>(null);
  const { modalType, onClose } = useModals();
  const isOpen = modalType === "CoverImageModal";
  const onDrop = useCallback((acceptedFiles: any) => {
    if (!acceptedFiles || (acceptedFiles && acceptedFiles.length === 0)) {
      return;
    }
    const singleFile = acceptedFiles[0];
    setfile(singleFile);
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });
  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.lastModified}>
      {file.lastModified} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.lastModified} className="flex items-center flex-wrap">
        <ul>
          {errors.map((e) => (
            <li key={e.code} className="text-rose-500">
              {e.message}
            </li>
          ))}
        </ul>
      </li>
    );
  });
  async function handleUpload() {
    if (!file) {
      toast.error("No file is selected.");
      return;
    }
    const formData = new FormData();
    formData.append("banner", file);
    mutate({ data: formData, documentId: params?.documentId as string });
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="border-b-neutral-500">
            Upload File
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {acceptedFileItems}
          {fileRejectionItems}
          {file ? (
            <div className="w-full mt-3">
              <Image
                src={URL.createObjectURL(file)}
                alt=""
                width={100}
                height={100}
              />
              <div className="flex items-center justify-end gap-x-2 w-full mt-3">
                <Button
                  disabled={isPending}
                  onClick={() => {
                    setfile(null);
                  }}
                  variant={"outline"}
                  size={"sm"}
                >
                  Cancel
                </Button>
                <Button disabled={isPending} onClick={handleUpload} size={"sm"}>
                  Upload
                </Button>
              </div>
            </div>
          ) : (
            <div {...getRootProps()} className="border border-dashed p-5">
              <input {...getInputProps()} />
              <Upload className="h-6 w-6 mx-auto my-3" />
              {isDragActive ? (
                <p className="text-center">Drop the files here ...</p>
              ) : (
                <p className="text-center">
                  Drag & drop some files here, or click to select files
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
