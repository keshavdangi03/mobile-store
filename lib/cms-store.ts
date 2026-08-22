import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedAsset {
  id: string;
  name: string;
  type: 'Section' | 'Image';
  url?: string;
  createdAt: string;
}

// ─── Custom Block Architecture ────────────────────────────────
export type BlockType = 
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'button'
  | 'columns'
  | 'cards'
  | 'features'
  | 'testimonials'
  | 'accordion'
  | 'countdown'
  | 'stats'
  | 'newsletter'
  | 'divider'
  | 'spacer'
  | 'products';

export interface CustomBlock {
  id: string;
  type: BlockType;
  data: Record<string, any>;
}

export const createDefaultBlock = (type: BlockType): CustomBlock => {
  const id = `block-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  switch (type) {
    case 'heading':
      return {
        id,
        type,
        data: {
          text: 'Empower Your Digital Experience',
          level: 'h2',
          alignment: 'center',
          size: 'text-3xl sm:text-4xl',
          badge: 'FEATURED HIGHLIGHT'
        }
      };
    case 'paragraph':
      return {
        id,
        type,
        data: {
          text: 'Explore top-tier devices, accessories, and certified repair services designed to keep you seamlessly connected every single day.',
          alignment: 'center',
          size: 'text-sm sm:text-base',
          maxWidth: 'max-w-2xl'
        }
      };
    case 'image':
      return {
        id,
        type,
        data: {
          url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
          alt: 'Product Showcase Image',
          caption: 'Premium Electronics & Laptops',
          rounded: 'rounded-2xl',
          aspectRatio: 'aspect-video',
          alignment: 'center'
        }
      };
    case 'video':
      return {
        id,
        type,
        data: {
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          title: 'Store Experience & Product Demo',
          autoplay: false,
          loop: false,
          controls: true
        }
      };
    case 'button':
      return {
        id,
        type,
        data: {
          text: 'Explore Catalog Now',
          link: '/category/all',
          variant: 'primary',
          size: 'md',
          alignment: 'center',
          showArrow: true
        }
      };
    case 'columns':
      return {
        id,
        type,
        data: {
          columnCount: 2,
          columns: [
            {
              id: 'col-1',
              title: 'Certified Repair Services',
              description: 'Fast, genuine screen, battery, and chip-level motherboard repair performed by master technicians.',
              icon: 'Wrench',
              linkText: 'Book Repair',
              linkUrl: '/#services'
            },
            {
              id: 'col-2',
              title: 'Official Warranty Products',
              description: '100% brand-new authentic laptops, smartphones, and accessories covered under comprehensive warranty.',
              icon: 'Shield',
              linkText: 'Browse Warranty Deals',
              linkUrl: '/category/all'
            }
          ]
        }
      };
    case 'cards':
      return {
        id,
        type,
        data: {
          items: [
            { id: '1', title: 'Express Delivery', description: 'Swift, safe doorstep shipping across Nepal within 24-48 hours.', icon: 'Zap', badge: 'FAST' },
            { id: '2', title: 'EMI Installments', description: 'Zero down-payment flexible installment plans on laptops and phones.', icon: 'Shield', badge: '0% EMI' },
            { id: '3', title: 'Expert Support', description: '24/7 technical advice and after-sales consultation for all devices.', icon: 'Star', badge: '24/7' }
          ]
        }
      };
    case 'features':
      return {
        id,
        type,
        data: {
          title: 'Why Choose Expert Mobile Solution?',
          items: [
            '100% Genuine Brand Warranty on all electronics',
            'ISO Certified Cleanroom Mobile Repair Station',
            'Exchange & Trade-In value guarantees',
            'Doorstep Pickup & Return repair assistance'
          ]
        }
      };
    case 'testimonials':
      return {
        id,
        type,
        data: {
          items: [
            { id: '1', name: 'Aarav Sharma', role: 'Graphic Designer', quote: 'Got my ROG laptop serviced and upgraded within 3 hours. Outstanding repair quality and genuine parts!', rating: 5, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80' },
            { id: '2', name: 'Pooja Thapa', role: 'Software Engineer', quote: 'Bought an iPad Air M2 at the best price with easy EMI. The customer support guided me through every step.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' }
          ]
        }
      };
    case 'accordion':
      return {
        id,
        type,
        data: {
          title: 'Frequently Asked Questions',
          items: [
            { id: '1', question: 'Do you offer warranty on repairs?', answer: 'Yes, all our hardware and display replacements come with an official 90-day service warranty.' },
            { id: '2', question: 'How can I apply for EMI installments?', answer: 'You can apply online or in-store using credit cards from partner banks with 0% interest terms up to 18 months.' },
            { id: '3', question: 'Are all laptops and accessories genuine?', answer: 'We are direct authorized retailers providing authentic, brand-sealed products with manufacturer seals.' }
          ]
        }
      };
    case 'countdown':
      return {
        id,
        type,
        data: {
          title: 'Special Flash Sale Ends In:',
          targetDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
          badge: 'LIMITED TIME ONLY',
          ctaText: 'Claim Your Discount &rarr;',
          ctaLink: '/category/all'
        }
      };
    case 'stats':
      return {
        id,
        type,
        data: {
          items: [
            { id: '1', value: '15,000+', label: 'Devices Repaired', icon: 'Wrench' },
            { id: '2', value: '99.4%', label: 'Customer Satisfaction', icon: 'Star' },
            { id: '3', value: '12+', label: 'Years of Trust', icon: 'Shield' },
            { id: '4', value: '500+', label: 'Students Trained', icon: 'Zap' }
          ]
        }
      };
    case 'newsletter':
      return {
        id,
        type,
        data: {
          title: 'Stay Ahead with Exclusive Deals',
          subtitle: 'Subscribe to our newsletter for flash discounts, tech tips, and repair guides.',
          buttonText: 'Subscribe Now',
          placeholder: 'Enter your email address...'
        }
      };
    case 'divider':
      return {
        id,
        type,
        data: {
          style: 'solid',
          thickness: 1,
          width: 'w-full',
          color: 'border-card-border'
        }
      };
    case 'spacer':
      return {
        id,
        type,
        data: {
          height: 32 // in px
        }
      };
    case 'products':
      return {
        id,
        type,
        data: {
          title: 'Trending Store Products',
          subtitle: 'Top-rated picks hand-selected for performance and value',
          items: [
            { id: '1', name: 'ROG Strix G16 Gaming Laptop', price: 'Rs. 189,999', originalPrice: 'Rs. 210,000', tag: 'HOT', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80' },
            { id: '2', name: 'iPhone 16 Pro Max 256GB', price: 'Rs. 209,999', originalPrice: 'Rs. 225,000', tag: 'NEW', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' },
            { id: '3', name: 'iPad Air M2 11-inch', price: 'Rs. 98,500', originalPrice: 'Rs. 108,000', tag: 'POPULAR', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' }
          ]
        }
      };
    default:
      return {
        id,
        type: 'heading',
        data: { text: 'New Block', level: 'h3', alignment: 'center' }
      };
  }
};

// ─── Custom Section / Blank Section Config ───────────────────────────────────
export interface CustomSectionConfig {
  id: string;
  layout: 'blank' | 'split' | 'centered' | 'cards' | 'banner' | 'video' | 'custom_blocks';
  badge?: string;
  title: string;
  subtitle: string;
  body: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video' | 'none';
  theme: 'primary' | 'dark' | 'light' | 'amber' | 'purple' | 'slate';
  minHeight: number; // in px
  paddingY?: number; // in rem
  blocks?: CustomBlock[];
  cards?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    badge?: string;
    link?: string;
  }>;
}

// ─── Section Customization Model for ALL Sections ────────────────────────────
export interface SectionCustomization {
  id?: string;
  // Shared properties
  title?: string;
  subtitle?: string;
  badge?: string;
  theme?: 'primary' | 'dark' | 'light' | 'amber' | 'purple' | 'slate' | 'emerald' | 'gradient';
  paddingY?: number; // rem
  hideSection?: boolean;
  
  // Hero Section
  slides?: Array<{
    id: string;
    title: string;
    subtitle: string;
    image: string;
    dealPrice?: string;
    originalPrice?: string;
    specs?: string[];
    buttonText?: string;
    buttonLink?: string;
    badge?: string;
    bgGradient?: string;
  }>;
  sideBanners?: Array<{
    id: string;
    title: string;
    subtitle: string;
    badge?: string;
    image?: string;
    link?: string;
    linkText?: string;
    bgGradient?: string;
  }>;

  // Services Section
  services?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    linkText: string;
    linkUrl: string;
  }>;

  // Promo Banner Section
  bannerHeading?: string;
  bannerDescription?: string;
  bannerBadge?: string;
  bannerButtonText?: string;
  bannerButtonLink?: string;
  bannerGradient?: string;

  // Categories Section
  categoriesTitle?: string;
  categoriesViewAllText?: string;
  categoriesViewAllLink?: string;

  // New Arrivals Section
  arrivalsTitle?: string;
  arrivalsTabs?: string[];
  arrivalsLimit?: number;

  // Limited Deals Section
  dealsTitle?: string;
  dealsBadgeText?: string;
  dealsHours?: number;
  dealsLinkText?: string;
  dealsLinkUrl?: string;

  // Testimonials Section
  testimonialsTitle?: string;
  testimonials?: Array<{
    id: string;
    name: string;
    date: string;
    role?: string;
    stars: number;
    text: string;
    avatar: string;
  }>;
}

// ─── Custom Pages ───────────────────────────────────────────────────────────
export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  status: 'published' | 'draft';
  content: string; // Rich text / HTML content
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Global Sections ─────────────────────────────────────────────────────────
export interface PromoBarConfig {
  enabled: boolean;
  text: string;
  bgColor: string;
  textColor: string;
  link: string;
  linkText: string;
  closeable: boolean;
  emoji: string;
}

export interface AnnouncementBannerConfig {
  enabled: boolean;
  type: 'info' | 'warning' | 'success' | 'promo';
  message: string;
  icon: string;
  closeable: boolean;
  link: string;
  linkText: string;
}

export interface GlobalSections {
  promoBar: PromoBarConfig;
  announcementBanner: AnnouncementBannerConfig;
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface CmsStore {
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  activeEditorId: string | null;
  setActiveEditorId: (id: string | null) => void;
  activeImageId: string | null;
  setActiveImageId: (id: string | null) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // Images
  imageOverrides: Record<string, string>;
  styleOverrides: Record<string, string>;
  setStyleOverrides: (overrides: Record<string, string>) => void;
  setImageOverride: (id: string, url: string) => void;
  
  // Section layout management
  sectionsByRoute: Record<string, string[]>;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  setSectionsForRoute: (route: string, sections: string[]) => void;
  addSection: (route: string, afterId: string | null, sectionType: string) => string;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;
  
  // Section Customization for ALL sections (Hero, Services, Promo, Categories, Testimonials, etc.)
  sectionCustomizations: Record<string, SectionCustomization>;
  setSectionCustomization: (sectionId: string, data: Partial<SectionCustomization>) => void;

  // Custom Sections Content
  customSectionsData: Record<string, CustomSectionConfig>;
  setCustomSectionData: (sectionId: string, data: Partial<CustomSectionConfig>) => void;

  // Custom Block Management inside Custom Sections
  addBlockToSection: (sectionId: string, blockType: BlockType, targetIndex?: number) => void;
  updateBlockInSection: (sectionId: string, blockId: string, data: Record<string, any>) => void;
  removeBlockFromSection: (sectionId: string, blockId: string) => void;
  moveBlock: (sectionId: string, blockId: string, direction: 'up' | 'down') => void;
  duplicateBlock: (sectionId: string, blockId: string) => void;

  // Copy / Paste
  clipboardSection: string | null;
  setClipboardSection: (id: string | null) => void;
  pasteSection: (afterId: string) => void;

  // Assets
  savedAssets: SavedAsset[];
  saveSectionToAssets: (id: string, name: string) => void;
  saveImageToAssets: (url: string, name: string) => void;
  removeAsset: (id: string) => void;

  // ─── Custom Pages ───────────────────────────────────────────────────────
  customPages: CustomPage[];
  addCustomPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => CustomPage;
  updateCustomPage: (id: string, updates: Partial<Omit<CustomPage, 'id' | 'createdAt'>>) => void;
  deleteCustomPage: (id: string) => void;

  // ─── Global Sections ────────────────────────────────────────────────────
  globalSections: GlobalSections;
  setPromoBar: (config: Partial<PromoBarConfig>) => void;
  setAnnouncementBanner: (config: Partial<AnnouncementBannerConfig>) => void;
}

// ─── Initial Values ───────────────────────────────────────────────────────────
const initialSectionsByRoute: Record<string, string[]> = {
  '/': [
    'hero_section',
    'categories_section',
    'new_arrivals_section',
    'services_section',
    'promo_banner_section',
    'limited_deals_section',
    'testimonials_section'
  ]
};

export const defaultSectionCustomizations: Record<string, SectionCustomization> = {
  hero_section: {
    title: 'Elevate Your Digital Lifestyle',
    slides: [
      {
        id: 'slide-1',
        title: 'Xiaomi Pad 8 Ultra Retina',
        subtitle: 'Flagship Performance Tablet',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        dealPrice: 'Rs. 48,999',
        buttonText: 'Shop Now',
        buttonLink: '/category/tablet',
        specs: ['11.2" 3.2K 144Hz Display', 'Snapdragon 8s Gen 3', '8850mAh Battery + 67W Turbo Charge']
      },
      {
        id: 'slide-2',
        title: 'ASUS ROG Strix G16 (2025)',
        subtitle: 'Unleash Next-Gen Gaming Power',
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
        dealPrice: 'Rs. 189,999',
        buttonText: 'View Specs',
        buttonLink: '/category/laptop',
        specs: ['Intel Core i9 14th Gen', 'NVIDIA GeForce RTX 4070 8GB', '16-inch 240Hz ROG Nebula Display', '16GB DDR5 + 1TB Gen4 SSD']
      },
      {
        id: 'slide-3',
        title: 'Professional Chip-Level Mobile Training',
        subtitle: 'Learn Hardware & Software Repair',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
        dealPrice: 'Rs. 25,000',
        buttonText: 'Enroll Now',
        buttonLink: '/training',
        specs: ['Classroom Lab at New Road, Kathmandu', 'Complete Schematic & Soldering Kit', 'ISO 9001 Certified Master Diploma', '100% Placement & Job Assistance']
      },
      {
        id: 'slide-4',
        title: 'Sell Your Gadgets on Trader Platform',
        subtitle: 'Zero Upfront Cost • Verified Buyers',
        image: 'https://images.unsplash.com/photo-1556742049-0a67e55722c6?w=600&q=80',
        dealPrice: '10% Fee Only',
        buttonText: 'Register Trader',
        buttonLink: '/register',
        specs: ['Fast product approval within 2 hours', 'Automated door-to-door courier pickup', 'Safe bank transfers & escrow protection', 'Instant live inventory analytics']
      }
    ],
    sideBanners: [
      {
        id: 'side-1',
        title: 'Save on Apple Trade-in Program',
        subtitle: 'Get up to Rs. 40,000 off on iPhone 16 Pro Max with your old device exchange.',
        badge: 'EXCHANGE BONUS',
        link: '/category/apple',
        linkText: 'Trade In Now'
      },
      {
        id: 'side-2',
        title: 'Refurbished Stock Clearance',
        subtitle: 'Certified grade-A pre-owned phones & laptops with 6-month store warranty.',
        badge: 'CLEARANCE',
        link: '/category/smartphone',
        linkText: 'View Sales'
      }
    ]
  },
  services_section: {
    title: 'Our Core Services',
    subtitle: 'All-in-one Mobile Solutions',
    services: [
      {
        id: 'service-1',
        title: 'Professional Mobile Repairing',
        description: 'Cracked display? Fast battery drainage? Software brick? Submit mobile details online, get price diagnostic estimates, drop off or mail your device, and track repairs step-by-step.',
        icon: 'Wrench',
        linkText: 'Request Repair Desk →',
        linkUrl: '/repair'
      },
      {
        id: 'service-2',
        title: 'Mobile Repair Training',
        description: 'Learn chip-level soldering and schematics from industry experts. Choose hands-on physical classroom lab training at New Road or study online via pre-recorded videos and study guide PDFs.',
        icon: 'GraduationCap',
        linkText: 'Explore Training Courses →',
        linkUrl: '/training'
      },
      {
        id: 'service-3',
        title: 'Seller & Trader Platform',
        description: 'Are you a trader or retailer? Create a trader profile, list your smart devices to sell live on our storefront, pay a low 10% platform commission fee, and check quick review statuses.',
        icon: 'Store',
        linkText: 'Register Trader Account →',
        linkUrl: '/register'
      }
    ]
  },
  promo_banner_section: {
    bannerBadge: 'Easy Installments',
    bannerHeading: 'BUY NOW, PAY LATER IN MONTHLY INSTALLMENTS',
    bannerDescription: 'Get up to 0% Interest on selected Laptop models, Smartphones, and Tablets across Nepal.',
    bannerButtonText: 'Apply for EMI',
    bannerButtonLink: '/category/all?emi=true',
    bannerGradient: 'from-slate-950 via-[#0a352e] to-slate-950'
  },
  categories_section: {
    categoriesTitle: 'Shop By Categories',
    categoriesViewAllText: 'View All →',
    categoriesViewAllLink: '/category/all'
  },
  new_arrivals_section: {
    arrivalsTitle: 'New Arrivals at Store',
    arrivalsLimit: 5
  },
  limited_deals_section: {
    dealsTitle: 'Limited Time Deals',
    dealsBadgeText: 'ENDS IN',
    dealsLinkText: 'View All Hot Deals →',
    dealsLinkUrl: '/category/all?clearance=true'
  },
  testimonials_section: {
    testimonialsTitle: 'What Our Customers Say',
    testimonials: [
      {
        id: 't-1',
        name: 'Aayush Sharma',
        role: 'Verified Buyer',
        date: '2 days ago',
        stars: 5,
        text: 'Bought an ASUS ROG gaming laptop with EMI service. Smooth transaction, authentic product with official warranty, and doorstep delivery within 24 hours!',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&fit=crop&q=80'
      },
      {
        id: 't-2',
        name: 'Pooja Thapa',
        role: 'Repair Customer',
        date: '1 week ago',
        stars: 5,
        text: 'My iPhone 14 display was replaced in just 45 minutes at their New Road lab. Genuine OLED screen and crystal clear colors. Excellent service!',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&fit=crop&q=80'
      },
      {
        id: 't-3',
        name: 'Rohan Shrestha',
        role: 'Academy Graduate',
        date: '2 weeks ago',
        stars: 5,
        text: 'Completed the Level 3 Advanced Hardware Repair Course. The hands-on microscope soldering and schematic tracing practice gave me the confidence to open my own shop.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&fit=crop&q=80'
      }
    ]
  }
};

const defaultGlobalSections: GlobalSections = {
  promoBar: {
    enabled: false,
    text: '🎉 Shrawan Sale is LIVE! Get up to 30% OFF on all laptops and smartphones!',
    bgColor: '#00AFA2',
    textColor: '#ffffff',
    link: '/category/all',
    linkText: 'Shop Now',
    closeable: true,
    emoji: '🎉',
  },
  announcementBanner: {
    enabled: false,
    type: 'promo',
    message: 'Free delivery on all orders above Rs. 5,000! Limited time offer.',
    icon: '🚚',
    closeable: true,
    link: '',
    linkText: '',
  },
};

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCmsStore = create<CmsStore>()(
  persist(
    (set) => ({
      isEditMode: false,
      setIsEditMode: (mode) => set({ isEditMode: mode }),
      activeEditorId: null,
      setActiveEditorId: (id) => set({ activeEditorId: id }),
      activeImageId: null,
      setActiveImageId: (id) => set({ activeImageId: id }),
      hasUnsavedChanges: false,
      setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

      imageOverrides: {},
      styleOverrides: {},
      setStyleOverrides: (overrides) => set((state) => ({ styleOverrides: { ...state.styleOverrides, ...overrides }, hasUnsavedChanges: true })),
      setImageOverride: (id, url) => set((state) => ({ 
        imageOverrides: { ...state.imageOverrides, [id]: url }, 
        hasUnsavedChanges: true 
      })),

      sectionsByRoute: initialSectionsByRoute,
      currentRoute: "/",
      setCurrentRoute: (route) => set({ currentRoute: route }),
      setSectionsForRoute: (route, sections) => set((state) => ({ sectionsByRoute: { ...state.sectionsByRoute, [route]: sections }, hasUnsavedChanges: true })),
      
      sectionCustomizations: defaultSectionCustomizations,
      setSectionCustomization: (sectionId, data) => set((state) => {
        const baseId = sectionId.split('-')[0];
        const current = state.sectionCustomizations[sectionId] || 
                        defaultSectionCustomizations[baseId] || 
                        defaultSectionCustomizations[sectionId] || {};
        if (typeof window !== 'undefined') {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES' }, '*');
          }
          window.dispatchEvent(new Event('storage'));
        }
        return {
          sectionCustomizations: {
            ...state.sectionCustomizations,
            [sectionId]: { ...current, ...data }
          },
          hasUnsavedChanges: true
        };
      }),

      customSectionsData: {},
      setCustomSectionData: (sectionId, data) => set((state) => {
        const existing = state.customSectionsData[sectionId] || {
          id: sectionId,
          layout: 'split',
          badge: 'FEATURED PROMO',
          title: 'Special Collection & Promotional Deals',
          subtitle: 'Limited Time Exclusive Offers',
          body: 'Discover our newest arrivals with official brand warranties, high-speed repair options, and flexible EMI installment payment plans.',
          ctaText: 'Shop Special Offers',
          ctaLink: '/category/all',
          secondaryCtaText: 'Contact Store',
          secondaryCtaLink: '/#locations',
          imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
          theme: 'primary',
          minHeight: 280,
          paddingY: 3,
          cards: [
            { id: '1', title: 'Premium Laptops', description: 'Up to 25% discount on gaming and ultra-thin laptops.', icon: 'Laptop', badge: 'HOT' },
            { id: '2', title: 'Smart Accessories', description: 'Genuine chargers, earbuds, and premium protective cases.', icon: 'Headphones', badge: 'NEW' },
            { id: '3', title: 'Express Repair', description: 'Same-day certified screen & battery replacement at store.', icon: 'Wrench', badge: 'FAST' }
          ]
        };
        return {
          customSectionsData: {
            ...state.customSectionsData,
            [sectionId]: { ...existing, ...data }
          },
          hasUnsavedChanges: true
        };
      }),

      addBlockToSection: (sectionId, blockType, targetIndex) => set((state) => {
        const existing = state.customSectionsData[sectionId] || {
          id: sectionId,
          layout: 'custom_blocks',
          badge: 'NEW SECTION',
          title: 'Custom Section',
          subtitle: '',
          body: '',
          ctaText: '',
          ctaLink: '',
          theme: 'primary',
          minHeight: 280,
          paddingY: 3,
          blocks: []
        };
        const currentBlocks = existing.blocks || [];
        const newBlock = createDefaultBlock(blockType);
        const updatedBlocks = [...currentBlocks];
        if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= updatedBlocks.length) {
          updatedBlocks.splice(targetIndex, 0, newBlock);
        } else {
          updatedBlocks.push(newBlock);
        }

        return {
          customSectionsData: {
            ...state.customSectionsData,
            [sectionId]: {
              ...existing,
              layout: 'custom_blocks',
              blocks: updatedBlocks
            }
          },
          hasUnsavedChanges: true
        };
      }),

      updateBlockInSection: (sectionId, blockId, data) => set((state) => {
        const existing = state.customSectionsData[sectionId];
        if (!existing || !existing.blocks) return state;
        const updatedBlocks = existing.blocks.map(b => 
          b.id === blockId ? { ...b, data: { ...b.data, ...data } } : b
        );
        return {
          customSectionsData: {
            ...state.customSectionsData,
            [sectionId]: {
              ...existing,
              blocks: updatedBlocks
            }
          },
          hasUnsavedChanges: true
        };
      }),

      removeBlockFromSection: (sectionId, blockId) => set((state) => {
        const existing = state.customSectionsData[sectionId];
        if (!existing || !existing.blocks) return state;
        const updatedBlocks = existing.blocks.filter(b => b.id !== blockId);
        return {
          customSectionsData: {
            ...state.customSectionsData,
            [sectionId]: {
              ...existing,
              blocks: updatedBlocks
            }
          },
          hasUnsavedChanges: true
        };
      }),

      moveBlock: (sectionId, blockId, direction) => set((state) => {
        const existing = state.customSectionsData[sectionId];
        if (!existing || !existing.blocks) return state;
        const blocks = [...existing.blocks];
        const idx = blocks.findIndex(b => b.id === blockId);
        if (idx === -1) return state;
        if (direction === 'up' && idx > 0) {
          [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
        } else if (direction === 'down' && idx < blocks.length - 1) {
          [blocks[idx + 1], blocks[idx]] = [blocks[idx], blocks[idx + 1]];
        } else {
          return state;
        }
        return {
          customSectionsData: {
            ...state.customSectionsData,
            [sectionId]: {
              ...existing,
              blocks
            }
          },
          hasUnsavedChanges: true
        };
      }),

      duplicateBlock: (sectionId, blockId) => set((state) => {
        const existing = state.customSectionsData[sectionId];
        if (!existing || !existing.blocks) return state;
        const blocks = [...existing.blocks];
        const idx = blocks.findIndex(b => b.id === blockId);
        if (idx === -1) return state;
        const blockToDuplicate = blocks[idx];
        const newBlock = {
          ...blockToDuplicate,
          id: `block-${blockToDuplicate.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          data: JSON.parse(JSON.stringify(blockToDuplicate.data))
        };
        blocks.splice(idx + 1, 0, newBlock);
        return {
          customSectionsData: {
            ...state.customSectionsData,
            [sectionId]: {
              ...existing,
              blocks
            }
          },
          hasUnsavedChanges: true
        };
      }),

      moveSectionUp: (id) => set((state) => {
        const route = (!state.currentRoute || state.currentRoute.startsWith('/admin/cms')) ? '/' : state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || state.sectionsByRoute['/'] || initialSectionsByRoute['/'] || [];
        const idx = currentSections.indexOf(id);
        if (idx <= 0) return state;
        const newSections = [...currentSections];
        [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
      }),
      
      moveSectionDown: (id) => set((state) => {
        const route = (!state.currentRoute || state.currentRoute.startsWith('/admin/cms')) ? '/' : state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || state.sectionsByRoute['/'] || initialSectionsByRoute['/'] || [];
        const idx = currentSections.indexOf(id);
        if (idx === -1 || idx === currentSections.length - 1) return state;
        const newSections = [...currentSections];
        [newSections[idx + 1], newSections[idx]] = [newSections[idx], newSections[idx + 1]];
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
      }),
      
      duplicateSection: (id) => set((state) => {
        const route = (!state.currentRoute || state.currentRoute.startsWith('/admin/cms')) ? '/' : state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || state.sectionsByRoute['/'] || initialSectionsByRoute['/'] || [];
        const idx = currentSections.indexOf(id);
        if (idx === -1) return state;
        const newSections = [...currentSections];
        const newId = `${id.split('-')[0]}-${Date.now()}`;
        newSections.splice(idx + 1, 0, newId);
        
        // Copy custom section data if present
        const customData = state.customSectionsData[id];
        const newCustomData = customData ? {
          ...state.customSectionsData,
          [newId]: { ...customData, id: newId }
        } : state.customSectionsData;

        return { 
          sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, 
          customSectionsData: newCustomData,
          hasUnsavedChanges: true 
        };
      }),
      
      deleteSection: (id) => set((state) => {
        const route = (!state.currentRoute || state.currentRoute.startsWith('/admin/cms')) ? '/' : state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || state.sectionsByRoute['/'] || initialSectionsByRoute['/'] || [];
        const newSections = currentSections.filter(sectionId => sectionId !== id);
        return { sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, hasUnsavedChanges: true };
      }),

      clipboardSection: null,
      setClipboardSection: (id) => set({ clipboardSection: id }),
      
      addSection: (route, afterId, sectionType) => {
        const targetRoute = (!route || route.startsWith('/admin/cms')) ? '/' : route;
        const newId = `${sectionType}-${Date.now()}`;
        
        set((state) => {
          let currentSections = (state.sectionsByRoute[targetRoute] && state.sectionsByRoute[targetRoute].length > 0)
            ? [...state.sectionsByRoute[targetRoute]]
            : (targetRoute === '/')
              ? [...(initialSectionsByRoute['/'] || [])]
              : [...(state.sectionsByRoute['/'] || initialSectionsByRoute['/'] || [])];

          // If on home route and default sections were missing, ensure full default set
          if (targetRoute === '/') {
            initialSectionsByRoute['/'].forEach(defId => {
              if (!currentSections.includes(defId)) {
                currentSections.push(defId);
              }
            });
          }
          
          const newSections = [...currentSections];
          if (afterId) {
            const idx = newSections.indexOf(afterId);
            if (idx !== -1) {
              newSections.splice(idx + 1, 0, newId);
            } else {
              newSections.push(newId);
            }
          } else {
            newSections.push(newId);
          }

          // If blank/custom section, pre-seed default editable layout
          const defaultCustomData: CustomSectionConfig = {
            id: newId,
            layout: 'blank',
            badge: 'NEW PROMOTION',
            title: 'Your Promotional Headline Here',
            subtitle: 'Special Store Offers & Highlights',
            body: 'Customize this title, subtitle, CTA button, background color, layout style, or upload custom images and videos.',
            ctaText: 'Explore Now',
            ctaLink: '/category/all',
            secondaryCtaText: 'Learn More',
            secondaryCtaLink: '/#locations',
            imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            theme: 'primary',
            minHeight: 280,
            paddingY: 3,
            cards: [
              { id: '1', title: 'Feature Item 1', description: 'Highlight a top product, service, or ongoing discount.', icon: 'Zap', badge: 'SALE' },
              { id: '2', title: 'Feature Item 2', description: 'Mention fast shipping, official warranty, or support.', icon: 'Shield', badge: 'VERIFIED' },
              { id: '3', title: 'Feature Item 3', description: 'Link directly to any category or special training course.', icon: 'Star', badge: 'POPULAR' }
            ]
          };

          return { 
            sectionsByRoute: { ...state.sectionsByRoute, [targetRoute]: newSections },
            customSectionsData: {
              ...state.customSectionsData,
              [newId]: defaultCustomData
            },
            hasUnsavedChanges: true 
          };
        });

        return newId;
      },
      
      pasteSection: (afterId) => set((state) => {
        if (!state.clipboardSection) return state;
        const route = (!state.currentRoute || state.currentRoute.startsWith('/admin/cms')) ? '/' : state.currentRoute;
        const currentSections = state.sectionsByRoute[route] || state.sectionsByRoute['/'] || initialSectionsByRoute['/'] || [];
        const idx = currentSections.indexOf(afterId);
        if (idx === -1) return state;
        const newSections = [...currentSections];
        const newId = `${state.clipboardSection.split('-')[0]}-${Date.now()}`;
        newSections.splice(idx + 1, 0, newId);
        
        const customData = state.customSectionsData[state.clipboardSection];
        const newCustomData = customData ? {
          ...state.customSectionsData,
          [newId]: { ...customData, id: newId }
        } : state.customSectionsData;

        return { 
          sectionsByRoute: { ...state.sectionsByRoute, [route]: newSections }, 
          customSectionsData: newCustomData,
          hasUnsavedChanges: true 
        };
      }),

      savedAssets: [],
      saveSectionToAssets: (id, name) => set((state) => {
        const baseId = id.split('-')[0];
        const newAsset: SavedAsset = {
          id: baseId,
          name,
          type: 'Section',
          createdAt: new Date().toISOString()
        };
        return { savedAssets: [newAsset, ...state.savedAssets] };
      }),
      saveImageToAssets: (url, name) => set((state) => {
        const newAsset: SavedAsset = {
          id: `img-${Date.now()}`,
          name,
          type: 'Image',
          url,
          createdAt: new Date().toISOString()
        };
        return { savedAssets: [newAsset, ...state.savedAssets] };
      }),
      removeAsset: (id) => set((state) => ({
        savedAssets: state.savedAssets.filter(a => a.id !== id)
      })),

      // ─── Custom Pages ─────────────────────────────────────────────────────
      customPages: [],
      addCustomPage: (page) => {
        const id = `page-${Date.now()}`;
        const cleanSlug = page.slug.replace(/^\//, '').replace(/^p\//, '');
        const newPage: CustomPage = {
          ...page,
          slug: cleanSlug,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const rootRouteKey = `/${cleanSlug}`;
        const legacyRouteKey = `/p/${cleanSlug}`;
        const heroSectionId = `custom-hero-${Date.now()}`;
        const contentSectionId = `custom-cards-${Date.now()}`;

        const defaultHeroConfig: CustomSectionConfig = {
          id: heroSectionId,
          layout: 'centered',
          badge: 'FEATURED PAGE',
          title: page.title,
          subtitle: page.metaDescription || 'Exclusive deals, announcements, and catalog highlights',
          body: page.content || `Welcome to ${page.title}. Discover premium devices, warranty coverage, and certified customer support.`,
          ctaText: 'Explore Catalog',
          ctaLink: '/category/all',
          secondaryCtaText: 'Contact Store',
          secondaryCtaLink: '/#locations',
          imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
          theme: 'primary',
          minHeight: 320,
          paddingY: 4
        };

        const defaultCardsConfig: CustomSectionConfig = {
          id: contentSectionId,
          layout: 'cards',
          badge: 'STORE HIGHLIGHTS',
          title: 'Why Shop with Us',
          subtitle: 'Certified Quality & Customer Service',
          body: 'We provide 100% genuine products with official warranties and express delivery.',
          ctaText: 'Shop All Products',
          ctaLink: '/category/all',
          theme: 'light',
          minHeight: 280,
          paddingY: 3,
          cards: [
            { id: '1', title: '100% Genuine Tech', description: 'Official brand warranties on laptops, tablets, and smartphones.', icon: 'Shield', badge: 'VERIFIED' },
            { id: '2', title: 'Express Delivery', description: 'Fast same-day delivery inside the Valley with careful packaging.', icon: 'Zap', badge: 'FAST' },
            { id: '3', title: '0% EMI Installments', description: 'Hassle-free installment plans available across multiple banks.', icon: 'Star', badge: 'POPULAR' }
          ]
        };

        set((state) => ({
          customPages: [...state.customPages, newPage],
          sectionsByRoute: {
            ...state.sectionsByRoute,
            [rootRouteKey]: [heroSectionId, contentSectionId],
            [legacyRouteKey]: [heroSectionId, contentSectionId]
          },
          customSectionsData: {
            ...state.customSectionsData,
            [heroSectionId]: defaultHeroConfig,
            [contentSectionId]: defaultCardsConfig
          },
          hasUnsavedChanges: true
        }));
        return newPage;
      },
      updateCustomPage: (id, updates) => set((state) => ({
        customPages: state.customPages.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      })),
      deleteCustomPage: (id) => set((state) => {
        const pageToDelete = state.customPages.find(p => p.id === id);
        const newSections = { ...state.sectionsByRoute };
        const newCustomData = { ...state.customSectionsData };

        if (pageToDelete) {
          const cleanSlug = pageToDelete.slug.replace(/^\//, '').replace(/^p\//, '');
          const pageRoutes = [`/${cleanSlug}`, `/p/${cleanSlug}`, cleanSlug];

          pageRoutes.forEach(r => {
            if (newSections[r]) {
              newSections[r].forEach(secId => {
                delete newCustomData[secId];
              });
              delete newSections[r];
            }
          });
        }

        return {
          customPages: state.customPages.filter(p => p.id !== id),
          sectionsByRoute: newSections,
          customSectionsData: newCustomData,
          hasUnsavedChanges: true
        };
      }),

      // ─── Global Sections ──────────────────────────────────────────────────
      globalSections: defaultGlobalSections,
      setPromoBar: (config) => set((state) => ({
        globalSections: {
          ...state.globalSections,
          promoBar: { ...state.globalSections.promoBar, ...config },
        }
      })),
      setAnnouncementBanner: (config) => set((state) => ({
        globalSections: {
          ...state.globalSections,
          announcementBanner: { ...state.globalSections.announcementBanner, ...config },
        }
      })),
    }),
    {
      name: 'cms-store',
      partialize: (state) => ({ 
        sectionsByRoute: state.sectionsByRoute,
        savedAssets: state.savedAssets,
        imageOverrides: state.imageOverrides,
        styleOverrides: state.styleOverrides,
        customPages: state.customPages,
        globalSections: state.globalSections,
        customSectionsData: state.customSectionsData,
        sectionCustomizations: state.sectionCustomizations,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state || !state.sectionsByRoute) return;
        if (state.sectionsByRoute['/']) {
          state.sectionsByRoute['/'] = state.sectionsByRoute['/'].filter(secId => 
            !secId.startsWith('custom-hero-') && 
            !secId.startsWith('custom-cards-') && 
            !secId.startsWith('custom_hero_') && 
            !secId.startsWith('custom_cards_')
          );
        }
      },
    }
  )
);

if (typeof window !== 'undefined') {
  (window as any).__cmsStore = useCmsStore;
  window.addEventListener('storage', (e) => {
    if (e.key === 'cms-store' && e.newValue) {
      useCmsStore.persist.rehydrate();
    }
  });
}
