"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCmsStore, defaultSectionCustomizations } from "@/lib/cms-store";
import SectionEditorWrapper from "@/components/section-editor-wrapper";
import BlockEditorWrapper from "@/components/block-editor-wrapper";
import EditableImage from "@/components/editable-image";
import { INITIAL_CATEGORIES, Product } from "@/lib/db-simulation";
import { useCart } from "@/components/cart-context";
import { getDbProducts, getDbCategories } from "@/app/actions";
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Cpu, 
  Monitor, 
  Projector, 
  Headphones, 
  Compass, 
  Clock, 
  Check,
  X,
  Wrench,
  GraduationCap,
  Store,
  Shield,
  Truck,
  Phone,
  Award,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";

import CustomBlankSection from "@/components/custom-blank-section";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Wrench,
  GraduationCap,
  Store,
  Shield,
  Truck,
  Phone,
  Award,
  Zap,
  Sparkles,
  Star
};

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 170 170" fill="currentColor" {...props}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.17-2.76-2.28-6.5-6.73-11.22-13.38-5.78-8.2-10.21-17.76-13.27-28.7-3.17-11.36-4.77-22.1-4.77-32.22 0-16.27 3.86-29.93 11.59-40.97 7.73-11.05 17.65-16.63 29.77-16.75 6.13 0 12.52 2.21 19.16 6.64 6.63 4.41 11.19 6.62 13.68 6.62 2.12 0 6.44-2.12 12.98-6.35 6.53-4.24 12.56-6.23 18.08-5.97 15.18 1.13 26.64 6.79 34.39 16.99-13.2 8.01-19.69 19.14-19.46 33.39.24 10.6 4.11 19.34 11.62 26.23 7.51 6.89 16.5 10.51 26.97 10.86-2.12 6.36-4.66 12.35-7.61 17.97zM119.33 26.54c0-8.08 2.84-15.65 8.52-22.7 7.21-8.91 16.21-13.72 26.98-14.42.12 1.04.18 1.83.18 2.37 0 7.73-3.03 15.35-9.08 22.86-5.83 7.15-13.64 12.27-23.44 13.56-.35-2.54-.51-5.18-.51-7.79z" />
  </svg>
);

const categoryIcons: { [key: string]: React.ComponentType<any> } = {
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

const arrivalTabs = [
  "Laptop",
  "Monitor",
  "Smart Phone",
  "Macbook",
  "Iphone",
  "Microphone",
  "Earbuds",
  "Headphone",
  "Projector",
  "Speaker",
  "Keyboard",
  "Drone"
];

const testimonials = [
  {
    name: "Arpeet Nemkul",
    date: "13 April 2026",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    stars: 5,
    text: "I had a really great experience purchasing my PC hardware here. All the components were genuine and properly packed, which gave me a lot of confidence..."
  },
  {
    name: "Salina Ranabhat",
    date: "12 May 2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    stars: 5,
    text: "I'm really happy with my purchase from Mobile Store. The customer service was excellent throughout the process, and they made sure the delivery from Ka..."
  },
  {
    name: "Mahesh Verma",
    date: "12 April 2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    stars: 5,
    text: "I am a software engineer and wanted to buy a durable and affordable laptop. I researched and found Acer Nitro V series to be value for money. I saw th..."
  },
  {
    name: "Sunita Shrestha",
    date: "24 June 2026",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    stars: 5,
    text: "Exceptional service! Ordered a new smartphone and it was delivered within 3 hours. The packaging was pristine and the phone works flawlessly. Will shop again."
  },
  {
    name: "Ramesh Thapa",
    date: "18 July 2026",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    stars: 5,
    text: "Very friendly support staff. They helped me choose the right laptop for my daughter's college. Pricing is highly competitive compared to physical shops."
  }
];

const categoryImages: { [key: string]: string } = {
  laptop: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80",
  apple: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=120&h=120&fit=crop&q=80",
  smartphone: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&h=120&fit=crop&q=80",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=120&h=120&fit=crop&q=80",
  "pc-components": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=120&h=120&fit=crop&q=80",
  monitor: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=120&h=120&fit=crop&q=80",
  projector: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=120&h=120&fit=crop&q=80",
  earbuds: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120&h=120&fit=crop&q=80",
  drone: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=120&h=120&fit=crop&q=80",
  headphone: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop&q=80"
};

export default function Home() {
  const { addToCart } = useCart();
  const sectionsByRoute = useCmsStore((state) => state.sectionsByRoute);
  const sectionCustomizations = useCmsStore((state) => state.sectionCustomizations);
  const customSectionsData = useCmsStore((state) => state.customSectionsData);
  const setCurrentRoute = useCmsStore((state) => state.setCurrentRoute);

  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    setCurrentRoute('/');

    const handleUpdate = () => {
      setTick(t => t + 1);
    };
    window.addEventListener('cms-section-added', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cms-section-added', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [setCurrentRoute]);
  
  const defaultSections = [
    'hero_section',
    'categories_section',
    'new_arrivals_section',
    'services_section',
    'promo_banner_section',
    'limited_deals_section',
    'testimonials_section'
  ];

  // Resolve all active sections for the Home page
  const getResolvedSections = () => {
    if (!mounted) return defaultSections;
    
    let rawList = (sectionsByRoute && Array.isArray(sectionsByRoute['/']) && sectionsByRoute['/'].length > 0)
      ? sectionsByRoute['/']
      : defaultSections;

    // Filter out any dynamic page artifacts
    let cleanList = rawList.filter(secId => 
      !secId.startsWith('custom-hero-') && 
      !secId.startsWith('custom-cards-') && 
      !secId.startsWith('custom_hero_') && 
      !secId.startsWith('custom_cards_')
    );

    return cleanList.length > 0 ? cleanList : defaultSections;
  };

  const pageSections = getResolvedSections();

  // Slide Carousel data
  const carouselSlides = [
    {
      id: "xiaomi-pad-8",
      bgGradient: "from-emerald-50/70 to-teal-100/50 border border-card-border",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
      subtitle: "Xiaomi Pad 8",
      title: "Powerfully productive",
      specs: [
        "Snapdragon® 8s Gen 4 Mobile Platform",
        "Massive 9200mAh (typ) Battery, 45W Turbo Charging",
        "11.2-inch 3.2K 144Hz Crystal-Clear Display",
      ],
    },
    {
      id: "asus-rog-strix-g16",
      bgGradient: "from-purple-50/50 to-indigo-100/40 border border-card-border",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
      subtitle: "Asus ROG Gaming Series",
      title: "Rule the battlefield",
      specs: [
        "Intel Core i7 14th Gen Processor",
        "NVIDIA GeForce RTX 4060 GPU",
        "165Hz ROG Nebula Display System",
      ],
    },
    {
      id: "mobile-training-slide",
      bgGradient: "from-teal-50/60 to-green-100/40 border border-card-border",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      subtitle: "Training Academy",
      title: "Hardware Repair Masterclass",
      specs: [
        "Hands-on Micro Soldering & IC Reballing",
        "Physical Labs at New Road or Online Video Course",
        "10+ Years Experienced Expert Mentors",
      ],
    },
    {
      id: "mobile-repair-slide",
      bgGradient: "from-blue-50/60 to-slate-100/40 border border-card-border",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      subtitle: "Repair Services",
      title: "Fast Certified Repairs",
      specs: [
        "Diagnostics, Display, & Battery Fixes",
        "Secure Online Submission & Quick Invoice Cost",
        "Real-Time Step-by-Step Status Tracking",
      ],
    },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ slug: string; name: string; image: string }[]>(INITIAL_CATEGORIES);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(true);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [activeArrivalTab, setActiveArrivalTab] = useState("Laptop");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const arrivalTabs = ["Laptop", "Smart Phone", "Apple", "Tablet", "Headphone"];

  // Xiaomi hero banner interaction states
  const [heroVariant, setHeroVariant] = useState("8GB + 128GB");
  const [heroAddon, setHeroAddon] = useState("Tablet Only");

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 40, minutes: 23, seconds: 14 });

  useEffect(() => {
    // Fetch products from PostgreSQL
    getDbProducts().then((data) => {
      setProducts(data);
    });

    const loadCategories = () => {
      getDbCategories().then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setCategoriesList(cats);
        }
      });
    };

    loadCategories();
    window.addEventListener("categories_updated", loadCategories);
    window.addEventListener("cms_db_synced", loadCategories);

    // Timer countdown loop
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => {
      window.removeEventListener("categories_updated", loadCategories);
      window.removeEventListener("cms_db_synced", loadCategories);
      clearInterval(timer);
    };
  }, []);

  // Autoplay loop for carousel slide transitions (3s interval)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(slideTimer);
  }, [carouselSlides.length]);



  // Helper to calculate active hero price based on interactive configurations
  const getHeroPrice = () => {
    let base = 59999;
    if (heroVariant === "8GB + 256GB") base += 10000;
    if (heroAddon === "With Focus Pen Pro OR Keyboard") base += 8000;
    if (heroAddon === "With Focus Pen Pro & Keyboard") base += 16000;
    return base;
  };

  const handleHeroAddToCart = () => {
    const pad8 = products.find((p) => p.id === "xiaomi-pad-8");
    if (pad8) {
      addToCart(pad8, 1, heroVariant, heroAddon);
    }
  };

  const padLeft = (num: number) => String(num).padStart(2, "0");

  const renderSection = (sectionId: string, index: number) => {
    const baseId = sectionId.split('-')[0];
    const sectionConfig = sectionCustomizations?.[sectionId] || 
                          sectionCustomizations?.[baseId] || 
                          {} as any;

    switch (baseId) {
      case 'hero_section': {
        const heroSlides = sectionConfig.slides && sectionConfig.slides.length > 0 ? sectionConfig.slides : carouselSlides;
        const heroSideBanners = sectionConfig.sideBanners || [];
        const currentSlideIndex = activeSlide % heroSlides.length;

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-xl min-h-[440px] flex flex-col bg-card-bg text-foreground border border-card-border group">
                <div 
                  className="flex transition-transform duration-500 ease-in-out flex-1"
                  style={{ 
                    transform: `translateX(-${currentSlideIndex * (100 / heroSlides.length)}%)`,
                    width: `${heroSlides.length * 100}%`
                  }}
                >
                  {heroSlides.map((slide: any, sIdx: number) => (
                    <div 
                      key={slide.id || sIdx}
                      style={{ width: `${100 / heroSlides.length}%` }}
                      className={`flex-shrink-0 p-8 md:p-12 flex flex-col-reverse md:flex-row items-center gap-8 justify-between relative min-h-[440px] ${
                        sIdx === 0 ? 'bg-gradient-to-r from-[#edf7f6] to-[#e4f0ee]' :
                        sIdx === 1 ? 'bg-gradient-to-r from-[#f3f1fa] to-[#e7e4f8]' :
                        sIdx === 2 ? 'bg-gradient-to-r from-teal-50/60 to-green-100/40' :
                        'bg-gradient-to-r from-purple-50/50 to-indigo-100/40'
                      }`}
                    >
                      <div className="flex-1 flex items-center justify-center relative w-full">
                        <div className="w-52 h-36 md:w-64 md:h-48 relative shrink-0 flex items-center justify-center">
                          {slide.image && (
                            <EditableImage 
                              imageId={`dynamic-img-${sIdx + 1}`} 
                              defaultSrc={slide.image}
                              alt={slide.title}
                              className="object-contain w-full h-full drop-shadow-xl hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-4 text-center md:text-left flex flex-col justify-center items-center md:items-start z-10 text-foreground">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{slide.subtitle}</span>
                          <h2 className="text-2xl md:text-3xl font-black mt-1 tracking-tight text-[#0d1e1c]">
                            {slide.title}
                          </h2>
                        </div>
                        {slide.specs && slide.specs.length > 0 && (
                          <ul className="text-xs text-foreground/80 space-y-1.5 text-left">
                            {slide.specs.map((spec: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 font-medium">
                                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {spec}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex items-center gap-6 pt-3.5 border-t border-card-border/60 w-full justify-center md:justify-start">
                          {slide.dealPrice && (
                            <div>
                              <div className="text-[9px] uppercase font-bold text-slate-500">Price</div>
                              <div className="text-lg font-black text-foreground">{slide.dealPrice}</div>
                            </div>
                          )}
                          <Link
                            href={slide.buttonLink || '/category/all'}
                            className="border border-card-border bg-transparent hover:bg-slate-900 hover:text-white text-foreground text-xs font-black tracking-widest px-6 py-2.5 rounded-md transition-all uppercase block w-max text-center cursor-pointer"
                          >
                            {slide.buttonText || 'Shop Now'} &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                  {heroSlides.map((_: any, dotIdx: number) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveSlide(dotIdx)}
                      className={`transition-all rounded-full ${
                        dotIdx === currentSlideIndex ? 'bg-primary w-5 h-1.5' : 'bg-white/60 w-1.5 h-1.5 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {heroSideBanners.slice(0, 2).map((banner: any, bIdx: number) => (
                  <div
                    key={banner.id || bIdx}
                    className={`flex-1 rounded-3xl p-6 relative overflow-hidden shadow-lg border border-card-border flex flex-col justify-between group ${
                      bIdx === 0 ? 'bg-gradient-to-br from-slate-900 to-slate-950 text-white' : 'bg-gradient-to-br from-teal-950 to-slate-900 text-white'
                    }`}
                  >
                    <div className="space-y-2 z-10">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-0.5 rounded-full border border-primary/30 w-max inline-block">
                        {banner.badge || 'SPECIAL OFFER'}
                      </span>
                      <h3 className="text-lg font-black text-white leading-snug">
                        {banner.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {banner.subtitle}
                      </p>
                    </div>
                    <Link
                      href={banner.link || '/category/all'}
                      className="mt-4 z-10 w-max px-4 py-2 bg-primary hover:opacity-90 text-[#0d1e1c] font-black text-[11px] rounded-lg transition-opacity uppercase tracking-wider block"
                    >
                      {banner.linkText || 'Explore Now'} &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      case 'categories_section': {
        const catTitle = sectionConfig.categoriesTitle || "Shop By Categories";
        const catLinkText = sectionConfig.categoriesViewAllText || "View All →";
        const catLinkUrl = sectionConfig.categoriesViewAllLink || "/category/all";

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between border-b border-card-border pb-4 mb-6">
                <h2 className="text-2xl font-black text-foreground tracking-tight">{catTitle}</h2>
                <Link href={catLinkUrl} className="text-xs font-bold text-primary hover:underline">
                  {catLinkText}
                </Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
                {categoriesList.map((cat) => {
                  const imgUrl = cat.image || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80";
                  return (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex flex-col items-center p-4 bg-card-bg rounded-2xl hover:scale-105 hover:shadow-md border border-card-border hover:border-primary/20 transition-all text-center group"
                    >
                      <div className="w-16 h-16 rounded-full bg-background border border-card-border overflow-hidden flex items-center justify-center mb-3 transition-transform group-hover:scale-105 duration-200">
                        <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <span className="text-[11px] font-bold text-foreground/80 group-hover:text-primary transition-colors truncate w-full">
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      case 'services_section': {
        const servicesTitle = sectionConfig.title || "Our Core Services";
        const servicesSubtitle = sectionConfig.subtitle || "All-in-one Mobile Solutions";
        const activeServices = sectionConfig.services || [];

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="max-w-7xl mx-auto px-6 space-y-6">
              <div className="flex items-center justify-between border-b border-card-border pb-4 mb-2">
                <h2 className="text-2xl font-black text-foreground tracking-tight">{servicesTitle}</h2>
                <span className="text-[10px] uppercase font-bold text-slate-400">{servicesSubtitle}</span>
              </div>
              <div className={`grid grid-cols-1 ${activeServices.length === 1 ? 'md:grid-cols-1' : activeServices.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8`}>
                {activeServices.map((service: any, sIdx: number) => (
                  <div key={service.id || sIdx} className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 hover:shadow-xl transition-all flex flex-col justify-between group hover:border-primary/40">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-xs text-foreground/60 leading-relaxed">{service.description}</p>
                    </div>
                    <Link href={service.linkUrl || '/repair'} className="mt-4 w-full py-2.5 bg-primary hover:bg-primary-hover font-bold text-xs uppercase text-[#0d1e1c] rounded-xl text-center shadow-md active:scale-95 transition-all block">
                      {service.linkText || 'Learn More →'}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      case 'promo_banner_section': {
        const badge = sectionConfig.bannerBadge || "Easy Installments";
        const heading = sectionConfig.bannerHeading || "BUY NOW, PAY LATER IN MONTHLY INSTALLMENTS";
        const desc = sectionConfig.bannerDescription || "Get up to 0% Interest on selected Laptop models, Smartphones, and Tablets across Nepal.";
        const btnText = sectionConfig.bannerButtonText || "Apply for EMI";
        const btnLink = sectionConfig.bannerButtonLink || "/category/all?emi=true";

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="max-w-7xl mx-auto px-6">
              <div className="w-full rounded-3xl bg-gradient-to-r from-slate-950 via-[#0a352e] to-slate-950 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-[#00AFA2]/15">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[10px] font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase">{badge}</span>
                  <h3 className="text-2xl font-extrabold tracking-tight">{heading}</h3>
                  <p className="text-xs text-slate-300">{desc}</p>
                </div>
                <Link href={btnLink} className="px-6 py-3 bg-primary text-[#0d1e1c] hover:opacity-90 font-extrabold text-xs uppercase rounded-full shadow-md tracking-wider flex-shrink-0 transition-opacity">
                  {btnText}
                </Link>
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      case 'new_arrivals_section': {
        const arrivalsTitle = sectionConfig.arrivalsTitle || "New Arrivals at Store";
        const limit = sectionConfig.arrivalsLimit || 5;
        const filteredProducts = products.filter(p => {
          const cat = p.category ? p.category.toLowerCase() : "";
          const tab = activeArrivalTab.toLowerCase();
          if (tab === "smart phone") return cat === "smartphone" || cat === "smart phone" || cat === "mobile";
          if (tab === "headphone") return cat === "headphone" || cat === "headphones";
          return cat === tab;
        });
        const displayProducts = (filteredProducts.length > 0 ? filteredProducts : products).slice(0, limit);

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col border-b border-card-border pb-2 mb-6">
                <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">{arrivalsTitle}</h2>
                <div className="flex items-center gap-6 overflow-x-auto pb-3 scrollbar-none">
                  {arrivalTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveArrivalTab(tab)}
                      className={`text-sm font-semibold whitespace-nowrap pb-2 relative transition-colors ${
                        activeArrivalTab === tab ? "text-primary" : "text-foreground/50 hover:text-foreground"
                      }`}
                    >
                      {tab}
                      {activeArrivalTab === tab && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayProducts.map((product) => (
                  <div key={product.id} className="bg-card-bg border border-card-border rounded-[2rem] overflow-hidden p-3.5 relative group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <Link href={`/product/${product.id}`} className="block h-40 w-full relative overflow-hidden bg-background/80 rounded-[1.5rem] mb-3 flex items-center justify-center">
                        <EditableImage imageId={`arrival-img-${product.id}`} defaultSrc={product.image} alt={product.title} className="object-contain max-h-[85%] max-w-[85%] group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute bottom-2.5 right-2.5 bg-red-50 text-red-600 border border-red-200/50 text-[9px] font-black px-2 py-0.5 rounded-md">
                          {product.discount > 0 ? product.discount : 5}% OFF
                        </span>
                      </Link>
                      <h3 className="text-[13px] font-bold text-foreground leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">
                        <Link href={`/product/${product.id}`}>{product.title}</Link>
                      </h3>
                    </div>
                    <div>
                      <div className="text-sm font-black text-foreground">Rs. {product.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      case 'limited_deals_section': {
        const dealsTitle = sectionConfig.dealsTitle || "Limited Time Deals";
        const badgeText = sectionConfig.dealsBadgeText || "ENDS IN";
        const linkText = sectionConfig.dealsLinkText || "View All Hot Deals →";
        const linkUrl = sectionConfig.dealsLinkUrl || "/category/all?clearance=true";

        const dealsProducts = products.filter(p => p.discount > 0).slice(0, 5);
        const displayDeals = dealsProducts.length > 0 ? dealsProducts : products.slice(0, 5);

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border pb-4 mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-foreground tracking-tight">{dealsTitle}</h2>
                  <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 p-[1.5px] rounded-full shadow-sm">
                    <div className="bg-card rounded-full px-4 py-1 flex items-center gap-1 text-[11px] font-bold text-foreground">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mr-1">{badgeText}</span>
                      <span className="font-mono text-foreground text-xs font-black">{padLeft(timeLeft.hours)}</span>
                      <span className="text-[9px] text-orange-500 font-black mr-1">H</span>
                      <span className="text-slate-300">:</span>
                      <span className="font-mono text-foreground text-xs font-black ml-1">{padLeft(timeLeft.minutes)}</span>
                      <span className="text-[9px] text-pink-500 font-black mr-1">M</span>
                      <span className="text-slate-300">:</span>
                      <span className="font-mono text-foreground text-xs font-black ml-1">{padLeft(timeLeft.seconds)}</span>
                      <span className="text-[9px] text-purple-500 font-black">S</span>
                    </div>
                  </div>
                </div>
                <Link href={linkUrl} className="text-xs font-bold text-primary hover:underline">{linkText}</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayDeals.map((product) => (
                  <div key={product.id} className="bg-card-bg border border-card-border rounded-[2rem] overflow-hidden p-3.5 relative group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <span className="absolute top-3 left-3 bg-purple-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full z-10">
                        {product.discount > 0 ? product.discount : 3}% OFF
                      </span>
                      <Link href={`/product/${product.id}`} className="block h-40 w-full relative overflow-hidden bg-background/80 rounded-[1.5rem] mb-3 flex items-center justify-center">
                        <EditableImage imageId={`deal-img-${product.id}`} defaultSrc={product.image} alt={product.title} className="object-contain max-h-[85%] max-w-[85%] group-hover:scale-105 transition-transform duration-300" />
                      </Link>
                      <h3 className="text-[13px] font-bold text-foreground leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">
                        <Link href={`/product/${product.id}`}>{product.title}</Link>
                      </h3>
                    </div>
                    <div className="text-sm font-black text-foreground">Rs. {product.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      case 'testimonials_section': {
        const testTitle = sectionConfig.testimonialsTitle || "What Our Customers Say";
        const activeTestimonials = sectionConfig.testimonials || testimonials;

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="bg-background py-12 border-y border-card-border/50">
              <div className="max-w-7xl mx-auto px-6 relative">
                <h2 className="text-3xl md:text-4xl font-black text-center text-foreground mb-10 tracking-tight">{testTitle}</h2>
                <div className="relative px-8">
                  <button onClick={() => setTestimonialIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length)} className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-card-border bg-card-bg flex items-center justify-center text-foreground hover:bg-black/5 z-10 shadow transition-all cursor-pointer">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[0, 1, 2].map((offset) => {
                      const index = (testimonialIndex + offset) % activeTestimonials.length;
                      const t: any = activeTestimonials[index];
                      if (!t) return null;
                      return (
                        <div key={t.id || index} className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-card-border" />
                              <div>
                                <h4 className="font-extrabold text-sm text-foreground leading-tight">{t.name}</h4>
                                <p className="text-[10px] text-foreground/45 font-medium mt-0.5">{t.role || t.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-yellow-400">
                              {[...Array(t.stars || 5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                            </div>
                            <p className="text-xs text-foreground/70 leading-relaxed">{t.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setTestimonialIndex((prev) => (prev + 1) % activeTestimonials.length)} className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-card-border bg-card-bg flex items-center justify-center text-foreground hover:bg-black/5 z-10 shadow transition-all cursor-pointer">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      default:
        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <CustomBlankSection sectionId={sectionId} />
          </SectionEditorWrapper>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground space-y-12 pb-16">
      {pageSections.map(renderSection)}

      {/* 5. Floating WhatsApp Assist Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Welcome Bubble */}
        {showWelcomeBubble && !isChatBoxOpen && (
          <div className="bg-gradient-to-br from-[#1c302d] via-[#203633] to-[#1a2b29] border border-[#2e4c49]/40 text-white p-4 rounded-2xl shadow-xl mb-4 max-w-xs relative animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowWelcomeBubble(false);
              }}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="space-y-1 pr-6">
              <h4 className="font-extrabold text-sm tracking-wide">Welcome to our site!</h4>
              <p className="text-xs text-white/90 leading-relaxed">
                Need help? Text us on WhatsApp, we're online!
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Chat Drawer Panel */}
        {isChatBoxOpen && (
          <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl mb-4 overflow-hidden w-72 animate-in fade-in slide-in-from-bottom-2 duration-200 text-foreground">
            {/* Green Header */}
            <div className="bg-[#075e54] text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center flex-shrink-0">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">WhatsApp Chat</h4>
                <p className="text-[10px] text-emerald-100 font-medium leading-none mt-1">Connect with us instantly</p>
              </div>
            </div>

            {/* Body content */}
            <div className="p-4 bg-card  space-y-4">
              <p className="text-xs text-foreground/75 leading-relaxed">
                Have questions? Chat with our team directly on WhatsApp.
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=9779851052140&text=Hi,%20I'm%20interested%20in%20your%20products!"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25d366] hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all duration-200"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                Start Chat
              </a>
            </div>
          </div>
        )}

        {/* Main Floating Trigger Icon */}
        <button
          onClick={() => {
            setIsChatBoxOpen((prev) => !prev);
            setShowWelcomeBubble(false);
          }}
          className="w-14 h-14 bg-[#25d366] hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:rotate-6 cursor-pointer relative"
        >
          <WhatsAppIcon className="w-7 h-7 text-white" />
          
          {/* Unread Badge indicator */}
          {showWelcomeBubble && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-card-bg shadow-sm">
              1
            </span>
          )}
        </button>
      </div>

    </div>
  );
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.008 14.07 1.01 11.5 1.01c-5.45 0-9.877 4.373-9.881 9.803-.001 1.77.476 3.498 1.38 5.011l-.995 3.634 3.743-.974zm12.39-5.104c-.318-.158-1.884-.919-2.176-1.025-.291-.106-.504-.158-.716.158-.212.318-.822.999-1.008 1.218-.186.218-.371.245-.69.088-.318-.158-1.343-.49-2.558-1.562-.945-.833-1.583-1.862-1.768-2.18-.186-.318-.02-.49.139-.647.144-.141.318-.371.477-.557.158-.186.212-.318.318-.53.106-.212.053-.397-.026-.556-.08-.158-.716-1.701-.981-2.338-.258-.614-.522-.531-.716-.541-.186-.01-.397-.01-.61-.01-.212 0-.557.08-.849.397-.291.318-1.114 1.087-1.114 2.65 0 1.562 1.14 3.072 1.299 3.284.159.212 2.242 3.387 5.43 4.743.758.322 1.349.515 1.81.657.76.24 1.453.206 2.001.125.612-.09 1.884-.761 2.15-1.486.265-.724.265-1.347.185-1.48-.08-.13-.298-.21-.616-.368z" />
  </svg>
);
