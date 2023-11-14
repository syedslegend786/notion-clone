"use client";
import { CreditCard, File, Loader2, Settings, User } from "lucide-react";
import { axios } from "@/lib/axios";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useIsMounted } from "@/hoc/useIsMounted";
import { useEffect } from "react";
import { useSearch } from "@/hooks/use-search";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/react-query/query-keys";
import { Document } from "@prisma/client";
import { useRouter } from "next/navigation";
import { URLS } from "@/utils/URLS";
export function SearchCommand() {
  const router = useRouter();
  const { isOpen, onClose, onOpen, toggle } = useSearch();
  const { data, error, isFetching } = useQuery({
    queryKey: [queryKeys.GET_ALL_DOCUMENTS],
    queryFn: async () => {
      const { data } = await axios.get("/documents");
      return data as Document[];
    },
    enabled: isOpen,
  });
  const { isMounted } = useIsMounted();
  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", down);
    return () => {
      window.removeEventListener("keydown", down);
    };
  }, [isMounted, isOpen, onOpen]);
  if (!isMounted) {
    return null;
  }
  function handleSelect(id: string) {
    router.push(URLS.SINGLE_DOCUMENT(id));
    onClose();
  }
  return (
    <>
      <CommandDialog open={isOpen} onOpenChange={onClose}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          {isFetching ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Documents">
                {data?.map((document) => (
                  <CommandItem
                    onSelect={() => {
                      handleSelect(document.id);
                    }}
                    key={document.id}
                    value={`${document.id}-${document.title}`}
                  >
                    {document.icon ? (
                      <p className="mr-2 h-4 w-4">{document.icon}</p>
                    ) : (
                      <File className="mr-2 h-4 w-4" />
                    )}
                    <span>{document.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
