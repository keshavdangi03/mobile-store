import { create } from 'zustand';

interface CmsStore {
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
}

export const useCmsStore = create<CmsStore>((set) => ({
  isEditMode: false,
  setIsEditMode: (mode) => set({ isEditMode: mode }),
}));
