"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Cpu, 
  Monitor, 
  Projector, 
  Headphones, 
  Compass, 
  ChevronRight 
} from "lucide-react";

interface MegaMenuProps {
  initialCategory?: string;
  onClose: () => void;
}

interface SubCategoryItem {
  name: string;
  image: string;
  href: string;
}

interface MegaMenuSection {
  title: string;
  items: SubCategoryItem[];
}

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 170 170" fill="currentColor" {...props}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.17-2.76-2.28-6.5-6.73-11.22-13.38-5.78-8.2-10.21-17.76-13.27-28.7-3.17-11.36-4.77-22.1-4.77-32.22 0-16.27 3.86-29.93 11.59-40.97 7.73-11.05 17.65-16.63 29.77-16.75 6.13 0 12.52 2.21 19.16 6.64 6.63 4.41 11.19 6.62 13.68 6.62 2.12 0 6.44-2.12 12.98-6.35 6.53-4.24 12.56-6.23 18.08-5.97 15.18 1.13 26.64 6.79 34.39 16.99-13.2 8.01-19.69 19.14-19.46 33.39.24 10.6 4.11 19.34 11.62 26.23 7.51 6.89 16.5 10.51 26.97 10.86-2.12 6.36-4.66 12.35-7.61 17.97zM119.33 26.54c0-8.08 2.84-15.65 8.52-22.7 7.21-8.91 16.21-13.72 26.98-14.42.12 1.04.18 1.83.18 2.37 0 7.73-3.03 15.35-9.08 22.86-5.83 7.15-13.64 12.27-23.44 13.56-.35-2.54-.51-5.18-.51-7.79z" />
  </svg>
);

// Default icon mapping keyed by slug (fallback for built-in categories)
const SLUG_ICON_MAP: Record<string, React.ElementType> = {
  laptop: Laptop,
  apple: AppleIcon,
  smartphone: Smartphone,
  tablet: Tablet,
  "pc-components": Cpu,
  monitor: Monitor,
  projector: Projector,
  earbuds: Headphones,
  drone: Compass,
  headphone: Headphones,
};

const DEFAULT_SIDEBAR_CATEGORIES = [
  { slug: "laptop", name: "Laptop" },
  { slug: "apple", name: "Apple" },
  { slug: "smartphone", name: "Smart Phone" },
  { slug: "tablet", name: "Tablet" },
  { slug: "pc-components", name: "PC Components" },
  { slug: "monitor", name: "Monitor" },
  { slug: "projector", name: "Projector" },
  { slug: "earbuds", name: "Earbuds" },
  { slug: "drone", name: "Drone" },
  { slug: "headphone", name: "Headphone" },
];

const MENU_CONTENT_DATA: { [key: string]: MegaMenuSection[] } = {
  laptop: [
    {
      title: "Laptop by Uses",
      items: [
        { name: "Gaming", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&h=150&fit=crop", href: "/category/laptop?use=gaming" },
        { name: "Work", image: "https://images.unsplash.com/photo-1496181130204-755241544e3f?w=150&h=150&fit=crop", href: "/category/laptop?use=work" },
        { name: "Students", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&h=150&fit=crop", href: "/category/laptop?use=students" },
        { name: "Editing", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop", href: "/category/laptop?use=editing" },
        { name: "Programming", image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=150&h=150&fit=crop", href: "/category/laptop?use=programming" },
      ],
    },
    {
      title: "ASUS Laptop",
      items: [
        { name: "ROG Zephyrus", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=150&h=150&fit=crop", href: "/category/laptop?brand=Asus" },
        { name: "ROG Strix", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150&h=150&fit=crop", href: "/category/laptop?brand=Asus" },
        { name: "ExpertBook", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150&h=150&fit=crop", href: "/category/laptop?brand=Asus" },
        { name: "TUF Gaming", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&h=150&fit=crop", href: "/category/laptop?brand=Asus" },
        { name: "Vivobook", image: "https://images.unsplash.com/photo-1496181130204-755241544e3f?w=150&h=150&fit=crop", href: "/category/laptop?brand=Asus" },
        { name: "Zenbook", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&h=150&fit=crop", href: "/category/laptop?brand=Asus" },
        { name: "ProArt", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop", href: "/category/laptop?brand=Asus" },
      ],
    },
  ],
  apple: [
    {
      title: "Apple Products",
      items: [
        { name: "MacBook", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop", href: "/category/apple?type=macbook" },
        { name: "iPhone", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop", href: "/category/apple?type=iphone" },
        { name: "iPad", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop", href: "/category/apple?type=ipad" },
        { name: "Apple Watch", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&h=150&fit=crop", href: "/category/apple?type=watch" },
      ],
    },
  ],
  smartphone: [
    {
      title: "Phones by Brands",
      items: [
        { name: "Xiaomi", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop", href: "/category/smartphone?brand=Xiaomi" },
        { name: "Samsung", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150&h=150&fit=crop", href: "/category/smartphone?brand=Samsung" },
        { name: "OnePlus", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150&h=150&fit=crop", href: "/category/smartphone?brand=OnePlus" },
        { name: "Realme", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop", href: "/category/smartphone?brand=Realme" },
      ],
    },
  ],
  tablet: [
    {
      title: "Tablets Catalog",
      items: [
        { name: "Xiaomi Pad", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop", href: "/category/tablet?brand=Xiaomi" },
        { name: "Samsung Tab", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop", href: "/category/tablet?brand=Samsung" },
      ],
    },
  ],
  "pc-components": [
    {
      title: "PC Parts",
      items: [
        { name: "Processors", image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=150&h=150&fit=crop", href: "/category/pc-components?type=processors" },
        { name: "Graphic Cards", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=150&h=150&fit=crop", href: "/category/pc-components?type=gpu" },
        { name: "SSD Storage", image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=150&h=150&fit=crop", href: "/category/pc-components?type=ssd" },
      ],
    },
  ],
  monitor: [
    {
      title: "Display Panels",
      items: [
        { name: "Gaming Monitor", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150&h=150&fit=crop", href: "/category/monitor?type=gaming" },
        { name: "Office Monitor", image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=150&h=150&fit=crop", href: "/category/monitor?type=office" },
      ],
    },
  ],
  projector: [
    {
      title: "Smart Projectors",
      items: [
        { name: "Home Theater", image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=150&h=150&fit=crop", href: "/category/projector?type=home" },
      ],
    },
  ],
  earbuds: [
    {
      title: "Xiaomi Earbuds",
      items: [
        { name: "Xiaomi Buds 5", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&h=150&fit=crop", href: "/category/earbuds?brand=Xiaomi" },
        { name: "Redmi Buds 6", image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=150&h=150&fit=crop", href: "/category/earbuds?brand=Xiaomi" },
      ],
    },
    {
      title: "Anker Earbuds",
      items: [
        { name: "Soundcore R50i", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&h=150&fit=crop", href: "/category/earbuds?brand=Anker" },
      ],
    },
  ],
  drone: [
    {
      title: "Aerial Photography",
      items: [
        { name: "DJI Mini", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=150&h=150&fit=crop", href: "/category/drone?brand=DJI" },
      ],
    },
  ],
  headphone: [
    {
      title: "Over-Ear Headsets",
      items: [
        { name: "Anker Soundcore", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop", href: "/category/headphone?brand=Anker" },
        { name: "UGREEN HiTune", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=150&h=150&fit=crop", href: "/category/headphone?brand=UGREEN" },
      ],
    },
  ],
};

export default function MegaMenu({ initialCategory, onClose }: MegaMenuProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(initialCategory?.toLowerCase() || "laptop");
  const [sidebarCategories, setSidebarCategories] = useState(DEFAULT_SIDEBAR_CATEGORIES);

  // Load categories from localStorage and stay in sync with admin changes
  useEffect(() => {
    const loadCats = () => {
      try {
        const saved = localStorage.getItem("expert_mobile_categories");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].slug) {
            setSidebarCategories(parsed.map((c: { slug: string; name: string }) => ({ slug: c.slug, name: c.name })));
          }
        }
      } catch {
        // fallback to defaults on parse error
      }
    };
    loadCats();
    window.addEventListener("storage", loadCats);
    window.addEventListener("categories_updated", loadCats);
    return () => {
      window.removeEventListener("storage", loadCats);
      window.removeEventListener("categories_updated", loadCats);
    };
  }, []);

  const sections = MENU_CONTENT_DATA[activeCategory];

  return (
    <div
      className="absolute top-full left-0 w-full bg-card-bg border-b border-card-border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto flex h-[480px]">
        {/* Left Side: Category list sidebar */}
        <div className="w-64 bg-card-bg dark:bg-slate-950/60 border-r border-card-border flex flex-col py-4 overflow-y-auto">
          {sidebarCategories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            const Icon = SLUG_ICON_MAP[cat.slug] ?? null;
            return (
              <div
                key={cat.slug}
                onMouseEnter={() => setActiveCategory(cat.slug)}
                onClick={() => {
                  router.push(`/category/${cat.slug}`);
                  onClose();
                }}
                className={`w-full px-6 py-3 flex items-center justify-between text-xs font-bold transition-all cursor-pointer border-l-4 ${
                  isActive
                    ? "border-primary bg-white text-primary"
                    : "border-transparent text-foreground/80 hover:bg-black/5 dark:hover:bg-slate-900/30"
                }`}
              >
                <span className="flex items-center gap-3">
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-primary animate-pulse" : "text-foreground/50"}`} />}
                  {cat.name}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
              </div>
            );
          })}
        </div>

        {/* Right Side: Dynamic section columns */}
        <div className="flex-1 p-8 overflow-y-auto bg-card-bg">
          {sections ? (
            <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-card-border pb-2">
                    <h3 className="font-extrabold text-[11px] text-foreground/80 uppercase tracking-widest">
                      {section.title}
                    </h3>
                    <Link
                      href={`/category/${activeCategory}`}
                      onClick={onClose}
                      className="text-[10px] font-bold text-primary hover:underline hover:text-primary-hover"
                    >
                      View all &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-6">
                    {section.items.map((item, itemIdx) => (
                      <Link
                        key={itemIdx}
                        href={item.href}
                        onClick={onClose}
                        className="flex flex-col items-center gap-2 group text-center"
                      >
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-card-border bg-card-bg group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover group-hover:brightness-95 transition-all"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-foreground/75 group-hover:text-primary transition-colors truncate w-full px-1">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-foreground/45">
              Select a category on the left sidebar to view its models.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
