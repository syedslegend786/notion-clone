"use client";

import { Skeleton } from "@/components/ui/skeleton";

type TitleProps = {
  initialText: string;
};
export function Title({ initialText }: TitleProps) {
  return <div>{initialText}</div>;
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-6 w-[200px] rounded" />;
};
