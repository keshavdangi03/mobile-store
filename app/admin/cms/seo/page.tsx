"use client";

import React, { useState } from "react";
import { Search, Globe, Image as ImageIcon, Save, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SEOPanel() {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  const [title, setTitle] = useState("Mobile Store | Premium Electronics");
  const [description, setDescription] = useState("Shop the latest smartphones, laptops, and premium accessories with exclusive discounts and 24/7 support.");

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9]">
      {/* Header */}
      <div className="p-6 pb-2 flex justify-between items-center sticky top-0 bg-[#f9f9f9] z-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">SEO</h2>
        <button 
          onClick={() => router.push("/admin/cms")} 
          className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-4 space-y-6 overflow-y-auto flex-1">
        
        {/* Intro */}
        <p className="text-xs text-gray-500 leading-relaxed px-2">
          Manage how your website appears on search engines like Google and Bing.
        </p>

        {/* Search Engine Preview */}
        <div className="bg-white rounded-lg p-4 border border-card-border shadow-sm">
          <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-3 flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Search Preview
          </p>
          <div className="space-y-1">
            <p className="text-xs text-[#1a0dab] font-medium break-all truncate">
              https://mobilestore.com
            </p>
            <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight line-clamp-1">
              {title || "Your Website Title"}
            </h3>
            <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
              {description || "Add a description to tell search engines what your website is about."}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 px-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">SEO Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="e.g. My Awesome Store"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Used in browser tabs and search results</span>
              <span>{title.length}/60</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Meta Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-black h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Describe your website..."
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Summarize your page for search engines</span>
              <span>{description.length}/160</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Social Sharing Image</label>
            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-medium">Upload Image</span>
            </div>
            <p className="text-[10px] text-gray-400">This image appears when sharing your site on Facebook, Twitter, and iMessage.</p>
          </div>
        </div>

      </div>

      {/* Footer Action */}
      <div className="p-4 bg-[#f9f9f9] border-t border-card-border sticky bottom-0">
        <button 
          onClick={handleSave}
          className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            isSaved 
              ? "bg-green-500 text-white" 
              : "bg-black text-white hover:bg-gray-800 hover:shadow-md"
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save SEO Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
