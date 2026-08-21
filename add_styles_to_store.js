const fs = require('fs');
try {
  let store = fs.readFileSync('e:/Programming/mobile-store/lib/cms-store.ts', 'utf-8');
  if (!store.includes('styleOverrides:')) {
    store = store.replace(
      /imageOverrides: Record<string, string>;/,
      'imageOverrides: Record<string, string>;\n  styleOverrides: Record<string, string>;\n  setStyleOverrides: (overrides: Record<string, string>) => void;'
    );
    store = store.replace(
      /imageOverrides: \{\},/,
      'imageOverrides: {},\n      styleOverrides: {},\n      setStyleOverrides: (overrides) => set((state) => ({ styleOverrides: { ...state.styleOverrides, ...overrides }, hasUnsavedChanges: true })),'
    );
    store = store.replace(
      /imageOverrides: state.imageOverrides/,
      'imageOverrides: state.imageOverrides,\n        styleOverrides: state.styleOverrides'
    );
    fs.writeFileSync('e:/Programming/mobile-store/lib/cms-store.ts', store);
    console.log("Store updated");
  }

  let panel = fs.readFileSync('e:/Programming/mobile-store/app/admin/cms/styles/page.tsx', 'utf-8');
  if (!panel.includes('setStyleOverrides')) {
    panel = panel.replace(
      /export default function SiteStylesPanel\(\) \{/,
      `import { useCmsStore } from "@/lib/cms-store";\n\nexport default function SiteStylesPanel() {`
    );
    panel = panel.replace(
      /const router = useRouter\(\);/,
      'const router = useRouter();\n  const { setStyleOverrides } = useCmsStore();'
    );
    panel = panel.replace(
      /const handleOverride = \(overrides: Record<string, string>\) => \{/,
      `const handleOverride = (overrides: Record<string, string>) => {
    setStyleOverrides(overrides);`
    );
    fs.writeFileSync('e:/Programming/mobile-store/app/admin/cms/styles/page.tsx', panel);
    console.log("Panel updated");
  }

  let provider = fs.readFileSync('e:/Programming/mobile-store/components/theme-provider.tsx', 'utf-8');
  if (!provider.includes('useCmsStore')) {
    provider = provider.replace(
      /import React, \{ createContext, useContext, useEffect, useState \} from "react";/,
      `import React, { createContext, useContext, useEffect, useState } from "react";\nimport { useCmsStore } from "@/lib/cms-store";`
    );
    provider = provider.replace(
      /const \[mounted, setMounted\] = useState\(false\);/,
      `const [mounted, setMounted] = useState(false);\n  const { styleOverrides } = useCmsStore();`
    );
    provider = provider.replace(
      /setMounted\(true\);/,
      `setMounted(true);\n    // Apply persisted styles\n    if (styleOverrides) {\n      Object.entries(styleOverrides).forEach(([key, value]) => {\n        document.documentElement.style.setProperty(key, value as string);\n      });\n    }`
    );
    fs.writeFileSync('e:/Programming/mobile-store/components/theme-provider.tsx', provider);
    console.log("Provider updated");
  }

} catch(e) { console.error(e) }
