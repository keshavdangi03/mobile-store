"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const THEME_CATEGORIES = [
  {
    name: "PROFESSIONAL",
    variants: [
      {
        id: "professional-1",
        font: "font-sans",
        fontFamily: "var(--font-inter), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#ffffff]", "bg-[#f8fafc]", "bg-[#e2e8f0]", "bg-[#71717a]", "bg-[#000000]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-transparent border border-black",
        buttonText: "text-black",
        cardBg: "bg-[#f8f9fa]",
        cardBorder: "border-gray-300"
      },
      {
        id: "professional-2",
        font: "font-serif text-black",
        fontFamily: "var(--font-playfair), serif",
        aaText: "Aa",
        colors: ["bg-[#ffffff]", "bg-[#e5e3d9]", "bg-[#16a34a]", "bg-[#1f2937]", "bg-[#000000]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#16a34a]",
        buttonText: "text-white",
        cardBg: "bg-[#e5e3d9]",
        cardBorder: "border-transparent"
      }
    ]
  },
  {
    name: "PLAYFUL",
    variants: [
      {
        id: "playful-1",
        font: "text-[#4a152e] italic tracking-wider",
        fontFamily: "var(--font-chewy), cursive",
        aaText: "Aa",
        colors: ["bg-[#fdf8f5]", "bg-[#d0c4f5]", "bg-[#a78bfa]", "bg-[#9f1239]", "bg-[#4a152e]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#4a152e]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#d0c4f5]",
        cardBorder: "border-transparent"
      },
      {
        id: "playful-2",
        font: "font-serif font-bold text-[#134e4a]",
        fontFamily: "var(--font-playfair), serif",
        aaText: "Aa",
        colors: ["bg-[#fdf8f5]", "bg-[#eecb74]", "bg-[#67e8f9]", "bg-[#0284c7]", "bg-[#1f2937]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#1f2937]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#eecb74]",
        cardBorder: "border-transparent"
      }
    ]
  },
  {
    name: "SOPHISTICATED",
    variants: [
      {
        id: "sophisticated-1",
        font: "text-[#453123]",
        fontFamily: "var(--font-cormorant), serif",
        aaText: "Aa",
        colors: ["bg-[#ffffff]", "bg-[#e8decb]", "bg-[#b8a28e]", "bg-[#5c4c42]", "bg-[#292524]"],
        buttonShape: "rounded-sm",
        buttonBg: "bg-[#292524]",
        buttonText: "text-[#ffffff]",
        cardBg: "bg-[#e8decb]",
        cardBorder: "border-transparent"
      },
      {
        id: "sophisticated-2",
        font: "text-[#1e293b]",
        fontFamily: "var(--font-syne), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#ffffff]", "bg-[#ece4d6]", "bg-[#dca68d]", "bg-[#334155]", "bg-[#0f172a]"],
        buttonShape: "rounded-sm",
        buttonBg: "bg-[#dca68d]",
        buttonText: "text-white",
        cardBg: "bg-[#ece4d6]",
        cardBorder: "border-transparent"
      }
    ]
  },
  {
    name: "FRIENDLY",
    variants: [
      {
        id: "friendly-1",
        font: "font-sans font-black text-[#172554]",
        fontFamily: "var(--font-nunito), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#fef3c7]", "bg-[#76939e]", "bg-[#475569]", "bg-[#1e293b]", "bg-[#0f172a]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#76939e] border border-[#475569]",
        buttonText: "text-white",
        cardBg: "bg-[#76939e]",
        cardBorder: "border-transparent"
      },
      {
        id: "friendly-2",
        font: "text-[#14532d]",
        fontFamily: "var(--font-dm-serif), serif",
        aaText: "Aa",
        colors: ["bg-[#f8fafc]", "bg-[#e6e2d1]", "bg-[#bef264]", "bg-[#86efac]", "bg-[#14532d]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#14532d]",
        buttonText: "text-white",
        cardBg: "bg-[#e6e2d1]",
        cardBorder: "border-transparent"
      }
    ]
  },
  {
    name: "QUIRKY",
    variants: [
      {
        id: "quirky-1",
        font: "font-sans font-black text-[#064e3b]",
        fontFamily: "var(--font-space), monospace",
        aaText: "Aa",
        colors: ["bg-[#f8fafc]", "bg-[#eef37b]", "bg-[#bae6fd]", "bg-[#dc2626]", "bg-[#064e3b]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#064e3b]",
        buttonText: "text-white",
        cardBg: "bg-[#eef37b]",
        cardBorder: "border-transparent"
      },
      {
        id: "quirky-2",
        font: "text-black",
        fontFamily: "var(--font-syne), sans-serif",
        aaText: "Aa",
        colors: ["bg-[#ffffff]", "bg-[#fbbd42]", "bg-[#fbcfe8]", "bg-[#a855f7]", "bg-[#000000]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#000000]",
        buttonText: "text-white",
        cardBg: "bg-[#fbbd42]",
        cardBorder: "border-transparent"
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
        colors: ["bg-[#ffffff]", "bg-[#fdb57b]", "bg-[#f97316]", "bg-[#1f2937]", "bg-[#000000]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#f97316]",
        buttonText: "text-white",
        cardBg: "bg-[#fdb57b]",
        cardBorder: "border-transparent"
      },
      {
        id: "bold-2",
        font: "text-black",
        fontFamily: "var(--font-archivo), sans-serif",
        aaText: "AA",
        colors: ["bg-[#ffffff]", "bg-[#dfdfdf]", "bg-[#cbd5e1]", "bg-[#1d4ed8]", "bg-[#111827]"],
        buttonShape: "rounded-full",
        buttonBg: "bg-[#111827]",
        buttonText: "text-white",
        cardBg: "bg-[#dfdfdf]",
        cardBorder: "border-transparent"
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
        colors: ["bg-[#ffffff]", "bg-[#f4f4f5]", "bg-[#f05a28]", "bg-[#3f3f46]", "bg-[#000000]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-[#f05a28]",
        buttonText: "text-white",
        cardBg: "bg-[#f4f4f5]",
        cardBorder: "border-transparent"
      },
      {
        id: "innovative-2",
        font: "font-sans font-black text-black",
        fontFamily: "var(--font-syne), sans-serif",
        aaText: "AA",
        colors: ["bg-[#ffffff]", "bg-[#f8fafc]", "bg-[#e2e8f0]", "bg-[#334155]", "bg-[#000000]"],
        buttonShape: "rounded-none",
        buttonBg: "bg-transparent border border-black",
        buttonText: "text-black",
        cardBg: "bg-[#ffffff]",
        cardBorder: "border-card-border"
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
    // Broadcast message to iframe to preview theme instantly
    window.dispatchEvent(new CustomEvent('cms-theme-change', { detail: { theme: themeId } }));
    
    // Also postMessage to the iframe
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
