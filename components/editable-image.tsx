"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useCmsStore } from '@/lib/cms-store';
import { Image as ImageIcon, Upload, Search, X, Check, Loader2, RotateCcw, Pencil } from 'lucide-react';

const PEXELS_API_KEY = "rlsWw1ShtUgqMyZbszm2VElVkwj02iZWkgDtqej9i3O77fbkpeSPXUfU";

interface PexelsPhoto {
  id: number;
  alt: string;
  src: { medium: string; large: string };
}

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageId: string;
  defaultSrc: string;
}

export default function EditableImage({ imageId, defaultSrc, className = '', ...props }: EditableImageProps) {
  const { isEditMode, activeImageId, setActiveImageId, imageOverrides, setImageOverride, saveImageToAssets, savedAssets } = useCmsStore();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'library' | 'upload' | 'pexels'>('library');
  const [pexelsQuery, setPexelsQuery] = useState('');
  const [pexelsResults, setPexelsResults] = useState<PexelsPhoto[]>([]);
  const [pexelsLoading, setPexelsLoading] = useState(false);
  const [insertedId, setInsertedId] = useState<number | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = isEditMode && activeImageId === imageId;
  const currentSrc = imageOverrides[imageId] || defaultSrc;
  const imageAssets = savedAssets.filter(a => a.type === 'Image' && a.url);

  // Close picker and context menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (pickerRef.current && !pickerRef.current.contains(target)) {
        setShowPicker(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close context menu on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setContextMenu(null); setShowPicker(false); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleRightClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveImageId(imageId);
    setContextMenu({ x: e.clientX, y: e.clientY });
    setShowPicker(false);
  };

  const openPicker = (tab: 'library' | 'upload' | 'pexels') => {
    setPickerTab(tab);
    setShowPicker(true);
    setContextMenu(null);
    if (tab === 'upload') {
      setTimeout(() => fileInputRef.current?.click(), 100);
    }
  };

  const applyImage = (url: string) => {
    setImageOverride(imageId, url);
    setShowPicker(false);
    setContextMenu(null);
    setActiveImageId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      applyImage(dataUrl);
      saveImageToAssets(dataUrl, file.name.replace(/\.[^.]+$/, ''));
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePexelsSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pexelsQuery.trim()) return;
    setPexelsLoading(true);
    setPexelsResults([]);
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(pexelsQuery)}&per_page=20&orientation=landscape`,
        { headers: { Authorization: PEXELS_API_KEY } }
      );
      const data = await res.json();
      setPexelsResults(data.photos || []);
    } catch {}
    setPexelsLoading(false);
  }, [pexelsQuery]);

  const handlePexelsInsert = (photo: PexelsPhoto) => {
    applyImage(photo.src.large);
    saveImageToAssets(photo.src.large, photo.alt || `Pexels ${photo.id}`);
    setInsertedId(photo.id);
    setTimeout(() => setInsertedId(null), 2000);
  };

  if (!isEditMode) {
    return (
      <img src={currentSrc} className={className} {...props} />
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block w-full h-full group/img`}>
      <img
        src={currentSrc}
        className={`${className} cursor-context-menu transition-all ${isActive ? 'ring-4 ring-blue-500 rounded-lg' : 'group-hover/img:brightness-90'}`}
        onContextMenu={handleRightClick}
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setActiveImageId(imageId); }}
        {...props}
      />

      {/* Edit hint on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
          <Pencil className="w-3 h-3" /> Right-click to edit
        </div>
      </div>

      {isActive && (
        <div className="absolute top-1 right-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md z-50 pointer-events-none">
          Selected
        </div>
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Right-click context menu */}
      {contextMenu && typeof document !== 'undefined' && createPortal((
        <div
          ref={contextMenuRef}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-2xl py-1.5 w-52 text-[13px] text-gray-800 font-medium"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          {/* Image preview header */}
          <div className="px-3 pb-2 mb-1 border-b border-gray-100">
            <img src={currentSrc} alt="" className="w-full h-20 object-cover rounded-lg mb-1.5" />
            <p className="text-[10px] text-gray-400 font-medium truncate">Image</p>
          </div>

          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2.5 transition-colors" onClick={() => openPicker('library')}>
            <ImageIcon className="w-3.5 h-3.5 text-[#007bff]" />
            Replace from Library
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2.5 transition-colors" onClick={() => openPicker('pexels')}>
            <Search className="w-3.5 h-3.5 text-purple-500" />
            Search Pexels Photos
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2.5 transition-colors" onClick={() => openPicker('upload')}>
            <Upload className="w-3.5 h-3.5 text-green-500" />
            Upload from Device
          </button>

          {imageOverrides[imageId] && (
            <>
              <div className="h-px bg-gray-100 my-1 mx-2" />
              <button
                className="w-full text-left px-3 py-2 hover:bg-orange-50 flex items-center gap-2.5 transition-colors text-orange-600"
                onClick={() => { setImageOverride(imageId, defaultSrc); setContextMenu(null); }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to original
              </button>
            </>
          )}

          <div className="h-px bg-gray-100 my-1 mx-2" />
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2.5 transition-colors text-gray-500" onClick={() => setContextMenu(null)}>
            <X className="w-3.5 h-3.5" />
            Close
          </button>
        </div>
      ), document.body)}

      {/* Image Picker Modal */}
      {showPicker && typeof document !== 'undefined' && createPortal((
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowPicker(false)}>
          <div ref={pickerRef} className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Replace Image</h3>
              <button onClick={() => setShowPicker(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-5">
              {([['library', 'Library'], ['pexels', 'Pexels Search'], ['upload', 'Upload']] as const).map(([id, label]) => (
                <button key={id} onClick={() => { setPickerTab(id); if (id === 'upload') fileInputRef.current?.click(); }}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${pickerTab === id ? 'border-[#007bff] text-[#007bff]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >{label}</button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {/* Library Tab */}
              {pickerTab === 'library' && (
                imageAssets.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-bold mb-1">No saved images</p>
                    <p className="text-xs">Upload images or search Pexels to build your library.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {imageAssets.map((asset, i) => (
                      <button key={`${asset.id}-${i}`} onClick={() => asset.url && applyImage(asset.url)}
                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-[#007bff] group/asset transition-all"
                      >
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/asset:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">Use this</span>
                        </div>
                        <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] px-1 py-0.5 truncate">{asset.name}</p>
                      </button>
                    ))}
                  </div>
                )
              )}

              {/* Pexels Tab */}
              {pickerTab === 'pexels' && (
                <div className="space-y-3">
                  <form onSubmit={handlePexelsSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text" value={pexelsQuery} onChange={e => setPexelsQuery(e.target.value)}
                        placeholder="Search Pexels photos..."
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                        autoFocus
                      />
                    </div>
                    <button type="submit" disabled={pexelsLoading || !pexelsQuery.trim()}
                      className="px-4 py-2 bg-[#007bff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                    >
                      {pexelsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                  </form>

                  {pexelsResults.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {pexelsResults.map(photo => (
                        <button key={photo.id} onClick={() => handlePexelsInsert(photo)}
                          className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-[#007bff] group/photo transition-all"
                        >
                          <img src={photo.src.medium} alt={photo.alt} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                            {insertedId === photo.id
                              ? <Check className="w-5 h-5 text-green-400" />
                              : <span className="text-white text-[10px] font-bold">Use this</span>
                            }
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {!pexelsLoading && pexelsResults.length === 0 && (
                    <div className="py-8 text-center text-gray-400">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">Search for free stock photos from Pexels</p>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Tab */}
              {pickerTab === 'upload' && (
                <div
                  className="py-12 text-center border-2 border-dashed border-gray-300 rounded-xl hover:border-[#007bff] hover:bg-blue-50 cursor-pointer transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-bold text-gray-600 mb-1">Click to upload an image</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP supported</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  );
}
