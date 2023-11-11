"use client";

import React from "react";
import {
  QueryClientProvider as Provider,
  QueryClient,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider client={queryClient}>{children}</Provider>;
}
