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
  styleOverrides: Record<string, string>;
  setStyleOverrides: (overrides: Record<string, string>) => void;
  setImageOverride: (id: string, url: string) => void;
  
  // Section layout management
  sectionsByRoute: Record<string, string[]>;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  setSectionsForRoute: (route: string, sections: string[]) => void;
  addSection: (route: string, afterId: string | null, sectionType: string) => void;
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

const initialSectionsByRoute: Record<string, string[]> = {
  '/': [
    'hero_section',
    'categories_section',
    'new_arrivals_section',
    'services_section',
    'promo_banner_section',
    'limited_deals_section',
    'testimonials_section'
  ]
};

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
      styleOverrides: {},
      setStyleOverrides: (overrides) => set((state) => ({ styleOverrides: { ...state.styleOverrides, ...overrides }, hasUnsavedChanges: true })),
      setImageOverride: (id, url) => set((state) => ({ 
        imageOverrides: { ...state.imageOverrides, [id]: url }, 
        hasUnsavedChanges: true 
      })),

      sectionsByRoute: initialSectionsByRoute,
      currentRoute: "/",
      setCurrentRoute: (route) => set({ currentRoute: route }),
      setSectionsForRoute: (route, sections) => set((state) => ({ sectionsByRoute: { ...state.sectionsByRoute, [route]: sections }, hasUnsavedChanges: true })),
      
      moveSectionUp: (id) => set((state) => {
        const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const idx = currentSections.indexOf(id);
        if (idx <= 0) return state;
        const newSections = [...currentSections];
        [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
      }),
      
      moveSectionDown: (id) => set((state) => {
        const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const idx = currentSections.indexOf(id);
        if (idx === -1 || idx === currentSections.length - 1) return state;
        const newSections = [...currentSections];
        [newSections[idx + 1], newSections[idx]] = [newSections[idx], newSections[idx + 1]];
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
      }),
      
      duplicateSection: (id) => set((state) => {
        const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const idx = currentSections.indexOf(id);
        if (idx === -1) return state;
        const newSections = [...currentSections];
        const newId = `${id.split('-')[0]}-${Date.now()}`;
        newSections.splice(idx + 1, 0, newId);
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
      }),
      
      deleteSection: (id) => set((state) => {
        const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const newSections = currentSections.filter(sectionId => sectionId !== id);
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
      }),

      clipboardSection: null,
      setClipboardSection: (id) => set({ clipboardSection: id }),
      
      addSection: (route, afterId, sectionType) => set((state) => {
        const currentSections = state.sectionsByRoute[route] || [];
        const newSections = [...currentSections];
        const newId = `${sectionType}-${Date.now()}`;
        if (afterId) {
          const idx = newSections.indexOf(afterId);
          if (idx !== -1) {
            newSections.splice(idx + 1, 0, newId);
          } else {
            newSections.push(newId);
          }
        } else {
          newSections.push(newId);
        }
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
      }),
      
      pasteSection: (afterId) => set((state) => {
        if (!state.clipboardSection) return state;
        const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const idx = currentSections.indexOf(afterId);
        if (idx === -1) return state;
        const newSections = [...currentSections];
        const newId = `${state.clipboardSection.split('-')[0]}-${Date.now()}`;
        newSections.splice(idx + 1, 0, newId);
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
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
        sectionsByRoute: state.sectionsByRoute,
        savedAssets: state.savedAssets,
        imageOverrides: state.imageOverrides,
        styleOverrides: state.styleOverrides
      }), // only save these fields
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'cms-store') {
      useCmsStore.persist.rehydrate();
    }
  });
}
