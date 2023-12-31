"use client";
import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleDocument } from "@/react-query/hooks";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

const SingleDocument = () => {
  const params = useParams();
  const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
  });
  const { data, isFetching, error } = useGetSingleDocument(
    params?.documentId as string
  );
  if (isFetching) {
    return (
      <div className="w-full h-screen">
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto pt-5 space-y-3">
          <Skeleton className="h-14 w-[50%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    );
  }
  if (!data) {
    return <div>No data found.</div>;
  }
  function handleChange(value: string) {}
  return (
    <div className="pb-40 pt-10 h-full overflow-auto">
      <Cover coverUrl={data.coverImage ?? ""} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto pt-5">
        <Toolbar initialData={data} />
        <Editor
          onChange={handleChange}
          initialContent={data.content ?? ""}
          editable
        />
      </div>
    </div>
  );
};

export default SingleDocument;
