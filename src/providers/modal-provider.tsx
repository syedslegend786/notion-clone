"use client";

import { SettingsModal } from "@/components/modals/settings-modal";
import { useIsMounted } from "@/hoc/useIsMounted";

export function ModalProvider() {
  const { isMounted } = useIsMounted();
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <SettingsModal />
    </>
  );
}
