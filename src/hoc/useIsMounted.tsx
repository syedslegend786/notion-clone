"use client";

import { useEffect, useState } from "react";

export function useIsMounted() {
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setisMounted(true);
  }, []);
  return { isMounted };
}
