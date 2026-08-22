import React, { useState, useEffect, useRef } from 'react';
import { useCmsStore } from "@/lib/cms-store";
import { 
  Layers, 
  Plus, 
  Pencil,
  Sliders,
  LayoutTemplate,
  Copy,
  Heart as HeartIcon, 
  ArrowUp, 
  ArrowDown,
  Trash2,
  X
} from "lucide-react";
import { SectionContext } from "@/lib/section-context";
import AddSectionModal from "./add-section-modal";
import SectionCustomizerModal from "./section-customizer-modal";

export default function SectionEditorWrapper({ children, sectionId }: { children: React.ReactNode, sectionId: string }) {
  const {
    isEditMode,
    activeEditorId,
    setActiveEditorId,
    moveSectionUp,
    moveSectionDown,
    duplicateSection,
    deleteSection,
    clipboardSection,
    setClipboardSection,
    pasteSection,
    saveSectionToAssets,
    customSectionsData
  } = useCmsStore();
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  
  const isCustomSection = Boolean(
    customSectionsData?.[sectionId] ||
    sectionId.startsWith('blank_') ||
    sectionId.startsWith('custom_') ||
    sectionId === 'blank_section' ||
    sectionId === 'custom_section'
  );
  
  const [isCustomizerModalOpen, setIsCustomizerModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'background' | 'colors'>('design');

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<'arrange' | 'save' | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Form states
  const [rowCount, setRowCount] = useState(22);
  const [gap, setGap] = useState<'none' | 'small' | 'large'>('small');
  const [fillScreen, setFillScreen] = useState(false);
  const [divider, setDivider] = useState(false);
  const [anchorLink, setAnchorLink] = useState('');
  const [bgType, setBgType] = useState<'image' | 'video' | 'art'>('image');
  const [bgWidth, setBgWidth] = useState<'full' | 'inset'>('full');
  const [colorTheme, setColorTheme] = useState('lightest-1');
  
  // Track changes to emit unsaved changes
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
  }, [rowCount, gap, fillScreen, divider, anchorLink, bgType, bgWidth, colorTheme]);

  useEffect(() => {
    if (activeEditorId !== sectionId) {
      setIsEditorModalOpen(false);
      setIsCustomizerModalOpen(false);
    }
  }, [activeEditorId, sectionId]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const isSectionActive = activeEditorId === sectionId;
  const showControls = isEditMode && activeEditorId !== 'header' && activeEditorId !== 'footer' && isSectionHovered;

  return (
    <SectionContext.Provider value={{ sectionId, isActive: isSectionActive }}>
      <div 
        className={`relative transition-all duration-200 ${showControls || isSectionActive ? 'ring-2 ring-[#007bff] z-40' : 'ring-2 ring-transparent'}`}
        onMouseEnter={() => setIsSectionHovered(true)}
        onMouseLeave={() => setIsSectionHovered(false)}
        onDoubleClick={() => {
          if (isEditMode) {
            if (!isCustomSection) {
              setIsCustomizerModalOpen(true);
            }
          }
        }}
        onContextMenu={(e) => {
          if (isEditMode) {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({ x: e.clientX, y: e.clientY });
          }
        }}
      >
        {/* Editor Overlay Elements */}
        {showControls && (
          <>
            {/* Top Left Buttons */}
            {!isCustomSection && (
              <div className="absolute top-3 left-3 z-[60] flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCustomizerModalOpen(true);
                  }}
                  className="bg-white/95 dark:bg-slate-900/95 hover:bg-white text-gray-800 dark:text-white px-3.5 py-1.5 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 flex items-center gap-2 transition-all text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  <span>Customize Section</span>
                </button>
              </div>
            )}

            {/* Top Right Floating Toolbar (Move, Duplicate, Delete) */}
            <div className="absolute top-3 right-3 z-[60] flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 p-1 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  moveSectionUp(sectionId);
                  window.parent?.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
                  window.dispatchEvent(new Event('storage'));
                }}
                title="Move section up"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  moveSectionDown(sectionId);
                  window.parent?.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
                  window.dispatchEvent(new Event('storage'));
                }}
                title="Move section down"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateSection(sectionId);
                  window.parent?.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
                  window.dispatchEvent(new Event('storage'));
                }}
                title="Duplicate section"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-gray-300 dark:bg-slate-700 mx-0.5" />

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Permanently remove this section? You can click SAVE in the top bar to commit your changes.")) {
                    deleteSection(sectionId);
                    window.parent?.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
                    window.dispatchEvent(new Event('storage'));
                  }
                }}
                title="Delete section permanently"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/50 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Right Click Context Menu */}
        {contextMenu && (
          <div 
            ref={contextMenuRef}
            className="fixed bg-white rounded shadow-2xl border border-gray-200 py-1.5 z-[100] w-56 text-[13px] text-gray-800 font-medium"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onMouseLeave={() => setActiveSubMenu(null)}
          >
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between" 
              onClick={() => {
                setClipboardSection(sectionId);
                setContextMenu(null);
              }}
            >
              <span>Copy section</span>
              <span className="text-[10px] font-bold tracking-wider text-foreground/50">CTRL C</span>
            </button>
            <button 
              className={`w-full text-left px-4 py-2 flex items-center justify-between transition-colors ${clipboardSection ? 'hover:bg-gray-100 text-gray-800' : 'text-foreground/50 cursor-not-allowed'}`}
              onClick={() => {
                if (clipboardSection) {
                  pasteSection(sectionId);
                  setContextMenu(null);
                }
              }}
            >
              <span>Paste</span>
              <span className={`text-[10px] font-bold tracking-wider ${clipboardSection ? 'text-foreground/50' : 'text-gray-300'}`}>CTRL V</span>
            </button>
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors" 
              onClick={() => {
                duplicateSection(sectionId);
                setContextMenu(null);
              }}
            >
              Duplicate section
            </button>
            
            <div className="h-[1px] bg-gray-200 my-1.5 mx-2"></div>
            
            <div 
              className="relative"
              onMouseEnter={() => setActiveSubMenu('save')}
            >
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between">
                <span>Save section</span>
                <span className="text-foreground/50 text-lg leading-none mb-1">›</span>
              </button>
              {activeSubMenu === 'save' && (
                <div className="absolute top-0 left-full ml-1 w-48 bg-white border border-gray-200 rounded shadow-xl py-1.5 z-[110]">
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      saveSectionToAssets(sectionId, `Template from ${sectionId.split('-')[0]}`);
                      setContextMenu(null);
                    }}
                  >
                    Save as Template
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      saveSectionToAssets(sectionId, `Library Block ${Math.floor(Math.random()*100)}`);
                      setContextMenu(null);
                    }}
                  >
                    Save to Library
                  </button>
                </div>
              )}
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setActiveSubMenu('arrange')}
            >
              <button className={`w-full text-left px-4 py-2 transition-colors flex items-center justify-between ${activeSubMenu === 'arrange' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}>
                <span>Arrange</span>
                <span className="text-foreground/50 text-lg leading-none mb-1">›</span>
              </button>
              {activeSubMenu === 'arrange' && (
                <div className="absolute top-0 left-full ml-1 w-48 bg-white border border-gray-200 rounded shadow-xl py-1.5 z-[110]">
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-800"
                    onClick={() => {
                      moveSectionUp(sectionId);
                      setContextMenu(null);
                    }}
                  >
                    Move up
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      moveSectionDown(sectionId);
                      setContextMenu(null);
                    }}
                  >
                    Move down
                  </button>
                </div>
              )}
            </div>

            <div className="h-[1px] bg-gray-200 my-1.5 mx-2"></div>
            
            <button 
              className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors flex items-center justify-between text-red-600"
              onClick={() => {
                deleteSection(sectionId);
                setContextMenu(null);
              }}
            >
              <span>Delete section</span>
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="h-[1px] bg-gray-200 my-1.5 mx-2"></div>
            
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between" onClick={() => window.parent.postMessage({ type: 'CMS_ACTION', action: 'TOGGLE_GRID' }, '*')}>
              <span>Hide grid</span>
              <span className="text-[10px] font-bold tracking-wider text-foreground/50">G</span>
            </button>
          </div>
        )}
        
        {/* The Section Editor Modal */}
        {isEditorModalOpen && (
          <div 
            className="absolute top-12 right-2 w-[320px] bg-white rounded-lg shadow-2xl border border-gray-200 z-[70] flex flex-col text-sm text-gray-800"
            onClick={(e) => e.stopPropagation()} // Prevent clicking the section
          >
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200 px-4 pt-2 relative">
               <button onClick={() => setActiveTab('design')} className={`pb-3 pt-2 px-1 text-[13px] font-medium transition-colors ${activeTab === 'design' ? 'border-b-2 border-black text-black' : 'text-foreground/60 hover:text-black'}`}>Design</button>
               <button onClick={() => setActiveTab('background')} className={`pb-3 pt-2 px-1 text-[13px] font-medium transition-colors ${activeTab === 'background' ? 'border-b-2 border-black text-black' : 'text-foreground/60 hover:text-black'}`}>Background</button>
               <button onClick={() => setActiveTab('colors')} className={`pb-3 pt-2 px-1 text-[13px] font-medium transition-colors ${activeTab === 'colors' ? 'border-b-2 border-black text-black' : 'text-foreground/60 hover:text-black'}`}>Colors</button>
               <button 
                 onClick={() => setIsEditorModalOpen(false)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-foreground/50 hover:text-black transition-colors rounded hover:bg-gray-100"
               >
                 <X className="w-4 h-4" />
               </button>
            </div>
            
            <div className="p-5 max-h-[450px] overflow-y-auto overflow-x-hidden">
               {activeTab === 'design' && (
                 <div className="space-y-6">
                   {/* Grid Section */}
                   <div>
                     <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-4">Grid</h4>
                     <div className="flex items-center justify-between mb-4">
                       <span className="text-sm">Row Count</span>
                       <input type="number" value={rowCount} onChange={(e) => setRowCount(Number(e.target.value))} className="w-20 bg-gray-100 border-none rounded px-3 py-1.5 text-center text-sm outline-none focus:ring-2 focus:ring-black/5" />
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm">Gap</span>
                       <div className="flex items-center gap-1.5">
                         <button onClick={() => setGap('none')} className={`p-1.5 rounded transition-colors ${gap === 'none' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><LayoutTemplate className="w-4 h-4" /></button>
                         <button onClick={() => setGap('small')} className={`p-1.5 rounded transition-colors ${gap === 'small' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><Layers className="w-4 h-4" /></button>
                         <button onClick={() => setGap('large')} className={`p-1.5 rounded transition-colors ${gap === 'large' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><span className="font-bold tracking-widest text-[10px]">...</span></button>
                       </div>
                     </div>
                   </div>
                   
                   {/* Section */}
                   <div className="border-t border-gray-100 pt-5">
                     <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-4">Section</h4>
                     <div className="flex items-center justify-between">
                       <span className="text-sm">Fill Screen</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" checked={fillScreen} onChange={(e) => setFillScreen(e.target.checked)} />
                         <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-600"></div>
                       </label>
                     </div>
                   </div>
                   
                   {/* Styling */}
                   <div className="border-t border-gray-100 pt-5">
                     <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-4">Styling</h4>
                     <div className="flex items-center justify-between">
                       <span className="text-sm">Divider</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" checked={divider} onChange={(e) => setDivider(e.target.checked)} />
                         <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-600"></div>
                       </label>
                     </div>
                   </div>
                   
                   {/* Anchor Link */}
                   <div className="border-t border-gray-100 pt-5">
                     <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                       Anchor Link <span className="text-[10px] w-3 h-3 flex items-center justify-center font-normal border border-gray-400 text-foreground/60 rounded-full">i</span>
                     </h4>
                     <div className="relative mt-2">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 font-bold">#</span>
                       <input type="text" placeholder="Add name" value={anchorLink} onChange={(e) => setAnchorLink(e.target.value)} className="w-full bg-gray-100 rounded px-3 pl-8 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/5" />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50">
                         <Copy className="w-4 h-4" />
                       </span>
                     </div>
                   </div>
                 </div>
               )}

               {activeTab === 'background' && (
                 <div className="space-y-6">
                   <div className="flex p-1 bg-gray-100 rounded">
                     <button onClick={() => setBgType('image')} className={`flex-1 py-1.5 text-[13px] font-medium transition-colors rounded ${bgType === 'image' ? 'bg-white shadow-sm' : 'text-foreground/60 hover:text-gray-700'}`}>Image</button>
                     <button onClick={() => setBgType('video')} className={`flex-1 py-1.5 text-[13px] font-medium transition-colors rounded ${bgType === 'video' ? 'bg-white shadow-sm' : 'text-foreground/60 hover:text-gray-700'}`}>Video</button>
                     <button onClick={() => setBgType('art')} className={`flex-1 py-1.5 text-[13px] font-medium transition-colors rounded ${bgType === 'art' ? 'bg-white shadow-sm' : 'text-foreground/60 hover:text-gray-700'}`}>Art</button>
                   </div>
                   
                   <div className="border border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                       <Plus className="w-5 h-5 text-black" />
                     </div>
                     <p className="text-[13px] text-gray-800">Add an Image</p>
                     <p className="text-[11px] text-foreground/60 mt-1">20 MB max</p>
                   </div>
                   
                   <div>
                     <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-3">Background Width</h4>
                     <div className="flex border border-gray-200 rounded">
                       <button onClick={() => setBgWidth('full')} className={`flex-1 py-2 text-[13px] font-medium transition-colors ${bgWidth === 'full' ? 'bg-white text-black' : 'bg-gray-50 text-foreground/60 hover:text-gray-700'}`}>Full Bleed</button>
                       <button onClick={() => setBgWidth('inset')} className={`flex-1 py-2 text-[13px] font-medium transition-colors border-l border-gray-200 ${bgWidth === 'inset' ? 'bg-white text-black' : 'bg-gray-50 text-foreground/60 hover:text-gray-700'}`}>Inset</button>
                     </div>
                   </div>
                 </div>
               )}

               {activeTab === 'colors' && (
                 <div className="space-y-5">
                   <p className="text-[13px] text-foreground/75 leading-relaxed">
                     Select a color theme for this section. To change a theme's colors, visit the <span className="underline cursor-pointer hover:text-black">Color Theme Editor</span>.
                   </p>
                   
                   <div className="space-y-2.5">
                     {[
                       { id: 'lightest-1', label: 'LIGHTEST 1', fg: 'text-black', bg: 'bg-[#fcfcfc] border-gray-200 hover:bg-gray-50' },
                       { id: 'lightest-2', label: 'LIGHTEST 2', fg: 'text-black', bg: 'bg-[#f5f5f5] border-gray-200 hover:bg-gray-200' },
                       { id: 'light-1', label: 'LIGHT 1', fg: 'text-gray-800', bg: 'bg-white border-gray-200 hover:bg-gray-50' },
                       { id: 'light-2', label: 'LIGHT 2', fg: 'text-gray-800', bg: 'bg-white border-gray-200 hover:bg-gray-50' },
                       { id: 'bright-1', label: 'BRIGHT 1', fg: 'text-white', bg: 'bg-black border-black hover:bg-gray-900' },
                       { id: 'bright-2', label: 'BRIGHT 2', fg: 'text-black', bg: 'bg-[#e0e0e0] border-gray-300 hover:bg-[#d5d5d5]' },
                     ].map((theme) => (
                       <button 
                         key={theme.id}
                         onClick={() => setColorTheme(theme.id)}
                         className={`w-full flex items-center justify-between px-5 py-3.5 rounded transition-all border ${theme.bg} ${theme.id === colorTheme ? 'ring-2 ring-black ring-offset-2' : ''}`}
                       >
                         <span className={`text-[17px] font-serif tracking-tight ${theme.fg}`}>Aa</span>
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.fg}`}>{theme.label}</span>
                         <span className="w-4 flex items-center justify-end">
                           {theme.id === colorTheme && <Pencil className={`w-3.5 h-3.5 ${theme.fg}`} />}
                         </span>
                       </button>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        )}
        
        <AddSectionModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          afterId={sectionId} 
        />

        <SectionCustomizerModal
          isOpen={isCustomizerModalOpen}
          onClose={() => setIsCustomizerModalOpen(false)}
          sectionId={sectionId}
        />
        {children}

        {/* Bottom Center ADD SECTION */}
        {showControls && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-[60]">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsAddModalOpen(true);
              }} 
              className="bg-[#007bff] hover:bg-blue-600 text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl transition-all cursor-pointer hover:scale-105 border-2 border-white"
            >
              + Add Section Below
            </button>
          </div>
        )}
      </div>
    </SectionContext.Provider>
  );
}
