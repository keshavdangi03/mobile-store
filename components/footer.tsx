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
          className="absolute inset-0 z-[50] bg-black/20 flex items-center justify-center cursor-pointer transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setActiveEditorId('footer');
          }}
        >
          <button className="bg-card text-foreground text-[10px] font-bold px-4 py-2 rounded shadow-lg uppercase tracking-wider flex items-center gap-2 hover:bg-background transition-colors">
            <Pencil className="w-3 h-3" />
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
            {/* Top Center ADD SECTION */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[60]">
              <button className="bg-[#007bff] hover:bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded uppercase tracking-wider shadow-sm transition-colors">
                Add Section
              </button>
            </div>

            {/* Top Left Buttons */}
            <div className="absolute top-2 left-2 z-[60] flex items-center gap-2">
              <button className="bg-card hover:bg-background text-gray-700 p-2 rounded shadow-sm border border-gray-200 transition-colors">
                <Layers className="w-4 h-4" />
              </button>
              <button className="bg-card hover:bg-background text-gray-700 px-3 py-2 rounded shadow-sm border border-gray-200 flex items-center gap-1.5 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add Block</span>
              </button>
            </div>

            {/* Top Right: Edit Design button + Panel */}
            <div ref={panelRef} className="absolute top-2 right-2 z-[110]">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDesignPanel(v => !v); setDesignTab('main'); }}
                className="bg-card text-foreground font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded shadow-2xl border border-gray-200 flex items-center gap-2 hover:bg-background transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Design
              </button>

              {showDesignPanel && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>

                  {designTab === 'main' && (
                    <>
                      <div className="flex border-b border-gray-200">
                        <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Design</button>
                        <button className="px-4 py-3 text-xs font-bold text-foreground/60 hover:text-foreground">Color</button>
                      </div>
                      <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">

                        {/* Layout Picker */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Layout</label>
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
                                className={`relative border-2 rounded-lg p-2 flex flex-col gap-1 transition-all ${
                                  footerLayout === layout.id ? 'border-[#007bff] bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-card'
                                }`}
                              >
                                <div className="flex gap-1 justify-center w-full">
                                  {layout.bars.map((span, i) => (
                                    <div key={i} className={`h-6 rounded bg-slate-700 opacity-70`} style={{ flex: span }} />
                                  ))}
                                </div>
                                <span className={`text-[9px] font-bold text-center mt-1 ${
                                  footerLayout === layout.id ? 'text-[#007bff]' : 'text-foreground/60'
                                }`}>{layout.label}</span>
                                {footerLayout === layout.id && (
                                  <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#007bff] flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Spacing */}
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Spacing</label>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">Vertical Padding</span>
                              <span className="text-xs text-foreground/60">{footerPadding}rem</span>
                            </div>
                            <input type="range" min="1" max="8" step="0.5" value={footerPadding} onChange={e => setFooterPadding(parseFloat(e.target.value))}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">Column Gap</span>
                              <span className="text-xs text-foreground/60">{footerColumnGap}rem</span>
                            </div>
                            <input type="range" min="0" max="6" step="0.5" value={footerColumnGap} onChange={e => setFooterColumnGap(parseFloat(e.target.value))}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                          </div>
                        </div>

                        {/* Effects */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Effects</label>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-background px-2 -mx-2 rounded transition-colors" onClick={() => setDesignTab('dropShadow')}>
                              <span className="text-sm">Drop shadow</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 text-foreground/50" />
                            </div>
                            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-background px-2 -mx-2 rounded transition-colors" onClick={() => setDesignTab('border')}>
                              <span className="text-sm">Border</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 text-foreground/50" />
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm">Sticky footer</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={footerFixedPosition} onChange={e => setFooterFixedPosition(e.target.checked)} />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
                              </label>
                            </div>
                          </div>
                        </div>

                      </div>
                    </>
                  )}

                  {designTab === 'dropShadow' && (
                    <>
                      <div className="flex items-center gap-2 p-3 border-b border-gray-200">
                        <button onClick={() => setDesignTab('main')} className="p-1 hover:bg-gray-100 rounded">
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <span className="text-sm font-semibold flex-1 text-center pr-6">Drop shadow</span>
                      </div>
                      <div className="p-4 space-y-6">
                        <div className="flex bg-gray-100 p-1 rounded border border-gray-200">
                          <button className={`flex-1 py-1 text-xs font-semibold rounded ${shadowMode === 'soft' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setShadowMode('soft'); setShadowEnabled(true); }}>Soft</button>
                          <button className={`flex-1 py-1 text-xs font-semibold rounded ${shadowMode === 'strong' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setShadowMode('strong'); setShadowEnabled(true); }}>Strong</button>
                        </div>
                        <div className="space-y-6 pt-2">
                          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <span className="text-sm">Color</span>
                            <input type="color" value={shadowColor} onChange={e => { setShadowColor(e.target.value); setShadowEnabled(true); }} className="w-6 h-6 rounded-full border border-gray-300 p-0 overflow-hidden cursor-pointer" />
                          </div>
                          <div className="space-y-2 border-b border-gray-100 pb-4">
                            <div className="flex justify-between"><span className="text-sm">Spread</span><span className="text-sm">{shadowSpread}px</span></div>
                            <input type="range" min="-50" max="50" value={shadowSpread} onChange={e => { setShadowSpread(parseInt(e.target.value)); setShadowEnabled(true); }} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                          </div>
                          <div className="space-y-2 pb-2">
                            <div className="flex justify-between"><span className="text-sm">Blur</span><span className="text-sm">{shadowBlur}px</span></div>
                            <input type="range" min="0" max="100" value={shadowBlur} onChange={e => { setShadowBlur(parseInt(e.target.value)); setShadowEnabled(true); }} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {designTab === 'border' && (
                    <>
                      <div className="flex items-center gap-2 p-3 border-b border-gray-200">
                        <button onClick={() => setDesignTab('main')} className="p-1 hover:bg-gray-100 rounded">
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <span className="text-sm font-semibold flex-1 text-center pr-6">Border</span>
                      </div>
                      <div className="p-4 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                          <span className="text-sm">Color</span>
                          <input type="color" value={borderColor} onChange={e => { setBorderColor(e.target.value); setBorderEnabled(true); }} className="w-6 h-6 rounded-full border border-gray-300 p-0 overflow-hidden cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm w-20">Thickness</span>
                          <div className="flex bg-gray-100 rounded border border-gray-200 flex-1">
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${borderThickness === 'S' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setBorderThickness('S'); setBorderEnabled(true); }}>S</button>
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${borderThickness === 'M' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setBorderThickness('M'); setBorderEnabled(true); }}>M</button>
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${borderThickness === 'L' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setBorderThickness('L'); setBorderEnabled(true); }}>L</button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Enabled</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={borderEnabled} onChange={e => setBorderEnabled(e.target.checked)} />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
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
              <img src="/logo.png" className="w-14 h-14 object-contain" alt="Logo" />
              <span className="text-xl font-extrabold tracking-tight text-white">EXPERT MOBILE SOLUTION</span>
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
            <img src="/logo.png" className="w-16 h-16 object-contain" alt="Logo" />
            <span className="text-2xl font-extrabold tracking-tight text-white">EXPERT MOBILE SOLUTION</span>
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
            <img src="/logo.png" className="w-12 h-12 object-contain" alt="Logo" />
            <span className="text-lg font-extrabold tracking-tight text-white">EXPERT MOBILE SOLUTION</span>
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
              <img src="/logo.png" className="w-14 h-14 object-contain" alt="Logo" />
              <span className="text-xl font-extrabold tracking-tight text-white">EXPERT MOBILE SOLUTION</span>
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
              <img src="/logo.png" className="w-14 h-14 object-contain" alt="Logo" />
              <span className="text-xl font-extrabold tracking-tight text-white">EXPERT MOBILE SOLUTION</span>
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
          <span>&copy; {new Date().getFullYear()} Expert Mobile Solution. All rights reserved.</span>
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
