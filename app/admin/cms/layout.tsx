"use client";

import React, { useState, useEffect, useRef } from "react";
import { Monitor, Tablet, Smartphone, Play, Paintbrush, Loader2, Undo2, Redo2 } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useCmsStore } from "@/lib/cms-store";

type DeviceMode = "desktop" | "tablet" | "mobile";

export default function CMSOverlayLayout({ children }: { children: React.ReactNode }) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  
  // To track iframe URL
  const [iframeUrl, setIframeUrl] = useState("/");
  const [currentPageTitle, setCurrentPageTitle] = useState("Home");
  const [currentPageStatus, setCurrentPageStatus] = useState("Page - Published");
  
  const { isEditMode, setIsEditMode } = useCmsStore();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Listen for navigation events from the Pages panel
  useEffect(() => {
    const handleNavigate = (e: any) => {
      setIframeUrl(e.detail.url);
      setCurrentPageTitle(e.detail.title);
      setIsIframeLoading(true);
    };
    window.addEventListener('cms-navigate', handleNavigate);
    return () => window.removeEventListener('cms-navigate', handleNavigate);
  }, []);

  // Smooth resize logic based on device
  const getIframeWidth = () => {
    switch (deviceMode) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      case "desktop": return "100%";
    }
  };

  const sendEditModeToIframe = (mode: boolean) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'CMS_EDIT_MODE', isEditMode: mode }, '*');
    }
  };

  const handleEditClick = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    sendEditModeToIframe(newEditMode);
    
    if (!newEditMode && pathname !== "/admin/cms") {
       router.push("/admin/cms");
    }
  };

  // Check if a right-side panel route is active (Styles, Pages, Assets, SEO)
  const isRightPanelActive = pathname !== "/admin/cms";

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Top Toolbar overlay (Squarespace style) */}
      <div className="h-14 bg-white dark:bg-[#f3f3f3] text-black border-b border-card-border flex items-center justify-between px-4 flex-shrink-0 z-10 shadow-sm">
        
        {/* Left: Edit Button / Save Controls */}
        <div className="flex-1 flex justify-start items-center gap-4">
          {!isEditMode ? (
            <button 
              onClick={handleEditClick}
              className="px-4 py-1.5 text-xs font-bold rounded tracking-wide transition-colors bg-black text-white hover:bg-gray-800"
            >
              EDIT
            </button>
          ) : (
            <>
              <button 
                className="px-3 py-1.5 text-[10px] font-bold rounded tracking-widest transition-colors bg-gray-200 text-black hover:bg-gray-300 uppercase"
              >
                Save
              </button>
              <button 
                onClick={handleEditClick}
                className="text-[10px] font-bold tracking-widest text-black hover:text-gray-600 uppercase"
              >
                Exit
              </button>
              <div className="flex items-center gap-2 ml-2 border-l border-gray-300 pl-4">
                <button className="text-gray-400 hover:text-black transition-colors" title="Undo">
                  <Undo2 className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-black transition-colors" title="Redo">
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Center: Page Info */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-gray-900 leading-tight">{currentPageTitle}</span>
          <span className="text-[9px] font-medium text-gray-500 leading-tight">{currentPageStatus}</span>
        </div>

        {/* Right: Device & Preview Controls */}
        <div className="flex-1 flex justify-end items-center gap-1">
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
            <div className="relative group flex items-center justify-center">
              <button 
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded transition-colors ${deviceMode === "desktop" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 bg-black text-white text-[11px] font-medium px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Desktop View
              </div>
            </div>
            
            <div className="relative group flex items-center justify-center">
              <button 
                onClick={() => setDeviceMode("tablet")}
                className={`p-1.5 rounded transition-colors ${deviceMode === "tablet" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 bg-black text-white text-[11px] font-medium px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Tablet View
              </div>
            </div>
            
            <div className="relative group flex items-center justify-center">
              <button 
                onClick={() => setDeviceMode("mobile")}
                className={`p-1.5 rounded transition-colors ${deviceMode === "mobile" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 bg-black text-white text-[11px] font-medium px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Mobile View
              </div>
            </div>
          </div>
          
          <div className="relative group flex items-center justify-center">
            <button 
              onClick={() => router.push("/admin/cms/styles")}
              className={`p-1.5 transition-colors rounded ${pathname.startsWith("/admin/cms/styles") ? "text-black bg-gray-200" : "text-gray-400 hover:text-black"}`} 
            >
              <Paintbrush className="w-4 h-4" />
            </button>
            <div className="absolute top-full mt-2 bg-black text-white text-[11px] font-medium px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Site Styles
            </div>
          </div>

          <div className="relative group flex items-center justify-center">
            <button className="p-1.5 text-gray-400 hover:text-black transition-colors rounded">
              <Play className="w-4 h-4" />
            </button>
            <div className="absolute top-full mt-2 bg-black text-white text-[11px] font-medium px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Preview
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Main Iframe Canvas */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden relative">
          {/* Loading overlay for iframe */}
          {isIframeLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          <div 
            className="h-full bg-white transition-all duration-300 ease-in-out shadow-2xl relative"
            style={{ width: getIframeWidth() }}
          >
            <iframe 
              ref={iframeRef}
              src={iframeUrl}
              className="w-full h-full border-0"
              onLoad={(e) => {
                setIsIframeLoading(false);
                sendEditModeToIframe(isEditMode); // Sync state to iframe when it finishes loading
              }}
              title="Live Website Preview"
            />
          </div>
        </div>

        {/* Right Sidebar (Handles Route Panels like Site Styles, Pages, SEO) */}
        <div 
          className={`h-full bg-white dark:bg-[#f9f9f9] border-l border-card-border dark:border-gray-300 shadow-2xl transition-all duration-300 ease-in-out flex flex-col ${
            isRightPanelActive ? "w-80 translate-x-0" : "w-0 translate-x-full border-none hidden"
          }`}
        >
          {isRightPanelActive && (
            <div className="flex-1 overflow-y-auto w-full h-full text-black">
              {children}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
