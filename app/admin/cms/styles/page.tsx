"use client";

import React, { useState } from "react";
import { X, ChevronRight, ChevronDown, Check } from "lucide-react";
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
  { bg: 'bg-[#d2cfd1]', shape: 'rounded-full', style: 'solid', radius: '9999px', cssProps: { '--btn-bg': 'var(--primary)', '--btn-text': 'var(--background)', '--btn-border': 'transparent', '--btn-radius': '9999px', '--btn-shadow': 'none' } },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-full', style: 'outline', radius: '9999px', cssProps: { '--btn-bg': 'transparent', '--btn-text': 'var(--primary)', '--btn-border': 'var(--primary)', '--btn-radius': '9999px', '--btn-shadow': 'none' } },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-md', style: 'solid', radius: '6px', cssProps: { '--btn-bg': 'var(--primary)', '--btn-text': 'var(--background)', '--btn-border': 'transparent', '--btn-radius': '6px', '--btn-shadow': 'none' } },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-md', style: 'outline', radius: '6px', cssProps: { '--btn-bg': 'transparent', '--btn-text': 'var(--primary)', '--btn-border': 'var(--primary)', '--btn-radius': '6px', '--btn-shadow': 'none' } },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-none', style: 'solid', radius: '0px', cssProps: { '--btn-bg': 'var(--primary)', '--btn-text': 'var(--background)', '--btn-border': 'transparent', '--btn-radius': '0px', '--btn-shadow': 'none' } },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-none', style: 'outline', radius: '0px', cssProps: { '--btn-bg': 'transparent', '--btn-text': 'var(--primary)', '--btn-border': 'var(--primary)', '--btn-radius': '0px', '--btn-shadow': 'none' } },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-[100px]', style: 'solid', radius: '100px', cssProps: { '--btn-bg': 'var(--primary)', '--btn-text': 'var(--background)', '--btn-border': 'transparent', '--btn-radius': '100px', '--btn-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1)' } },
  { bg: 'bg-[#f5f5f5]', shape: 'rounded-none', style: 'text', radius: '0px', cssProps: { '--btn-bg': 'transparent', '--btn-text': 'var(--primary)', '--btn-border': 'transparent', '--btn-radius': '0px', '--btn-shadow': 'none', '--btn-border-b': '2px solid var(--primary)' } },
];

const FORM_PACKS = [
  { bg: 'bg-[#d2cfd1]', style: 'solid-fill', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '0px', btnRadius: '0px', cssProps: { '--form-bg': 'var(--card-bg)', '--form-border': 'transparent', '--form-radius': '0px', '--form-btn-radius': '0px', '--form-border-b': '1px solid var(--primary)' } },
  { bg: 'bg-[#f5f5f5]', style: 'outline', formBg: 'bg-white', border: 'border-[#4a152e]', radius: '0px', btnRadius: '9999px', cssProps: { '--form-bg': 'transparent', '--form-border': 'var(--primary)', '--form-radius': '0px', '--form-btn-radius': '9999px', '--form-border-b': 'none' } },
  { bg: 'bg-[#f5f5f5]', style: 'outline-pill', formBg: 'bg-white', border: 'border-[#4a152e]', radius: '9999px', btnRadius: '9999px', cssProps: { '--form-bg': 'transparent', '--form-border': 'var(--primary)', '--form-radius': '9999px', '--form-btn-radius': '9999px', '--form-border-b': 'none' } },
  { bg: 'bg-[#f5f5f5]', style: 'underline', formBg: 'bg-[#fdf8f5]', border: 'border-b border-[#4a152e]', radius: '0px', btnRadius: '4px', cssProps: { '--form-bg': 'transparent', '--form-border': 'transparent', '--form-radius': '0px', '--form-btn-radius': '4px', '--form-border-b': '2px solid var(--primary)' } },
  { bg: 'bg-[#f5f5f5]', style: 'solid-pill', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '9999px', btnRadius: '9999px', cssProps: { '--form-bg': 'var(--card-bg)', '--form-border': 'transparent', '--form-radius': '9999px', '--form-btn-radius': '9999px', '--form-border-b': 'none' } },
  { bg: 'bg-[#f5f5f5]', style: 'solid-square', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '4px', btnRadius: '4px', cssProps: { '--form-bg': 'var(--card-bg)', '--form-border': 'transparent', '--form-radius': '4px', '--form-btn-radius': '4px', '--form-border-b': 'none' } },
];

export default function SiteStylesPanel() {
  const router = useRouter();

  const [activePopover, setActivePopover] = useState<'fonts' | 'colors' | 'buttons' | 'forms' | null>(null);
  const [fontsView, setFontsView] = useState<'packs' | 'customize' | 'headings' | 'paragraphs' | 'buttons-font' | 'misc'>('packs');
  const [colorsView, setColorsView] = useState<'packs' | 'customize' | 'edit_palette'>('packs');

  // Font customize state
  const [baseSize, setBaseSize] = useState(16);
  const [headingFont, setHeadingFont] = useState('Playfair Display');
  const [headingSize, setHeadingSize] = useState(42);
  const [headingWeight, setHeadingWeight] = useState('700');
  const [headingStyle, setHeadingStyle] = useState('normal');
  const [headingLetterSpacing, setHeadingLetterSpacing] = useState(0);
  const [headingLineHeight, setHeadingLineHeight] = useState(1.2);
  const [paragraphFont, setParagraphFont] = useState('Inter');
  const [paragraphSize, setParagraphSize] = useState(15);
  const [paragraphWeight, setParagraphWeight] = useState('400');
  const [paragraphLetterSpacing, setParagraphLetterSpacing] = useState(0);
  const [paragraphLineHeight, setParagraphLineHeight] = useState(1.6);
  
  // Color customize state
  const [activePalette, setActivePalette] = useState<string[]>(COLOR_PACKS[0].colors);
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);

  const GOOGLE_FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Merriweather', 'Raleway', 'Oswald', 'Nunito', 'Poppins', 'Source Serif 4', 'DM Serif Display', 'Cormorant Garamond', 'Archivo', 'Chewy'];

  const togglePopover = (popover: 'fonts' | 'colors' | 'buttons' | 'forms') => {
    setActivePopover(activePopover === popover ? null : popover);
    setFontsView('packs');
    setColorsView('packs');
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
        <div className="fixed right-[320px] top-[180px] mr-4 w-[340px] bg-white rounded-lg shadow-2xl border border-card-border z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200" style={{ maxHeight: '70vh' }}>

          {/* ─── PACKS VIEW ─── */}
          {fontsView === 'packs' && (
            <div className="flex flex-col" style={{ maxHeight: '70vh' }}>
              <div className="p-6 pb-0">
                <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Recommended Font Packs</h3>
              </div>
              <div className="overflow-y-auto flex-1 p-6 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {FONT_PACKS.map((pack, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleOverride({ '--font-sans-theme': pack.hFont, '--font-serif-theme': pack.pFont })}
                      className={`${pack.bg} rounded border ${i === 0 ? 'border-gray-900' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-colors flex flex-col justify-center min-h-[80px]`}
                    >
                      <p className={`text-[#4a152e] text-2xl leading-none ${pack.fontWeight || ''} ${pack.italic ? 'italic' : ''}`} style={{ fontFamily: pack.hFont }}>Heading</p>
                      <p className="text-[#5b2b41] text-[9px] mt-1 tracking-tight" style={{ fontFamily: pack.pFont }}>This is your paragraph.</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => setFontsView('customize')}
                  className="w-full py-3 border border-gray-300 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
                >
                  Customize
                </button>
              </div>
            </div>
          )}

          {/* ─── CUSTOMIZE VIEW ─── */}
          {fontsView === 'customize' && (
            <div className="flex flex-col" style={{ maxHeight: '70vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                <button onClick={() => setFontsView('packs')} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-semibold flex-1 text-center pr-6">Fonts</span>
                <button onClick={() => setActivePopover(null)} className="p-1 hover:bg-gray-100 rounded ml-auto"><X className="w-4 h-4" /></button>
              </div>
              <div className="overflow-y-auto flex-1">
                {/* Preview */}
                <div className="mx-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-3xl text-gray-900" style={{ fontFamily: headingFont, fontWeight: headingWeight, fontStyle: headingStyle, letterSpacing: `${headingLetterSpacing}em`, lineHeight: headingLineHeight }}>Heading</p>
                  <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: paragraphFont, fontWeight: paragraphWeight, lineHeight: paragraphLineHeight, letterSpacing: `${paragraphLetterSpacing}em` }}>This is your paragraph.</p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">{headingFont} · {paragraphFont}</p>
                </div>

                {/* Settings list */}
                <div className="mt-2">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => {}}>
                    <span className="text-sm text-gray-800">All Font Packs</span>
                    <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-800">Base Size</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{baseSize} px</span>
                      <button onClick={() => setBaseSize(s => Math.max(10, s - 1))} className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm">–</button>
                      <button onClick={() => setBaseSize(s => Math.min(24, s + 1))} className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm">+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setFontsView('headings')}>
                    <span className="text-sm text-gray-800">Headings</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{headingFont}</span>
                      <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setFontsView('paragraphs')}>
                    <span className="text-sm text-gray-800">Paragraphs</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{paragraphFont}</span>
                      <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <span className="text-sm text-gray-800">Buttons</span>
                    <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <span className="text-sm text-[#4a152e]">Miscellaneous</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{paragraphFont}</span>
                      <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <span className="text-sm text-gray-800">Assign Styles</span>
                    <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button onClick={() => { setHeadingFont('Playfair Display'); setBaseSize(16); setParagraphFont('Inter'); }} className="w-full py-2 text-xs font-bold tracking-widest uppercase text-gray-600 hover:text-black transition-colors">RESET FONT PACK</button>
              </div>
            </div>
          )}

          {/* ─── HEADINGS DETAIL VIEW ─── */}
          {fontsView === 'headings' && (
            <div className="flex flex-col" style={{ maxHeight: '70vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                <button onClick={() => setFontsView('customize')} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-semibold flex-1 text-center pr-6">Headings</span>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-5">
                {/* Live preview */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                  <p style={{ fontFamily: headingFont, fontWeight: headingWeight, fontStyle: headingStyle, fontSize: `${Math.min(headingSize, 40)}px`, letterSpacing: `${headingLetterSpacing}em`, lineHeight: headingLineHeight }} className="text-gray-900">Heading</p>
                </div>

                {/* Font picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Font</label>
                  <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {GOOGLE_FONTS.map(font => (
                      <button key={font} onClick={() => { setHeadingFont(font); handleOverride({ '--heading-font': font }); }}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between text-sm transition-colors ${headingFont === font ? 'text-[#4a152e] font-semibold' : 'text-gray-700'}`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                        {headingFont === font && <Check className="w-3.5 h-3.5 text-[#4a152e]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Size</label>
                    <span className="text-xs text-gray-500">{headingSize}px</span>
                  </div>
                  <input type="range" min="20" max="80" value={headingSize} onChange={e => setHeadingSize(parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Weight</label>
                  <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                    {[['300','Light'],['400','Regular'],['600','Semi'],['700','Bold'],['900','Black']].map(([val, label]) => (
                      <button key={val} onClick={() => setHeadingWeight(val)}
                        className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all ${headingWeight === val ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                      >{label}</button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Style</label>
                  <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                    {[['normal','Normal'],['italic','Italic']].map(([val, label]) => (
                      <button key={val} onClick={() => setHeadingStyle(val)}
                        className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all ${headingStyle === val ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                      >{label}</button>
                    ))}
                  </div>
                </div>

                {/* Letter Spacing */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Letter Spacing</label>
                    <span className="text-xs text-gray-500">{headingLetterSpacing}em</span>
                  </div>
                  <input type="range" min="-0.1" max="0.3" step="0.01" value={headingLetterSpacing} onChange={e => setHeadingLetterSpacing(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                </div>

                {/* Line Height */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Line Height</label>
                    <span className="text-xs text-gray-500">{headingLineHeight}</span>
                  </div>
                  <input type="range" min="0.9" max="2.0" step="0.05" value={headingLineHeight} onChange={e => setHeadingLineHeight(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                </div>
              </div>
            </div>
          )}

          {/* ─── PARAGRAPHS DETAIL VIEW ─── */}
          {fontsView === 'paragraphs' && (
            <div className="flex flex-col" style={{ maxHeight: '70vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                <button onClick={() => setFontsView('customize')} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-semibold flex-1 text-center pr-6">Paragraphs</span>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-5">
                {/* Live preview */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p style={{ fontFamily: paragraphFont, fontWeight: paragraphWeight, fontSize: `${paragraphSize}px`, lineHeight: paragraphLineHeight, letterSpacing: `${paragraphLetterSpacing}em` }} className="text-gray-700">This is your paragraph. It shows how your body text will look across the website.</p>
                </div>

                {/* Font picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Font</label>
                  <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {GOOGLE_FONTS.map(font => (
                      <button key={font} onClick={() => setParagraphFont(font)}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between text-sm transition-colors ${paragraphFont === font ? 'text-[#4a152e] font-semibold' : 'text-gray-700'}`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                        {paragraphFont === font && <Check className="w-3.5 h-3.5 text-[#4a152e]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Size</label>
                    <span className="text-xs text-gray-500">{paragraphSize}px</span>
                  </div>
                  <input type="range" min="10" max="24" value={paragraphSize} onChange={e => setParagraphSize(parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Weight</label>
                  <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                    {[['300','Light'],['400','Regular'],['500','Medium'],['600','Semi'],['700','Bold']].map(([val, label]) => (
                      <button key={val} onClick={() => setParagraphWeight(val)}
                        className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all ${paragraphWeight === val ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                      >{label}</button>
                    ))}
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Line Height</label>
                    <span className="text-xs text-gray-500">{paragraphLineHeight}</span>
                  </div>
                  <input type="range" min="1.0" max="2.5" step="0.05" value={paragraphLineHeight} onChange={e => setParagraphLineHeight(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                </div>

                {/* Letter Spacing */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Letter Spacing</label>
                    <span className="text-xs text-gray-500">{paragraphLetterSpacing}em</span>
                  </div>
                  <input type="range" min="-0.05" max="0.2" step="0.01" value={paragraphLetterSpacing} onChange={e => setParagraphLetterSpacing(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Color Packs Popover */}
      {activePopover === 'colors' && (
        <div className="fixed right-[320px] top-[260px] mr-4 w-[340px] bg-white rounded-lg shadow-2xl border border-card-border z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200" style={{ maxHeight: '70vh' }}>
          
          {/* ─── PACKS VIEW ─── */}
          {colorsView === 'packs' && (
            <div className="flex flex-col" style={{ maxHeight: '70vh' }}>
              <div className="p-6 pb-0">
                <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Recommended Color Palettes</h3>
              </div>
              <div className="overflow-y-auto flex-1 p-6 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {COLOR_PACKS.map((pack, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setActivePalette(pack.colors);
                        handleOverride({
                          '--background': pack.colors[0],
                          '--card-bg': pack.colors[1],
                          '--primary-hover': pack.colors[2],
                          '--primary': pack.colors[3],
                          '--foreground': pack.colors[4],
                        });
                      }}
                      className={`rounded border ${activePalette.join('') === pack.colors.join('') ? 'border-gray-900' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center min-h-[80px] bg-gray-50`}
                    >
                      <div className="flex w-full h-8 rounded border border-black/10 overflow-hidden">
                        {pack.colors.map((c, j) => (
                          <div key={j} className="flex-1" style={{ backgroundColor: c }}></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => setColorsView('customize')}
                  className="w-full py-3 border border-gray-300 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
                >
                  Customize
                </button>
              </div>
            </div>
          )}

          {/* ─── CUSTOMIZE (THEMES) VIEW ─── */}
          {colorsView === 'customize' && (
            <div className="flex flex-col" style={{ maxHeight: '70vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                <button onClick={() => setColorsView('packs')} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-semibold flex-1 text-center pr-6">Colors</span>
                <button onClick={() => setActivePopover(null)} className="p-1 hover:bg-gray-100 rounded ml-auto"><X className="w-4 h-4" /></button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-6">
                
                {/* Active Palette */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex rounded h-16 w-full border border-black/10 overflow-hidden">
                    {activePalette.map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }}></div>
                    ))}
                  </div>
                </div>

                <div 
                  className="flex items-center justify-between px-2 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setColorsView('edit_palette')}
                >
                  <span className="text-sm text-gray-800 font-medium">Edit Palette</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    Section color themes
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[9px] font-bold">i</span>
                  </h4>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-4">Color Themes On This Page</p>
                    
                    {[
                      { bg: activePalette[0], text: activePalette[4], label: 'LIGHT 1', border: true },
                      { bg: activePalette[1], text: activePalette[4], label: 'LIGHT 2', border: true },
                      { bg: activePalette[2], text: activePalette[4], label: 'BRIGHT 2', border: false },
                    ].map((theme, i) => (
                      <div key={i} className={`flex items-center gap-4 px-6 py-3 rounded ${theme.border ? 'border border-gray-200' : ''} cursor-pointer hover:opacity-90 transition-opacity`} style={{ backgroundColor: theme.bg }}>
                        <span className="text-xl font-serif tracking-tighter" style={{ color: theme.text }}>Aa</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase flex-1 text-center" style={{ color: theme.text }}>{theme.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-6">Other Color Themes</p>
                    {[
                      { bg: activePalette[0], text: activePalette[4], label: 'LIGHTEST 1', border: true },
                      { bg: activePalette[1], text: activePalette[4], label: 'LIGHTEST 2', border: true },
                      { bg: activePalette[4], text: activePalette[0], label: 'BRIGHT 1', border: false },
                      { bg: activePalette[4], text: activePalette[0], label: 'DARK 1', border: false },
                      { bg: activePalette[4], text: activePalette[0], label: 'DARK 2', border: false },
                    ].map((theme, i) => (
                      <div key={i} className={`flex items-center gap-4 px-6 py-3 rounded ${theme.border ? 'border border-gray-200' : ''} cursor-pointer hover:opacity-90 transition-opacity`} style={{ backgroundColor: theme.bg }}>
                        <span className="text-xl font-serif tracking-tighter" style={{ color: theme.text }}>Aa</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase flex-1 text-center" style={{ color: theme.text }}>{theme.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ─── EDIT PALETTE VIEW ─── */}
          {colorsView === 'edit_palette' && (
            <div className="flex flex-col" style={{ maxHeight: '70vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                <button onClick={() => { setColorsView('customize'); setEditingColorIndex(null); }} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-semibold flex-1 text-center pr-6">Edit Palette</span>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-6">
                
                {/* 5 Color Squares */}
                <div className="flex justify-between px-2">
                  {activePalette.map((c, i) => (
                    <div 
                      key={i} 
                      onClick={() => setEditingColorIndex(i)}
                      className={`w-10 h-10 rounded-md cursor-pointer transition-all ${editingColorIndex === i ? 'ring-2 ring-offset-2 ring-black' : 'border border-gray-200'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                {/* Color Editor */}
                {editingColorIndex !== null && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm font-semibold text-gray-800">Color {editingColorIndex + 1}</span>
                    </div>
                    
                    <div className="relative">
                      {/* Native Color Picker that behaves like custom ones */}
                      <input 
                        type="color" 
                        value={activePalette[editingColorIndex]} 
                        onChange={(e) => {
                          const newPalette = [...activePalette];
                          newPalette[editingColorIndex] = e.target.value;
                          setActivePalette(newPalette);
                          handleOverride({
                            '--background': newPalette[0],
                            '--card-bg': newPalette[1],
                            '--primary-hover': newPalette[2],
                            '--primary': newPalette[3],
                            '--foreground': newPalette[4],
                          });
                        }}
                        className="w-full h-32 rounded-lg cursor-pointer opacity-0 absolute inset-0 z-10" 
                      />
                      <div 
                        className="w-full h-32 rounded-lg shadow-inner pointer-events-none"
                        style={{ backgroundColor: activePalette[editingColorIndex] }}
                      ></div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="bg-gray-100 rounded p-2 flex-1 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-bold">HEX</span>
                        <span className="text-sm font-mono text-gray-900">{activePalette[editingColorIndex].toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex gap-4 border-b border-gray-100 text-xs font-bold text-gray-500">
                    <span className="pb-2 border-b-2 border-black text-black">Presets</span>
                    <span className="pb-2 hover:text-gray-900 cursor-pointer">From Image</span>
                    <span className="pb-2 hover:text-gray-900 cursor-pointer">From Color</span>
                  </div>
                  
                  <div className="space-y-3">
                    {COLOR_PACKS.map((pack, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setActivePalette(pack.colors);
                          handleOverride({
                            '--background': pack.colors[0],
                            '--card-bg': pack.colors[1],
                            '--primary-hover': pack.colors[2],
                            '--primary': pack.colors[3],
                            '--foreground': pack.colors[4],
                          });
                        }}
                        className="flex h-6 rounded overflow-hidden border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {pack.colors.map((c, j) => (
                          <div key={j} className="flex-1" style={{ backgroundColor: c }}></div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

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
                onClick={() => handleOverride(pack.cssProps)}
                className={`${pack.bg} rounded border ${i === 0 ? 'border-gray-900' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center min-h-[80px]`}
              >
                <div 
                  className={`px-5 py-2 text-[10px] tracking-widest uppercase font-bold flex items-center justify-center ${pack.shape} ${pack.style === 'solid' ? 'bg-[#4a152e] text-white' : pack.style === 'outline' ? 'border border-[#4a152e] text-[#4a152e]' : 'text-[#4a152e]'}`}
                  style={{ borderBottom: pack.style === 'text' ? '2px solid #4a152e' : '' }}
                >
                  BUTTON
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
                onClick={() => handleOverride(pack.cssProps)}
                className={`${pack.bg} rounded border ${i === 0 ? 'border-gray-900' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center min-h-[80px]`}
              >
                <div className="flex items-center gap-1 w-full">
                  <div className={`flex-1 ${pack.formBg} ${pack.border} ${pack.style.includes('square') ? 'rounded-none' : pack.style.includes('pill') ? 'rounded-full' : 'rounded'} px-2 py-1.5 text-[8px] text-[#4a152e]`} style={{ borderBottom: pack.style.includes('underline') ? '1px solid #4a152e' : '' }}>
                    Text
                  </div>
                  {pack.style.includes('button') || pack.style.includes('fill') ? (
                    <div className={`bg-[#4a152e] text-white text-[7px] font-bold px-2 py-1.5 ${pack.btnRadius === '9999px' ? 'rounded-full' : pack.btnRadius === '0px' ? 'rounded-none' : 'rounded'}`}>
                      OPTION
                    </div>
                  ) : (
                    <div className={`bg-[#4a152e] text-white w-5 h-5 flex items-center justify-center ${pack.btnRadius === '9999px' ? 'rounded-full' : pack.btnRadius === '0px' ? 'rounded-none' : 'rounded'} text-[8px]`}>
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



      </div>
    </div>
  );
}
