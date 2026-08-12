"use client";

import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const FONT_PACKS = [
  { bg: 'bg-[#d2cfd1]', hFont: 'var(--font-playfair)', italic: true, pFont: 'var(--font-inter)' },
  { bg: 'bg-[#f5f5f5]', hFont: 'var(--font-inter)', fontWeight: 'font-bold', pFont: 'var(--font-inter)' },
  { bg: 'bg-[#f5f5f5]', hFont: 'var(--font-cormorant)', fontWeight: 'font-bold', pFont: 'var(--font-inter)' },
  { bg: 'bg-[#f5f5f5]', hFont: 'var(--font-dm-serif)', pFont: 'var(--font-inter)' },
  { bg: 'bg-[#f5f5f5]', hFont: 'var(--font-archivo)', pFont: 'var(--font-inter)' },
  { bg: 'bg-[#f5f5f5]', hFont: 'var(--font-cormorant)', pFont: 'var(--font-inter)' },
  { bg: 'bg-[#f5f5f5]', hFont: 'var(--font-playfair)', italic: true, pFont: 'var(--font-inter)' },
  { bg: 'bg-[#f5f5f5]', hFont: 'var(--font-chewy)', pFont: 'var(--font-inter)' },
];

const COLOR_PACKS = [
  { bg: 'bg-[#d2cfd1]', colors: ['#fdf8f5', '#d0c4f5', '#a78bfa', '#9f1239', '#4a152e'] },
  { bg: 'bg-[#f5f5f5]', colors: ['#f8fafc', '#bae6fd', '#38bdf8', '#0284c7', '#0f172a'] },
  { bg: 'bg-[#f5f5f5]', colors: ['#ffffff', '#fef08a', '#fde047', '#a16207', '#000000'] },
  { bg: 'bg-[#f5f5f5]', colors: ['#f8f9fa', '#fcd34d', '#f97316', '#3b82f6', '#1f2937'] },
  { bg: 'bg-[#f5f5f5]', colors: ['#ffffff', '#fdf4ff', '#f0abfc', '#818cf8', '#1e1e24'] },
  { bg: 'bg-[#f5f5f5]', colors: ['#ffffff', '#f0fdf4', '#22c55e', '#14532d', '#000000'] },
  { bg: 'bg-[#f5f5f5]', colors: ['#f8f9fa', '#fde68a', '#5eead4', '#2563eb', '#1e293b'] },
  { bg: 'bg-[#f5f5f5]', colors: ['#ffffff', '#f3f4f6', '#d1d5db', '#6b7280', '#000000'] },
];

const BUTTON_PACKS = [
  { bg: 'bg-[#d2cfd1]', shape: 'rounded-full', style: 'solid', radius: '9999px' },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-full', style: 'outline', radius: '9999px' },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-full', style: 'solid', radius: '9999px' },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-none', style: 'solid', radius: '0px' },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-full', style: 'outline', radius: '9999px' },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-lg', style: 'solid', radius: '8px' },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-xl', style: 'solid', radius: '12px' },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-none', style: 'text', radius: '0px' },
];

const FORM_PACKS = [
  { bg: 'bg-[#a78bfa]', style: 'solid-pill', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '9999px' },
  { bg: 'bg-[#d0c4f5]', style: 'solid-pill-button', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '9999px' },
  { bg: 'bg-[#d0c4f5]', style: 'outline-square', formBg: 'bg-white', border: 'border-[#4a152e]', radius: '0px' },
  { bg: 'bg-[#d0c4f5]', style: 'outline-pill', formBg: 'bg-white', border: 'border-[#4a152e]', radius: '9999px' },
  { bg: 'bg-[#d0c4f5]', style: 'underline', formBg: 'bg-[#fdf8f5]', border: 'border-b border-[#4a152e]', radius: '0px' },
  { bg: 'bg-[#d0c4f5]', style: 'solid-square', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '4px' },
];

export default function SiteStylesPanel() {
  const router = useRouter();
  const [activePopover, setActivePopover] = useState<'fonts' | 'colors' | 'buttons' | 'forms' | null>(null);

  const togglePopover = (popover: 'fonts' | 'colors' | 'buttons' | 'forms') => {
    setActivePopover(activePopover === popover ? null : popover);
  };

  const handleOverride = (overrides: Record<string, string>) => {
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
      iframes[i].contentWindow?.postMessage({ type: 'CMS_STYLE_OVERRIDE', overrides }, '*');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Font Packs Popover (floats over canvas) */}
      {activePopover === 'fonts' && (
        <div className="fixed right-[320px] top-[180px] mr-4 w-[340px] bg-white rounded-lg shadow-2xl border border-card-border p-6 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Recommended Font Packs</h3>
          <div className="grid grid-cols-2 gap-3">
            {FONT_PACKS.map((pack, i) => (
              <div 
                key={i} 
                onClick={() => handleOverride({
                  '--font-sans-theme': pack.hFont,
                  '--font-serif-theme': pack.pFont
                })}
                className={`${pack.bg} rounded border ${i === 0 ? 'border-gray-900' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-colors flex flex-col justify-center min-h-[80px]`}
              >
                <p 
                  className={`text-[#4a152e] text-2xl leading-none ${pack.fontWeight || ''} ${pack.italic ? 'italic' : ''}`}
                  style={{ fontFamily: pack.hFont }}
                >
                  Heading
                </p>
                <p 
                  className="text-[#5b2b41] text-[9px] mt-1 tracking-tight"
                  style={{ fontFamily: pack.pFont }}
                >
                  This is your paragraph.
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-3 border border-gray-300 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors">
            Customize
          </button>
        </div>
      )}

      {/* Color Packs Popover */}
      {activePopover === 'colors' && (
        <div className="fixed right-[320px] top-[260px] mr-4 w-[340px] bg-white rounded-lg shadow-2xl border border-card-border p-6 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Recommended Color Palettes</h3>
          <div className="grid grid-cols-2 gap-3">
            {COLOR_PACKS.map((pack, i) => (
              <div 
                key={i} 
                onClick={() => handleOverride({
                  '--background': pack.colors[0],
                  '--card-bg': pack.colors[1],
                  '--primary-hover': pack.colors[2],
                  '--primary': pack.colors[3],
                  '--foreground': pack.colors[4],
                })}
                className={`${pack.bg} rounded border ${i === 0 ? 'border-gray-900' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center min-h-[80px]`}
              >
                <div className="flex w-full h-8 rounded border border-black/10 overflow-hidden">
                  {pack.colors.map((c, j) => (
                    <div key={j} className="flex-1" style={{ backgroundColor: c }}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-3 border border-gray-300 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors">
            Customize
          </button>
        </div>
      )}

      {/* Button Packs Popover */}
      {activePopover === 'buttons' && (
        <div className="fixed right-[320px] top-[340px] mr-4 w-[340px] bg-white rounded-lg shadow-2xl border border-card-border p-6 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Recommended Button Packs</h3>
          <div className="grid grid-cols-2 gap-3">
            {BUTTON_PACKS.map((pack, i) => (
              <div 
                key={i} 
                onClick={() => handleOverride({
                  '--radius-theme': pack.radius,
                })}
                className={`${pack.bg} rounded border ${i === 0 ? 'border-gray-900' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center min-h-[80px]`}
              >
                <div 
                  className={`px-5 py-2 text-xs font-bold ${pack.shape} ${pack.style === 'solid' ? 'bg-[#4a152e] text-white' : pack.style === 'outline' ? 'border border-[#4a152e] text-[#4a152e]' : 'text-[#4a152e]'}`}
                >
                  Button
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-3 border border-gray-300 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors">
            Customize
          </button>
        </div>
      )}

      {/* Form Packs Popover */}
      {activePopover === 'forms' && (
        <div className="fixed right-[320px] top-[420px] mr-4 w-[340px] bg-white rounded-lg shadow-2xl border border-card-border p-6 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Recommended Form Packs</h3>
          <div className="grid grid-cols-2 gap-3">
            {FORM_PACKS.map((pack, i) => (
              <div 
                key={i} 
                onClick={() => handleOverride({
                  '--radius-theme': pack.radius,
                })}
                className={`${pack.bg} rounded border ${i === 0 ? 'border-gray-900' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center min-h-[80px]`}
              >
                <div className="flex items-center gap-1 w-full">
                  <div className={`flex-1 ${pack.formBg} ${pack.border} ${pack.style.includes('square') ? 'rounded-none' : pack.style.includes('pill') ? 'rounded-full' : 'rounded'} px-2 py-1.5 text-[8px] text-[#4a152e]`}>
                    Text
                  </div>
                  {pack.style.includes('button') || pack.style.includes('Option') ? (
                    <div className={`bg-[#4a152e] text-white text-[7px] font-bold px-2 py-1.5 ${pack.style.includes('square') ? 'rounded-none' : 'rounded-full'}`}>
                      Option
                    </div>
                  ) : (
                    <div className={`bg-white border border-[#4a152e] text-[#4a152e] w-5 h-5 flex items-center justify-center rounded-full text-[8px]`}>
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-3 border border-gray-300 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors">
            Customize
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-4 pb-2 flex justify-between items-center sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Site Styles</h2>
        <div className="relative group flex items-center justify-center">
          <button 
            onClick={() => router.push("/admin/cms")} 
            className="w-7 h-7 bg-white border border-gray-900 rounded-[4px] flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-900" strokeWidth={2.5} />
          </button>
          <div className="absolute top-full mt-2 right-0 bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            Close
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-white">
        
        {/* Themes */}
        <div 
          onClick={() => router.push("/admin/cms/styles/themes")}
          className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 transition-colors group"
        >
          <p className="text-[10px] uppercase text-gray-500 font-medium tracking-wide mb-2 group-hover:text-black transition-colors">Themes</p>
          <div className="border border-card-border rounded-md p-3 flex items-center justify-between group-hover:border-gray-400 transition-colors">
            <span className="text-3xl tracking-tighter font-serif text-black">Aa</span>
            <div className="flex -space-x-1">
              <div className="w-4 h-8 bg-white border border-card-border"></div>
              <div className="w-4 h-8 bg-gray-50 border border-card-border"></div>
              <div className="w-4 h-8 bg-gray-200 border border-card-border"></div>
              <div className="w-4 h-8 bg-gray-900 border border-gray-900"></div>
              <div className="w-4 h-8 bg-black border border-black"></div>
            </div>
            <div className="bg-black text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
              Button
            </div>
          </div>
        </div>

        {/* Fonts Row */}
        <div className="flex gap-2">
          <div 
            onClick={() => togglePopover('fonts')}
            className={`flex-1 ${activePopover === 'fonts' ? 'bg-[#d2cfd1] border-gray-400 shadow-md' : 'bg-[#f5f5f5] border-transparent'} rounded border p-3 cursor-pointer hover:border-gray-400 transition-colors flex flex-col justify-center min-h-[90px]`}
          >
            <p className="text-[10px] text-gray-600 mb-1">Fonts</p>
            <p className="text-[#4a152e] text-2xl font-bold italic leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
              Heading
            </p>
            <p className="text-[#5b2b41] text-[9px] mt-1 tracking-tight">
              This is your paragraph.
            </p>
          </div>
          <button 
            onClick={() => togglePopover('fonts')}
            className={`w-[45px] ${activePopover === 'fonts' ? 'bg-[#eaeaea]' : 'bg-[#f5f5f5]'} hover:bg-[#eaeaea] transition-colors rounded flex items-center justify-center border border-gray-100`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Colors Row */}
        <div className="flex gap-2">
          <div 
            onClick={() => togglePopover('colors')}
            className={`flex-1 ${activePopover === 'colors' ? 'bg-[#d2cfd1] border-gray-400 shadow-md' : 'bg-[#f5f5f5] border-transparent'} rounded border p-3 cursor-pointer hover:border-gray-400 transition-colors min-h-[90px] flex flex-col justify-center`}
          >
            <p className="text-[10px] text-gray-500 mb-2">Colors</p>
            <div className="flex rounded overflow-hidden h-9 shadow-sm border border-black/5">
              <div className="flex-1 bg-[#fdf8f5]"></div>
              <div className="flex-1 bg-[#d0c4f5]"></div>
              <div className="flex-1 bg-[#a78bfa]"></div>
              <div className="flex-1 bg-[#9f1239]"></div>
              <div className="flex-1 bg-[#4a152e]"></div>
            </div>
          </div>
          <button 
            onClick={() => togglePopover('colors')}
            className={`w-[45px] ${activePopover === 'colors' ? 'bg-[#eaeaea]' : 'bg-[#f5f5f5]'} hover:bg-[#eaeaea] transition-colors rounded flex items-center justify-center border border-gray-100`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-2">
          <div 
            onClick={() => togglePopover('buttons')}
            className={`flex-1 ${activePopover === 'buttons' ? 'bg-[#d2cfd1] border-gray-400 shadow-md' : 'bg-[#f5f5f5] border-transparent'} rounded border p-3 cursor-pointer hover:border-gray-400 transition-colors min-h-[90px] flex flex-col justify-center items-center relative`}
          >
            <p className="text-[10px] text-gray-500 absolute top-3 left-3">Buttons</p>
            <div className="bg-[#4a152e] text-white text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-widest inline-block mt-4">
              Button
            </div>
          </div>
          <button 
            onClick={() => togglePopover('buttons')}
            className={`w-[45px] ${activePopover === 'buttons' ? 'bg-[#eaeaea]' : 'bg-[#f5f5f5]'} hover:bg-[#eaeaea] transition-colors rounded flex items-center justify-center border border-gray-100`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Forms Row */}
        <div className="flex gap-2">
          <div 
            onClick={() => togglePopover('forms')}
            className={`flex-1 ${activePopover === 'forms' ? 'bg-[#d2cfd1] border-gray-400 shadow-md' : 'bg-[#f5f5f5] border-transparent'} rounded border p-3 cursor-pointer hover:border-gray-400 transition-colors min-h-[90px] flex flex-col justify-center relative`}
          >
            <p className="text-[10px] text-gray-500 absolute top-3 left-3">Forms</p>
            <div className="flex items-center gap-2 mt-4 px-2">
              <div className="border border-[#b8adff] rounded-full px-4 py-2 flex-1 bg-[#e1d8fa] text-[10px] text-[#4a152e]">Text</div>
              <div className="bg-[#e1d8fa] border border-[#b8adff] text-[#4a152e] w-8 h-8 rounded-full flex items-center justify-center">✓</div>
            </div>
          </div>
          <button 
            onClick={() => togglePopover('forms')}
            className={`w-[45px] ${activePopover === 'forms' ? 'bg-[#eaeaea]' : 'bg-[#f5f5f5]'} hover:bg-[#eaeaea] transition-colors rounded flex items-center justify-center border border-gray-100`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Miscellaneous */}
        <div className="pt-4 pb-2 flex justify-between items-center cursor-pointer hover:text-gray-900 text-gray-700 transition-colors">
          <span className="text-[14px] font-medium text-gray-800">Miscellaneous</span>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

      </div>
    </div>
  );
}
