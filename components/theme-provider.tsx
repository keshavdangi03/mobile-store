"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useCmsStore } from "@/lib/cms-store";

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
    // Determine initial theme on client mount
    const saved = localStorage.getItem("zolpa_theme") as Theme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    }

    const savedDesign = localStorage.getItem("zolpa_design_theme") as DesignTheme | null;
    if (savedDesign) {
      setDesignThemeState(savedDesign);
      document.documentElement.classList.add(`theme-${savedDesign}`);
    } else {
      document.documentElement.classList.add("theme-professional-1");
    }
    
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
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("zolpa_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
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
    localStorage.setItem("zolpa_design_theme", newTheme);
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
