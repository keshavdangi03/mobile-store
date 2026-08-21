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
  UserCircle,
  Headphones
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
        onDoubleClick={(e) => {
          if (onEdit) {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }
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
            className={`absolute bg-card rounded-lg shadow-xl border border-gray-200 flex items-center p-1 gap-1 z-[120] ${
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
  
  const [siteTitle, setSiteTitle] = useState("Expert Mobile Solution");
  const [logoHeight, setLogoHeight] = useState(56);
  const [mobileLogoHeight, setMobileLogoHeight] = useState(48);
  const [logoImage, setLogoImage] = useState<string | null>("/logo.png");
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

  // Sync navItems with dynamic categories from localStorage
  useEffect(() => {
    const syncNavFromStorage = () => {
      try {
        const saved = localStorage.getItem("expert_mobile_categories");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].slug) {
            setNavItems(
              parsed.map((c: { slug: string; name: string }, i: number) => ({
                id: String(i + 1),
                label: c.name,
                link: `/category/${c.slug}`,
                categoryKey: c.slug,
              }))
            );
          }
        }
      } catch {
        // keep defaults on error
      }
    };
    syncNavFromStorage();
    window.addEventListener("storage", syncNavFromStorage);
    window.addEventListener("categories_updated", syncNavFromStorage);
    return () => {
      window.removeEventListener("storage", syncNavFromStorage);
      window.removeEventListener("categories_updated", syncNavFromStorage);
    };
  }, []);
  const [navFontSize, setNavFontSize] = useState<'sm' | 'base' | 'lg'>('sm');
  const [navSpacing, setNavSpacing] = useState(6);

  const [quickLinks, setQuickLinks] = useState([
    { id: '1', label: "Mobile Training", link: "/training", color: "#00AFA2", icon: "GraduationCap" },
    { id: '2', label: "Repair Services", link: "/repair", color: "#00AFA2", icon: "Wrench" },
    { id: '3', label: "Stock Clearance", link: "/category/all?clearance=true", color: "#f97316", icon: "Flame" },
    { id: '4', label: "EMI Products", link: "/category/all?emi=true", color: "#3b82f6", icon: "CreditCard" },
  ]);
  const [quickLinkFontSize, setQuickLinkFontSize] = useState<'xs' | 'sm' | 'base'>('xs');

  const [themeIconSize, setThemeIconSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [themeLightIcon, setThemeLightIcon] = useState('Sun');
  const [themeDarkIcon, setThemeDarkIcon] = useState('Moon');

  const [cartIconSize, setCartIconSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [cartIcon, setCartIcon] = useState('ShoppingCart');

  const [accountTextSize, setAccountTextSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [accountIcon, setAccountIcon] = useState('User');
  const [accountColor, setAccountColor] = useState('#00AFA2');

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

  const [announcementText, setAnnouncementText] = useState("Shrawan Sale is LIVE! Massive Discounts on Premium Gear");
  const [announcementAnimation, setAnnouncementAnimation] = useState<'pulse' | 'bounce' | 'flash' | 'none'>('pulse');
  const [announcementShow, setAnnouncementShow] = useState(true);

  // Auth modal popup states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  // Auth modal form states
  const [loginInput, setLoginInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);
  const [regIsTrader, setRegIsTrader] = useState(false);
  
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const handleModalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim() || !loginPassword.trim()) {
      setAuthError("Please fill in all fields.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    setTimeout(() => {
      if (loginInput.toLowerCase() === "admin" && loginPassword === "admin") {
        sessionStorage.setItem("admin_auth", "true");
        setAuthLoading(false);
        setIsAuthModalOpen(false);
        router.push("/admin");
        return;
      }
      if (typeof window !== "undefined") {
        const registeredUsersRaw = localStorage.getItem("zolpa_users");
        const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : [];
        const matchedUser = registeredUsers.find(
          (u: any) => u.email === loginInput || u.phone === loginInput
        );
        if (matchedUser) {
          if (matchedUser.password !== loginPassword) {
            setAuthLoading(false);
            setAuthError("Incorrect password.");
            return;
          }
          const sessionUser = {
            name: matchedUser.name,
            email: matchedUser.email,
            phone: matchedUser.phone,
            isTrader: matchedUser.isTrader,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
          };
          localStorage.setItem("customer_session", JSON.stringify(sessionUser));
          setAuthLoading(false);
          setIsAuthModalOpen(false);
          window.dispatchEvent(new Event("storage"));
          loadCustomerSession();
          return;
        } else {
          // Fallback to guest user auto-registration for quick testing
          const guestUser = {
            name: loginInput.split("@")[0] || "Customer",
            email: loginInput.includes("@") ? loginInput : "user@mobilestore.com",
            phone: !loginInput.includes("@") ? loginInput : "9800000000",
            isTrader: false,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
          };
          localStorage.setItem("customer_session", JSON.stringify(guestUser));
          setAuthLoading(false);
          setIsAuthModalOpen(false);
          window.dispatchEvent(new Event("storage"));
          loadCustomerSession();
          return;
        }
      }
    }, 1000);
  };

  const handleModalGoogleLogin = () => {
    setAuthLoading(true);
    setAuthError("");
    setTimeout(() => {
      const mockGoogleUser = {
        name: "Google Guest User",
        email: "google.guest@gmail.com",
        phone: "+977-9800000000",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
      };
      localStorage.setItem("customer_session", JSON.stringify(mockGoogleUser));
      setAuthLoading(false);
      setIsAuthModalOpen(false);
      window.dispatchEvent(new Event("storage"));
      loadCustomerSession();
    }, 800);
  };

  const handleModalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setAuthError("Please fill in all required fields.");
      return;
    }
    if (regPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    if (!regAgreeTerms) {
      setAuthError("You must agree to the Terms & Conditions.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");
    setTimeout(() => {
      const newUser = {
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        isTrader: regIsTrader
      };
      if (typeof window !== "undefined") {
        const existingUsersRaw = localStorage.getItem("zolpa_users");
        const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
        const userExists = existingUsers.some((u: any) => u.email === regEmail || u.phone === regPhone);
        if (userExists) {
          setAuthLoading(false);
          setAuthError("An account with this email or phone number already exists.");
          return;
        }
        existingUsers.push(newUser);
        localStorage.setItem("zolpa_users", JSON.stringify(existingUsers));
      }
      setAuthLoading(false);
      setAuthSuccess("Account created successfully!");
      // Clear register fields
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegAgreeTerms(false);
      setRegIsTrader(false);
      setTimeout(() => {
        setAuthSuccess("");
        setAuthModalMode('login');
      }, 1000);
    }, 1000);
  };

  // Keep a ref of all settings for the save handler to access latest values
  const currentSettingsRef = useRef({
    headerLayout, headerLinkSpacing, headerElementSpacing,
    headerDropShadowEnabled, headerDropShadowMode, headerDropShadowColor,
    headerDropShadowSpread, headerDropShadowDistance, headerDropShadowBlur,
    headerBorderEnabled, headerBorderColor, headerBorderThickness, headerBorderPosition,
    headerHeight, headerFixedPosition,
    announcementText, announcementAnimation, announcementShow
  });

  useEffect(() => {
    currentSettingsRef.current = {
      headerLayout, headerLinkSpacing, headerElementSpacing,
      headerDropShadowEnabled, headerDropShadowMode, headerDropShadowColor,
      headerDropShadowSpread, headerDropShadowDistance, headerDropShadowBlur,
      headerBorderEnabled, headerBorderColor, headerBorderThickness, headerBorderPosition,
      headerHeight, headerFixedPosition,
      announcementText, announcementAnimation, announcementShow
    };
  }, [
    headerLayout, headerLinkSpacing, headerElementSpacing,
    headerDropShadowEnabled, headerDropShadowMode, headerDropShadowColor,
    headerDropShadowSpread, headerDropShadowDistance, headerDropShadowBlur,
    headerBorderEnabled, headerBorderColor, headerBorderThickness, headerBorderPosition,
    headerHeight, headerFixedPosition,
    announcementText, announcementAnimation, announcementShow
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
        if (parsed.announcementText !== undefined) setAnnouncementText(parsed.announcementText);
        if (parsed.announcementAnimation !== undefined) setAnnouncementAnimation(parsed.announcementAnimation);
        if (parsed.announcementShow !== undefined) setAnnouncementShow(parsed.announcementShow);
      }
    } catch (e) {
      console.error('Failed to load header settings', e);
    }
  }, []);

  // Load initially
  useEffect(() => {
    loadSavedSettings();
  }, [loadSavedSettings]);

  // Sync cross-tab
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cms_header_settings') {
        loadSavedSettings();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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
    headerHeight, headerFixedPosition,
    announcementText, announcementAnimation, announcementShow
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
                className="pointer-events-none bg-card text-foreground font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded shadow-xl border border-gray-200 flex items-center gap-2"
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
                className="pointer-events-auto bg-card text-foreground font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded shadow-2xl border border-gray-200 flex items-center gap-2 hover:bg-background transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Design
              </button>

              {/* Design Popup */}
              {editingSection === "HEADER_DESIGN" && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                  {headerDesignTab === 'main' && (
                    <>
                      <div className="flex border-b border-gray-200">
                        <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Design</button>
                        <button className="px-4 py-3 text-xs font-bold text-foreground/60 hover:text-foreground">Color</button>
                      </div>
                      <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Layout</label>
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
                          <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Spacing</label>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">Link Spacing</span>
                              <span className="text-xs text-foreground/60">{headerLinkSpacing}vw</span>
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
                              <span className="text-xs text-foreground/60">{headerElementSpacing}vw</span>
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
                          <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Effects</label>
                          <div className="space-y-1">
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-background px-2 -mx-2 rounded transition-colors"
                              onClick={() => setHeaderDesignTab('dropShadow')}
                            >
                              <span className="text-sm">Drop shadow</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 text-foreground/50" />
                            </div>
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-background px-2 -mx-2 rounded transition-colors"
                              onClick={() => setHeaderDesignTab('border')}
                            >
                              <span className="text-sm">Border</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 text-foreground/50" />
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm">Fixed position</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={headerFixedPosition} onChange={e => setHeaderFixedPosition(e.target.checked)} />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Size</label>
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
                            className={`flex-1 py-1 text-xs font-semibold rounded ${headerDropShadowMode === 'soft' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`}
                            onClick={() => { setHeaderDropShadowMode('soft'); setHeaderDropShadowEnabled(true); }}
                          >
                            Soft
                          </button>
                          <button 
                            className={`flex-1 py-1 text-xs font-semibold rounded ${headerDropShadowMode === 'strong' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`}
                            onClick={() => { setHeaderDropShadowMode('strong'); setHeaderDropShadowEnabled(true); }}
                          >
                            Strong
                          </button>
                          <button className="px-2 text-foreground/50 hover:text-foreground">
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
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${headerBorderThickness === 'S' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setHeaderBorderThickness('S'); setHeaderBorderEnabled(true); }}>S</button>
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${headerBorderThickness === 'M' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setHeaderBorderThickness('M'); setHeaderBorderEnabled(true); }}>M</button>
                            <button className={`flex-1 py-1 text-xs font-semibold rounded ${headerBorderThickness === 'L' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/60'}`} onClick={() => { setHeaderBorderThickness('L'); setHeaderBorderEnabled(true); }}>L</button>
                            <button className="px-2 text-foreground/50">...</button>
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
                            className="text-xs font-bold tracking-widest text-foreground hover:text-foreground/75 uppercase"
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
      {announcementShow && (
        <EditorHighlight 
          label="ANNOUNCEMENT BAR" 
          isEditorActive={isEditorActive} 
          isActiveSection={activeSection === "ANNOUNCEMENT BAR"}
          hasActiveSection={activeSection !== null}
          onSelect={() => setActiveSection("ANNOUNCEMENT BAR")}
          onEdit={() => setEditingSection("ANNOUNCEMENT BAR")}
          wrapperClassName="w-full relative"
          toolbarPosition="bottom"
        >
        <div 
          className="w-full bg-primary text-[#0d1e1c] text-[11px] font-extrabold py-2 px-6 flex items-center justify-between shadow-sm"
        >
          <span className={`mx-auto flex items-center gap-1.5 ${
            announcementAnimation === 'pulse' ? 'animate-pulse' : 
            announcementAnimation === 'bounce' ? 'animate-bounce' : 
            announcementAnimation === 'flash' ? 'animate-[pulse_0.5s_cubic-bezier(0.4,0,0.6,1)_infinite]' : ''
          }`}>
            <Sparkles className="w-3.5 h-3.5" /> {announcementText}
          </span>
          <div className="hidden md:flex items-center gap-1 hover:underline text-[11px] cursor-pointer" onClick={() => router.push("/#locations")}>
            <MapPin className="w-3.5 h-3.5" /> <span>Find our store</span>
          </div>
        </div>
        
        {/* Edit Popup for Announcement Bar */}
        {editingSection === "ANNOUNCEMENT BAR" && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex border-b border-gray-200">
              <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Content & Animation</button>
            </div>
            <div className="p-4 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Text</label>
                <input 
                  type="text" 
                  value={announcementText} 
                  onChange={e => setAnnouncementText(e.target.value)}
                  className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Animation Effect</label>
                <select
                  value={announcementAnimation}
                  onChange={e => setAnnouncementAnimation(e.target.value as any)}
                  className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-black transition-colors"
                >
                  <option value="none">None</option>
                  <option value="pulse">Pulse</option>
                  <option value="flash">Flash</option>
                  <option value="bounce">Bounce</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Show Bar</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={announcementShow} onChange={e => setAnnouncementShow(e.target.checked)} />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
                </label>
              </div>
            </div>
          </div>
        )}
        </EditorHighlight>
      )}

      {/* 2. Main Header (Logo, Search, Right actions) */}
      <div className="w-full bg-card-bg" style={{ paddingTop: `${headerHeight}vw`, paddingBottom: `${headerHeight}vw` }}>
        <div 
          className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between"
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
                  className="rounded-full bg-primary flex items-center justify-center text-[#0d1e1c] font-black text-lg shadow-md group-hover:rotate-12 transition-all duration-300 flex-shrink-0"
                >
                  E
                </div>
              )}
              <span className="text-xl font-black tracking-tight text-foreground uppercase whitespace-nowrap group-hover:text-primary transition-colors">
                {siteTitle}
              </span>
            </Link>
            </EditorHighlight>

            {/* Edit Popup for Site Title & Logo */}
            {editingSection === "SITE TITLE & LOGO" && (
              <div className="absolute top-full left-0 mt-4 w-72 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Content</button>
                </div>
                <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Site Title</label>
                    <input 
                      type="text" 
                      value={siteTitle} 
                      onChange={e => setSiteTitle(e.target.value)}
                      className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Logo Image</label>
                    <div 
                      className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${isDragging ? 'border-black bg-background' : 'border-gray-300 hover:bg-background'}`}
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
                          <span className="text-xs font-medium text-foreground">Add logo</span>
                          <span className="text-[10px] text-foreground/50">20 MB max</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-medium text-foreground">Logo Height</label>
                       <span className="text-xs text-foreground/60">{logoHeight}px</span>
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
                       <label className="text-xs font-medium text-foreground">Mobile Logo Max Height</label>
                       <span className="text-xs text-foreground/60">{mobileLogoHeight}px</span>
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
                    className="flex items-center gap-3 p-2 hover:bg-card-bg hover:bg-card/10 rounded-xl transition-all"
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
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex border-b border-gray-200">
                <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Design</button>
              </div>
              <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Placeholder Text</label>
                  <input 
                    type="text" 
                    value={searchPlaceholder} 
                    onChange={e => setSearchPlaceholder(e.target.value)}
                    className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Layout Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setSearchDesign('pill')}
                      className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${searchDesign === 'pill' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      Pill
                    </button>
                    <button 
                      onClick={() => setSearchDesign('rectangle')}
                      className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${searchDesign === 'rectangle' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      Rectangle
                    </button>
                    <button 
                      onClick={() => setSearchDesign('underline')}
                      className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${searchDesign === 'underline' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      Underline
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Search Bar Width</label>
                     <span className="text-xs text-foreground/60">{searchSize}%</span>
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
                className={`hidden lg:flex items-center gap-2 bg-card-bg border border-card-border hover:bg-black/5 hover:bg-card/10 transition-all cursor-pointer ${
                  liveChatShape === 'pill' ? 'rounded-full' : liveChatShape === 'rounded' ? 'rounded-md' : 'rounded-none'
                } ${
                  liveChatSize === 'sm' ? 'px-3.5 py-1.5' : liveChatSize === 'md' ? 'px-4 py-2' : 'px-5 py-2.5'
                }`}
              >
                <Headphones className="w-4 h-4 text-foreground/75" />
                <span className={`font-semibold text-foreground/80 ${liveChatSize === 'sm' ? 'text-xs' : liveChatSize === 'md' ? 'text-sm' : 'text-base'}`}>
                  {liveChatText}
                </span>
              </div>
              </EditorHighlight>

              {/* Edit Popup for Live Chat */}
              {editingSection === "LIVE CHAT" && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="flex border-b border-gray-200">
                    <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Design & Content</button>
                  </div>
                  <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Button Text</label>
                      <input 
                        type="text" 
                        value={liveChatText} 
                        onChange={e => setLiveChatText(e.target.value)}
                        className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Redirect Link</label>
                      <input 
                        type="text" 
                        value={liveChatLink}
                        placeholder="/support or https://example.com"
                        onChange={e => setLiveChatLink(e.target.value)}
                        className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Button Shape</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setLiveChatShape('pill')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatShape === 'pill' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Pill
                        </button>
                        <button 
                          onClick={() => setLiveChatShape('rounded')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatShape === 'rounded' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Rounded
                        </button>
                        <button 
                          onClick={() => setLiveChatShape('square')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatShape === 'square' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Square
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Button Size</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setLiveChatSize('sm')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatSize === 'sm' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Small
                        </button>
                        <button 
                          onClick={() => setLiveChatSize('md')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatSize === 'md' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          Medium
                        </button>
                        <button 
                          onClick={() => setLiveChatSize('lg')}
                          className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${liveChatSize === 'lg' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
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
              className={`rounded-full hover:bg-black/5 hover:bg-card/10 border border-card-border relative transition-all flex items-center justify-center text-foreground ${
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
              <div className="absolute top-full right-0 mt-4 w-64 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Cart Design</button>
                </div>
                <div className="p-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Cart Icon</label>
                    <select
                      value={cartIcon}
                      onChange={(e) => setCartIcon(e.target.value)}
                      className="w-full text-xs bg-card border border-gray-300 rounded px-2 py-2 outline-none focus:border-black"
                    >
                      <option value="ShoppingCart">Shopping Cart</option>
                      <option value="ShoppingBag">Shopping Bag</option>
                      <option value="ShoppingBasket">Shopping Basket</option>
                      <option value="Package">Package</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Button Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setCartIconSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${cartIconSize === 'sm' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setCartIconSize('md')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${cartIconSize === 'md' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setCartIconSize('lg')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${cartIconSize === 'lg' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
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
                      className="block px-3 py-2 hover:bg-black/5 hover:bg-card/10 rounded-xl transition-all font-semibold text-xs mb-0.5"
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isEditorActive) return;
                  setAuthError("");
                  setAuthSuccess("");
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className={`hidden sm:flex items-center gap-1.5 border border-card-border rounded-full hover:bg-card-bg hover:bg-card/10 font-bold transition-all cursor-pointer ${
                  accountTextSize === 'sm' ? 'px-3 py-1.5 text-[11px]' : accountTextSize === 'lg' ? 'px-4 py-2.5 text-sm' : 'px-3.5 py-2 text-xs'
                }`}
                style={{ color: accountColor }}
              >
                {(() => {
                  const ActiveIcon = availableIcons[accountIcon as keyof typeof availableIcons] || availableIcons.User;
                  const iconClass = accountTextSize === 'sm' ? 'w-3 h-3' : accountTextSize === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
                  return <ActiveIcon className={iconClass} style={{ color: accountColor }} />;
                })()} 
                Sign In
              </button>
            )}
            </EditorHighlight>

            {/* Edit Popup for Account */}
            {editingSection === "ACCOUNT" && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Account Design</button>
                </div>
                <div className="p-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Account Icon</label>
                    <select
                      value={accountIcon}
                      onChange={(e) => setAccountIcon(e.target.value)}
                      className="w-full text-xs bg-card border border-gray-300 rounded px-2 py-2 outline-none focus:border-black"
                    >
                      <option value="User">User Default</option>
                      <option value="UserCircle">User Circle</option>
                      <option value="Star">Star</option>
                      <option value="Heart">Heart</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Text & Icon Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={accountColor}
                        onChange={(e) => setAccountColor(e.target.value)}
                        className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                      />
                      <span className="text-xs text-foreground/60">{accountColor}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setAccountTextSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${accountTextSize === 'sm' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setAccountTextSize('md')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${accountTextSize === 'md' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setAccountTextSize('lg')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${accountTextSize === 'lg' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
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
              <div className="absolute top-full left-0 mt-4 w-96 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Links & Design</button>
                </div>
                <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Navigation Links</label>
                      <button 
                        onClick={() => setNavItems([...navItems, { id: Math.random().toString(), label: 'New Link', link: '/', categoryKey: '' }])}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        + Add Link
                      </button>
                    </div>
                    <div className="space-y-2">
                      {navItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2 bg-background p-2 rounded-lg border border-gray-200">
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
                              className="w-full text-xs bg-card border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
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
                              className="w-full text-xs bg-card border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const newItems = navItems.filter((_, i) => i !== index);
                              setNavItems(newItems);
                            }}
                            className="p-1.5 text-foreground/50 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Text Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setNavFontSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${navFontSize === 'sm' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setNavFontSize('base')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${navFontSize === 'base' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setNavFontSize('lg')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${navFontSize === 'lg' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Large
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Item Spacing</label>
                       <span className="text-xs text-foreground/60">{navSpacing}</span>
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
                    className={`px-3 py-1.5 cursor-pointer font-bold border rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      quickLinkFontSize === 'xs' ? 'text-[11px]' : quickLinkFontSize === 'sm' ? 'text-xs' : 'text-sm'
                    }`}
                    style={{
                      color: link.color,
                      backgroundColor: link.color + '10',
                      borderColor: link.color + '30'
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </div>
                );
              })}
            </div>
            </EditorHighlight>

            {/* Edit Popup for Quick Links */}
            {editingSection === "QUICK LINKS" && (
              <div className="absolute top-full right-0 mt-4 w-96 bg-card border border-gray-200 shadow-2xl rounded-lg z-[200] text-foreground font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-3 text-xs font-bold border-b-2 border-black">Quick Links & Design</button>
                </div>
                <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Links</label>
                      <button 
                        onClick={() => setQuickLinks([...quickLinks, { id: Math.random().toString(), label: 'New Link', link: '/', color: '#000000', icon: 'Star' }])}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        + Add Link
                      </button>
                    </div>
                    <div className="space-y-2">
                      {quickLinks.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2 bg-background p-2 rounded-lg border border-gray-200">
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
                                className="w-full text-xs bg-card border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
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
                                className="w-full text-xs bg-card border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
                              />
                              <select
                                value={item.icon}
                                onChange={(e) => {
                                  const newItems = [...quickLinks];
                                  newItems[index].icon = e.target.value;
                                  setQuickLinks(newItems);
                                }}
                                className="w-24 text-xs bg-card border border-gray-300 rounded px-2 py-1 outline-none focus:border-black"
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
                            className="p-1.5 text-foreground/50 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="text-[10px] font-bold text-foreground/60 tracking-wider uppercase">Text Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setQuickLinkFontSize('xs')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${quickLinkFontSize === 'xs' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setQuickLinkFontSize('sm')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${quickLinkFontSize === 'sm' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setQuickLinkFontSize('base')}
                        className={`py-2 px-2 border rounded-lg text-xs font-medium transition-colors ${quickLinkFontSize === 'base' ? 'border-black bg-background' : 'border-gray-200 hover:border-gray-300'}`}
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

      {/* Floating Authentication Modal (Sign In / Sign Up) */}
      {isAuthModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div 
            className="bg-card-bg border border-card-border rounded-[2.5rem] p-8 shadow-2xl relative w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-6 right-6 text-foreground/60 hover:text-foreground cursor-pointer z-10 p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {authModalMode === 'login' ? (
              // ── SIGN IN MODE ──
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md">
                    E
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground">Welcome Back</h2>
                  <p className="text-xs text-foreground/60">Sign in to sync your cart and tracks orders</p>
                </div>

                {/* Social Login Button */}
                <button
                  onClick={handleModalGoogleLogin}
                  disabled={authLoading}
                  className="w-full py-2.5 bg-background border border-card-border hover:bg-background rounded-xl text-xs font-bold text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-2.04 2.15v1.78h3.29c1.92-1.78 3.8-5.78 3.8-5.78z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.29-1.78c-.91.61-2.07.97-3.67.97-3.13 0-5.78-2.11-6.73-4.96H1.05v1.85C3.04 20.12 7.15 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 15.32c-.25-.7-.39-1.45-.39-2.22s.14-1.52.39-2.22V7.03H1.05C.38 8.38 0 10.15 0 12s.38 3.62 1.05 4.97l4.22-1.65z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.15 0 3.04 3.88 1.05 7.03l4.22 1.65c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  Google मार्फत जारी राख्नुहोस्
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-card-border"></div>
                  </div>
                  <span className="relative bg-card-bg px-3.5 text-[10px] text-foreground/45 uppercase font-bold tracking-widest">
                    Or Sign in with Email / Phone
                  </span>
                </div>

                <form onSubmit={handleModalLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Email or Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. user@gmail.com or 98XXXXXXXX"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      disabled={authLoading}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Password</label>
                      <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">Forgot password?</span>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={authLoading}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  {authError && <p className="text-[10px] text-red-500 font-bold text-center">{authError}</p>}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="modalRemember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-card-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="modalRemember" className="text-xs text-foreground/70 cursor-pointer select-none">
                      Remember this device
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-primary hover:bg-primary-hover active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {authLoading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-xs text-foreground/60">
                    New to Expert Mobile Solution?{" "}
                    <button 
                      onClick={() => { setAuthError(""); setAuthModalMode('register'); }}
                      className="font-bold text-primary hover:underline bg-transparent border-none cursor-pointer p-0 ml-1"
                    >
                      Sign Up Free
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // ── SIGN UP MODE ──
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md">
                    E
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground">Create an Account</h2>
                  <p className="text-xs text-foreground/60">Register with email or phone to get started</p>
                </div>

                <form onSubmit={handleModalRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Keshav Dangi"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      disabled={authLoading}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Email Address *</label>
                      <input
                        type="email"
                        placeholder="name@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        disabled={authLoading}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="98XXXXXXXX"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        disabled={authLoading}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Password (Min. 6 chars) *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      disabled={authLoading}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Confirm Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      disabled={authLoading}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  {authError && <p className="text-[10px] text-red-500 font-bold text-center">{authError}</p>}
                  {authSuccess && <p className="text-[10px] text-emerald-500 font-bold text-center">{authSuccess}</p>}

                  {/* Trader Account selection */}
                  <div className={`p-3.5 rounded-xl border transition-all duration-200 ${
                    regIsTrader 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-900" 
                      : "bg-black/5 dark:bg-card/5 border-card-border hover:border-foreground/20"
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="modalIsTrader"
                        checked={regIsTrader}
                        onChange={(e) => setRegIsTrader(e.target.checked)}
                        className="rounded border-card-border text-amber-500 focus:ring-amber-500 w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <label htmlFor="modalIsTrader" className="text-[11px] text-foreground font-extrabold cursor-pointer leading-tight flex items-center gap-1.5">
                          Register as Trader Account 
                          <span className="text-[8px] uppercase font-black bg-amber-500 text-foreground px-1.5 py-0.5 rounded tracking-wide">Sellers Only</span>
                        </label>
                        <p className="text-[10px] text-foreground/70 leading-normal font-medium">
                          Choose this if you want to upload and sell your products on this website.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Agree to terms */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="modalTerms"
                      checked={regAgreeTerms}
                      onChange={(e) => setRegAgreeTerms(e.target.checked)}
                      className="rounded border-card-border text-primary focus:ring-primary w-4 h-4 mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="modalTerms" className="text-[10px] text-foreground/80 cursor-pointer leading-tight">
                      I agree to the Expert Mobile Solution Terms &amp; Conditions and Privacy Policy.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-primary hover:bg-primary-hover active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {authLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-xs text-foreground/60">
                    Already have an account?{" "}
                    <button 
                      onClick={() => { setAuthError(""); setAuthModalMode('login'); }}
                      className="font-bold text-primary hover:underline bg-transparent border-none cursor-pointer p-0 ml-1"
                    >
                      Sign In instead
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
