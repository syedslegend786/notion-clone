import { cn } from "@/lib/utils";
import {
  ChevronsLeftIcon,
  MenuIcon,
  PlusCircleIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { MAX_WIDTH, MIN_WIDTH } from "./utils";
import { Item } from "./Item";
import { DocumentList } from "./document-list";
import { useCreateDocumentMutation } from "@/react-query/hooks";

import { TrashList } from "./trash-list";
import { useSearch } from "@/hooks/use-search";
import { useModals } from "@/hooks/use-modals";
import { DocumentNavBar } from "./document-navbar";
export function Navigation() {
  const params = useParams();
  const { onOpen: OnModalOpen } = useModals();
  const { mutate: createDocumentMutation } = useCreateDocumentMutation();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"div">>(null);
  const navbarRef = useRef<ElementRef<"aside">>(null);
  const [isResetting, setisResetting] = useState(false);
  const [isCollapsed, setisCollapsed] = useState(isMobile);
  const { onOpen } = useSearch();
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }
  function handleMouseMove(e: MouseEvent) {
    if (!isResizingRef.current) {
      return;
    }
    let newWidth = e.clientX;
    if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
    if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
    if (sidebarRef.current && navbarRef.current) {
      navbarRef.current.style.left = `${newWidth}px`;
      sidebarRef.current.style.width = `${newWidth}px`;
    }
  }
  function handleMouseUp(e: MouseEvent) {
    isResizingRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }
  function resetSideBar() {
    if (isMobile) {
      setisCollapsed(true);
    } else {
      setisCollapsed(false);
    }
    if (sidebarRef.current && navbarRef.current) {
      setisResetting(true);
      if (isMobile) {
        sidebarRef.current.style.setProperty("width", "100%");
        sidebarRef.current.style.setProperty("position", "fixed");
        sidebarRef.current.style.setProperty("left", "0px");
        sidebarRef.current.style.setProperty("top", "0px");
        sidebarRef.current.style.setProperty("bottom", "0px");
        sidebarRef.current.style.setProperty("right", "0px");
        navbarRef.current.style.setProperty("left", "0px");
        // navbarRef.current.style.setProperty("opacity", "0");
      } else {
        sidebarRef.current.style.removeProperty("position");
        sidebarRef.current.style.width = isMobile ? "100%" : `${MIN_WIDTH}px`;
        navbarRef.current.style.left = `${MIN_WIDTH}px`;
        // navbarRef.current.style.setProperty("width", "100%");
        // navbarRef.current.style.setProperty("opacity", "100");
      }
      setTimeout(() => {
        setisResetting(false);
      }, 300);
    }
  }
  function collapseSideBar() {
    if (sidebarRef.current && navbarRef.current) {
      setisCollapsed(true);
      setisResetting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.left = "0px";
      setTimeout(() => {
        setisResetting(false);
      }, 300);
    }
  }
  useEffect(() => {
    if (isMobile) {
      collapseSideBar();
    } else {
      resetSideBar();
    }
    /**
     * DO NOT CHANGE THE DEPENDENCIES, BECAUSE IT WILL PRODUCE WRONG OUTPUTS.
     */
  }, [isMobile]);
  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          "group/sidebar w-60 bg-secondary/40 overflow-y-auto relative flex flex-col z-[99999]",
          isResetting && "transition-all ease-in-out",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapseSideBar}
          role="button"
          className={cn(
            "p-1 rounded bg-gray-200 dark:bg-neutral-500 w-max right-3 top-3 absolute transition group-hover/sidebar:opacity-100 opacity-0",
            {
              "opacity-100": isMobile,
            }
          )}
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </div>
        <div>
          <UserItem />
          <Item label={"Search"} isSearch onClick={onOpen} icon={SearchIcon} />
          <Item
            label={"Settings"}
            onClick={() => {
              OnModalOpen("SettingsModal");
            }}
            icon={SettingsIcon}
          />
          <Item
            label={"New page"}
            onClick={() => {
              createDocumentMutation({ title: "Untitled" });
            }}
            icon={PlusCircleIcon}
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item
            onClick={() => {
              createDocumentMutation({ title: "Untitled" });
            }}
            label="Add Page"
            icon={PlusIcon}
          />
          <TrashList />
        </div>
        {/* resizer */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetSideBar}
          className="cursor-e-resize group-hover/sidebar:opacity-100 opacity-0 h-full absolute right-0 w-1 bg-gray-200"
        />
      </div>
      <nav
        ref={navbarRef}
        className={cn(`fixed left-60 top-0 z-[9999]  h-10 right-0 `, {
          "transition-all ease-in-out duration-300": isResetting,
        })}
      >
        {!!params.documentId ? (
          <DocumentNavBar
            isCollapsed={isCollapsed}
            onResetWidth={resetSideBar}
          />
        ) : (
          <div
            className={cn("hidden", {
              "inline-block": (!isMobile && isCollapsed) || isMobile,
            })}
            role="button"
            onClick={resetSideBar}
          >
            <MenuIcon className="h-4 w-4" />
          </div>
        )}
      </nav>
    </>
  );
}
