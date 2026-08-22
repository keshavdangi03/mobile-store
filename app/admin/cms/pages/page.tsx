"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Plus, Home, Laptop, Smartphone, Tablet, Cpu, Monitor, 
  Headphones, Compass, FileText, Wrench, GraduationCap, X, 
  Trash2, Edit3, Globe, Eye, EyeOff, ExternalLink, ChevronRight,
  Layers, Tag, ShoppingBag, FolderPlus, Image as ImageIcon,
  Sparkles, Star, Flame, CreditCard, BookOpen, Zap, Shield, Check,
  Navigation, Link2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCmsStore } from "@/lib/cms-store";
import { INITIAL_CATEGORIES } from "@/lib/db-simulation";

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 170 170" fill="currentColor" {...props}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.17-2.76-2.28-6.5-6.73-11.22-13.38-5.78-8.2-10.21-17.76-13.27-28.7-3.17-11.36-4.77-22.1-4.77-32.22 0-16.27 3.86-29.93 11.59-40.97 7.73-11.05 17.65-16.63 29.77-16.75 6.13 0 12.52 2.21 19.16 6.64 6.63 4.41 11.19 6.62 13.68 6.62 2.12 0 6.44-2.12 12.98-6.35 6.53-4.24 12.56-6.23 18.08-5.97 15.18 1.13 26.64 6.79 34.39 16.99-13.2 8.01-19.69 19.14-19.46 33.39.24 10.6 4.11 19.34 11.62 26.23 7.51 6.89 16.5 10.51 26.97 10.86-2.12 6.36-4.66 12.35-7.61 17.97zM119.33 26.54c0-8.08 2.84-15.65 8.52-22.7 7.21-8.91 16.21-13.72 26.98-14.42.12 1.04.18 1.83.18 2.37 0 7.73-3.03 15.35-9.08 22.86-5.83 7.15-13.64 12.27-23.44 13.56-.35-2.54-.51-5.18-.51-7.79z" />
  </svg>
);

const BUILTIN_MAIN_PAGES = [
  { slug: "/", name: "Home", icon: Home },
  { slug: "/repair", name: "Repair Services", icon: Wrench },
  { slug: "/training", name: "Training Academy", icon: GraduationCap },
];

const AVAILABLE_BUTTON_COLORS = [
  { label: "Teal", value: "#00AFA2" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Orange", value: "#f97316" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Dark", value: "#0f172a" },
];

const AVAILABLE_BUTTON_ICONS = [
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Wrench", icon: Wrench },
  { name: "BookOpen", icon: BookOpen },
  { name: "Sparkles", icon: Sparkles },
  { name: "Star", icon: Star },
  { name: "Flame", icon: Flame },
  { name: "CreditCard", icon: CreditCard },
  { name: "Zap", icon: Zap },
  { name: "Shield", icon: Shield },
  { name: "Tag", icon: Tag },
];

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("apple") || s.includes("iphone") || s.includes("macbook") || s.includes("ipad")) return AppleIcon;
  if (s.includes("laptop") || s.includes("notebook")) return Laptop;
  if (s.includes("phone") || s.includes("smart") || s.includes("mobile")) return Smartphone;
  if (s.includes("tab") || s.includes("pad")) return Tablet;
  if (s.includes("pc") || s.includes("cpu") || s.includes("component")) return Cpu;
  if (s.includes("monitor") || s.includes("display") || s.includes("screen") || s.includes("tv")) return Monitor;
  if (s.includes("projector")) return Monitor;
  if (s.includes("earbud") || s.includes("headphone") || s.includes("audio") || s.includes("sound")) return Headphones;
  if (s.includes("drone") || s.includes("camera")) return Compass;
  return Tag;
};

// ─── Header Quick Links Helpers ──────────────────────────────────────────────
interface QuickLinkItem {
  id: string;
  label: string;
  link: string;
  color: string;
  icon: string;
}

const getHeaderSettings = () => {
  if (typeof window === "undefined") return { quickLinks: [] };
  try {
    const saved = localStorage.getItem("cms_header_settings");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    quickLinks: [
      { id: '1', label: "Mobile Training", link: "/training", color: "#00AFA2", icon: "GraduationCap" },
      { id: '2', label: "Repair Services", link: "/repair", color: "#00AFA2", icon: "Wrench" },
      { id: '3', label: "Stock Clearance", link: "/category/all?clearance=true", color: "#f97316", icon: "Flame" },
      { id: '4', label: "EMI Products", link: "/category/all?emi=true", color: "#3b82f6", icon: "CreditCard" },
    ]
  };
};

const saveHeaderSettings = (settings: any) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cms_header_settings", JSON.stringify(settings));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("header_settings_updated"));
  } catch (e) {}
};

interface AddPageModalProps {
  onClose: () => void;
  onAdd: (data: { 
    type: 'main' | 'category';
    title: string; 
    slug: string; 
    content: string; 
    status: 'published' | 'draft'; 
    metaDescription: string;
    image?: string;
    addHeaderButton?: boolean;
    buttonColor?: string;
    buttonIcon?: string;
    addToCategoryNav?: boolean;
  }) => void;
}

function AddPageModal({ onClose, onAdd }: AddPageModalProps) {
  const [pageType, setPageType] = useState<'main' | 'category'>('main');
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [categoryImage, setCategoryImage] = useState("https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300");
  const [slugEdited, setSlugEdited] = useState(false);

  // Navigation Linkage options
  const [addHeaderButton, setAddHeaderButton] = useState(true);
  const [buttonColor, setButtonColor] = useState("#00AFA2");
  const [buttonIcon, setButtonIcon] = useState("GraduationCap");
  const [addToCategoryNav, setAddToCategoryNav] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) {
      setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugEdited(true);
    setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {pageType === 'category' ? 'Create Category Page' : 'Create Main Page'}
            </h3>
            <p className="text-[11px] text-gray-500">
              {pageType === 'category' ? 'Adds to store categories & catalog' : 'Adds a customizable page under Main Pages'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Page Type Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Choose Section *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPageType('main');
                  setAddHeaderButton(true);
                }}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-all cursor-pointer text-left ${
                  pageType === 'main'
                    ? 'border-black bg-black text-white shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Home className={`w-3.5 h-3.5 ${pageType === 'main' ? 'text-primary' : 'text-gray-400'}`} />
                  <span>Main Page</span>
                </div>
                <span className={`text-[10px] ${pageType === 'main' ? 'text-gray-300' : 'text-gray-400'}`}>
                  Direct URL: /{slug || 'page'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPageType('category');
                  setAddHeaderButton(false);
                }}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-all cursor-pointer text-left ${
                  pageType === 'category'
                    ? 'border-black bg-black text-white shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShoppingBag className={`w-3.5 h-3.5 ${pageType === 'category' ? 'text-primary' : 'text-gray-400'}`} />
                  <span>Category Page</span>
                </div>
                <span className={`text-[10px] ${pageType === 'category' ? 'text-gray-300' : 'text-gray-400'}`}>
                  Direct URL: /category/{slug || 'cat'}
                </span>
              </button>
            </div>
          </div>

          {/* 2. Title / Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {pageType === 'category' ? 'Category Name *' : 'Main Page Title *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              autoFocus
              className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
              placeholder={pageType === 'category' ? 'e.g. iPhone or Smart Watch' : 'e.g. Course or About Us'}
            />
          </div>

          {/* 3. Slug */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">URL Link *</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-black bg-white">
              <span className="px-3 py-2.5 text-xs text-gray-500 bg-gray-50 border-r border-gray-200 whitespace-nowrap font-mono">
                {pageType === 'category' ? '/category/' : '/'}
              </span>
              <input
                type="text"
                value={slug}
                onChange={e => handleSlugChange(e.target.value)}
                className="flex-1 text-sm px-3 py-2.5 outline-none bg-white font-mono"
                placeholder={pageType === 'category' ? 'iphone' : 'course'}
              />
            </div>
          </div>

          {/* 4. Navigation Linkage Configuration */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-gray-900">Header Quick Button Link</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={addHeaderButton}
                  onChange={(e) => setAddHeaderButton(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="text-[11px] text-gray-500">
              Adds a quick link button (like <span className="font-semibold text-primary">Mobile Training</span> or <span className="font-semibold text-primary">Repair Services</span>) in the top header.
            </p>

            {addHeaderButton && (
              <div className="space-y-2.5 pt-2 border-t border-gray-200">
                {/* Button Color */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Button Color</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_BUTTON_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setButtonColor(c.value)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          buttonColor === c.value
                            ? 'border-black text-white bg-black shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.value }} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Icon */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Button Icon</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_BUTTON_ICONS.map(i => {
                      const IconComp = i.icon;
                      return (
                        <button
                          key={i.name}
                          type="button"
                          onClick={() => setButtonIcon(i.name)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            buttonIcon === i.name
                              ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                          }`}
                          title={i.name}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category-Specific: Image URL */}
          {pageType === 'category' ? (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category Image URL</label>
              <input
                type="text"
                value={categoryImage}
                onChange={e => setCategoryImage(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
                placeholder="https://..."
              />
              <p className="text-[10px] text-gray-400">Used for navigation icons, mega-menus, and product filters.</p>
            </div>
          ) : (
            /* Main Page-Specific: Description & Status */
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Page Summary / Description</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={2}
                  className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-black resize-none bg-white"
                  placeholder="Brief introductory message or summary for this page..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Meta Description</label>
                <input
                  type="text"
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
                  placeholder="Short description for search engines..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                <div className="flex gap-2">
                  {(['published', 'draft'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border capitalize transition-all cursor-pointer ${
                        status === s ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Actions */}
        <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!title.trim() || !slug.trim()) return;
              onAdd({ 
                type: pageType,
                title, 
                slug, 
                content, 
                status, 
                metaDescription,
                image: categoryImage,
                addHeaderButton,
                buttonColor,
                buttonIcon,
                addToCategoryNav
              });
            }}
            disabled={!title.trim() || !slug.trim()}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            {pageType === 'category' ? 'Create Category Page' : 'Create Main Page'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function PagesPanel() {
  const router = useRouter();
  const { customPages, addCustomPage, updateCustomPage, deleteCustomPage } = useCmsStore();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Dynamic store categories
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);

  // Header quick links tracking
  const [headerQuickLinks, setHeaderQuickLinks] = useState<QuickLinkItem[]>([]);

  const loadHeaderQuickLinks = () => {
    const settings = getHeaderSettings();
    setHeaderQuickLinks(settings.quickLinks || []);
  };

  const loadCategories = () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("expert_mobile_categories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed.map((c: any) => ({ slug: c.slug, name: c.name })));
          return;
        }
      }
    } catch (e) {}
    setCategories(INITIAL_CATEGORIES.map(c => ({ slug: c.slug, name: c.name })));
  };

  useEffect(() => {
    loadCategories();
    loadHeaderQuickLinks();
    window.addEventListener("storage", loadCategories);
    window.addEventListener("storage", loadHeaderQuickLinks);
    window.addEventListener("categories_updated", loadCategories);
    window.addEventListener("header_settings_updated", loadHeaderQuickLinks);
    return () => {
      window.removeEventListener("storage", loadCategories);
      window.removeEventListener("storage", loadHeaderQuickLinks);
      window.removeEventListener("categories_updated", loadCategories);
      window.removeEventListener("header_settings_updated", loadHeaderQuickLinks);
    };
  }, []);

  const isLinkInHeader = (linkUrl: string) => {
    const cleanUrl = linkUrl.startsWith('/') ? linkUrl : '/' + linkUrl;
    return headerQuickLinks.some(l => 
      l.link === cleanUrl || 
      l.link === cleanUrl.replace(/^\//, '') ||
      (cleanUrl.startsWith('/p/') && l.link === cleanUrl.replace('/p/', '/')) ||
      (!cleanUrl.startsWith('/p/') && l.link === '/p' + cleanUrl)
    );
  };

  const toggleQuickLinkForPage = (linkUrl: string, label: string, color = '#00AFA2', icon = 'Sparkles') => {
    const cleanUrl = linkUrl.startsWith('/') ? linkUrl : '/' + linkUrl;
    const current = getHeaderSettings();
    let links: QuickLinkItem[] = Array.isArray(current.quickLinks) ? [...current.quickLinks] : [];
    
    const existingIndex = links.findIndex(l => 
      l.link === cleanUrl || 
      l.link === cleanUrl.replace(/^\//, '') ||
      (cleanUrl.startsWith('/p/') && l.link === cleanUrl.replace('/p/', '/')) ||
      (!cleanUrl.startsWith('/p/') && l.link === '/p' + cleanUrl)
    );

    if (existingIndex >= 0) {
      // Remove
      links.splice(existingIndex, 1);
    } else {
      // Add
      links.push({
        id: 'ql-' + Date.now(),
        label,
        link: cleanUrl,
        color,
        icon
      });
    }

    saveHeaderSettings({ ...current, quickLinks: links });
    setHeaderQuickLinks(links);
  };

  const filteredBuiltinMain = BUILTIN_MAIN_PAGES.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCustomMain = customPages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalMainPagesCount = filteredBuiltinMain.length + filteredCustomMain.length;

  const handleNavigate = (url: string, title: string) => {
    window.dispatchEvent(new CustomEvent('cms-navigate', {
      detail: { url, title }
    }));
  };

  const handleDeleteCustomPage = (page: { id: string; slug: string; title: string }) => {
    const cleanSlug = page.slug.replace(/^\//, '').replace(/^p\//, '');
    const pageUrl = `/${cleanSlug}`;

    // 1. Remove from CMS store
    deleteCustomPage(page.id);

    // 2. Remove associated header button from quick links
    const current = getHeaderSettings();
    const filteredLinks = (current.quickLinks || []).filter(
      (l: any) => l.link !== pageUrl && l.link !== `/p/${cleanSlug}` && l.link !== cleanSlug && l.label !== page.title
    );
    saveHeaderSettings({ ...current, quickLinks: filteredLinks });
    setHeaderQuickLinks(filteredLinks);

    // 3. Close confirmation
    setConfirmDeleteId(null);

    // 4. Navigate preview back to Home
    handleNavigate('/', 'Home');

    // 5. Notify parent frame & storage
    if (typeof window !== 'undefined') {
      window.parent?.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('header_settings_updated'));
    }
  };

  const handleDeleteCategory = (catSlug: string, catName: string) => {
    try {
      const saved = localStorage.getItem("expert_mobile_categories");
      const existing = saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
      const updated = existing.filter((c: any) => c.slug !== catSlug);
      localStorage.setItem("expert_mobile_categories", JSON.stringify(updated));
      window.dispatchEvent(new Event("categories_updated"));
    } catch (e) {}

    // Remove header link if exists
    const categoryUrl = `/category/${catSlug}`;
    const current = getHeaderSettings();
    const filteredLinks = (current.quickLinks || []).filter(
      (l: any) => l.link !== categoryUrl && l.link !== catSlug && l.label !== catName
    );
    saveHeaderSettings({ ...current, quickLinks: filteredLinks });
    setHeaderQuickLinks(filteredLinks);

    loadCategories();
    handleNavigate('/', 'Home');
    if (typeof window !== 'undefined') {
      window.parent?.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('header_settings_updated'));
    }
  };

  const handleAddPage = (data: { 
    type: 'main' | 'category';
    title: string; 
    slug: string; 
    content: string; 
    status: 'published' | 'draft'; 
    metaDescription: string;
    image?: string;
    addHeaderButton?: boolean;
    buttonColor?: string;
    buttonIcon?: string;
    addToCategoryNav?: boolean;
  }) => {
    const cleanSlug = data.slug.replace(/^\//, '').replace(/^p\//, '');

    if (data.type === 'category') {
      try {
        const saved = localStorage.getItem("expert_mobile_categories");
        const existing = saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
        const exists = existing.some((c: any) => c.slug === cleanSlug);
        if (!exists) {
          const newCat = {
            slug: cleanSlug,
            name: data.title,
            image: data.image || "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300",
            count: 0
          };
          const updated = [...existing, newCat];
          localStorage.setItem("expert_mobile_categories", JSON.stringify(updated));
          window.dispatchEvent(new Event("categories_updated"));
        }
      } catch (e) {}

      if (data.addHeaderButton) {
        toggleQuickLinkForPage(`/category/${cleanSlug}`, data.title, data.buttonColor || '#00AFA2', data.buttonIcon || 'ShoppingBag');
      }

      loadCategories();
      setShowAddModal(false);
      handleNavigate(`/category/${cleanSlug}`, `${data.title} Category`);
    } else {
      const newPage = addCustomPage({
        title: data.title,
        slug: cleanSlug,
        content: data.content || '',
        status: data.status || 'published',
        metaDescription: data.metaDescription || '',
      });

      if (data.addHeaderButton) {
        toggleQuickLinkForPage(`/${cleanSlug}`, data.title, data.buttonColor || '#00AFA2', data.buttonIcon || 'GraduationCap');
      }

      setShowAddModal(false);
      handleNavigate(`/${cleanSlug}`, newPage.title);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9]">
      {/* Header */}
      <div className="p-5 pb-3 sticky top-0 bg-[#f9f9f9] z-10 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Pages</h2>
            <p className="text-[11px] text-gray-500 font-medium">Manage and preview all site pages</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[11px] font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Page
          </button>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages or categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-black text-gray-800"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* ── 1. MAIN PAGES (System Pages + User Created Main Pages) ────────── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Main Pages</h3>
            <span className="text-[10px] text-gray-400 font-bold">{totalMainPagesCount} page{totalMainPagesCount !== 1 ? 's' : ''}</span>
          </div>

          <div className="space-y-1.5">
            {/* Built-in system main pages (Home, Repair, Training) */}
            {filteredBuiltinMain.map((page) => {
              const Icon = page.icon;
              const hasHeaderBtn = page.slug !== "/" && isLinkInHeader(page.slug);
              return (
                <div
                  key={page.slug}
                  className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 group shadow-2xs"
                >
                  <div 
                    onClick={() => handleNavigate(page.slug, page.name)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{page.name}</span>
                    <span className="text-[9px] font-mono text-gray-400 hidden group-hover:inline truncate max-w-[90px]">{page.slug}</span>
                  </div>

                  {page.slug !== "/" && (
                    <button
                      onClick={() => toggleQuickLinkForPage(page.slug, page.name, '#00AFA2', page.slug === '/repair' ? 'Wrench' : 'GraduationCap')}
                      title={hasHeaderBtn ? "Remove button from Header navigation" : "Add button to Header navigation"}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                        hasHeaderBtn 
                          ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100' 
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Navigation className="w-2.5 h-2.5" />
                      {hasHeaderBtn ? 'Header Button' : '+ Header'}
                    </button>
                  )}

                  <ChevronRight 
                    onClick={() => handleNavigate(page.slug, page.name)}
                    className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:translate-x-0.5 transition-transform cursor-pointer" 
                  />
                </div>
              );
            })}

            {/* User Created Main Pages (e.g. course, about, etc.) */}
            {filteredCustomMain.map((page) => {
              const cleanSlug = page.slug.replace(/^\//, '').replace(/^p\//, '');
              const pageUrl = `/${cleanSlug}`;
              const hasHeaderBtn = isLinkInHeader(pageUrl);

              return (
                <div
                  key={page.id}
                  className="bg-white rounded-xl border border-gray-100 p-2.5 group hover:border-gray-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      onClick={() => handleNavigate(pageUrl, page.title)}
                      className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary" />
                    </div>
                    <div 
                      onClick={() => handleNavigate(pageUrl, page.title)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900 truncate hover:text-primary transition-colors">{page.title}</span>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full flex-shrink-0 ${
                          page.status === 'published' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {page.status}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono block">/{cleanSlug}</span>
                    </div>

                    {/* Header Button Toggle */}
                    <button
                      onClick={() => toggleQuickLinkForPage(pageUrl, page.title, '#00AFA2', 'BookOpen')}
                      title={hasHeaderBtn ? "Remove button from Header navigation" : "Add button to Header navigation"}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                        hasHeaderBtn 
                          ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100' 
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Navigation className="w-2.5 h-2.5" />
                      {hasHeaderBtn ? 'Header Button' : '+ Header'}
                    </button>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {/* Toggle status */}
                      <button
                        onClick={() => updateCustomPage(page.id, { status: page.status === 'published' ? 'draft' : 'published' })}
                        title={page.status === 'published' ? 'Set to Draft' : 'Publish'}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 cursor-pointer"
                      >
                        {page.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {/* Preview / Navigate */}
                      <button
                        onClick={() => handleNavigate(pageUrl, page.title)}
                        title="Preview page"
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => setConfirmDeleteId(page.id)}
                        title="Delete page"
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Confirm Delete */}
                  {confirmDeleteId === page.id && (
                    <div className="mt-2 pt-2 border-t border-red-100 flex items-center gap-2 bg-red-50 rounded-lg p-2">
                      <p className="text-[10px] text-red-700 font-semibold flex-1">Delete "{page.title}" page & header button?</p>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-[10px] font-bold text-gray-600 px-2 py-0.5 hover:bg-white rounded transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteCustomPage(page)}
                        className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 2. CATEGORY PAGES (Live Synced with Admin Categories) ────────── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Category Pages</h3>
            <span className="text-[10px] text-gray-400 font-bold">{categories.length} categories</span>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-400">No matching categories</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCategories.map((cat) => {
                const CatIcon = getCategoryIcon(cat.slug);
                const categoryUrl = `/category/${cat.slug}`;
                const hasHeaderBtn = isLinkInHeader(categoryUrl);

                return (
                  <div
                    key={cat.slug}
                    className="flex items-center gap-3 px-3 py-2 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 group shadow-2xs"
                  >
                    <div 
                      onClick={() => handleNavigate(categoryUrl, `${cat.name} Category`)}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    >
                      <CatIcon className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-semibold text-gray-800 flex-1 truncate">{cat.name}</span>
                      <span className="text-[9px] font-mono text-gray-400 hidden group-hover:inline truncate max-w-[90px]">/category/{cat.slug}</span>
                    </div>

                    {/* Header Button Toggle */}
                    <button
                      onClick={() => toggleQuickLinkForPage(categoryUrl, cat.name, '#00AFA2', 'Tag')}
                      title={hasHeaderBtn ? "Remove button from Header navigation" : "Add button to Header navigation"}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                        hasHeaderBtn 
                          ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100' 
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Navigation className="w-2.5 h-2.5" />
                      {hasHeaderBtn ? 'Header Button' : '+ Header'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete "${cat.name}" category page?`)) {
                          handleDeleteCategory(cat.slug, cat.name);
                        }
                      }}
                      title="Delete category"
                      className="p-1 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <ChevronRight 
                      onClick={() => handleNavigate(categoryUrl, `${cat.name} Category`)}
                      className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:translate-x-0.5 transition-transform cursor-pointer" 
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Add Page Modal */}
      {showAddModal && (
        <AddPageModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPage}
        />
      )}
    </div>
  );
}
