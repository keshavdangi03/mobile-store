"use client";

import React, { useState, useEffect, useRef } from "react";
import { Monitor, Tablet, Smartphone, Play, Paintbrush, Loader2, Undo2, Redo2, Layers, FileText } from "lucide-react";

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
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  // Independent UI toolbar state (prevents overwriting iframe storage state)
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const dispatchToIframe = (type: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type }, '*');
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'CMS_UNSAVED_CHANGES') {
         setHasUnsavedChanges(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setHasUnsavedChanges]);

  const executeExit = () => {
    setIsEditMode(false);
    sendEditModeToIframe(false);
    setHasUnsavedChanges(false);
    if (pathname !== "/admin/cms") {
       router.push("/admin/cms");
    }
  };

  const handleEditClick = () => {
    if (isEditMode) {
      if (hasUnsavedChanges) {
        setShowSaveModal(true);
      } else {
        executeExit();
      }
    } else {
      setIsEditMode(true);
      sendEditModeToIframe(true);
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
                onClick={async () => {
                  setHasUnsavedChanges(false);
                  await useCmsStore.getState().saveToDatabase();
                  dispatchToIframe('CMS_SAVE_CHANGES');
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new Event('cms_db_synced'));
                  }
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded tracking-wider transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
                  hasUnsavedChanges
                    ? "bg-[#007bff] text-white hover:bg-blue-600 shadow-md ring-2 ring-blue-300"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Save
                {hasUnsavedChanges && (
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </button>
              <button 
                onClick={handleEditClick}
                className="text-xs font-bold tracking-wider text-black hover:text-gray-600 uppercase px-2 py-1 cursor-pointer"
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
              onClick={() => router.push("/admin/cms/pages")}
              className={`p-1.5 transition-colors rounded ${pathname.startsWith("/admin/cms/pages") ? "text-black bg-gray-200" : "text-gray-400 hover:text-black"}`} 
            >
              <FileText className="w-4 h-4" />
            </button>
            <div className="absolute top-full mt-2 bg-black text-white text-[11px] font-medium px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Pages
            </div>
          </div>

          <div className="relative group flex items-center justify-center">
            <button 
              onClick={() => router.push("/admin/cms/sections")}
              className={`p-1.5 transition-colors rounded ${pathname.startsWith("/admin/cms/sections") ? "text-black bg-gray-200" : "text-gray-400 hover:text-black"}`} 
            >
              <Layers className="w-4 h-4" />
            </button>
            <div className="absolute top-full mt-2 bg-black text-white text-[11px] font-medium px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Global Sections
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

      {/* Unsaved Changes Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-[400px] overflow-hidden text-black animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Unsaved Changes</h3>
              <p className="text-sm text-gray-600">
                You have unsaved changes. Do you want to save current changes before closing?
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowSaveModal(false);
                  dispatchToIframe('CMS_DISCARD_CHANGES');
                  executeExit();
                }}
                className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={async () => {
                  setHasUnsavedChanges(false);
                  setShowSaveModal(false);
                  await useCmsStore.getState().saveToDatabase();
                  dispatchToIframe('CMS_SAVE_CHANGES');
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new Event('cms_db_synced'));
                  }
                  executeExit();
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-lg shadow-sm transition-colors"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
