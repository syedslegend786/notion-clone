"use client";

import { CoverImageModal } from "@/components/modals/cover-image-modal";
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
      <CoverImageModal />
    </>
  );
}
