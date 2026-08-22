"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useCmsStore } from "@/lib/cms-store";
import { getDbTheme, saveDbTheme } from "@/app/actions";

type Theme = "light" | "dark";
type DesignTheme = string;

interface ThemeContextType {
  theme: Theme;
  designTheme: DesignTheme;
  toggleTheme: () => void;
  setDesignTheme: (theme: DesignTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [designTheme, setDesignThemeState] = useState<DesignTheme>("professional-1");
  const [mounted, setMounted] = useState(false);
  const { styleOverrides } = useCmsStore();

  useEffect(() => {
    // Force light theme
    setTheme("light");
    document.documentElement.classList.remove("dark");

    // Fetch theme from PostgreSQL database
    getDbTheme().then((dbTheme) => {
      const active = dbTheme || "professional-1";
      setDesignThemeState(active);
      previewDesignTheme(active);
    }).catch(() => {
      previewDesignTheme("professional-1");
    });
    
    setMounted(true);
    // Apply persisted styles
    if (styleOverrides) {
      Object.entries(styleOverrides).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value as string);
      });
    }

    // Listen for CMS theme changes
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CMS_STYLE_OVERRIDE') {
        console.log("CMS_STYLE_OVERRIDE received in iframe!", event.data.overrides);
        const { overrides } = event.data;
        Object.entries(overrides).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value as string);
        });
      }
      if (event.data && event.data.type === 'CMS_PREVIEW_THEME') {
        previewDesignTheme(event.data.theme);
      }
      if (event.data && event.data.type === 'CMS_SAVE_THEME') {
        setDesignTheme(event.data.theme);
      }
      if (event.data && event.data.type === 'CMS_REVERT_THEME') {
        const saved = localStorage.getItem("zolpa_design_theme") || "professional-1";
        previewDesignTheme(saved);
        setDesignThemeState(saved);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const toggleTheme = () => {
    // Dark mode is disabled
  };

  const previewDesignTheme = (newTheme: DesignTheme) => {
    const classes = Array.from(document.documentElement.classList);
    classes.forEach(cls => {
      if (cls.startsWith("theme-")) {
        document.documentElement.classList.remove(cls);
      }
    });
    document.documentElement.classList.add(`theme-${newTheme}`);
    // DO NOT save to local storage for previews!
  };

  const setDesignTheme = (newTheme: DesignTheme) => {
    previewDesignTheme(newTheme);
    setDesignThemeState(newTheme);
    saveDbTheme(newTheme).catch((e) => console.error("Error saving theme to DB:", e));
  };

  return (
    <ThemeContext.Provider value={{ theme, designTheme, toggleTheme, setDesignTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
