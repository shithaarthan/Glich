import { create } from 'zustand';

interface CommunityModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useCommunityModalStore = create<CommunityModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
