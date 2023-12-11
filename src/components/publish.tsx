"use client";

import { UseOrigin } from "@/hooks/use-origin";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, Copy, Globe } from "lucide-react";
import { useUpdateDocumentMutation } from "@/react-query/hooks";
import { useState } from "react";
import { Input } from "./ui/input";
import { useCopyToClipboard } from "usehooks-ts";

interface PublishProps {
  isPublished: boolean;
  documentId: string;
}
export function Publish({
  documentId,
  isPublished: IsPublished,
}: PublishProps) {
  const [isPublished, setisPublished] = useState(IsPublished);
  const [copyValue, setCopy] = useCopyToClipboard();
  const [isCopied, setisCopied] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const { mutate: mutateUpdateDocumentMutation, isPending } =
    useUpdateDocumentMutation();
  const origin = UseOrigin();
  const url = `${origin}/preview/${documentId}`;
  function toggle() {
    setisOpen(!isOpen);
  }
  function handleCopy() {
    setCopy(url);
    setisCopied(true);
    setTimeout(() => {
      setisCopied(false);
    }, 1000);
  }
  return (
    <div>
      <Popover
        open={isOpen}
        onOpenChange={() => {
          toggle();
        }}
      >
        <PopoverTrigger onClick={toggle}>
          <Button size={"sm"} variant={"ghost"}>
            Publish{" "}
            {isPublished && <Globe className="h-4 w-4 ml-2 text-blue-500" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {!isPublished && (
            <div className="space-y-2">
              <Globe className="w-6 h-6 shrink-0 text-black  mx-auto" />
              <p className="text-xs text-center font-semibold">
                Publish this document
              </p>
              <p className="text-xs text-primary/30 text-center font-semibold">
                Share this with other people
              </p>
              <Button
                disabled={isPending}
                onClick={() => {
                  mutateUpdateDocumentMutation(
                    {
                      documentId: documentId,
                      data: {
                        isPublished: true,
                      },
                    },
                    {
                      onSuccess() {
                        setisPublished(true);
                        setisOpen(false);
                      },
                    }
                  );
                }}
                className="w-full"
              >
                Publish
              </Button>
            </div>
          )}
          {isPublished && (
            <div className="space-y-2">
              <div className="flex items-center gap-x-2">
                <Globe className="h-4 w-4 shrink-0 text-blue-500" />
                <p className="font-bold text-xs text-blue-500">
                  This note is live on web.
                </p>
              </div>
              <div className="flex items-center ">
                <Input
                  value={url}
                  className=" rounded-r-none outline-none ring-0 ring-offset-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0"
                />
                <Button
                  onClick={handleCopy}
                  size={"icon"}
                  className="rounded-l-none transition"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 shrink-0 " />
                  ) : (
                    <Copy className="h-4 w-4 shrink-0 " />
                  )}
                </Button>
              </div>
              <Button
                disabled={isPending}
                onClick={() => {
                  mutateUpdateDocumentMutation(
                    {
                      documentId: documentId,
                      data: {
                        isPublished: false,
                      },
                    },
                    {
                      onSuccess() {
                        setisPublished(false);
                        setisOpen(false);
                      },
                    }
                  );
                }}
                className="w-full"
              >
                Unpublish
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
