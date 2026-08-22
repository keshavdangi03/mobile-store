"use client";

import React, { useState } from "react";
import { X, ChevronRight, ChevronDown, Check, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCmsStore } from "@/lib/cms-store";

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
  { id: 'btn-1', bg: 'bg-[#d2cfd1]', shape: 'rounded-full', style: 'solid', radius: '9999px', cssProps: { '--btn-bg': 'var(--primary)', '--btn-text': 'var(--background)', '--btn-border': 'transparent', '--btn-radius': '9999px', '--btn-shadow': 'none', '--btn-border-b': 'none' } },
  { id: 'btn-2', bg: 'bg-[#f5f5f5]', shape: 'rounded-full', style: 'outline', radius: '9999px', cssProps: { '--btn-bg': 'transparent', '--btn-text': 'var(--primary)', '--btn-border': 'var(--primary)', '--btn-radius': '9999px', '--btn-shadow': 'none', '--btn-border-b': 'none' } },
  { id: 'btn-3', bg: 'bg-[#f5f5f5]', shape: 'rounded-md', style: 'solid', radius: '6px', cssProps: { '--btn-bg': 'var(--primary)', '--btn-text': 'var(--background)', '--btn-border': 'transparent', '--btn-radius': '6px', '--btn-shadow': 'none', '--btn-border-b': 'none' } },
  { id: 'btn-4', bg: 'bg-[#f5f5f5]', shape: 'rounded-md', style: 'outline', radius: '6px', cssProps: { '--btn-bg': 'transparent', '--btn-text': 'var(--primary)', '--btn-border': 'var(--primary)', '--btn-radius': '6px', '--btn-shadow': 'none', '--btn-border-b': 'none' } },
  { id: 'btn-5', bg: 'bg-[#f5f5f5]', shape: 'rounded-none', style: 'solid', radius: '0px', cssProps: { '--btn-bg': 'var(--primary)', '--btn-text': 'var(--background)', '--btn-border': 'transparent', '--btn-radius': '0px', '--btn-shadow': 'none', '--btn-border-b': 'none' } },
  { id: 'btn-6', bg: 'bg-[#f5f5f5]', shape: 'rounded-none', style: 'outline', radius: '0px', cssProps: { '--btn-bg': 'transparent', '--btn-text': 'var(--primary)', '--btn-border': 'var(--primary)', '--btn-radius': '0px', '--btn-shadow': 'none', '--btn-border-b': 'none' } },
  { id: 'btn-7', bg: 'bg-[#f5f5f5]', shape: 'rounded-[100px]', style: 'solid', radius: '100px', cssProps: { '--btn-bg': 'var(--primary)', '--btn-text': 'var(--background)', '--btn-border': 'transparent', '--btn-radius': '100px', '--btn-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1)', '--btn-border-b': 'none' } },
  { id: 'btn-8', bg: 'bg-[#f5f5f5]', shape: 'rounded-none', style: 'text', radius: '0px', cssProps: { '--btn-bg': 'transparent', '--btn-text': 'var(--primary)', '--btn-border': 'transparent', '--btn-radius': '0px', '--btn-shadow': 'none', '--btn-border-b': '2px solid var(--primary)' } },
];

const FORM_PACKS = [
  { id: 'form-1', bg: 'bg-[#d2cfd1]', style: 'solid-fill', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '0px', btnRadius: '0px', cssProps: { '--form-bg': 'var(--card-bg)', '--form-border': 'transparent', '--form-radius': '0px', '--form-btn-radius': '0px', '--form-border-b': '1px solid var(--primary)' } },
  { id: 'form-2', bg: 'bg-[#f5f5f5]', style: 'outline', formBg: 'bg-white', border: 'border-[#4a152e]', radius: '0px', btnRadius: '9999px', cssProps: { '--form-bg': 'transparent', '--form-border': 'var(--primary)', '--form-radius': '0px', '--form-btn-radius': '9999px', '--form-border-b': 'none' } },
  { id: 'form-3', bg: 'bg-[#f5f5f5]', style: 'outline-pill', formBg: 'bg-white', border: 'border-[#4a152e]', radius: '9999px', btnRadius: '9999px', cssProps: { '--form-bg': 'transparent', '--form-border': 'var(--primary)', '--form-radius': '9999px', '--form-btn-radius': '9999px', '--form-border-b': 'none' } },
  { id: 'form-4', bg: 'bg-[#f5f5f5]', style: 'underline', formBg: 'bg-[#fdf8f5]', border: 'border-b border-[#4a152e]', radius: '0px', btnRadius: '4px', cssProps: { '--form-bg': 'transparent', '--form-border': 'transparent', '--form-radius': '0px', '--form-btn-radius': '4px', '--form-border-b': '2px solid var(--primary)' } },
  { id: 'form-5', bg: 'bg-[#f5f5f5]', style: 'solid-pill', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '9999px', btnRadius: '9999px', cssProps: { '--form-bg': 'var(--card-bg)', '--form-border': 'transparent', '--form-radius': '9999px', '--form-btn-radius': '9999px', '--form-border-b': 'none' } },
  { id: 'form-6', bg: 'bg-[#f5f5f5]', style: 'solid-square', formBg: 'bg-[#fdf8f5]', border: 'border-transparent', radius: '4px', btnRadius: '4px', cssProps: { '--form-bg': 'var(--card-bg)', '--form-border': 'transparent', '--form-radius': '4px', '--form-btn-radius': '4px', '--form-border-b': 'none' } },
];

export default function SiteStylesPanel() {
  const router = useRouter();
  const { setStyleOverrides } = useCmsStore();

  const [activePopover, setActivePopover] = useState<'fonts' | 'colors' | 'buttons' | 'forms' | null>(null);
  const [fontsView, setFontsView] = useState<'packs' | 'customize' | 'headings' | 'paragraphs' | 'buttons-font' | 'misc'>('packs');
  const [colorsView, setColorsView] = useState<'packs' | 'customize' | 'edit_palette'>('packs');

  // Active selections for saving
  const [selectedFontPackIndex, setSelectedFontPackIndex] = useState(0);
  const [selectedButtonPackIndex, setSelectedButtonPackIndex] = useState(0);
  const [selectedFormPackIndex, setSelectedFormPackIndex] = useState(0);

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

  // Saved feedback banner
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const GOOGLE_FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Merriweather', 'Raleway', 'Oswald', 'Nunito', 'Poppins', 'Source Serif 4', 'DM Serif Display', 'Cormorant Garamond', 'Archivo', 'Chewy'];

  const togglePopover = (popover: 'fonts' | 'colors' | 'buttons' | 'forms') => {
    setActivePopover(activePopover === popover ? null : popover);
    setFontsView('packs');
    setColorsView('packs');
  };

  const handleOverride = (overrides: Record<string, string>) => {
    setStyleOverrides(overrides);
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
      iframes[i].contentWindow?.postMessage({ type: 'CMS_STYLE_OVERRIDE', overrides }, '*');
    }
  };

  const triggerSaveFeedback = (section: string) => {
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2200);
  };

  // ─── SAVE HANDLERS FOR EACH INDIVIDUAL CATEGORY ──────────────────────────
  
  const handleSaveColors = () => {
    const colorOverrides = {
      '--background': activePalette[0],
      '--card-bg': activePalette[1],
      '--primary-hover': activePalette[2],
      '--primary': activePalette[3],
      '--foreground': activePalette[4],
    };
    handleOverride(colorOverrides);
    triggerSaveFeedback('colors');
  };

  const handleSaveFonts = () => {
    const fontOverrides = {
      '--font-sans-theme': headingFont,
      '--font-serif-theme': paragraphFont,
      '--heading-font': headingFont,
      '--paragraph-font': paragraphFont,
      '--base-font-size': `${baseSize}px`,
      '--heading-font-size': `${headingSize}px`,
      '--heading-font-weight': headingWeight,
      '--heading-font-style': headingStyle,
      '--heading-letter-spacing': `${headingLetterSpacing}em`,
      '--heading-line-height': `${headingLineHeight}`,
      '--paragraph-font-size': `${paragraphSize}px`,
      '--paragraph-font-weight': paragraphWeight,
      '--paragraph-letter-spacing': `${paragraphLetterSpacing}em`,
      '--paragraph-line-height': `${paragraphLineHeight}`,
    };
    handleOverride(fontOverrides);
    triggerSaveFeedback('fonts');
  };

  const handleSaveButtons = () => {
    const pack = BUTTON_PACKS[selectedButtonPackIndex] || BUTTON_PACKS[0];
    handleOverride(pack.cssProps);
    triggerSaveFeedback('buttons');
  };

  const handleSaveForms = () => {
    const pack = FORM_PACKS[selectedFormPackIndex] || FORM_PACKS[0];
    handleOverride(pack.cssProps);
    triggerSaveFeedback('forms');
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* ─── 1. FONT PACKS POPOVER ────────────────────────────────────────── */}
      {activePopover === 'fonts' && (
        <div className="fixed right-[320px] top-[140px] mr-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200 overflow-hidden" style={{ maxHeight: '78vh' }}>

          {/* ─── PACKS VIEW ─── */}
          {fontsView === 'packs' && (
            <div className="flex flex-col" style={{ maxHeight: '78vh' }}>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">Font Packs</h3>
                  <p className="text-[10px] text-gray-500">Select heading & body pairing</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSaveFonts}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                      savedSection === 'fonts'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {savedSection === 'fonts' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                    {savedSection === 'fonts' ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={() => setActivePopover(null)} className="p-1 hover:bg-gray-200/60 rounded-lg cursor-pointer">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-4">
                <div className="grid grid-cols-2 gap-2.5">
                  {FONT_PACKS.map((pack, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setSelectedFontPackIndex(i);
                        handleOverride({ '--font-sans-theme': pack.hFont, '--font-serif-theme': pack.pFont });
                      }}
                      className={`${pack.bg} rounded-xl border-2 ${selectedFontPackIndex === i ? 'border-black ring-1 ring-black shadow-sm' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-all flex flex-col justify-center min-h-[85px]`}
                    >
                      <p className={`text-[#4a152e] text-2xl leading-none ${pack.fontWeight || ''} ${pack.italic ? 'italic' : ''}`} style={{ fontFamily: pack.hFont }}>Heading</p>
                      <p className="text-[#5b2b41] text-[9px] mt-1 tracking-tight" style={{ fontFamily: pack.pFont }}>This is your paragraph.</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-gray-100 bg-gray-50/50 flex gap-2">
                <button 
                  onClick={() => setFontsView('customize')}
                  className="flex-1 py-2.5 border border-gray-300 bg-white text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Customize Fonts
                </button>
                <button 
                  onClick={handleSaveFonts}
                  className={`flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    savedSection === 'fonts'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'fonts' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {savedSection === 'fonts' ? 'Saved ✓' : 'Save Fonts'}
                </button>
              </div>
            </div>
          )}

          {/* ─── CUSTOMIZE VIEW ─── */}
          {fontsView === 'customize' && (
            <div className="flex flex-col" style={{ maxHeight: '78vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
                <button onClick={() => setFontsView('packs')} className="p-1 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-bold flex-1 text-center">Customize Fonts</span>
                <button 
                  onClick={handleSaveFonts}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                    savedSection === 'fonts'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'fonts' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                  {savedSection === 'fonts' ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-4">
                {/* Preview */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-2xl text-gray-900" style={{ fontFamily: headingFont, fontWeight: headingWeight, fontStyle: headingStyle, letterSpacing: `${headingLetterSpacing}em`, lineHeight: headingLineHeight }}>Heading</p>
                  <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: paragraphFont, fontWeight: paragraphWeight, lineHeight: paragraphLineHeight, letterSpacing: `${paragraphLetterSpacing}em` }}>This is your paragraph.</p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase font-mono">{headingFont} · {paragraphFont}</p>
                </div>

                {/* Settings list */}
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                    <span className="text-xs font-semibold text-gray-800">Base Size</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">{baseSize}px</span>
                      <button onClick={() => setBaseSize(s => Math.max(10, s - 1))} className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-xs font-bold cursor-pointer">–</button>
                      <button onClick={() => setBaseSize(s => Math.min(24, s + 1))} className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-xs font-bold cursor-pointer">+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 cursor-pointer" onClick={() => setFontsView('headings')}>
                    <span className="text-xs font-semibold text-gray-800">Headings Typography</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400 font-mono">{headingFont}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 cursor-pointer" onClick={() => setFontsView('paragraphs')}>
                    <span className="text-xs font-semibold text-gray-800">Paragraphs Typography</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400 font-mono">{paragraphFont}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-2">
                <button 
                  onClick={() => { setHeadingFont('Playfair Display'); setBaseSize(16); setParagraphFont('Inter'); }} 
                  className="flex-1 py-2 text-xs font-bold text-gray-500 hover:text-black border border-gray-200 bg-white rounded-xl cursor-pointer"
                >
                  Reset
                </button>
                <button 
                  onClick={handleSaveFonts}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    savedSection === 'fonts'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'fonts' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {savedSection === 'fonts' ? 'Saved ✓' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* ─── HEADINGS DETAIL VIEW ─── */}
          {fontsView === 'headings' && (
            <div className="flex flex-col" style={{ maxHeight: '78vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
                <button onClick={() => setFontsView('customize')} className="p-1 hover:bg-gray-200 rounded cursor-pointer">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-bold flex-1 text-center">Headings Font</span>
                <button 
                  onClick={handleSaveFonts}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                    savedSection === 'fonts'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'fonts' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                  {savedSection === 'fonts' ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <p style={{ fontFamily: headingFont, fontWeight: headingWeight, fontStyle: headingStyle, fontSize: `${Math.min(headingSize, 36)}px`, letterSpacing: `${headingLetterSpacing}em`, lineHeight: headingLineHeight }} className="text-gray-900">Heading Title</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Select Heading Font</label>
                  <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
                    {GOOGLE_FONTS.map(font => (
                      <button key={font} onClick={() => { setHeadingFont(font); handleOverride({ '--heading-font': font }); }}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between text-xs transition-colors cursor-pointer ${headingFont === font ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'}`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                        {headingFont === font && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Size</label>
                    <span className="text-xs text-gray-500 font-mono">{headingSize}px</span>
                  </div>
                  <input type="range" min="20" max="70" value={headingSize} onChange={e => setHeadingSize(parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button 
                  onClick={handleSaveFonts}
                  className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    savedSection === 'fonts'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'fonts' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {savedSection === 'fonts' ? 'Saved ✓' : 'Save Headings Font'}
                </button>
              </div>
            </div>
          )}

          {/* ─── PARAGRAPHS DETAIL VIEW ─── */}
          {fontsView === 'paragraphs' && (
            <div className="flex flex-col" style={{ maxHeight: '78vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
                <button onClick={() => setFontsView('customize')} className="p-1 hover:bg-gray-200 rounded cursor-pointer">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-bold flex-1 text-center">Paragraphs Font</span>
                <button 
                  onClick={handleSaveFonts}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                    savedSection === 'fonts'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'fonts' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                  {savedSection === 'fonts' ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p style={{ fontFamily: paragraphFont, fontWeight: paragraphWeight, fontSize: `${paragraphSize}px`, lineHeight: paragraphLineHeight, letterSpacing: `${paragraphLetterSpacing}em` }} className="text-gray-700">This is your paragraph body text across the site.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Select Body Font</label>
                  <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
                    {GOOGLE_FONTS.map(font => (
                      <button key={font} onClick={() => setParagraphFont(font)}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between text-xs transition-colors cursor-pointer ${paragraphFont === font ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'}`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                        {paragraphFont === font && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button 
                  onClick={handleSaveFonts}
                  className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    savedSection === 'fonts'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'fonts' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {savedSection === 'fonts' ? 'Saved ✓' : 'Save Body Font'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ─── 2. COLOR PACKS POPOVER ───────────────────────────────────────── */}
      {activePopover === 'colors' && (
        <div className="fixed right-[320px] top-[220px] mr-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200 overflow-hidden" style={{ maxHeight: '78vh' }}>
          
          {/* ─── PACKS VIEW ─── */}
          {colorsView === 'packs' && (
            <div className="flex flex-col" style={{ maxHeight: '78vh' }}>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">Color Palettes</h3>
                  <p className="text-[10px] text-gray-500">Pick or customize your store palette</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSaveColors}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                      savedSection === 'colors'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {savedSection === 'colors' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                    {savedSection === 'colors' ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={() => setActivePopover(null)} className="p-1 hover:bg-gray-200/60 rounded-lg cursor-pointer">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-4">
                <div className="grid grid-cols-2 gap-2.5">
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
                      className={`rounded-xl border-2 ${activePalette.join('') === pack.colors.join('') ? 'border-black ring-1 ring-black shadow-sm' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-all flex items-center justify-center min-h-[80px] bg-gray-50`}
                    >
                      <div className="flex w-full h-8 rounded-lg border border-black/10 overflow-hidden shadow-2xs">
                        {pack.colors.map((c, j) => (
                          <div key={j} className="flex-1" style={{ backgroundColor: c }}></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-gray-100 bg-gray-50/50 flex gap-2">
                <button 
                  onClick={() => setColorsView('customize')}
                  className="flex-1 py-2.5 border border-gray-300 bg-white text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Customize Colors
                </button>
                <button 
                  onClick={handleSaveColors}
                  className={`flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    savedSection === 'colors'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'colors' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {savedSection === 'colors' ? 'Saved ✓' : 'Save Colors'}
                </button>
              </div>
            </div>
          )}

          {/* ─── CUSTOMIZE VIEW ─── */}
          {colorsView === 'customize' && (
            <div className="flex flex-col" style={{ maxHeight: '78vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
                <button onClick={() => setColorsView('packs')} className="p-1 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-bold flex-1 text-center">Colors Customizer</span>
                <button 
                  onClick={handleSaveColors}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                    savedSection === 'colors'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'colors' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                  {savedSection === 'colors' ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-4">
                {/* Active Palette Preview */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active 5-Tone Palette</span>
                  <div className="flex rounded-lg h-12 w-full border border-black/10 overflow-hidden shadow-inner">
                    {activePalette.map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }}></div>
                    ))}
                  </div>
                </div>

                <div 
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setColorsView('edit_palette')}
                >
                  <span className="text-xs text-gray-800 font-bold">Edit Individual Hex Colors</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button 
                  onClick={handleSaveColors}
                  className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    savedSection === 'colors'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'colors' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {savedSection === 'colors' ? 'Saved ✓' : 'Save Color Palette'}
                </button>
              </div>
            </div>
          )}

          {/* ─── EDIT PALETTE VIEW ─── */}
          {colorsView === 'edit_palette' && (
            <div className="flex flex-col" style={{ maxHeight: '78vh' }}>
              <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
                <button onClick={() => { setColorsView('customize'); setEditingColorIndex(null); }} className="p-1 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <span className="text-sm font-bold flex-1 text-center">Edit Color Tones</span>
                <button 
                  onClick={handleSaveColors}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                    savedSection === 'colors'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'colors' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                  {savedSection === 'colors' ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-4">
                <div className="flex justify-between gap-2">
                  {activePalette.map((c, i) => (
                    <div 
                      key={i} 
                      onClick={() => setEditingColorIndex(i)}
                      className={`flex-1 h-12 rounded-xl cursor-pointer transition-all border-2 ${editingColorIndex === i ? 'border-black ring-2 ring-black' : 'border-gray-200 shadow-xs'}`}
                      style={{ backgroundColor: c }}
                      title={`Tone ${i+1}`}
                    />
                  ))}
                </div>

                {editingColorIndex !== null && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-3 animate-in fade-in">
                    <span className="text-xs font-bold text-gray-800">Adjust Tone {editingColorIndex + 1}</span>
                    <div className="flex items-center gap-3">
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
                        className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-gray-300"
                      />
                      <span className="text-xs font-mono font-bold text-gray-800">{activePalette[editingColorIndex].toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button 
                  onClick={handleSaveColors}
                  className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    savedSection === 'colors'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {savedSection === 'colors' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {savedSection === 'colors' ? 'Saved ✓' : 'Save Palette Changes'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ─── 3. BUTTON PACKS POPOVER ──────────────────────────────────────── */}
      {activePopover === 'buttons' && (
        <div className="fixed right-[320px] top-[300px] mr-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Button Styles</h3>
              <p className="text-[10px] text-gray-500">Pick your global button shape & border</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSaveButtons}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                  savedSection === 'buttons'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                {savedSection === 'buttons' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {savedSection === 'buttons' ? 'Saved' : 'Save'}
              </button>
              <button onClick={() => setActivePopover(null)} className="p-1 hover:bg-gray-200/60 rounded-lg cursor-pointer">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 gap-2.5">
              {BUTTON_PACKS.map((pack, i) => (
                <div 
                  key={pack.id} 
                  onClick={() => {
                    setSelectedButtonPackIndex(i);
                    handleOverride(pack.cssProps);
                  }}
                  className={`${pack.bg} rounded-xl border-2 ${selectedButtonPackIndex === i ? 'border-black ring-1 ring-black shadow-sm' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-all flex items-center justify-center min-h-[75px]`}
                >
                  <div 
                    className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-bold flex items-center justify-center ${pack.shape} ${pack.style === 'solid' ? 'bg-[#4a152e] text-white' : pack.style === 'outline' ? 'border border-[#4a152e] text-[#4a152e]' : 'text-[#4a152e]'}`}
                    style={{ borderBottom: pack.style === 'text' ? '2px solid #4a152e' : '' }}
                  >
                    BUTTON
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button 
              onClick={handleSaveButtons}
              className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                savedSection === 'buttons'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              {savedSection === 'buttons' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {savedSection === 'buttons' ? 'Saved ✓' : 'Save Button Style'}
            </button>
          </div>
        </div>
      )}

      {/* ─── 4. FORM PACKS POPOVER ────────────────────────────────────────── */}
      {activePopover === 'forms' && (
        <div className="fixed right-[320px] top-[380px] mr-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Form Styles</h3>
              <p className="text-[10px] text-gray-500">Pick your global input field design</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSaveForms}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                  savedSection === 'forms'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                {savedSection === 'forms' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {savedSection === 'forms' ? 'Saved' : 'Save'}
              </button>
              <button onClick={() => setActivePopover(null)} className="p-1 hover:bg-gray-200/60 rounded-lg cursor-pointer">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 gap-2.5">
              {FORM_PACKS.map((pack, i) => (
                <div 
                  key={pack.id} 
                  onClick={() => {
                    setSelectedFormPackIndex(i);
                    handleOverride(pack.cssProps);
                  }}
                  className={`${pack.bg} rounded-xl border-2 ${selectedFormPackIndex === i ? 'border-black ring-1 ring-black shadow-sm' : 'border-transparent'} p-3 cursor-pointer hover:border-gray-400 transition-all flex items-center justify-center min-h-[75px]`}
                >
                  <div className="flex items-center gap-1 w-full">
                    <div className={`flex-1 ${pack.formBg} ${pack.border} ${pack.style.includes('square') ? 'rounded-none' : pack.style.includes('pill') ? 'rounded-full' : 'rounded'} px-2 py-1 text-[8px] text-[#4a152e]`} style={{ borderBottom: pack.style.includes('underline') ? '1px solid #4a152e' : '' }}>
                      Text
                    </div>
                    {pack.style.includes('button') || pack.style.includes('fill') ? (
                      <div className={`bg-[#4a152e] text-white text-[7px] font-bold px-1.5 py-1 ${pack.btnRadius === '9999px' ? 'rounded-full' : pack.btnRadius === '0px' ? 'rounded-none' : 'rounded'}`}>
                        OK
                      </div>
                    ) : (
                      <div className={`bg-[#4a152e] text-white w-4 h-4 flex items-center justify-center ${pack.btnRadius === '9999px' ? 'rounded-full' : pack.btnRadius === '0px' ? 'rounded-none' : 'rounded'} text-[7px]`}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button 
              onClick={handleSaveForms}
              className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                savedSection === 'forms'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              {savedSection === 'forms' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {savedSection === 'forms' ? 'Saved ✓' : 'Save Form Style'}
            </button>
          </div>
        </div>
      )}

      {/* ─── MAIN SITE STYLES SIDEBAR ─────────────────────────────────────── */}
      <div className="p-4 pb-2 flex justify-between items-center sticky top-0 bg-white z-10 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Site Styles</h2>
          <p className="text-[11px] text-gray-500 font-medium">Global typography, palettes, and buttons</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push("/admin/cms")} 
            className="w-7 h-7 bg-white border border-gray-900 rounded-[4px] flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-900" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-white">
        
        {/* Themes */}
        <div 
          onClick={() => router.push("/admin/cms/styles/themes")}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider group-hover:text-black transition-colors">Full Site Themes</p>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="border border-card-border rounded-xl p-3 flex items-center justify-between group-hover:border-gray-400 transition-colors bg-gray-50/50">
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
            className={`flex-1 ${activePopover === 'fonts' ? 'bg-[#d2cfd1] border-gray-400 shadow-md' : 'bg-[#f5f5f5] border-transparent'} rounded-xl border p-3.5 cursor-pointer hover:border-gray-400 transition-all flex flex-col justify-center min-h-[90px]`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Fonts</p>
              {savedSection === 'fonts' && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">Saved ✓</span>}
            </div>
            <p className="text-[#4a152e] text-2xl font-bold italic leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
              Heading
            </p>
            <p className="text-[#5b2b41] text-[9px] mt-1 tracking-tight">
              This is your paragraph.
            </p>
          </div>
          <button 
            onClick={() => togglePopover('fonts')}
            className={`w-[45px] ${activePopover === 'fonts' ? 'bg-[#eaeaea]' : 'bg-[#f5f5f5]'} hover:bg-[#eaeaea] transition-colors rounded-xl flex items-center justify-center border border-gray-100 cursor-pointer`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Colors Row */}
        <div className="flex gap-2">
          <div 
            onClick={() => togglePopover('colors')}
            className={`flex-1 ${activePopover === 'colors' ? 'bg-[#d2cfd1] border-gray-400 shadow-md' : 'bg-[#f5f5f5] border-transparent'} rounded-xl border p-3.5 cursor-pointer hover:border-gray-400 transition-all min-h-[90px] flex flex-col justify-center`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Colors</p>
              {savedSection === 'colors' && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">Saved ✓</span>}
            </div>
            <div className="flex rounded-lg overflow-hidden h-9 shadow-sm border border-black/5">
              {activePalette.map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c }}></div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => togglePopover('colors')}
            className={`w-[45px] ${activePopover === 'colors' ? 'bg-[#eaeaea]' : 'bg-[#f5f5f5]'} hover:bg-[#eaeaea] transition-colors rounded-xl flex items-center justify-center border border-gray-100 cursor-pointer`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-2">
          <div 
            onClick={() => togglePopover('buttons')}
            className={`flex-1 ${activePopover === 'buttons' ? 'bg-[#d2cfd1] border-gray-400 shadow-md' : 'bg-[#f5f5f5] border-transparent'} rounded-xl border p-3.5 cursor-pointer hover:border-gray-400 transition-all min-h-[90px] flex flex-col justify-center items-center relative`}
          >
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider absolute top-3 left-3">Buttons</p>
            {savedSection === 'buttons' && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full absolute top-3 right-3">Saved ✓</span>}
            <div className="bg-[#4a152e] text-white text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-widest inline-block mt-4 shadow-sm">
              Button
            </div>
          </div>
          <button 
            onClick={() => togglePopover('buttons')}
            className={`w-[45px] ${activePopover === 'buttons' ? 'bg-[#eaeaea]' : 'bg-[#f5f5f5]'} hover:bg-[#eaeaea] transition-colors rounded-xl flex items-center justify-center border border-gray-100 cursor-pointer`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Forms Row */}
        <div className="flex gap-2">
          <div 
            onClick={() => togglePopover('forms')}
            className={`flex-1 ${activePopover === 'forms' ? 'bg-[#d2cfd1] border-gray-400 shadow-md' : 'bg-[#f5f5f5] border-transparent'} rounded-xl border p-3.5 cursor-pointer hover:border-gray-400 transition-all min-h-[90px] flex flex-col justify-center relative`}
          >
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider absolute top-3 left-3">Forms</p>
            {savedSection === 'forms' && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full absolute top-3 right-3">Saved ✓</span>}
            <div className="flex items-center gap-2 mt-4 px-2">
              <div className="border border-[#b8adff] rounded-full px-4 py-1.5 flex-1 bg-[#e1d8fa] text-[10px] text-[#4a152e]">Text</div>
              <div className="bg-[#e1d8fa] border border-[#b8adff] text-[#4a152e] w-7 h-7 rounded-full flex items-center justify-center text-xs">✓</div>
            </div>
          </div>
          <button 
            onClick={() => togglePopover('forms')}
            className={`w-[45px] ${activePopover === 'forms' ? 'bg-[#eaeaea]' : 'bg-[#f5f5f5]'} hover:bg-[#eaeaea] transition-colors rounded-xl flex items-center justify-center border border-gray-100 cursor-pointer`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

      </div>
    </div>
  );
}
