"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Search, Plus, FolderPlus, LayoutTemplate, Clock, Trash2,
  Upload, Image as ImageIcon, X, Check, Loader2, ArrowRight, Download
} from "lucide-react";
import { useCmsStore } from "@/lib/cms-store";

const PEXELS_API_KEY = "rlsWw1ShtUgqMyZbszm2VElVkwj02iZWkgDtqej9i3O77fbkpeSPXUfU";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  alt: string;
  src: {
    medium: string;
    large: string;
    original: string;
  };
}

type Tab = 'blocks' | 'images';

export default function AssetsPanel() {
  const { savedAssets, saveSectionToAssets, saveImageToAssets, removeAsset, activeImageId, setImageOverride, setActiveImageId } = useCmsStore();

  const [tab, setTab] = useState<Tab>('blocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [pexelsResults, setPexelsResults] = useState<PexelsPhoto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [insertedId, setInsertedId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError('');
    setPexelsResults([]);
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=24&orientation=landscape`,
        { headers: { Authorization: PEXELS_API_KEY } }
      );
      if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);
      const data = await res.json();
      setPexelsResults(data.photos || []);
      if (!data.photos?.length) setSearchError('No photos found. Try a different search.');
    } catch (err: any) {
      setSearchError(err.message || 'Failed to search Pexels.');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleInsert = (photo: PexelsPhoto) => {
    if (!activeImageId) {
      alert('Please double-click an image on the website first to select it, then click Insert here.');
      return;
    }
    setImageOverride(activeImageId, photo.src.large);
    setInsertedId(photo.id);
    setActiveImageId(null);
    setTimeout(() => setInsertedId(null), 2000);
  };

  const handleSaveImage = (photo: PexelsPhoto) => {
    saveImageToAssets(photo.src.large, photo.alt || `Pexels Photo ${photo.id}`);
    setSavedId(photo.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const handleSavedAssetInsert = (url: string) => {
    if (!activeImageId) {
      alert('Please double-click an image on the website first to select it, then click Insert here.');
      return;
    }
    setImageOverride(activeImageId, url);
    setActiveImageId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (activeImageId) {
        setImageOverride(activeImageId, dataUrl);
        setActiveImageId(null);
      }
      saveImageToAssets(dataUrl, file.name.replace(/\.[^.]+$/, ''));
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const blockAssets = savedAssets.filter(a => a.type === 'Section');
  const imageAssets = savedAssets.filter(a => a.type === 'Image');

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] text-gray-900">
      {/* Header */}
      <div className="p-5 pb-3 sticky top-0 bg-[#f9f9f9] z-10 border-b border-gray-100">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-3">Assets</h2>

        {/* Active image banner */}
        {activeImageId && (
          <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
            <p className="text-[11px] font-semibold text-blue-700 leading-tight">
              Image selected on page. Click <strong>Insert</strong> on any image to swap it.
            </p>
            <button onClick={() => setActiveImageId(null)} className="ml-auto text-blue-400 hover:text-blue-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-200/60 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setTab('blocks')}
            className={`flex-1 text-[12px] font-bold py-1.5 rounded-md transition-all ${tab === 'blocks' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Blocks
          </button>
          <button
            onClick={() => setTab('images')}
            className={`flex-1 text-[12px] font-bold py-1.5 rounded-md transition-all ${tab === 'images' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Images
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
        {/* ── BLOCKS TAB ── */}
        {tab === 'blocks' && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved Blocks</h3>
              <button className="p-1 hover:bg-gray-200 rounded" title="New Folder">
                <FolderPlus className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {blockAssets.length === 0 ? (
              <div className="py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <LayoutTemplate className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold mb-1">No Saved Blocks</p>
                <p className="text-[10px] px-4">Right-click a section on the website and choose Save to see it here.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {blockAssets.map((asset, i) => (
                  <li key={`${asset.id}-${i}`}
                    className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                        <LayoutTemplate className="w-4 h-4 text-[#007bff] flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{asset.name}</span>
                      </div>
                      <button 
                        onClick={() => removeAsset(asset.id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </span>
                      <button className="text-[10px] font-bold text-[#007bff] hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        Insert <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* ── IMAGES TAB ── */}
        {tab === 'images' && (
          <>
            {/* Upload button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 w-full justify-center border-2 border-dashed border-gray-300 hover:border-[#007bff] hover:bg-blue-50 text-gray-500 hover:text-[#007bff] transition-all rounded-xl py-3 text-[12px] font-bold"
              >
                <Upload className="w-4 h-4" />
                Upload from Device
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Pexels photos..."
                  className="w-full pl-8 pr-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007bff] bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-3 py-2 bg-[#007bff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </form>

            {/* Saved images */}
            {imageAssets.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Saved Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {imageAssets.map((asset, i) => (
                    <div key={`${asset.id}-${i}`} className="relative group rounded-lg overflow-hidden aspect-video bg-gray-100 border border-gray-200">
                      {asset.url && (
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                        <button
                          onClick={() => asset.url && handleSavedAssetInsert(asset.url)}
                          className="text-[10px] font-bold text-white bg-[#007bff] px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Insert
                        </button>
                        <button
                          onClick={() => removeAsset(asset.id)}
                          className="text-[10px] font-bold text-white bg-red-500/80 px-3 py-1 rounded-full hover:bg-red-600 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                      <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1.5 py-1 truncate">{asset.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {searchError && (
              <p className="text-center text-xs text-red-500 py-4">{searchError}</p>
            )}

            {/* Pexels results */}
            {pexelsResults.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Pexels Results</span>
                  <span className="normal-case font-medium">{pexelsResults.length} photos</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {pexelsResults.map(photo => (
                    <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-video bg-gray-200 cursor-pointer">
                      <img
                        src={photo.src.medium}
                        alt={photo.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                        <button
                          onClick={() => handleInsert(photo)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all w-full text-center ${insertedId === photo.id ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:bg-[#007bff] hover:text-white'}`}
                        >
                          {insertedId === photo.id ? (
                            <span className="flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Inserted!</span>
                          ) : 'Insert'}
                        </button>
                        <button
                          onClick={() => handleSaveImage(photo)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all w-full text-center ${savedId === photo.id ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                        >
                          {savedId === photo.id ? (
                            <span className="flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Saved!</span>
                          ) : 'Save to Library'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 text-center mt-2">Photos provided by Pexels</p>
              </div>
            )}

            {/* Empty state */}
            {!isSearching && pexelsResults.length === 0 && !searchError && imageAssets.length === 0 && (
              <div className="py-10 text-center text-gray-400">
                <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-xs font-bold mb-1">Search for Images</p>
                <p className="text-[10px] px-6">Use the search bar above to find free stock photos from Pexels, or upload from your device.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
