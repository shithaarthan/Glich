import { create } from 'zustand';

interface ModalState {
  isCreateEchoModalOpen: boolean;
  openCreateEchoModal: () => void;
  closeCreateEchoModal: () => void;
  isEditProfileModalOpen: boolean;
  openEditProfileModal: () => void;
  closeEditProfileModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateEchoModalOpen: false,
  openCreateEchoModal: () => set({ isCreateEchoModalOpen: true }),
  closeCreateEchoModal: () => set({ isCreateEchoModalOpen: false }),
  isEditProfileModalOpen: false,
  openEditProfileModal: () => set({ isEditProfileModalOpen: true }),
  closeEditProfileModal: () => set({ isEditProfileModalOpen: false }),
}));
