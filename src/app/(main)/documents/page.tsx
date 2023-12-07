"use client";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { axios } from "@/lib/axios";
import * as z from "zod";
import { createDocumentSchema } from "@/app/api/documents/utils";
import { useCreateDocumentMutation } from "@/react-query/hooks";
const Documents = () => {
  const { data } = useSession();
  const { mutate: createDocumentMutation } = useCreateDocumentMutation();
  return (
    <div className="flex items-center h-full justify-center  flex-col">
      <div className="relative w-[300px] h-[300px]">
        <Image
          src={"/empty.png"}
          alt=""
          fill
          className="object-contain dark:hidden"
        />
        <Image
          src={"/empty-dark.png"}
          alt=""
          fill
          className="object-contain dark:block hidden"
        />
      </div>
      <h3 className="font-semibold text-lg">
        Welcome to {data?.user?.email}&apos;s Jotion
      </h3>
      <Button
        className="text-sm mt-3"
        onClick={() => {
          createDocumentMutation({ title: "Untitled" });
        }}
      >
        <PlusCircleIcon className="mr-2 h-4 w-4" />
        Create a note
      </Button>
    </div>
  );
};

export default Documents;
