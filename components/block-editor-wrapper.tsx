"use client";

import React, { useState, useContext, useRef, useEffect } from 'react';
import { useCmsStore } from "@/lib/cms-store";
import { SectionContext } from "@/lib/section-context";
import { 
  Sparkles, 
  ChevronDown, 
  Bold, 
  Italic, 
  Type, 
  Highlighter, 
  Link as LinkIcon, 
  AlignLeft, 
  Quote, 
  List, 
  ListOrdered, 
  Strikethrough, 
  Indent, 
  Outdent, 
  RemoveFormatting,
  Check
} from "lucide-react";

export default function BlockEditorWrapper({ 
  children, 
  blockType 
}: { 
  children: React.ReactNode, 
  blockType: 'TEXT' | 'IMAGE' | 'BUTTON' | 'FORM' | 'GALLERY' | string 
}) {
  const isEditMode = useCmsStore(state => state.isEditMode);
  const { isActive: isSectionActive } = useContext(SectionContext);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  // Pos and Size
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: number | 'auto', height: number | 'auto' }>({ width: 'auto', height: 'auto' });
  
  // Text Toolbar State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [textStyle, setTextStyle] = useState('Heading 1');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef<string | null>(null);
  const savedRange = useRef<Range | null>(null);
  const dragStartInfo = useRef({ startX: 0, startY: 0, initialPosX: 0, initialPosY: 0, initialWidth: 0, initialHeight: 0 });

  // Only enable block editing if the parent section is currently being edited
  const isBlockEditable = isEditMode && isSectionActive;

  useEffect(() => {
    // If we leave edit mode or section becomes inactive, deselect
    if (!isBlockEditable) {
      setIsSelected(false);
      setIsHovered(false);
    }
  }, [isBlockEditable]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
      setIsDropdownOpen(false);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && wrapperRef.current) {
        const dx = e.clientX - dragStartInfo.current.startX;
        const dy = e.clientY - dragStartInfo.current.startY;
        const newX = dragStartInfo.current.initialPosX + dx;
        const newY = dragStartInfo.current.initialPosY + dy;
        wrapperRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      } else if (isResizing.current && wrapperRef.current) {
        const dx = e.clientX - dragStartInfo.current.startX;
        const dy = e.clientY - dragStartInfo.current.startY;
        
        const { initialWidth, initialHeight, initialPosX, initialPosY } = dragStartInfo.current;
        let newWidth = initialWidth as number;
        let newHeight = initialHeight as number;
        let newX = initialPosX;
        let newY = initialPosY;

        if (isResizing.current.includes('e')) newWidth = initialWidth + dx;
        if (isResizing.current.includes('w')) {
          newWidth = initialWidth - dx;
          newX = initialPosX + dx;
        }
        if (isResizing.current.includes('s')) newHeight = initialHeight + dy;
        if (isResizing.current.includes('n')) {
          newHeight = initialHeight - dy;
          newY = initialPosY + dy;
        }

        // prevent negative sizes
        if (newWidth < 20) newWidth = 20;
        if (newHeight < 20) newHeight = 20;

        wrapperRef.current.style.width = `${newWidth}px`;
        wrapperRef.current.style.height = `${newHeight}px`;
        wrapperRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging.current || isResizing.current) {
        // Sync the final DOM values back to React state
        if (wrapperRef.current) {
          const transform = wrapperRef.current.style.transform;
          const match = transform.match(/translate\(([^p]+)px,\s*([^p]+)px\)/);
          if (match) {
            setPos({ x: parseFloat(match[1]), y: parseFloat(match[2]) });
          }
          
          if (wrapperRef.current.style.width && wrapperRef.current.style.width !== 'auto') {
            setSize(prev => ({ ...prev, width: parseFloat(wrapperRef.current!.style.width) }));
          }
          if (wrapperRef.current.style.height && wrapperRef.current.style.height !== 'auto') {
            setSize(prev => ({ ...prev, height: parseFloat(wrapperRef.current!.style.height) }));
          }
        }
        window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
      }
      isDragging.current = false;
      isResizing.current = null;
    };

    if (isSelected && isBlockEditable) {
      document.addEventListener('mousedown', handleGlobalClick);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelected, isBlockEditable]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isBlockEditable) return;
    e.stopPropagation();
    
    // If it's a text block and already selected, don't start dragging so they can edit the text
    if (isSelected && blockType === 'TEXT') {
      return;
    }

    setIsSelected(true);
    setIsDropdownOpen(false);
    
    // Start drag
    isDragging.current = true;
    dragStartInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: pos.x,
      initialPosY: pos.y,
      initialWidth: wrapperRef.current?.offsetWidth || 0,
      initialHeight: wrapperRef.current?.offsetHeight || 0,
    };
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    isResizing.current = direction;
    dragStartInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: pos.x,
      initialPosY: pos.y,
      initialWidth: wrapperRef.current?.offsetWidth || 0,
      initialHeight: wrapperRef.current?.offsetHeight || 0,
    };
  };

  // Only show the outline if selected OR (hovered and not currently dragging/resizing anything else? just hovered is fine)
  const showOutline = isBlockEditable && (isHovered || isSelected);

  // Resize handles
  const renderHandles = () => {
    if (!isSelected || !isBlockEditable) return null;
    const handleClass = "absolute w-2 h-2 bg-white border border-[#007bff] z-[70]";
    return (
      <>
        {/* Corners */}
        <div className={`${handleClass} -top-1 -left-1 cursor-nwse-resize`} onMouseDown={(e) => handleResizeStart(e, 'nw')} />
        <div className={`${handleClass} -top-1 -right-1 cursor-nesw-resize`} onMouseDown={(e) => handleResizeStart(e, 'ne')} />
        <div className={`${handleClass} -bottom-1 -left-1 cursor-nesw-resize`} onMouseDown={(e) => handleResizeStart(e, 'sw')} />
        <div className={`${handleClass} -bottom-1 -right-1 cursor-nwse-resize`} onMouseDown={(e) => handleResizeStart(e, 'se')} />
        {/* Edges */}
        <div className={`${handleClass} -top-1 left-1/2 -translate-x-1/2 cursor-ns-resize`} onMouseDown={(e) => handleResizeStart(e, 'n')} />
        <div className={`${handleClass} -bottom-1 left-1/2 -translate-x-1/2 cursor-ns-resize`} onMouseDown={(e) => handleResizeStart(e, 's')} />
        <div className={`${handleClass} top-1/2 -left-1 -translate-y-1/2 cursor-ew-resize`} onMouseDown={(e) => handleResizeStart(e, 'w')} />
        <div className={`${handleClass} top-1/2 -right-1 -translate-y-1/2 cursor-ew-resize`} onMouseDown={(e) => handleResizeStart(e, 'e')} />
      </>
    );
  };

  const renderTextToolbar = () => {
    if (!isSelected || !isBlockEditable || blockType !== 'TEXT') return null;
    
    const textStyles = [
      { name: 'Heading 1', shortcut: '⌘ ⌥ 6' },
      { name: 'Heading 2', shortcut: '⌘ ⌥ 5' },
      { name: 'Heading 3', shortcut: '⌘ ⌥ 4' },
      { name: 'Heading 4', shortcut: '⌘ ⌥ 3' },
      { name: 'Paragraph 1', shortcut: '⌘ ⌥ 2' },
      { name: 'Paragraph 2', shortcut: '⌘ ⌥ 1' },
      { name: 'Paragraph 3', shortcut: '⌘ ⌥ 0' },
      { name: 'Monospace', shortcut: '⌘ ⌥ M' },
    ];
    
    return (
      <div 
        className="absolute -top-14 left-0 z-[80] bg-white rounded-lg shadow-xl border border-gray-200 flex items-center h-10 px-2 gap-1 w-max"
        style={{ cursor: 'default' }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><Sparkles className="w-4 h-4" /></button>
        <div className="w-[1px] h-5 bg-gray-200 mx-1"></div>
        
        {/* Dropdown Container */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded text-[13px] font-medium transition-colors border whitespace-nowrap ${isDropdownOpen ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-100 border-transparent text-gray-700'}`}
          >
            {textStyle} <ChevronDown className="w-3 h-3 text-foreground/60 flex-shrink-0" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl py-2 w-56 z-[90]">
              {textStyles.map((style) => (
                <button
                  key={style.name}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setTextStyle(style.name);
                    setIsDropdownOpen(false);
                    const tagMap: Record<string, string> = {
                      'Heading 1': 'H1', 'Heading 2': 'H2', 'Heading 3': 'H3', 'Heading 4': 'H4',
                      'Paragraph 1': 'P', 'Paragraph 2': 'P', 'Paragraph 3': 'P', 'Monospace': 'PRE'
                    };
                    document.execCommand('formatBlock', false, tagMap[style.name] || 'P');
                    window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4">
                      {textStyle === style.name && <Check className="w-3.5 h-3.5 text-black" />}
                    </span>
                    <span className="text-[13px] text-gray-700">{style.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-foreground/50 font-medium">
                    {style.shortcut.split(' ').map((key, i) => (
                      <span key={i} className="bg-gray-100 px-1 py-0.5 rounded border border-gray-200">{key}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-[1px] h-5 bg-gray-200 mx-1"></div>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-black font-bold transition-colors"><Bold className="w-4 h-4" /></button>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 font-serif italic transition-colors"><Italic className="w-4 h-4" /></button>
        <label className="p-1.5 hover:bg-gray-100 rounded flex items-center justify-center transition-colors cursor-pointer relative overflow-hidden">
          <input 
            type="color" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onMouseDown={(e) => {
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                savedRange.current = sel.getRangeAt(0);
              }
            }}
            onChange={(e) => {
              contentEditableRef.current?.focus();
              if (savedRange.current) {
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(savedRange.current);
              }
              document.execCommand('foreColor', false, e.target.value);
              window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
            }}
          />
          <div className="w-3.5 h-3.5 bg-black rounded-full pointer-events-none"></div>
        </label>
        <button className="p-1.5 hover:bg-gray-100 rounded text-foreground/75 transition-colors"><Type className="w-4 h-4" /></button>
        <label className="p-1.5 hover:bg-gray-100 rounded flex items-center justify-center transition-colors cursor-pointer relative overflow-hidden">
          <input 
            type="color" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onMouseDown={(e) => {
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                savedRange.current = sel.getRangeAt(0);
              }
            }}
            onChange={(e) => {
              contentEditableRef.current?.focus();
              if (savedRange.current) {
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(savedRange.current);
              }
              // hiliteColor is deprecated in some browsers, backColor is standard for text background
              document.execCommand('backColor', false, e.target.value);
              window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
            }}
          />
          <Highlighter className="w-4 h-4 pointer-events-none text-foreground/50" />
        </label>
        <button onMouseDown={(e) => { e.preventDefault(); const url = prompt('Enter URL:'); if (url) { document.execCommand('createLink', false, url); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); } }} className="p-1.5 hover:bg-gray-100 rounded text-foreground/50 transition-colors"><LinkIcon className="w-4 h-4" /></button>
        <div className="w-[1px] h-5 bg-gray-200 mx-1"></div>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyLeft', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><AlignLeft className="w-4 h-4" /></button>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, 'BLOCKQUOTE'); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><Quote className="w-4 h-4" /></button>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertUnorderedList', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><List className="w-4 h-4" /></button>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertOrderedList', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><ListOrdered className="w-4 h-4" /></button>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('strikeThrough', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><Strikethrough className="w-4 h-4" /></button>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('outdent', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><Outdent className="w-4 h-4" /></button>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('indent', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><Indent className="w-4 h-4" /></button>
        <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('removeFormat', false); window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*'); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors"><RemoveFormatting className="w-4 h-4" /></button>
      </div>
    );
  };

  return (
    <div 
      ref={wrapperRef}
      className={`relative inline-block w-full ${showOutline ? 'ring-1 ring-[#007bff] z-50' : 'ring-1 ring-transparent'}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: size.width === 'auto' ? 'auto' : `${size.width}px`,
        height: size.height === 'auto' ? 'auto' : `${size.height}px`,
        cursor: isSelected ? 'move' : 'default',
        transition: isDragging.current || isResizing.current ? 'none' : 'box-shadow 0.15s ease'
      }}
      onMouseEnter={(e) => {
        if (isBlockEditable) {
          e.stopPropagation();
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (isBlockEditable) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {showOutline && (
        <div className="absolute -top-5 left-[-1px] z-[60]">
          <span className="bg-[#007bff] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
            {blockType}
          </span>
        </div>
      )}
      {renderTextToolbar()}
      {renderHandles()}
      <div 
        ref={contentEditableRef}
        contentEditable={isSelected && blockType === 'TEXT'}
        suppressContentEditableWarning={true}
        className={`w-full h-full [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 ${isSelected && blockType === 'TEXT' ? 'outline-none cursor-text' : ''}`}
        onInput={() => {
          window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
        }}
      >
        {children}
      </div>
    </div>
  );
}
