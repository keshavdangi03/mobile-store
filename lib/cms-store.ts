import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedAsset {
  id: string;
  name: string;
  type: 'Section' | 'Image';
  url?: string;
  createdAt: string;
}

interface CmsStore {
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  activeEditorId: string | null;
  setActiveEditorId: (id: string | null) => void;
  activeImageId: string | null;
  setActiveImageId: (id: string | null) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // Images
  imageOverrides: Record<string, string>;
  setImageOverride: (id: string, url: string) => void;
  
  // Section layout management
  pageSections: string[];
  setPageSections: (sections: string[]) => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;
  
  // Copy / Paste
  clipboardSection: string | null;
  setClipboardSection: (id: string | null) => void;
  pasteSection: (afterId: string) => void;

  // Assets
  savedAssets: SavedAsset[];
  saveSectionToAssets: (id: string, name: string) => void;
  saveImageToAssets: (url: string, name: string) => void;
  removeAsset: (id: string) => void;
}

const initialSections = [
  'hero_section',
  'categories_section',
  'services_section',
  'promo_banner_section',
  'limited_deals_section'
];

export const useCmsStore = create<CmsStore>()(
  persist(
    (set) => ({
      isEditMode: false,
      setIsEditMode: (mode) => set({ isEditMode: mode }),
      activeEditorId: null,
      setActiveEditorId: (id) => set({ activeEditorId: id }),
      activeImageId: null,
      setActiveImageId: (id) => set({ activeImageId: id }),
      hasUnsavedChanges: false,
      setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

      imageOverrides: {},
      setImageOverride: (id, url) => set((state) => ({ 
        imageOverrides: { ...state.imageOverrides, [id]: url }, 
        hasUnsavedChanges: true 
      })),

      pageSections: initialSections,
      setPageSections: (sections) => set({ pageSections: sections, hasUnsavedChanges: true }),
      
      moveSectionUp: (id) => set((state) => {
        const idx = state.pageSections.indexOf(id);
        if (idx <= 0) return state; // Already at top or not found
        const newSections = [...state.pageSections];
        [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
        return { pageSections: newSections, hasUnsavedChanges: true };
      }),
      
      moveSectionDown: (id) => set((state) => {
        const idx = state.pageSections.indexOf(id);
        if (idx === -1 || idx === state.pageSections.length - 1) return state;
        const newSections = [...state.pageSections];
        [newSections[idx + 1], newSections[idx]] = [newSections[idx], newSections[idx + 1]];
        return { pageSections: newSections, hasUnsavedChanges: true };
      }),
      
      duplicateSection: (id) => set((state) => {
        const idx = state.pageSections.indexOf(id);
        if (idx === -1) return state;
        const newSections = [...state.pageSections];
        const newId = `${id.split('-')[0]}-${Date.now()}`;
        newSections.splice(idx + 1, 0, newId);
        return { pageSections: newSections, hasUnsavedChanges: true };
      }),
      
      deleteSection: (id) => set((state) => {
        const newSections = state.pageSections.filter(sectionId => sectionId !== id);
        return { pageSections: newSections, hasUnsavedChanges: true };
      }),

      clipboardSection: null,
      setClipboardSection: (id) => set({ clipboardSection: id }),
      
      pasteSection: (afterId) => set((state) => {
        if (!state.clipboardSection) return state;
        const idx = state.pageSections.indexOf(afterId);
        if (idx === -1) return state;
        const newSections = [...state.pageSections];
        const newId = `${state.clipboardSection.split('-')[0]}-${Date.now()}`;
        newSections.splice(idx + 1, 0, newId);
        return { pageSections: newSections, hasUnsavedChanges: true };
      }),

      savedAssets: [],
      saveSectionToAssets: (id, name) => set((state) => {
        const baseId = id.split('-')[0];
        const newAsset: SavedAsset = {
          id: baseId,
          name,
          type: 'Section',
          createdAt: new Date().toISOString()
        };
        return { savedAssets: [newAsset, ...state.savedAssets] };
      }),
      saveImageToAssets: (url, name) => set((state) => {
        const newAsset: SavedAsset = {
          id: `img-${Date.now()}`,
          name,
          type: 'Image',
          url,
          createdAt: new Date().toISOString()
        };
        return { savedAssets: [newAsset, ...state.savedAssets] };
      }),
      removeAsset: (id) => set((state) => ({
        savedAssets: state.savedAssets.filter(a => a.id !== id)
      }))
    }),
    {
      name: 'cms-store', // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        pageSections: state.pageSections,
        savedAssets: state.savedAssets,
        imageOverrides: state.imageOverrides
      }), // only save these fields
    }
  )
);
