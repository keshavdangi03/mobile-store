const fs = require('fs');

try {
  let content = fs.readFileSync('e:/Programming/mobile-store/lib/cms-store.ts', 'utf-8');

  // Replace pageSections with sectionsByRoute
  content = content.replace(
    /pageSections: string\[\];/g,
    'sectionsByRoute: Record<string, string[]>;\n  currentRoute: string;\n  setCurrentRoute: (route: string) => void;'
  );
  
  content = content.replace(
    /setPageSections: \(sections: string\[\]\) => void;/g,
    'setSectionsForRoute: (route: string, sections: string[]) => void;\n  addSection: (route: string, afterId: string | null, sectionType: string) => void;'
  );

  content = content.replace(
    /const initialSections = \[\n  'hero_section',\n  'categories_section',\n  'services_section',\n  'promo_banner_section',\n  'limited_deals_section'\n\];/g,
    `const initialSectionsByRoute: Record<string, string[]> = {
  '/': [
    'hero_section',
    'categories_section',
    'services_section',
    'promo_banner_section',
    'limited_deals_section'
  ]
};`
  );

  content = content.replace(
    /pageSections: initialSections,/g,
    'sectionsByRoute: initialSectionsByRoute,\n      currentRoute: "/",\n      setCurrentRoute: (route) => set({ currentRoute: route }),'
  );

  content = content.replace(
    /setPageSections: \(sections\) => set\(\{ pageSections: sections, hasUnsavedChanges: true \}\),/g,
    'setSectionsForRoute: (route, sections) => set((state) => ({ sectionsByRoute: { ...state.sectionsByRoute, [route]: sections }, hasUnsavedChanges: true })),'
  );
  
  // Refactor moveSectionUp
  content = content.replace(
    /const idx = state\.pageSections\.indexOf\(id\);\n\s*if \(idx <= 0\) return state; \/\/ Already at top or not found\n\s*const newSections = \[\.\.\.state\.pageSections\];\n\s*\[newSections\[idx - 1\], newSections\[idx\]\] = \[newSections\[idx\], newSections\[idx - 1\]\];\n\s*return \{ pageSections: newSections, hasUnsavedChanges: true \};/g,
    `const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const idx = currentSections.indexOf(id);
        if (idx <= 0) return state;
        const newSections = [...currentSections];
        [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };`
  );

  // Refactor moveSectionDown
  content = content.replace(
    /const idx = state\.pageSections\.indexOf\(id\);\n\s*if \(idx === -1 \|\| idx === state\.pageSections\.length - 1\) return state;\n\s*const newSections = \[\.\.\.state\.pageSections\];\n\s*\[newSections\[idx \+ 1\], newSections\[idx\]\] = \[newSections\[idx\], newSections\[idx \+ 1\]\];\n\s*return \{ pageSections: newSections, hasUnsavedChanges: true \};/g,
    `const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const idx = currentSections.indexOf(id);
        if (idx === -1 || idx === currentSections.length - 1) return state;
        const newSections = [...currentSections];
        [newSections[idx + 1], newSections[idx]] = [newSections[idx], newSections[idx + 1]];
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };`
  );

  // Refactor duplicateSection
  content = content.replace(
    /const idx = state\.pageSections\.indexOf\(id\);\n\s*if \(idx === -1\) return state;\n\s*const newSections = \[\.\.\.state\.pageSections\];\n\s*const newId = \`\$\{id\.split\('-'\)\[0\]\}-\$\{Date\.now\(\)\}\`;\n\s*newSections\.splice\(idx \+ 1, 0, newId\);\n\s*return \{ pageSections: newSections, hasUnsavedChanges: true \};/g,
    `const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const idx = currentSections.indexOf(id);
        if (idx === -1) return state;
        const newSections = [...currentSections];
        const newId = \`\$\{id.split('-')[0]\}-\$\{Date.now()\}\`;
        newSections.splice(idx + 1, 0, newId);
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };`
  );

  // Refactor deleteSection
  content = content.replace(
    /const newSections = state\.pageSections\.filter\(sectionId => sectionId !== id\);\n\s*return \{ pageSections: newSections, hasUnsavedChanges: true \};/g,
    `const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const newSections = currentSections.filter(sectionId => sectionId !== id);
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };`
  );

  // Refactor pasteSection
  content = content.replace(
    /const idx = state\.pageSections\.indexOf\(afterId\);\n\s*if \(idx === -1\) return state;\n\s*const newSections = \[\.\.\.state\.pageSections\];\n\s*const newId = \`\$\{state\.clipboardSection\.split\('-'\)\[0\]\}-\$\{Date\.now\(\)\}\`;\n\s*newSections\.splice\(idx \+ 1, 0, newId\);\n\s*return \{ pageSections: newSections, hasUnsavedChanges: true \};/g,
    `const route = state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || [];
        const idx = currentSections.indexOf(afterId);
        if (idx === -1) return state;
        const newSections = [...currentSections];
        const newId = \`\$\{state.clipboardSection.split('-')[0]\}-\$\{Date.now()\}\`;
        newSections.splice(idx + 1, 0, newId);
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };`
  );

  // Add addSection method
  content = content.replace(
    /setClipboardSection:/,
    `addSection: (route, afterId, sectionType) => set((state) => {
        const currentSections = state.sectionsByRoute[route] || [];
        const newSections = [...currentSections];
        const newId = \`\$\{sectionType\}-\$\{Date.now()\}\`;
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
      }),\n      setClipboardSection:`
  );

  // Fix partialize
  content = content.replace(
    /pageSections: state\.pageSections,/g,
    'sectionsByRoute: state.sectionsByRoute,'
  );

  fs.writeFileSync('e:/Programming/mobile-store/lib/cms-store.ts', content);
  console.log("Store refactored!");
} catch (e) {
  console.error(e);
}
