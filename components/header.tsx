"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import { useCart } from "./cart-context";
import { useCmsStore } from "@/lib/cms-store";
import { getProducts, Product } from "@/lib/db-simulation";
import MegaMenu from "./mega-menu";
import { 
  Search, 
  X, 
  MapPin, 
  Sparkles, 
  Moon, 
  Sun, 
  ShoppingCart, 
  User, 
  Grid, 
  ChevronDown, 
  Flame, 
  CreditCard,
  Pencil,
  GraduationCap,
  Wrench,
  Star,
  Zap,
  Heart,
  Shield,
  Info,
  SunDim,
  MoonStar,
  Lightbulb,
  Monitor,
  ShoppingBag,
  ShoppingBasket,
  Package,
  UserCircle
} from "lucide-react";

const availableIcons = {
  User: User,
  UserCircle: UserCircle,
  GraduationCap: GraduationCap,
  Wrench: Wrench,
  Flame: Flame,
  CreditCard: CreditCard,
  Star: Star,
  Zap: Zap,
  Heart: Heart,
  Shield: Shield,
  Info: Info,
  Sun: Sun,
  Moon: Moon,
  SunDim: SunDim,
  MoonStar: MoonStar,
  Lightbulb: Lightbulb,
  Monitor: Monitor,
  ShoppingCart: ShoppingCart,
  ShoppingBag: ShoppingBag,
  ShoppingBasket: ShoppingBasket,
  Package: Package,
  None: () => null
};

const EditorHighlight = ({ 
  children, 
  label, 
  isEditorActive,
  isActiveSection,
  hasActiveSection,
  onSelect,
  onEdit,
  wrapperClassName = "",
  toolbarPosition = "right"
}: { 
  children: React.ReactNode;
  label: string;
  isEditorActive: boolean;
  isActiveSection?: boolean;
  hasActiveSection?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  wrapperClassName?: string;
  toolbarPosition?: "left" | "right" | "bottom";
}) => {
  if (!isEditorActive) return <>{children}</>;
  
  return (
    <div className={`relative group/highlight flex-shrink-0 ${wrapperClassName}`}>
      {children}
      <div 
        className={`absolute -inset-1.5 z-[105] cursor-pointer transition-all ${
          isActiveSection 
            ? 'pointer-events-auto border-2 border-[#007bff]' 
            : hasActiveSection
              ? 'pointer-events-none border-2 border-transparent'
              : 'pointer-events-auto border-2 border-transparent group-hover/highlight:border-[#007bff]'
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect?.();
        }}
      >
        <div className={`absolute -top-[22px] left-[-2px] bg-[#007bff] text-white text-[9px] font-bold px-1.5 py-0.5 pointer-events-none transition-opacity whitespace-nowrap uppercase rounded-sm shadow-sm ${
          isActiveSection 
            ? 'opacity-100' 
            : hasActiveSection
              ? 'opacity-0'
              : 'opacity-0 group-hover/highlight:opacity-100'
        }`}>
          {label}
        </div>
        
        {/* Editor Toolbar */}
        {isActiveSection && (
          <div 
            className={`absolute bg-white rounded-lg shadow-xl border border-gray-200 flex items-center p-1 gap-1 z-[120] ${
              toolbarPosition === 'right' ? 'top-1/2 -translate-y-1/2 -right-14' : 
              toolbarPosition === 'left' ? 'top-1/2 -translate-y-1/2 -left-14' : 
              'left-1/2 -translate-x-1/2 -bottom-14'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
             <button 
               className="p-2 hover:bg-gray-100 rounded text-gray-700 transition-colors group/btn relative"
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 onEdit?.();
               }}
             >
                <Pencil className="w-4 h-4" />
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                  Edit {label}
                </div>
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const loadCustomerSession = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customer_session");
      if (saved) {
        setCustomer(JSON.parse(saved));
      } else {
        setCustomer(null);
      }
    }
  };

  useEffect(() => {
    loadCustomerSession();

    // Listen to localstorage updates to refresh login state across routing
    window.addEventListener("storage", loadCustomerSession);
    return () => window.removeEventListener("storage", loadCustomerSession);
  }, []);

  // CMS Edit Mode Listener
  const [isVisualEditor, setIsVisualEditor] = useState(false);
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  const [siteTitle, setSiteTitle] = useState("Mobile Store");
  const [logoHeight, setLogoHeight] = useState(32);
  const [mobileLogoHeight, setMobileLogoHeight] = useState(30);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search for "Alienware series", "iPad 8", "Sony"...');
  const [searchDesign, setSearchDesign] = useState<'pill' | 'rectangle' | 'underline'>('pill');
  const [searchSize, setSearchSize] = useState(100);
  
  const [liveChatText, setLiveChatText] = useState("24/7 Live Chat");
  const [liveChatShape, setLiveChatShape] = useState<'pill' | 'rounded' | 'square'>('pill');
  const [liveChatSize, setLiveChatSize] = useState<'sm' | 'md' | 'lg'>('sm');
  const [liveChatLink, setLiveChatLink] = useState('');

  const [navItems, setNavItems] = useState([
    { id: '1', label: "Laptop", link: "/category/laptop", categoryKey: "laptop" },
    { id: '2', label: "Apple", link: "/category/apple", categoryKey: "apple" },
    { id: '3', label: "Smart Phone", link: "/category/smartphone", categoryKey: "smartphone" },
    { id: '4', label: "Tablet", link: "/category/tablet", categoryKey: "tablet" },
    { id: '5', label: "PC Components", link: "/category/pc-components", categoryKey: "pc-components" },
    { id: '6', label: "Monitor", link: "/category/monitor", categoryKey: "monitor" },
    { id: '7', label: "Projector", link: "/category/projector", categoryKey: "projector" },
    { id: '8', label: "Earbuds", link: "/category/earbuds", categoryKey: "earbuds" },
  ]);
  const [navFontSize, setNavFontSize] = useState<'sm' | 'base' | 'lg'>('sm');
  const [navSpacing, setNavSpacing] = useState(6);

  const [quickLinks, setQuickLinks] = useState([
    { id: '1', label: "Mobile Training", link: "/training", color: "#10b981", icon: "GraduationCap" },
    { id: '2', label: "Repair Services", link: "/repair", color: "#3b82f6", icon: "Wrench" },
    { id: '3', label: "Stock Clearance", link: "/category/all?clearance=true", color: "#f97316", icon: "Flame" },
    { id: '4', label: "EMI Products", link: "/category/all?emi=true", color: "#a855f7", icon: "CreditCard" },
  ]);
  const [quickLinkFontSize, setQuickLinkFontSize] = useState<'xs' | 'sm' | 'base'>('xs');

  const [themeIconSize, setThemeIconSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [themeLightIcon, setThemeLightIcon] = useState('Sun');
  const [themeDarkIcon, setThemeDarkIcon] = useState('Moon');

  const [cartIconSize, setCartIconSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [cartIcon, setCartIcon] = useState('ShoppingCart');

  const [accountTextSize, setAccountTextSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [accountIcon, setAccountIcon] = useState('User');
  const [accountColor, setAccountColor] = useState('#007bff');

  const [headerLayout, setHeaderLayout] = useState('default');
  const [headerLinkSpacing, setHeaderLinkSpacing] = useState(1);
  const [headerElementSpacing, setHeaderElementSpacing] = useState(1.5);

  const [headerDesignTab, setHeaderDesignTab] = useState<'main' | 'dropShadow' | 'border'>('main');

  const [headerDropShadowEnabled, setHeaderDropShadowEnabled] = useState(false);
  const [headerDropShadowMode, setHeaderDropShadowMode] = useState<'soft' | 'strong'>('soft');
  const [headerDropShadowColor, setHeaderDropShadowColor] = useState('#000000');
  const [headerDropShadowSpread, setHeaderDropShadowSpread] = useState(0);
  const [headerDropShadowDistance, setHeaderDropShadowDistance] = useState(12);
  const [headerDropShadowBlur, setHeaderDropShadowBlur] = useState(12);

  const [headerBorderEnabled, setHeaderBorderEnabled] = useState(false);
  const [headerBorderColor, setHeaderBorderColor] = useState('#000000');
  const [headerBorderThickness, setHeaderBorderThickness] = useState<'S' | 'M' | 'L'>('S');
  const [headerBorderPosition, setHeaderBorderPosition] = useState<'all' | 'horizontal' | 'vertical' | 'custom'>('all');

  const [headerHeight, setHeaderHeight] = useState(2); // vw
  const [headerFixedPosition, setHeaderFixedPosition] = useState(true);

  // Keep a ref of all settings for the save handler to access latest values
  const currentSettingsRef = useRef({
    headerLayout, headerLinkSpacing, headerElementSpacing,
    headerDropShadowEnabled, headerDropShadowMode, headerDropShadowColor,
    headerDropShadowSpread, headerDropShadowDistance, headerDropShadowBlur,
    headerBorderEnabled, headerBorderColor, headerBorderThickness, headerBorderPosition,
    headerHeight, headerFixedPosition
  });

  useEffect(() => {
    currentSettingsRef.current = {
      headerLayout, headerLinkSpacing, headerElementSpacing,
      headerDropShadowEnabled, headerDropShadowMode, headerDropShadowColor,
      headerDropShadowSpread, headerDropShadowDistance, headerDropShadowBlur,
      headerBorderEnabled, headerBorderColor, headerBorderThickness, headerBorderPosition,
      headerHeight, headerFixedPosition
    };
  }, [
    headerLayout, headerLinkSpacing, headerElementSpacing,
    headerDropShadowEnabled, headerDropShadowMode, headerDropShadowColor,
    headerDropShadowSpread, headerDropShadowDistance, headerDropShadowBlur,
    headerBorderEnabled, headerBorderColor, headerBorderThickness, headerBorderPosition,
    headerHeight, headerFixedPosition
  ]);

  const loadSavedSettings = React.useCallback(() => {
    try {
      const saved = localStorage.getItem('cms_header_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.headerLayout !== undefined) setHeaderLayout(parsed.headerLayout);
        if (parsed.headerLinkSpacing !== undefined) setHeaderLinkSpacing(parsed.headerLinkSpacing);
        if (parsed.headerElementSpacing !== undefined) setHeaderElementSpacing(parsed.headerElementSpacing);
        if (parsed.headerDropShadowEnabled !== undefined) setHeaderDropShadowEnabled(parsed.headerDropShadowEnabled);
        if (parsed.headerDropShadowMode !== undefined) setHeaderDropShadowMode(parsed.headerDropShadowMode);
        if (parsed.headerDropShadowColor !== undefined) setHeaderDropShadowColor(parsed.headerDropShadowColor);
        if (parsed.headerDropShadowSpread !== undefined) setHeaderDropShadowSpread(parsed.headerDropShadowSpread);
        if (parsed.headerDropShadowDistance !== undefined) setHeaderDropShadowDistance(parsed.headerDropShadowDistance);
        if (parsed.headerDropShadowBlur !== undefined) setHeaderDropShadowBlur(parsed.headerDropShadowBlur);
        if (parsed.headerBorderEnabled !== undefined) setHeaderBorderEnabled(parsed.headerBorderEnabled);
        if (parsed.headerBorderColor !== undefined) setHeaderBorderColor(parsed.headerBorderColor);
        if (parsed.headerBorderThickness !== undefined) setHeaderBorderThickness(parsed.headerBorderThickness);
        if (parsed.headerBorderPosition !== undefined) setHeaderBorderPosition(parsed.headerBorderPosition);
        if (parsed.headerHeight !== undefined) setHeaderHeight(parsed.headerHeight);
        if (parsed.headerFixedPosition !== undefined) setHeaderFixedPosition(parsed.headerFixedPosition);
      }
    } catch (e) {
      console.error('Failed to load header settings', e);
    }
  }, []);

  // Load initially
  useEffect(() => {
    loadSavedSettings();
  }, [loadSavedSettings]);

  // Track if style changes occur during edit mode
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // send message if we are in edit mode
    if (isVisualEditor) {
      window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
    }
  }, [
    headerLayout, headerLinkSpacing, headerElementSpacing,
    headerDropShadowEnabled, headerDropShadowMode, headerDropShadowColor, 
    headerDropShadowSpread, headerDropShadowDistance, headerDropShadowBlur,
    headerBorderEnabled, headerBorderColor, headerBorderThickness, headerBorderPosition,
    headerHeight, headerFixedPosition
  ]);

  const headerRef = useRef<HTMLElement>(null);
  
  const setActiveEditorId = useCmsStore((state) => state.setActiveEditorId);
  const setIsEditMode = useCmsStore((state) => state.setIsEditMode);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CMS_EDIT_MODE') {
        setIsVisualEditor(event.data.isEditMode);
        setIsEditMode(event.data.isEditMode); // Sync iframe store
        if (!event.data.isEditMode) {
          setIsEditorActive(false);
          setActiveSection(null);
          setEditingSection(null);
          setActiveEditorId(null);
        }
      } else if (event.data?.type === 'CMS_SAVE_CHANGES') {
        localStorage.setItem('cms_header_settings', JSON.stringify(currentSettingsRef.current));
      } else if (event.data?.type === 'CMS_DISCARD_CHANGES') {
        loadSavedSettings();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setActiveEditorId, setIsEditMode, loadSavedSettings]);

  // Click outside to deselect header in visual editor
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isEditorActive && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsEditorActive(false);
        setActiveSection(null);
        setEditingSection(null);
        setActiveEditorId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditorActive, setActiveEditorId]);

  // Search logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const allProducts = getProducts();
      const filtered = allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Click outside search & profile dismisses dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  // Compute Header Styles
  const headerStyles: React.CSSProperties = {};
  
  if (headerDropShadowEnabled) {
    let color = headerDropShadowColor;
    if (headerDropShadowMode === 'soft') {
      color = headerDropShadowColor + '40'; // 25% opacity
    } else {
      color = headerDropShadowColor + '80'; // 50% opacity
    }
    headerStyles.boxShadow = `0px ${headerDropShadowDistance}px ${headerDropShadowBlur}px ${headerDropShadowSpread}px ${color}`;
  }

  if (headerBorderEnabled) {
    const borderWidth = headerBorderThickness === 'S' ? '1px' : headerBorderThickness === 'M' ? '2px' : '4px';
    const borderStyle = `${borderWidth} solid ${headerBorderColor}`;
    
    if (headerBorderPosition === 'all') {
      headerStyles.border = borderStyle;
    } else if (headerBorderPosition === 'horizontal') {
      headerStyles.borderTop = borderStyle;
      headerStyles.borderBottom = borderStyle;
    } else if (headerBorderPosition === 'vertical') {
      headerStyles.borderLeft = borderStyle;
      headerStyles.borderRight = borderStyle;
    } else if (headerBorderPosition === 'custom') {
      headerStyles.borderBottom = borderStyle;
    }
  }

  headerStyles.paddingTop = `${headerHeight}vw`;
  headerStyles.paddingBottom = `${headerHeight}vw`;

  return (
    <header 
      ref={headerRef} 
      style={headerStyles}
      className={`w-full flex flex-col z-40 bg-card-bg ${headerFixedPosition ? 'sticky top-0' : 'relative'} ${!headerBorderEnabled ? 'border-b border-card-border' : ''} ${isVisualEditor ? 'group relative' : ''}`}
    >
      
      {/* CMS Visual Editor Overlay */}
      {isVisualEditor && (
        <div 
          className={`absolute inset-0 z-[100] transition-all ${isEditorActive ? 'border-2 border-[#007bff] pointer-events-auto' : 'pointer-events-auto border-2 border-transparent hover:border-primary/80 hover:bg-black/10'}`}
          onClick={() => {
            if (!isEditorActive) {
              setIsEditorActive(true);
              setActiveEditorId('header');
            }
            setActiveSection(null);
            setEditingSection(null);
            // we can still send the message when clicking the header or button
            window.parent.postMessage({ type: 'CMS_EDIT_HEADER' }, '*');
          }}
        >
          {/* Inactive Hover State - Center Button */}
          {!isEditorActive && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
              <button 
                className="pointer-events-none bg-white text-black font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded shadow-xl border border-gray-200 flex items-center gap-2"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Site Header
              </button>
            </div>
          )}

          {/* Active State - Bottom Right Design Button */}
          {isEditorActive && (
            <div className="absolute top-full right-4 mt-2 z-[110]">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingSection("HEADER_DESIGN");
                }}
                className="pointer-events-auto bg-white text-black font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded shadow-2xl border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Design
              </button>

              {/* Design Popup */}
              {editingSection === "HEADER_DESIGN" && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                  {headerDesignTab === 'main' && (
                    <>
                      <div className="flex border-b border-gray-200">
                        <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Design</button>
                        <button className="px-4 py-3 text-xs font-bold text-gray-500 hover:text-black">Color</button>
                      </div>
                      <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Layout</label>
                          <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center">
                            <select 
                               value={headerLayout}
                               onChange={(e) => setHeaderLayout(e.target.value)}
                               className="bg-[#2a2a2a] text-white text-xs font-bold rounded px-3 py-2 outline-none w-full flex items-center justify-between"
                            >
                               <option value="default">LOGO ... [SEARCH] ... ACTIONS</option>
                               <option value="centered-logo">[SEARCH] ... LOGO ... ACTIONS</option>
                               <option value="actions-left">ACTIONS ... [SEARCH] ... LOGO</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Spacing</label>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">Link Spacing</span>
                              <span className="text-xs text-gray-500">{headerLinkSpacing}vw</span>
                            </div>
                            <input 
                              type="range" min="0" max="5" step="0.25" 
                              value={headerLinkSpacing} onChange={e => setHeaderLinkSpacing(parseFloat(e.target.value))}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">Element Spacing</span>
                              <span className="text-xs text-gray-500">{headerElementSpacing}vw</span>
                            </div>
                            <input 
                              type="range" min="0" max="5" step="0.25" 
                              value={headerElementSpacing} onChange={e => setHeaderElementSpacing(parseFloat(e.target.value))}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                            />
                          </div>
                        </div>

                        {/* Effects & Size */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Effects</label>
                          <div className="space-y-1">
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded transition-colors"
                              onClick={() => setHeaderDesignTab('dropShadow')}
                            >
                              <span className="text-sm">Drop shadow</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                            </div>
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded transition-colors"
                              onClick={() => setHeaderDesignTab('border')}
                            >
                              <span className="text-sm">Border</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm">Fixed position</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={headerFixedPosition} onChange={e => setHeaderFixedPosition(e.target.checked)} />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Size</label>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Height</span>
                              <span className="text-sm">{headerHeight}vw</span>
                            </div>
                            <input 
                              type="range" min="0" max="10" step="0.5" 
                              value={headerHeight} onChange={e => setHeaderHeight(parseFloat(e.target.value))}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {headerDesignTab === 'dropShadow' && (
                    <>
                      <div className="flex items-center gap-2 p-3 border-b border-gray-200">
                        <button onClick={() => setHeaderDesignTab('main')} className="p-1 hover:bg-gray-100 rounded">
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <span className="text-sm font-semibold flex-1 text-center pr-6">Drop shadow</span>
                      </div>
                      <div className="p-4 space-y-6">
                        <div className="flex bg-gray-100 p-1 rounded border border-gray-200">
                          <button 
                            className={`flex-1 py-1 text-xs font-semibold rounded ${headerDropShadowMode === 'soft' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                            onClick={() => { setHeaderDropShadowMode('soft'); setHeaderDropShadowEnabled(true); }}
                          >
                            Soft
                          </button>
                          <button 
                            className={`flex-1 py-1 text-xs font-semibold rounded ${headerDropShadowMode === 'strong' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                            onClick={() => { setHeaderDropShadowMode('strong'); setHeaderDropShadowEnabled(true); }}
                          >
                            Strong
                          </button>
                          <button className="px-2 text-gray-400 hover:text-black">
                            ...
                          </button>
                        </div>
                        
                        <div className="space-y-6 pt-2">
                          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <span className="text-sm">Color</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={headerDropShadowColor} 
                                onChange={e => { setHeaderDropShadowColor(e.target.value); setHeaderDropShadowEnabled(true); }}
                                className="w-6 h-6 rounded-full border border-gray-300 p-0 overflow-hidden cursor-pointer" 
                              />
                            </div>
                          </div>

                          <div className="space-y-2 border-b border-gray-100 pb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Spread</span>
                              <span className="text-sm">{headerDropShadowSpread}px</span>
                            </div>
                            <input 
                              type="range" min="-50" max="50" 
                              value={headerDropShadowSpread} onChange={e => { setHeaderDropShadowSpread(parseInt(e.target.value)); setHeaderDropShadowEnabled(true); }}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                            />
                          </div>

                          <div className="space-y-2 border-b border-gray-100 pb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Distance</span>
                              <span className="text-sm">{headerDropShadowDistance}px</span>
                            </div>
                            <input 
                              type="range" min="0" max="100" 
                              value={headerDropShadowDistance} onChange={e => { setHeaderDropShadowDistance(parseInt(e.target.value)); setHeaderDropShadowEnabled(true); }}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                            />
                          </div>

                          <div className="space-y-2 pb-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Blur</span>
                              <span className="text-sm">{headerDropShadowBlur}px</span>
                            </div>
                            <input 
                              type="range" min="0" max="100" 
                              value={headerDropShadowBlur} onChange={e => { setHeaderDropShadowBlur(parseInt(e.target.value)); setHeaderDropShadowEnabled(true); }}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {headerDesignTab === 'border' && (
                    <>
                      <div className="flex items-center gap-2 p-3 border-b border-gray-200">
                        <button onClick={() => setHeaderDesignTab('main')} className="p-1 hover:bg-gray-100 rounded">
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <span className="text-sm font-semibold flex-1 text-center pr-6">Border</span>
                      </div>
                      <div className="p-4 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                          <span className="text-sm">Color</span>
                          <input 
                            type="color" 
                            value={headerBorderColor} 
                            onChange={e => { setHeaderBorderColor(e.target.value); setHeaderBorderEnabled(true); }}
                            className="w-6 h-6 rounded-full border border-gray-300 p-0 overflow-hidden cursor-pointer" 
                          />
                        </div>

                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                          <span className="text-sm w-20">Thickness</span>
                          <div className="flex bg-gray-100 rounded border border-gray-200 flex-1">
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${headerBorderThickness === 'S' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`} onClick={() => { setHeaderBorderThickness('S'); setHeaderBorderEnabled(true); }}>S</button>
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${headerBorderThickness === 'M' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`} onClick={() => { setHeaderBorderThickness('M'); setHeaderBorderEnabled(true); }}>M</button>
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${headerBorderThickness === 'L' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`} onClick={() => { setHeaderBorderThickness('L'); setHeaderBorderEnabled(true); }}>L</button>
                            <button className="px-2 text-gray-400">...</button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                          <span className="text-sm w-20">Position</span>
                          <div className="flex gap-1 flex-1 justify-between">
                            <button className={`p-1.5 rounded border ${headerBorderPosition === 'all' ? 'bg-gray-200 border-gray-300' : 'border-transparent hover:bg-gray-100'}`} onClick={() => { setHeaderBorderPosition('all'); setHeaderBorderEnabled(true); }}>
                              <div className="w-4 h-4 border-2 border-black" />
                            </button>
                            <button className={`p-1.5 rounded border ${headerBorderPosition === 'horizontal' ? 'bg-gray-200 border-gray-300' : 'border-transparent hover:bg-gray-100'}`} onClick={() => { setHeaderBorderPosition('horizontal'); setHeaderBorderEnabled(true); }}>
                              <div className="w-4 h-4 border-t-2 border-b-2 border-black" />
                            </button>
                            <button className={`p-1.5 rounded border ${headerBorderPosition === 'vertical' ? 'bg-gray-200 border-gray-300' : 'border-transparent hover:bg-gray-100'}`} onClick={() => { setHeaderBorderPosition('vertical'); setHeaderBorderEnabled(true); }}>
                              <div className="w-4 h-4 border-l-2 border-r-2 border-black border-dashed" />
                            </button>
                            <button className={`p-1.5 rounded border ${headerBorderPosition === 'custom' ? 'bg-gray-200 border-gray-300' : 'border-transparent hover:bg-gray-100'}`} onClick={() => { setHeaderBorderPosition('custom'); setHeaderBorderEnabled(true); }}>
                              <div className="w-4 h-4 border-2 border-black border-dashed" />
                            </button>
                          </div>
                        </div>

                        <div className="pt-4 text-center">
                          <button 
                            onClick={() => setHeaderBorderEnabled(false)}
                            className="text-xs font-bold tracking-widest text-black hover:text-gray-600 uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 1. Announcement Bar */}
      <EditorHighlight 
        label="ANNOUNCEMENT BAR" 
        isEditorActive={isEditorActive} 
        isActiveSection={activeSection === "ANNOUNCEMENT BAR"}
        hasActiveSection={activeSection !== null}
        onSelect={() => setActiveSection("ANNOUNCEMENT BAR")}
        wrapperClassName="w-full"
      >
      <div className="w-full bg-gradient-to-r from-primary to-primary-hover text-white text-[11px] font-medium py-2 px-6 flex items-center justify-between">
        <span className="mx-auto flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" /> Shrawan Sale is LIVE! Massive Discounts on Premium Gear
        </span>
        <div className="hidden md:flex items-center gap-1 hover:underline text-[11px] cursor-pointer" onClick={() => router.push("/#locations")}>
          <MapPin className="w-3 h-3" /> <span>Find our store</span>
        </div>
      </div>
      </EditorHighlight>

      {/* 2. Main Header (Logo, Search, Right actions) */}
      <div className="w-full bg-card-bg">
        <div 
          className="max-w-7xl mx-auto w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between"
          style={{ gap: `${headerElementSpacing}vw` }}
        >
          
          {/* Logo */}
          <div className={`flex items-center shrink-0 ${
            headerLayout === 'centered-logo' ? 'order-2 mx-auto' : 
            headerLayout === 'actions-left' ? 'order-3 ml-auto' : 'order-1'
          }`}>
            <EditorHighlight 
              label="SITE TITLE & LOGO" 
              isEditorActive={isEditorActive}
              isActiveSection={activeSection === "SITE TITLE & LOGO"}
              hasActiveSection={activeSection !== null}
              onSelect={() => setActiveSection("SITE TITLE & LOGO")}
              onEdit={() => setEditingSection("SITE TITLE & LOGO")}
            >
            <Link href="/" className="flex items-center gap-2 group" onClick={e => isEditorActive && e.preventDefault()}>
              {logoImage ? (
                <img 
                  src={logoImage} 
                  alt="Site Logo" 
                  style={{ width: logoHeight, height: logoHeight, objectFit: 'contain' }} 
                />
              ) : (
                <div 
                  style={{ width: logoHeight, height: logoHeight }}
                  className="rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:rotate-12 transition-all duration-300 flex-shrink-0"
                >
                  M
                </div>
              )}
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase whitespace-nowrap">
                {siteTitle}
              </span>
            </Link>
            </EditorHighlight>

            {/* Edit Popup for Site Title & Logo */}
            {editingSection === "SITE TITLE & LOGO" && (
              <div className="absolute top-full left-0 mt-4 w-72 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Content</button>
                </div>
                <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Site Title</label>
                    <input 
                      type="text" 
                      value={siteTitle} 
                      onChange={e => setSiteTitle(e.target.value)}
                      className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Logo Image</label>
                    <div 
                      className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:bg-gray-50'}`}
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
                      onDrop={e => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => setLogoImage(event.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => setLogoImage(event.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      
                      {logoImage ? (
                         <div className="w-full flex flex-col items-center">
                           <img src={logoImage} className="max-h-24 object-contain mb-2" alt="Uploaded Logo" />
                           <button 
                             className="text-[10px] text-red-500 hover:underline z-10"
                             onClick={(e) => { e.stopPropagation(); setLogoImage(null); }}
                           >
                             Remove image
                           </button>
                         </div>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                            <span className="text-xl leading-none">+</span>
                          </div>
                          <span className="text-xs font-medium text-gray-800">Add logo</span>
                          <span className="text-[10px] text-gray-400">20 MB max</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-medium text-gray-800">Logo Height</label>
                       <span className="text-xs text-gray-500">{logoHeight}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={logoHeight} 
                      onChange={e => setLogoHeight(parseInt(e.target.value))}
                      className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-medium text-gray-800">Mobile Logo Max Height</label>
                       <span className="text-xs text-gray-500">{mobileLogoHeight}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={mobileLogoHeight} 
                      onChange={e => setMobileLogoHeight(parseInt(e.target.value))}
                      className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Search Bar */}
          <div className={`w-full md:flex-1 max-w-xl relative ${
            headerLayout === 'centered-logo' ? 'order-1 mr-auto' :
            headerLayout === 'actions-left' ? 'order-2 mx-auto' : 'order-2 mx-auto'
          }`}>
            <EditorHighlight 
              label="SEARCH" 
              isEditorActive={isEditorActive} 
              isActiveSection={activeSection === "SEARCH"}
              hasActiveSection={activeSection !== null}
              onSelect={() => setActiveSection("SEARCH")}
              onEdit={() => setEditingSection("SEARCH")}
              wrapperClassName="w-full flex justify-center"
              toolbarPosition="bottom"
            >
            <div className="relative transition-all duration-300" style={{ width: `${searchSize}%` }} ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  className={`w-full py-2.5 outline-none transition-all ${
                    searchDesign === 'pill' ? 'px-4 pl-10 rounded-full border border-card-border focus:border-primary focus:ring-1 focus:ring-primary/20 bg-card-bg text-sm' :
                    searchDesign === 'rectangle' ? 'px-4 pl-10 rounded-md border border-card-border focus:border-primary focus:ring-1 focus:ring-primary/20 bg-card-bg text-sm' :
                    'border-b-2 border-transparent border-b-card-border rounded-none focus:border-b-primary bg-transparent px-0 pl-8 text-sm'
                  }`}
                />
                <span className={`absolute top-1/2 -translate-y-1/2 text-foreground/45 ${searchDesign === 'underline' ? 'left-1' : 'left-3.5'}`}>
                  <Search className="w-4 h-4" />
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

            {/* Search Result Popup Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-card-bg border border-card-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-200">
                <div className="text-[10px] uppercase font-bold text-foreground/40 px-3 py-1">Matching Products</div>
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    onClick={() => setShowSearchResults(false)}
                    className="flex items-center gap-3 p-2 hover:bg-card-bg hover:bg-white/10 rounded-xl transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-card-border relative flex-shrink-0 bg-card-bg">
                      <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate text-foreground">{p.title}</div>
                      <div className="text-xs text-foreground/60">{p.brand} &middot; {p.category}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-primary">Rs. {p.price.toLocaleString()}</div>
                      {p.discount > 0 && (
                        <div className="text-[10px] text-secondary font-medium">{p.discount}% OFF</div>
                      )}
                    </div>
                  </Link>
                ))}
                <div className="border-t border-card-border mt-1 pt-2 pb-1 text-center">
                  <button
                    onClick={() => {
                      router.push(`/category/all?search=${encodeURIComponent(searchQuery)}`);
                      setShowSearchResults(false);
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View all results &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
          </EditorHighlight>

          {/* Edit Popup for Search */}
          {editingSection === "SEARCH" && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex border-b border-gray-200">
                <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Design</button>
              </div>
              <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Placeholder Text</label>
                  <input 
                    type="text" 
                    value={searchPlaceholder} 
                    onChange={e => setSearchPlaceholder(e.target.value)}
                    className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Layout Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setSearchDesign('pill')}
                      className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${searchDesign === 'pill' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      Pill
                    </button>
                    <button 
                      onClick={() => setSearchDesign('rectangle')}
                      className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${searchDesign === 'rectangle' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      Rectangle
                    </button>
                    <button 
                      onClick={() => setSearchDesign('underline')}
                      className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${searchDesign === 'underline' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      Underline
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Search Bar Width</label>
                     <span className="text-xs text-gray-500">{searchSize}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="100" 
                    value={searchSize} 
                    onChange={e => setSearchSize(parseInt(e.target.value))}
                    className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Right Actions (Live Chat, Theme, Cart, Profile) */}
          <div 
            className={`flex items-center ml-auto sm:ml-0 self-end sm:self-auto ${
              headerLayout === 'actions-left' ? 'order-1 mr-auto' : 'order-3'
            }`}
            style={{ gap: `${headerLinkSpacing}vw` }}
          >
            {/* Live Chat Indicator */}
            <div className="relative">
              <EditorHighlight 
                label="LIVE CHAT" 
                isEditorActive={isEditorActive}
                isActiveSection={activeSection === "LIVE CHAT"}
                hasActiveSection={activeSection !== null}
                onSelect={() => setActiveSection("LIVE CHAT")}
                onEdit={() => setEditingSection("LIVE CHAT")}
                toolbarPosition="bottom"
              >
              <div 
                onClick={() => {
                  if (liveChatLink && !isEditorActive) {
                    if (liveChatLink.startsWith('http')) window.open(liveChatLink, '_blank');
                    else router.push(liveChatLink);
                  }
                }}
                className={`hidden lg:flex items-center gap-2 bg-card-bg border border-card-border hover:bg-black/5 hover:bg-white/10 transition-all cursor-pointer ${
                  liveChatShape === 'pill' ? 'rounded-full' : liveChatShape === 'rounded' ? 'rounded-md' : 'rounded-none'
                } ${
                  liveChatSize === 'sm' ? 'px-3.5 py-1.5' : liveChatSize === 'md' ? 'px-4 py-2' : 'px-5 py-2.5'
                }`}
              >
                <span className={`relative flex ${liveChatSize === 'sm' ? 'h-2 w-2' : liveChatSize === 'md' ? 'h-2.5 w-2.5' : 'h-3 w-3'}`}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-accent-green"></span>
                </span>
                <span className={`font-semibold text-foreground/80 ${liveChatSize === 'sm' ? 'text-xs' : liveChatSize === 'md' ? 'text-sm' : 'text-base'}`}>
                  {liveChatText}
                </span>
              </div>
              </EditorHighlight>

              {/* Edit Popup for Live Chat */}
              {editingSection === "LIVE CHAT" && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="flex border-b border-gray-200">
                    <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Design & Content</button>
                  </div>
                  <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Button Text</label>
                      <input 
                        type="text" 
                        value={liveChatText} 
                        onChange={e => setLiveChatText(e.target.value)}
                        className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Redirect Link</label>
                      <input 
                        type="text" 
                        value={liveChatLink}
                        placeholder="/support or https://example.com"
                        onChange={e => setLiveChatLink(e.target.value)}
                        className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Button Shape</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setLiveChatShape('pill')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatShape === 'pill' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Pill
                        </button>
                        <button 
                          onClick={() => setLiveChatShape('rounded')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatShape === 'rounded' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Rounded
                        </button>
                        <button 
                          onClick={() => setLiveChatShape('square')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatShape === 'square' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Square
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Button Size</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setLiveChatSize('sm')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatSize === 'sm' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Small
                        </button>
                        <button 
                          onClick={() => setLiveChatSize('md')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatSize === 'md' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Medium
                        </button>
                        <button 
                          onClick={() => setLiveChatSize('lg')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatSize === 'lg' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Large
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>



          {/* Theme Switcher Toggle */}
          <div className="relative">
            <EditorHighlight 
              label="THEME" 
              isEditorActive={isEditorActive}
              isActiveSection={activeSection === "THEME"}
              hasActiveSection={activeSection !== null}
              onSelect={() => setActiveSection("THEME")}
              onEdit={() => setEditingSection("THEME")}
              toolbarPosition="bottom"
            >
            <button
              onClick={toggleTheme}
              className={`rounded-full hover:bg-black/5 hover:bg-white/10 border border-card-border text-foreground transition-all flex items-center justify-center ${
                themeIconSize === 'sm' ? 'p-2' : themeIconSize === 'lg' ? 'p-3' : 'p-2.5'
              }`}
              title="Toggle theme"
            >
              {(() => {
                const IconName = theme === 'light' ? themeDarkIcon : themeLightIcon;
                const ActiveIcon = availableIcons[IconName as keyof typeof availableIcons] || availableIcons.Sun;
                const iconClass = themeIconSize === 'sm' ? 'w-3.5 h-3.5' : themeIconSize === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
                return <ActiveIcon className={iconClass} />;
              })()}
            </button>
            </EditorHighlight>
            
            {/* Edit Popup for Theme */}
            {editingSection === "THEME" && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Theme Design</button>
                </div>
                <div className="p-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Light Mode Icon</label>
                    <select
                      value={themeLightIcon}
                      onChange={(e) => setThemeLightIcon(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-2 outline-none focus:border-black"
                    >
                      <option value="Sun">Sun</option>
                      <option value="SunDim">Sun Dim</option>
                      <option value="Lightbulb">Lightbulb</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Star">Star</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Dark Mode Icon</label>
                    <select
                      value={themeDarkIcon}
                      onChange={(e) => setThemeDarkIcon(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-2 outline-none focus:border-black"
                    >
                      <option value="Moon">Moon</option>
                      <option value="MoonStar">Moon & Star</option>
                      <option value="Lightbulb">Lightbulb</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Star">Star</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Button Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setThemeIconSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${themeIconSize === 'sm' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setThemeIconSize('md')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${themeIconSize === 'md' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setThemeIconSize('lg')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${themeIconSize === 'lg' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon with badge */}
          <div className="relative">
            <EditorHighlight 
              label="CART" 
              isEditorActive={isEditorActive}
              isActiveSection={activeSection === "CART"}
              hasActiveSection={activeSection !== null}
              onSelect={() => setActiveSection("CART")}
              onEdit={() => setEditingSection("CART")}
              toolbarPosition="bottom"
            >
            <button
              onClick={() => setIsCartOpen(true)}
              className={`rounded-full hover:bg-black/5 hover:bg-white/10 border border-card-border relative transition-all flex items-center justify-center text-foreground ${
                cartIconSize === 'sm' ? 'p-2' : cartIconSize === 'lg' ? 'p-3' : 'p-2.5'
              }`}
            >
              {(() => {
                const ActiveIcon = availableIcons[cartIcon as keyof typeof availableIcons] || availableIcons.ShoppingCart;
                const iconClass = cartIconSize === 'sm' ? 'w-3.5 h-3.5' : cartIconSize === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
                return <ActiveIcon className={iconClass} />;
              })()}
              {cartCount > 0 && (
                <span className={`absolute bg-secondary text-white font-extrabold rounded-full flex items-center justify-center border-2 border-card-bg shadow-sm animate-bounce ${
                  cartIconSize === 'sm' ? '-top-1 -right-1 text-[9px] w-4 h-4' : 
                  cartIconSize === 'lg' ? '-top-1.5 -right-1.5 text-xs w-6 h-6' : 
                  '-top-1.5 -right-1.5 text-[10px] w-5 h-5'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>
            </EditorHighlight>

            {/* Edit Popup for Cart */}
            {editingSection === "CART" && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Cart Design</button>
                </div>
                <div className="p-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Cart Icon</label>
                    <select
                      value={cartIcon}
                      onChange={(e) => setCartIcon(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-2 outline-none focus:border-black"
                    >
                      <option value="ShoppingCart">Shopping Cart</option>
                      <option value="ShoppingBag">Shopping Bag</option>
                      <option value="ShoppingBasket">Shopping Basket</option>
                      <option value="Package">Package</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Button Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setCartIconSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${cartIconSize === 'sm' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setCartIconSize('md')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${cartIconSize === 'md' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setCartIconSize('lg')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${cartIconSize === 'lg' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Profile / Sign In Portal */}
          <div className="relative">
            <EditorHighlight 
              label="ACCOUNT" 
              isEditorActive={isEditorActive}
              isActiveSection={activeSection === "ACCOUNT"}
              hasActiveSection={activeSection !== null}
              onSelect={() => setActiveSection("ACCOUNT")}
              onEdit={() => setEditingSection("ACCOUNT")}
              toolbarPosition="bottom"
            >
            {customer ? (
              <div 
                ref={profileRef}
                className={`relative flex items-center gap-1.5 border border-card-border rounded-full bg-card-bg/50 cursor-pointer select-none font-bold transition-all ${
                  accountTextSize === 'sm' ? 'px-3 py-1.5 text-[11px]' : accountTextSize === 'lg' ? 'px-4 py-2.5 text-sm' : 'px-3.5 py-2 text-xs'
                }`}
                style={{ color: accountColor }}
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
              >
                {(() => {
                  const ActiveIcon = availableIcons[accountIcon as keyof typeof availableIcons] || availableIcons.User;
                  const iconClass = accountTextSize === 'sm' ? 'w-3 h-3' : accountTextSize === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
                  return <ActiveIcon className={iconClass} style={{ color: accountColor }} />;
                })()}
                <span className="truncate max-w-[80px]">Hi, {customer.name.split(" ")[0]}</span>
                <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                
                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-card-bg border border-card-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-200 text-foreground">
                    <Link
                      href="/account"
                      className="block px-3 py-2 hover:bg-black/5 hover:bg-white/10 rounded-xl transition-all font-semibold text-xs mb-0.5"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      👤 My Account
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent re-toggling on container click
                        localStorage.removeItem("customer_session");
                        setCustomer(null);
                        setIsProfileDropdownOpen(false);
                        router.push("/");
                        window.dispatchEvent(new Event("storage"));
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-xl transition-all font-extrabold text-xs cursor-pointer block border-none outline-none"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`hidden sm:flex items-center gap-1.5 border border-card-border rounded-full hover:bg-card-bg hover:bg-white/10 font-bold transition-all ${
                  accountTextSize === 'sm' ? 'px-3 py-1.5 text-[11px]' : accountTextSize === 'lg' ? 'px-4 py-2.5 text-sm' : 'px-3.5 py-2 text-xs'
                }`}
                style={{ color: accountColor }}
                onClick={(e) => isEditorActive && e.preventDefault()}
              >
                {(() => {
                  const ActiveIcon = availableIcons[accountIcon as keyof typeof availableIcons] || availableIcons.User;
                  const iconClass = accountTextSize === 'sm' ? 'w-3 h-3' : accountTextSize === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
                  return <ActiveIcon className={iconClass} style={{ color: accountColor }} />;
                })()} 
                Sign In
              </Link>
            )}
            </EditorHighlight>

            {/* Edit Popup for Account */}
            {editingSection === "ACCOUNT" && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Account Design</button>
                </div>
                <div className="p-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Account Icon</label>
                    <select
                      value={accountIcon}
                      onChange={(e) => setAccountIcon(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-2 outline-none focus:border-black"
                    >
                      <option value="User">User Default</option>
                      <option value="UserCircle">User Circle</option>
                      <option value="Star">Star</option>
                      <option value="Heart">Heart</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Text & Icon Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={accountColor}
                        onChange={(e) => setAccountColor(e.target.value)}
                        className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                      />
                      <span className="text-xs text-gray-500">{accountColor}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setAccountTextSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${accountTextSize === 'sm' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setAccountTextSize('md')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${accountTextSize === 'md' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setAccountTextSize('lg')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${accountTextSize === 'lg' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* 3. Category & Navigation Menu */}
      <div className="w-full bg-card-bg dark:bg-slate-950 border-t border-card-border py-1">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between gap-4 font-semibold">
          {/* Main Category Links */}
          <div className="relative flex-1 max-w-[65%]">
            <EditorHighlight 
              label="NAVIGATION" 
              isEditorActive={isEditorActive} 
              isActiveSection={activeSection === "NAVIGATION"}
              hasActiveSection={activeSection !== null}
              onSelect={() => setActiveSection("NAVIGATION")}
              onEdit={() => setEditingSection("NAVIGATION")}
              wrapperClassName="w-full"
              toolbarPosition="bottom"
            >
            <div className={`flex items-center overflow-x-auto no-scrollbar py-2 w-full ${
              navFontSize === 'sm' ? 'text-sm' : navFontSize === 'base' ? 'text-base' : 'text-lg'
            }`} style={{ gap: `${navSpacing * 0.25}rem` }}>
              {/* Mega Dropdown Hover Activation */}
              <div 
                className="relative py-1 cursor-pointer text-primary hover:text-primary-hover flex items-center gap-1.5 flex-shrink-0"
                onMouseEnter={() => setHoveredCategory("laptop")} // Default mega menu anchor
                onClick={(e) => {
                  if (isEditorActive) { e.preventDefault(); return; }
                  router.push("/category/all");
                  setHoveredCategory(null);
                }}
              >
                <Grid className="w-4 h-4" /> All Categories <ChevronDown className="w-3.5 h-3.5" />
              </div>

              {navItems.map((item) => (
                <div
                  key={item.id}
                  className={`py-1 cursor-pointer transition-colors relative flex-shrink-0 ${
                    pathname.includes(item.link) && item.link !== '/'
                      ? "text-primary border-b-2 border-primary"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                  onMouseEnter={() => item.categoryKey ? setHoveredCategory(item.categoryKey) : setHoveredCategory(null)}
                  onClick={(e) => {
                    if (isEditorActive) { e.preventDefault(); return; }
                    router.push(item.link);
                    setHoveredCategory(null);
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
            </EditorHighlight>

            {/* Edit Popup for Navigation */}
            {editingSection === "NAVIGATION" && (
              <div className="absolute top-full left-0 mt-4 w-96 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Links & Design</button>
                </div>
                <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Navigation Links</label>
                      <button 
                        onClick={() => setNavItems([...navItems, { id: Math.random().toString(), label: 'New Link', link: '/', categoryKey: '' }])}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        + Add Link
                      </button>
                    </div>
                    <div className="space-y-2">
                      {navItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                          <div className="flex flex-col gap-2 flex-1">
                            <input 
                              type="text" 
                              value={item.label}
                              placeholder="Label"
                              onChange={(e) => {
                                const newItems = [...navItems];
                                newItems[index].label = e.target.value;
                                setNavItems(newItems);
                              }}
                              className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
                            />
                            <input 
                              type="text" 
                              value={item.link}
                              placeholder="URL (e.g. /about)"
                              onChange={(e) => {
                                const newItems = [...navItems];
                                newItems[index].link = e.target.value;
                                setNavItems(newItems);
                              }}
                              className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const newItems = navItems.filter((_, i) => i !== index);
                              setNavItems(newItems);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Text Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setNavFontSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${navFontSize === 'sm' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setNavFontSize('base')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${navFontSize === 'base' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setNavFontSize('lg')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${navFontSize === 'lg' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Large
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Item Spacing</label>
                       <span className="text-xs text-gray-500">{navSpacing}</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="12" 
                      value={navSpacing} 
                      onChange={e => setNavSpacing(parseInt(e.target.value))}
                      className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clearance & EMI & Services Quick Links */}
          <div className="relative">
            <EditorHighlight 
              label="QUICK LINKS" 
              isEditorActive={isEditorActive}
              isActiveSection={activeSection === "QUICK LINKS"}
              hasActiveSection={activeSection !== null}
              onSelect={() => setActiveSection("QUICK LINKS")}
              onEdit={() => setEditingSection("QUICK LINKS")}
              toolbarPosition="left"
            >
            <div className="hidden xl:flex items-center gap-3">
              {quickLinks.map(link => {
                const Icon = availableIcons[link.icon as keyof typeof availableIcons] || availableIcons.None;
                return (
                  <div
                    key={link.id}
                    onClick={(e) => {
                      if (isEditorActive) { e.preventDefault(); return; }
                      router.push(link.link);
                    }}
                    className={`px-3 py-1 cursor-pointer font-bold rounded-lg border flex items-center gap-1 transition-all ${
                      quickLinkFontSize === 'xs' ? 'text-[11px]' : quickLinkFontSize === 'sm' ? 'text-xs' : 'text-sm'
                    }`}
                    style={{
                      color: link.color,
                      backgroundColor: link.color + '15',
                      borderColor: link.color + '40'
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </div>
                );
              })}
            </div>
            </EditorHighlight>

            {/* Edit Popup for Quick Links */}
            {editingSection === "QUICK LINKS" && (
              <div className="absolute top-full right-0 mt-4 w-96 bg-white border border-gray-200 shadow-2xl rounded-lg z-[200] text-black font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Quick Links & Design</button>
                </div>
                <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Links</label>
                      <button 
                        onClick={() => setQuickLinks([...quickLinks, { id: Math.random().toString(), label: 'New Link', link: '/', color: '#000000', icon: 'Star' }])}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        + Add Link
                      </button>
                    </div>
                    <div className="space-y-2">
                      {quickLinks.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={item.label}
                                placeholder="Label"
                                onChange={(e) => {
                                  const newItems = [...quickLinks];
                                  newItems[index].label = e.target.value;
                                  setQuickLinks(newItems);
                                }}
                                className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
                              />
                              <input
                                type="color"
                                value={item.color}
                                onChange={(e) => {
                                  const newItems = [...quickLinks];
                                  newItems[index].color = e.target.value;
                                  setQuickLinks(newItems);
                                }}
                                className="w-8 h-6 p-0 border-0 rounded cursor-pointer"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={item.link}
                                placeholder="URL"
                                onChange={(e) => {
                                  const newItems = [...quickLinks];
                                  newItems[index].link = e.target.value;
                                  setQuickLinks(newItems);
                                }}
                                className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
                              />
                              <select
                                value={item.icon}
                                onChange={(e) => {
                                  const newItems = [...quickLinks];
                                  newItems[index].icon = e.target.value;
                                  setQuickLinks(newItems);
                                }}
                                className="w-24 text-xs bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
                              >
                                {Object.keys(availableIcons).map(iconName => (
                                  <option key={iconName} value={iconName}>{iconName}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const newItems = quickLinks.filter((_, i) => i !== index);
                              setQuickLinks(newItems);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Text Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setQuickLinkFontSize('xs')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${quickLinkFontSize === 'xs' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setQuickLinkFontSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${quickLinkFontSize === 'sm' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setQuickLinkFontSize('base')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${quickLinkFontSize === 'base' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Hover MegaMenu */}
      {hoveredCategory && (
        <MegaMenu
          initialCategory={hoveredCategory}
          onClose={() => setHoveredCategory(null)}
        />
      )}
    </header>
  );
}
