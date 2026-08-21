"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const THEME_CATEGORIES = [
  {
    name: "PRIMARY",
    variants: [
      {
        id: "professional-1",
        font: "font-sans",
        fontFamily: "var(--font-inter), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#f7fcfb]", "bg-[#ffffff]", "bg-[#f1f5f9]", "bg-[#00AFA2]", "bg-[#0d1e1c]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#00AFA2]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#f1f5f9]"
      },
      {
        id: "professional-2",
        font: "font-serif text-[#0f172a]",
        fontFamily: "var(--font-playfair), serif",
        aaText: "Aa",
        colors: ["bg-[#f8fafc]", "bg-[#ffffff]", "bg-[#e2e8f0]", "bg-[#0c2b5c]", "bg-[#0f172a]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#0c2b5c]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#e2e8f0]"
      }
    ]
  },
  {
    name: "PLAYFUL",
    variants: [
      {
        id: "playful-1",
        font: "text-[#4a044e] italic tracking-wider",
        fontFamily: "var(--font-chewy), cursive",
        aaText: "Aa",
        colors: ["bg-[#faf5ff]", "bg-[#ffffff]", "bg-[#f5d0fe]", "bg-[#d946ef]", "bg-[#4a044e]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#d946ef]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#f5d0fe]"
      },
      {
        id: "playful-2",
        font: "font-serif font-bold text-[#1e3a8a]",
        fontFamily: "var(--font-playfair), serif",
        aaText: "Aa",
        colors: ["bg-[#fffbeb]", "bg-[#ffffff]", "bg-[#fde68a]", "bg-[#3b82f6]", "bg-[#1e3a8a]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#3b82f6]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#fde68a]"
      }
    ]
  },
  {
    name: "SOPHISTICATED",
    variants: [
      {
        id: "sophisticated-1",
        font: "text-[#451a03]",
        fontFamily: "var(--font-cormorant), serif",
        aaText: "Aa",
        colors: ["bg-[#fafaf9]", "bg-[#ffffff]", "bg-[#e7e5e4]", "bg-[#b45309]", "bg-[#451a03]"],
        buttonShape: "rounded-sm",
        buttonBg: "bg-[#b45309]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#e7e5e4]"
      },
      {
        id: "sophisticated-2",
        font: "text-[#334155]",
        fontFamily: "var(--font-syne), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#fff1f2]", "bg-[#ffffff]", "bg-[#ffe4e6]", "bg-[#e11d48]", "bg-[#334155]"],
        buttonShape: "rounded-sm",
        buttonBg: "bg-[#e11d48]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#ffe4e6]"
      }
    ]
  },
  {
    name: "FRIENDLY",
    variants: [
      {
        id: "friendly-1",
        font: "font-sans font-black text-[#0f172a]",
        fontFamily: "var(--font-nunito), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#f0f9ff]", "bg-[#ffffff]", "bg-[#e0f2fe]", "bg-[#0ea5e9]", "bg-[#0f172a]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#0ea5e9]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#e0f2fe]"
      },
      {
        id: "friendly-2",
        font: "text-[#064e3b]",
        fontFamily: "var(--font-dm-serif), serif",
        aaText: "Aa",
        colors: ["bg-[#ecfdf5]", "bg-[#ffffff]", "bg-[#d1fae5]", "bg-[#10b981]", "bg-[#064e3b]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#10b981]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#d1fae5]"
      }
    ]
  },
  {
    name: "QUIRKY",
    variants: [
      {
        id: "quirky-1",
        font: "font-sans font-black text-[#000000]",
        fontFamily: "var(--font-space), monospace",
        aaText: "Aa",
        colors: ["bg-[#fef08a]", "bg-[#ffffff]", "bg-[#000000]", "bg-[#000000]", "bg-[#000000]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#000000]",
        buttonText: "text-[#fef08a]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#000000]"
      },
      {
        id: "quirky-2",
        font: "text-[#2e1065]",
        fontFamily: "var(--font-syne), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#fdf4ff]", "bg-[#ffffff]", "bg-[#fbcfe8]", "bg-[#db2777]", "bg-[#2e1065]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#db2777]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#fbcfe8]"
      }
    ]
  },
  {
    name: "BOLD",
    variants: [
      {
        id: "bold-1",
        font: "text-black",
        fontFamily: "var(--font-anton), sans-serif",
        aaText: "AA",
        colors: ["bg-[#ffffff]", "bg-[#fff7ed]", "bg-[#ea580c]", "bg-[#ea580c]", "bg-[#000000]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#ea580c]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#fff7ed]",
        cardBorder: "border-[#ea580c]"
      },
      {
        id: "bold-2",
        font: "text-black",
        fontFamily: "var(--font-archivo), sans-serif",
        aaText: "AA",
        colors: ["bg-[#f4f4f5]", "bg-[#ffffff]", "bg-[#d4d4d8]", "bg-[#1d4ed8]", "bg-[#000000]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#1d4ed8]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#d4d4d8]"
      }
    ]
  },
  {
    name: "INNOVATIVE",
    variants: [
      {
        id: "innovative-1",
        font: "font-sans font-bold text-black",
        fontFamily: "var(--font-space), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#ffffff]", "bg-[#fef2f2]", "bg-[#fee2e2]", "bg-[#dc2626]", "bg-[#000000]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#dc2626]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#fef2f2]",
        cardBorder: "border-[#fee2e2]"
      },
      {
        id: "innovative-2",
        font: "font-sans font-black text-[#0f172a]",
        fontFamily: "var(--font-syne), sans-serif",
        aaText: "AA",
        colors: ["bg-[#f0fdfa]", "bg-[#ffffff]", "bg-[#ccfbf1]", "bg-[#0d9488]", "bg-[#0f172a]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#0d9488]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-[#ccfbf1]"
      }
    ]
  }
];

export default function ThemesPanel() {
  const router = useRouter();
  
  // Track currently selected theme
  const [activeTheme, setActiveTheme] = useState<string>("professional-1");

  useEffect(() => {
    const saved = localStorage.getItem("zolpa_design_theme");
    if (saved) {
      setActiveTheme(saved);
    }
  }, []);

  const handleThemeClick = (themeId: string) => {
    setActiveTheme(themeId);
    
    // Only postMessage to the iframe to preview (DO NOT use window.dispatchEvent to avoid changing CMS UI)
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
      iframes[i].contentWindow?.postMessage({ type: 'CMS_PREVIEW_THEME', theme: themeId }, '*');
    }
  };

  const handleSave = () => {
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
      iframes[i].contentWindow?.postMessage({ type: 'CMS_SAVE_THEME', theme: activeTheme }, '*');
    }
    // Update our own local state
    localStorage.setItem("zolpa_design_theme", activeTheme);
  };

  const handleBack = () => {
    const saved = localStorage.getItem("zolpa_design_theme") || "professional-1";
    if (activeTheme !== saved) {
      // Revert preview if navigating away without saving
      const iframes = document.getElementsByTagName('iframe');
      for (let i = 0; i < iframes.length; i++) {
        iframes[i].contentWindow?.postMessage({ type: 'CMS_REVERT_THEME' }, '*');
      }
    }
    router.push("/admin/cms/styles");
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9]">
      {/* Header */}
      <div className="p-4 pb-2 flex items-center justify-between sticky top-0 bg-[#f9f9f9] z-10 gap-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBack} 
            className="p-1 -ml-1 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Themes</h2>
        </div>
        <button 
          onClick={handleSave}
          className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Save
        </button>
      </div>

      <div className="p-4 space-y-8 overflow-y-auto flex-1 pb-20">
        {THEME_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-3">
            <p className="text-[10px] font-bold text-gray-500 tracking-widest">{category.name}</p>
            
            <div className="space-y-3">
              {category.variants.map((theme) => {
                const isActive = activeTheme === theme.id;
                
                return (
                  <div 
                    key={theme.id}
                    onClick={() => handleThemeClick(theme.id)}
                    className={`p-1 -mx-1 rounded-[6px] cursor-pointer transition-all ${isActive ? 'ring-1 ring-black bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`w-full ${theme.cardBg} border ${isActive && theme.cardBorder === 'border-transparent' ? 'border-black/10' : theme.cardBorder || 'border-transparent'} p-4 flex items-center justify-between rounded shadow-sm relative`}>
                      
                      {/* Typography preview */}
                      <div 
                        className={`${theme.font} text-4xl tracking-tighter select-none`}
                        style={{ fontFamily: theme.fontFamily }}
                      >
                        {theme.aaText}
                      </div>
                      
                      {/* Colors preview */}
                      <div className="flex -space-x-0 overflow-hidden rounded shadow-sm border border-black/10">
                        {theme.colors.map((color, i) => (
                          <div key={i} className={`w-4 h-10 ${color}`}></div>
                        ))}
                      </div>
                      
                      {/* Button preview */}
                      <div className={`${theme.buttonBg} ${theme.buttonText} ${theme.buttonShape} text-[7px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-sm`}>
                        Button
                      </div>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
