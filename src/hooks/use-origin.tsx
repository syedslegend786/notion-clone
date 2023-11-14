"use client";

import { useIsMounted } from "@/hoc/useIsMounted";

export function UseOrigin() {
  const { isMounted } = useIsMounted();
  if (!isMounted) {
    return "";
  }
  return window.location.origin ? window.location.origin : "";
}
