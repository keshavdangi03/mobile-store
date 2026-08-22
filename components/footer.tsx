"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCmsStore } from "@/lib/cms-store";
import { Pencil, Layers, Plus, ChevronDown } from "lucide-react";

export default function Footer() {
  const isEditMode = useCmsStore(state => state.isEditMode);
  const activeEditorId = useCmsStore(state => state.activeEditorId);
  const setActiveEditorId = useCmsStore(state => state.setActiveEditorId);

  const [isHovered, setIsHovered] = useState(false);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [designTab, setDesignTab] = useState<'main' | 'dropShadow' | 'border'>('main');

  // Design state
  const [footerLayout, setFooterLayout] = useState<'4col' | 'centered' | 'minimal' | 'newsletter' | '2col'>('4col');
  const [footerPadding, setFooterPadding] = useState(3);
  const [footerColumnGap, setFooterColumnGap] = useState(2);
  const [footerFixedPosition, setFooterFixedPosition] = useState(false);
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowMode, setShadowMode] = useState<'soft'|'strong'>('soft');
  const [borderEnabled, setBorderEnabled] = useState(true);
  const [borderColor, setBorderColor] = useState('#334155');
  const [borderThickness, setBorderThickness] = useState<'S'|'M'|'L'>('S');

  const currentSettingsRef = useRef({
    footerLayout, footerPadding, footerColumnGap, footerFixedPosition,
    shadowEnabled, shadowColor, shadowSpread, shadowBlur, shadowMode,
    borderEnabled, borderColor, borderThickness
  });

  useEffect(() => {
    currentSettingsRef.current = {
      footerLayout, footerPadding, footerColumnGap, footerFixedPosition,
      shadowEnabled, shadowColor, shadowSpread, shadowBlur, shadowMode,
      borderEnabled, borderColor, borderThickness
    };
  }, [
    footerLayout, footerPadding, footerColumnGap, footerFixedPosition,
    shadowEnabled, shadowColor, shadowSpread, shadowBlur, shadowMode,
    borderEnabled, borderColor, borderThickness
  ]);

  const loadSavedSettings = React.useCallback(() => {
    try {
      const saved = localStorage.getItem('cms_footer_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.footerLayout !== undefined) setFooterLayout(parsed.footerLayout);
        if (parsed.footerPadding !== undefined) setFooterPadding(parsed.footerPadding);
        if (parsed.footerColumnGap !== undefined) setFooterColumnGap(parsed.footerColumnGap);
        if (parsed.footerFixedPosition !== undefined) setFooterFixedPosition(parsed.footerFixedPosition);
        if (parsed.shadowEnabled !== undefined) setShadowEnabled(parsed.shadowEnabled);
        if (parsed.shadowColor !== undefined) setShadowColor(parsed.shadowColor);
        if (parsed.shadowSpread !== undefined) setShadowSpread(parsed.shadowSpread);
        if (parsed.shadowBlur !== undefined) setShadowBlur(parsed.shadowBlur);
        if (parsed.shadowMode !== undefined) setShadowMode(parsed.shadowMode);
        if (parsed.borderEnabled !== undefined) setBorderEnabled(parsed.borderEnabled);
        if (parsed.borderColor !== undefined) setBorderColor(parsed.borderColor);
        if (parsed.borderThickness !== undefined) setBorderThickness(parsed.borderThickness);
      }
    } catch (e) {
      console.error('Failed to load footer settings', e);
    }
  }, []);

  const [siteTitle, setSiteTitle] = useState("Expert Mobile Solution");
  const [logoImage, setLogoImage] = useState<string | null>("/logo.png");

  const syncHeaderSettings = React.useCallback(() => {
    try {
      const saved = localStorage.getItem('cms_header_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.siteTitle !== undefined) setSiteTitle(parsed.siteTitle);
        if (parsed.logoImage !== undefined) setLogoImage(parsed.logoImage);
      }
    } catch (e) {
      console.error('Failed to load header settings in footer', e);
    }
  }, []);

  useEffect(() => {
    syncHeaderSettings();
    window.addEventListener('storage', syncHeaderSettings);
    return () => window.removeEventListener('storage', syncHeaderSettings);
  }, [syncHeaderSettings]);

  useEffect(() => {
    loadSavedSettings();
  }, [loadSavedSettings]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isEditMode) {
      window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
    }
  }, [
    footerLayout, footerPadding, footerColumnGap, footerFixedPosition,
    shadowEnabled, shadowColor, shadowSpread, shadowBlur, shadowMode,
    borderEnabled, borderColor, borderThickness, isEditMode
  ]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CMS_SAVE_CHANGES') {
        localStorage.setItem('cms_footer_settings', JSON.stringify(currentSettingsRef.current));
      } else if (event.data?.type === 'CMS_DISCARD_CHANGES') {
        loadSavedSettings();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loadSavedSettings]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cms_footer_settings') {
        loadSavedSettings();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadSavedSettings]);

  const panelRef = useRef<HTMLDivElement>(null);

  const isFooterActive = activeEditorId === 'footer';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowDesignPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const borderPx = borderEnabled ? (borderThickness === 'S' ? 1 : borderThickness === 'M' ? 2 : 3) : 0;
  const shadowCSS = shadowEnabled
    ? `0 ${shadowMode === 'soft' ? -4 : -8}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`
    : 'none';


  return (
    <div 
      className="relative mt-auto w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Initial Hover State: "EDIT SITE FOOTER" Overlay */}
      {isEditMode && !isFooterActive && isHovered && (
        <div 
          className="absolute inset-0 z-[50] bg-black/50 flex items-center justify-center cursor-pointer transition-all duration-200 backdrop-blur-[2px]"
          onClick={(e) => {
            e.stopPropagation();
            setActiveEditorId('footer');
          }}
        >
          <button className="bg-[#007bff] hover:bg-blue-600 text-white text-xs font-extrabold px-6 py-3 rounded-full shadow-2xl uppercase tracking-wider flex items-center gap-2.5 transition-all scale-105 border-2 border-white cursor-pointer">
            <Pencil className="w-4 h-4" />
            Edit Site Footer
          </button>
        </div>
      )}

      {/* 2. Active State: Section Editor Menus & Blue Border */}
      <div 
        className={`w-full transition-all duration-200 ${isEditMode && isFooterActive ? 'ring-2 ring-[#007bff] z-40 relative' : ''}`}
        onClick={() => {
          if (isEditMode) {
             setActiveEditorId('footer');
          }
        }}
      >
        {isEditMode && isFooterActive && (
          <>
            {/* Top Left Buttons */}
            <div className="absolute top-3 left-4 z-[60] flex items-center gap-2">
              <button className="bg-white hover:bg-gray-50 text-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 transition-colors cursor-pointer">
                <Layers className="w-4 h-4" />
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-800 px-3.5 py-2 rounded-xl shadow-lg border border-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add Block</span>
              </button>
            </div>

            {/* Top Right: Edit Design button + Panel */}
            <div ref={panelRef} className="absolute top-3 right-4 z-[110]">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDesignPanel(v => !v); setDesignTab('main'); }}
                className="bg-[#007bff] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-2xl border-2 border-white flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Design
              </button>

              {showDesignPanel && (
                <div 
                  className="absolute bottom-full right-0 mb-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-card-border shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl z-[300] text-foreground font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-200" 
                  onClick={e => e.stopPropagation()}
                >

                  {designTab === 'main' && (
                    <>
                      <div className="flex items-center justify-between px-4 py-3 border-b border-card-border bg-gray-50 dark:bg-slate-800/80">
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 text-xs font-black border-b-2 border-black dark:border-white text-foreground">Design</button>
                        </div>
                        <button 
                          onClick={() => setShowDesignPanel(false)}
                          className="p-1 rounded-md text-foreground/50 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <div className="p-4 space-y-5 max-h-[460px] overflow-y-auto bg-white dark:bg-slate-900">

                        {/* Layout Picker */}
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black text-foreground/60 tracking-wider uppercase">Footer Layout</label>
                          <div className="grid grid-cols-2 gap-2">
                            {([
                              { id: '4col', label: '4 Columns', bars: [1,1,1,1] },
                              { id: 'centered', label: 'Centered', bars: [4] },
                              { id: 'minimal', label: 'Minimal Bar', bars: [2,2] },
                              { id: 'newsletter', label: 'Newsletter', bars: [3,1] },
                              { id: '2col', label: '2 Columns', bars: [2,2] },
                            ] as const).map(layout => (
                              <button
                                key={layout.id}
                                onClick={() => setFooterLayout(layout.id)}
                                className={`relative border-2 rounded-2xl p-2.5 flex flex-col gap-1.5 transition-all text-left cursor-pointer ${
                                  footerLayout === layout.id 
                                    ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary' 
                                    : 'border-card-border hover:border-foreground/30 bg-background'
                                }`}
                              >
                                <div className="flex gap-1 justify-center w-full">
                                  {layout.bars.map((span, i) => (
                                    <div key={i} className="h-6 rounded-md bg-slate-600/60" style={{ flex: span }} />
                                  ))}
                                </div>
                                <span className={`text-[10px] font-bold text-center mt-1 ${
                                  footerLayout === layout.id ? 'text-primary' : 'text-foreground/80'
                                }`}>{layout.label}</span>
                                {footerLayout === layout.id && (
                                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-white">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Spacing */}
                        <div className="space-y-3.5 pt-2 border-t border-card-border">
                          <label className="text-[10px] font-black text-foreground/60 tracking-wider uppercase">Spacing & Padding</label>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold">Vertical Padding</span>
                              <span className="text-xs font-mono text-foreground/70">{footerPadding}rem</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="8" 
                              step="0.5" 
                              value={footerPadding} 
                              onChange={e => setFooterPadding(parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold">Column Gap</span>
                              <span className="text-xs font-mono text-foreground/70">{footerColumnGap}rem</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="6" 
                              step="0.5" 
                              value={footerColumnGap} 
                              onChange={e => setFooterColumnGap(parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                          </div>
                        </div>

                        {/* Effects */}
                        <div className="space-y-2.5 pt-2 border-t border-card-border">
                          <label className="text-[10px] font-black text-foreground/60 tracking-wider uppercase">Effects & Borders</label>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 px-2.5 rounded-xl transition-colors" onClick={() => setDesignTab('dropShadow')}>
                              <span className="text-xs font-bold">Drop shadow</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 text-foreground/50" />
                            </div>
                            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 px-2.5 rounded-xl transition-colors" onClick={() => setDesignTab('border')}>
                              <span className="text-xs font-bold">Border</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 text-foreground/50" />
                            </div>
                            <div className="flex items-center justify-between py-2 px-2.5">
                              <span className="text-xs font-bold">Sticky footer</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={footerFixedPosition} onChange={e => setFooterFixedPosition(e.target.checked)} />
                                <div className="w-9 h-5 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                            </div>
                          </div>
                        </div>

                      </div>
                    </>
                  )}

                  {designTab === 'dropShadow' && (
                    <>
                      <div className="flex items-center gap-2 p-3 border-b border-card-border bg-gray-50 dark:bg-slate-800/80">
                        <button onClick={() => setDesignTab('main')} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg cursor-pointer">
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <span className="text-xs font-black flex-1 text-center pr-6 uppercase tracking-wider">Drop shadow</span>
                      </div>
                      <div className="p-4 space-y-5 bg-white dark:bg-slate-900">
                        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-card-border">
                          <button className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${shadowMode === 'soft' ? 'bg-white dark:bg-slate-700 shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setShadowMode('soft'); setShadowEnabled(true); }}>Soft</button>
                          <button className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${shadowMode === 'strong' ? 'bg-white dark:bg-slate-700 shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setShadowMode('strong'); setShadowEnabled(true); }}>Strong</button>
                        </div>
                        <div className="space-y-4 pt-1">
                          <div className="flex justify-between items-center border-b border-card-border pb-3">
                            <span className="text-xs font-semibold">Color</span>
                            <input type="color" value={shadowColor} onChange={e => { setShadowColor(e.target.value); setShadowEnabled(true); }} className="w-7 h-7 rounded-full border border-gray-300 p-0 overflow-hidden cursor-pointer" />
                          </div>
                          <div className="space-y-1.5 border-b border-card-border pb-3">
                            <div className="flex justify-between"><span className="text-xs font-semibold">Spread</span><span className="text-xs font-mono">{shadowSpread}px</span></div>
                            <input type="range" min="-50" max="50" value={shadowSpread} onChange={e => { setShadowSpread(parseInt(e.target.value)); setShadowEnabled(true); }} className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" />
                          </div>
                          <div className="space-y-1.5 pb-2">
                            <div className="flex justify-between"><span className="text-xs font-semibold">Blur</span><span className="text-xs font-mono">{shadowBlur}px</span></div>
                            <input type="range" min="0" max="100" value={shadowBlur} onChange={e => { setShadowBlur(parseInt(e.target.value)); setShadowEnabled(true); }} className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {designTab === 'border' && (
                    <>
                      <div className="flex items-center gap-2 p-3 border-b border-card-border bg-gray-50 dark:bg-slate-800/80">
                        <button onClick={() => setDesignTab('main')} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg cursor-pointer">
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <span className="text-xs font-black flex-1 text-center pr-6 uppercase tracking-wider">Border</span>
                      </div>
                      <div className="p-4 space-y-5 bg-white dark:bg-slate-900">
                        <div className="flex justify-between items-center border-b border-card-border pb-3">
                          <span className="text-xs font-semibold">Color</span>
                          <input type="color" value={borderColor} onChange={e => { setBorderColor(e.target.value); setBorderEnabled(true); }} className="w-7 h-7 rounded-full border border-gray-300 p-0 overflow-hidden cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-semibold w-20">Thickness</span>
                          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl border border-card-border flex-1 p-1">
                            <button className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${borderThickness === 'S' ? 'bg-white dark:bg-slate-700 shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setBorderThickness('S'); setBorderEnabled(true); }}>S</button>
                            <button className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${borderThickness === 'M' ? 'bg-white dark:bg-slate-700 shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setBorderThickness('M'); setBorderEnabled(true); }}>M</button>
                            <button className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${borderThickness === 'L' ? 'bg-white dark:bg-slate-700 shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setBorderThickness('L'); setBorderEnabled(true); }}>L</button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs font-semibold">Enable Border</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={borderEnabled} onChange={e => setBorderEnabled(e.target.checked)} />
                            <div className="w-9 h-5 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              )}
            </div>
          </>
        )}


    <footer 
      className="w-full bg-slate-900 text-slate-300"
      style={{
        borderTopWidth: borderPx,
        borderTopStyle: 'solid',
        borderTopColor: borderColor,
        boxShadow: shadowCSS,
        paddingTop: `${footerPadding}rem`,
        paddingBottom: `${footerPadding}rem`,
        position: footerFixedPosition ? 'sticky' : 'relative',
        bottom: footerFixedPosition ? 0 : undefined,
      }}
    >

      {/* ── LAYOUT: 4 COLUMNS (default) ── */}
      {footerLayout === '4col' && (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4" style={{ gap: `${footerColumnGap}rem` }}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoImage || "/logo.png"} className="w-14 h-14 object-contain" alt="Logo" />
              <span className="text-xl font-extrabold tracking-tight text-white uppercase">{siteTitle}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Nepal's premium tech destination. Genuine products with official warranties.</p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>📍 Chabahil, Ganesthan Marg, Kathmandu</p>
              <p>📞 +977 9851052140</p>
              <p>✉️ expertmobilesolution111@gmail.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="text-xs space-y-2.5">
              {[['Laptops','/category/laptop'],['Apple Store','/category/apple'],['Smart Phones','/category/smartphone'],['PC Parts','/category/pc-components']].map(([l,h])=>(
                <li key={l}><Link href={h} className="hover:text-primary transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Policies</h4>
            <ul className="text-xs space-y-2.5">
              {[['Warranty Policy','/#warranty'],['EMI Info','/#emi-info'],['Terms & Conditions','/#terms'],['Privacy Policy','/#privacy']].map(([l,h])=>(
                <li key={l}><Link href={h} className="hover:text-primary transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Store Hours</h4>
            <div className="text-xs text-slate-400 space-y-1.5">
              <p>🗓️ Sun – Fri: 10:00 AM – 7:30 PM</p>
              <p>🗓️ Sat: 11:00 AM – 5:00 PM</p>
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Subscribe</h5>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="bg-slate-800 border border-card-border text-slate-100 text-xs px-3 py-2 rounded-lg outline-none focus:border-primary flex-1" />
                <button className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-2 rounded-lg transition-all">Join</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT: CENTERED ── */}
      {footerLayout === 'centered' && (
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <img src={logoImage || "/logo.png"} className="w-16 h-16 object-contain" alt="Logo" />
            <span className="text-2xl font-extrabold tracking-tight text-white uppercase">{siteTitle}</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">Nepal's premium tech destination. Genuine laptops, smartphones & accessories with official warranties.</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-300">
            {[['Laptops','/category/laptop'],['Apple','/category/apple'],['Phones','/category/smartphone'],['PC Parts','/category/pc-components'],['Warranty','/#warranty'],['EMI','/#emi-info'],['Privacy','/#privacy']].map(([l,h])=>(
              <Link key={l} href={h} className="hover:text-primary transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <input type="email" placeholder="Subscribe to deals..." className="bg-slate-800 border border-card-border text-slate-100 text-xs px-4 py-2 rounded-full outline-none focus:border-primary w-56" />
            <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-primary-hover transition-all">Join</button>
          </div>
          <p className="text-xs text-slate-500">📍 Chabahil, Ganesthan Marg, Kathmandu &nbsp;|&nbsp; 📞 +977 9851052140 &nbsp;|&nbsp; ✉️ expertmobilesolution111@gmail.com</p>
        </div>
      )}

      {/* ── LAYOUT: MINIMAL BAR ── */}
      {footerLayout === 'minimal' && (
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImage || "/logo.png"} className="w-12 h-12 object-contain" alt="Logo" />
            <span className="text-lg font-extrabold tracking-tight text-white uppercase">{siteTitle}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-xs text-slate-400">
            {[['Laptops','/category/laptop'],['Phones','/category/smartphone'],['Apple','/category/apple'],['PC Parts','/category/pc-components'],['Warranty','/#warranty'],['Privacy','/#privacy']].map(([l,h])=>(
              <Link key={l} href={h} className="hover:text-primary transition-colors">{l}</Link>
            ))}
          </div>
          <p className="text-xs text-slate-500">📞 +977 9851052140</p>
        </div>
      )}

      {/* ── LAYOUT: NEWSLETTER FOCUS ── */}
      {footerLayout === 'newsletter' && (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoImage || "/logo.png"} className="w-14 h-14 object-contain" alt="Logo" />
              <span className="text-xl font-extrabold tracking-tight text-white uppercase">{siteTitle}</span>
            </div>
            <p className="text-sm text-slate-300 font-medium">Get exclusive deals, new arrivals & flash sale alerts straight to your inbox.</p>
            <div className="flex gap-2 max-w-md">
              <input type="email" placeholder="Enter your email address" className="bg-slate-800 border border-card-border text-slate-100 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-primary flex-1" />
              <button className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">Subscribe</button>
            </div>
            <div className="flex flex-wrap gap-5 text-xs text-slate-400 pt-2">
              {[['Laptops','/category/laptop'],['Apple','/category/apple'],['Phones','/category/smartphone'],['Warranty','/#warranty'],['Privacy','/#privacy']].map(([l,h])=>(
                <Link key={l} href={h} className="hover:text-primary transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact</h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p>📍 Chabahil, Ganesthan Marg, Kathmandu, Nepal</p>
              <p>📞 +977 9851052140</p>
              <p>✉️ expertmobilesolution111@gmail.com</p>
              <p>🗓️ Sun–Fri: 10AM–7:30PM</p>
              <p>🗓️ Sat: 11AM–5PM</p>
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT: 2 COLUMNS ── */}
      {footerLayout === '2col' && (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2" style={{ gap: `${footerColumnGap}rem` }}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoImage || "/logo.png"} className="w-14 h-14 object-contain" alt="Logo" />
              <span className="text-xl font-extrabold tracking-tight text-white uppercase">{siteTitle}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">Nepal's premium tech shopping destination. We supply genuine laptops, smartphones, PC components, and accessories with official warranties.</p>
            <div className="text-xs text-slate-400 space-y-1.5">
              <p>📍 Chabahil, Ganesthan Marg, Kathmandu, Nepal</p>
              <p>📞 +977 9851052140</p>
              <p>✉️ expertmobilesolution111@gmail.com</p>
              <p>🗓️ Sun–Fri: 10:00 AM – 7:30 PM</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Shop</h4>
              <ul className="text-xs space-y-2.5">
                {[['Laptops','/category/laptop'],['Apple Store','/category/apple'],['Smart Phones','/category/smartphone'],['PC Parts','/category/pc-components'],['Monitors','/category/monitor'],['Tablets','/category/tablet']].map(([l,h])=>(
                  <li key={l}><Link href={h} className="hover:text-primary transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
              <ul className="text-xs space-y-2.5">
                {[['Warranty','/#warranty'],['EMI Info','/#emi-info'],['Terms','/#terms'],['Privacy','/#privacy'],['Repair Service','/repair'],['Training','/training']].map(([l,h])=>(
                  <li key={l}><Link href={h} className="hover:text-primary transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="w-full bg-slate-950 border-t border-card-border/60 py-4 px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <span>&copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.</span>
          <span className="mt-1 sm:mt-0 flex gap-4">
            <span>Designed by Quarkinfotech</span>
            <span>Enhanced with Antigravity AI</span>
          </span>
        </div>
      </div>
    </footer>
      </div>
    </div>
  );
}
