"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Item } from "./Item";
import { Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/react-query/query-keys";
import { axios } from "@/lib/axios";
import { Document } from "@prisma/client";
import { useState } from "react";
import { TrashItem } from "./trash-item";
export function TrashList() {
  const [search, setsearch] = useState("");
  const [open, setopen] = useState(false);
  const { isFetching, data, error, status } = useQuery({
    queryKey: [queryKeys.TRASH_DOCUMENTS],
    async queryFn() {
      const { data } = await axios.get("/documents/trash");
      return data as Document[];
    },
    enabled: open,
  });
  function toggle() {
    setopen(!open);
  }
  const filteredData = data?.filter((item) =>
    item.title.toLocaleLowerCase().includes(search.toLowerCase())
  );
  console.log("open===>", status);
  return (
    <Popover
      open={open}
      onOpenChange={() => {
        toggle();
      }}
    >
      <PopoverTrigger
        onClick={() => {
          toggle();
        }}
        className="w-full"
      >
        <Item onClick={() => {}} label="Trash" icon={Trash} />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="right"
        className="h-[400px] overflow-auto"
      >
        <div className="flex items-center gap-2 w-full">
          <Input
            value={search}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
            placeholder="Search..."
            className="flex-1"
          />
        </div>
        {isFetching && (
          <div className="mt-5 flex flex-col gap-3">
            <TrashItem.Skeleton />
            <TrashItem.Skeleton />
            <TrashItem.Skeleton />
            <TrashItem.Skeleton />
          </div>
        )}
        {!isFetching && filteredData && filteredData?.length > 0 && (
          <div className="mt-5 flex flex-col gap-3">
            {filteredData?.map((item, index) => (
              <TrashItem document={item} key={index} />
            ))}
          </div>
        )}
        {!isFetching && (!filteredData || filteredData.length === 0) && (
          <div className="mt-5">
            <h1 className="text-center font-semibold text-xs">Empty Trash.</h1>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
