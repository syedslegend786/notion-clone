import { create } from "zustand";

type ModalsType = "SettingsModal" | "CoverImageModal" | null;
type UseModal = {
  modalType: ModalsType;
  onClose: () => void;
  onOpen: (modalType: ModalsType) => void;
};

export const useModals = create<UseModal>((set, get) => ({
  modalType: null,
  onClose: () => set({ modalType: null }),
  onOpen: (modalType: ModalsType) => set({ modalType: modalType }),
}));
