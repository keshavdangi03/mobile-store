"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCmsStore } from "@/lib/cms-store";
import SectionEditorWrapper from "@/components/section-editor-wrapper";
import BlockEditorWrapper from "@/components/block-editor-wrapper";
import EditableImage from "@/components/editable-image";
import { INITIAL_CATEGORIES, Product } from "@/lib/db-simulation";
import { useCart } from "@/components/cart-context";
import { getDbProducts } from "@/app/actions";
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
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";

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
  headphone: Headphones
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
  const { isEditMode, sectionsByRoute } = useCmsStore();
  
  let pageSections = sectionsByRoute['/'] || [];
  if (pageSections.length > 0) {
    if (!pageSections.includes('new_arrivals_section')) {
      const catIdx = pageSections.indexOf('categories_section');
      if (catIdx !== -1) {
        pageSections = [
          ...pageSections.slice(0, catIdx + 1),
          'new_arrivals_section',
          ...pageSections.slice(catIdx + 1)
        ];
      } else {
        pageSections.push('new_arrivals_section');
      }
    }
    if (!pageSections.includes('testimonials_section')) {
      pageSections.push('testimonials_section');
    }
  }

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

    const savedCats = localStorage.getItem("expert_mobile_categories");
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      const needsMigration = parsed.some((c: any) => !c.image && c.icon);
      if (needsMigration) {
        localStorage.setItem("expert_mobile_categories", JSON.stringify(INITIAL_CATEGORIES));
        setCategoriesList(INITIAL_CATEGORIES);
      } else {
        setCategoriesList(parsed);
      }
    }

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

    return () => clearInterval(timer);
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
    switch (baseId) {      case 'hero_section': return (
      <SectionEditorWrapper key={sectionId} sectionId={sectionId}>

      <section className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Carousel Slide Box */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-xl min-h-[440px] flex flex-col bg-card-bg text-foreground border border-card-border group">
          {/* Sliding Carousel Track */}
          <div 
            className="flex transition-transform duration-500 ease-in-out flex-1"
            style={{ 
              transform: `translateX(-${activeSlide * 25}%)`,
              width: "400%"
            }}
          >
            {/* Slide 1: Interactive Xiaomi Pad 8 */}
            <div className="w-1/4 flex-shrink-0 p-8 md:p-12 flex flex-col-reverse md:flex-row items-center gap-8 justify-between bg-gradient-to-r from-[#edf7f6] to-[#e4f0ee] relative min-h-[440px]">
              
              {/* Product Mockup Image on the left */}
              <div className="flex-1 flex items-center justify-center relative w-full">
                <div className="w-52 h-36 md:w-64 md:h-48 relative shrink-0">
                  <EditableImage 
                    imageId="dynamic-img-1" 
                    defaultSrc={carouselSlides[0].image!}
                    alt="Xiaomi Pad 8"
                    className="object-contain w-full h-full drop-shadow-xl hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Text Info & Config Block on the right */}
              <div className="flex-1 space-y-5 text-center md:text-left flex flex-col justify-center items-center md:items-start z-10 text-foreground">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{carouselSlides[0].subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-1 tracking-tight text-[#0d1e1c]">
                    {carouselSlides[0].title}
                  </h2>
                </div>

                {/* Configuration Interactive Pills */}
                <div className="space-y-3 pt-1 w-full flex flex-col items-center md:items-start">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] uppercase font-black text-slate-500">Config:</span>
                    {["8GB + 128GB", "8GB + 256GB"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setHeroVariant(v)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black transition-all border cursor-pointer ${
                          heroVariant === v
                            ? "bg-slate-900 border-card-border text-white shadow-sm"
                            : "bg-transparent border-card-border hover:bg-black/5 text-foreground/75"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] uppercase font-black text-slate-500">Bundle:</span>
                    {["Tablet Only", "With Focus Pen Pro OR Keyboard", "With Focus Pen Pro & Keyboard"].map((a) => (
                      <button
                        key={a}
                        onClick={() => setHeroAddon(a)}
                        className={`px-3 py-1 rounded-full text-[9px] font-black transition-all border cursor-pointer ${
                          heroAddon === a
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-transparent border-card-border hover:bg-black/5 text-foreground/75"
                        }`}
                      >
                        {a === "Tablet Only" ? "Only" : a.replace("With ", "")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Price & outline CTA Button */}
                <div className="flex items-center gap-6 pt-3.5 border-t border-card-border/60 w-full justify-center md:justify-start">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">Total Price</div>
                    <div className="text-xl font-black text-foreground">Rs. {getHeroPrice().toLocaleString()}</div>
                  </div>
                  <button
                    onClick={handleHeroAddToCart}
                    className="border border-card-border bg-transparent hover:bg-slate-900 hover:text-white text-foreground text-xs font-black tracking-widest px-6 py-2.5 rounded-md transition-all uppercase cursor-pointer"
                  >
                    Shop Now &rarr;
                  </button>
                </div>
              </div>

            </div>

            {/* Slide 2: ASUS ROG */}
            <div className="w-1/4 flex-shrink-0 p-8 md:p-12 flex flex-col-reverse md:flex-row items-center gap-8 justify-between bg-gradient-to-r from-[#f3f1fa] to-[#e7e4f8] relative min-h-[440px]">
              
              {/* Laptop Image Mockup on the left */}
              <div className="flex-1 flex items-center justify-center relative w-full">
                <div className="w-52 h-36 md:w-64 md:h-48 relative shrink-0">
                  <EditableImage 
                    imageId="dynamic-img-2" 
                    defaultSrc={carouselSlides[1].image!}
                    alt="Asus ROG"
                    className="object-contain w-full h-full drop-shadow-xl hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Text Info Block on the right */}
              <div className="flex-1 space-y-5 text-center md:text-left flex flex-col justify-center items-center md:items-start z-10 text-foreground">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{carouselSlides[1].subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-1 tracking-tight text-[#0d1e1c]">
                    {carouselSlides[1].title}
                  </h2>
                </div>

                <ul className="text-xs text-foreground/80 space-y-2.5 text-left">
                  {carouselSlides[1].specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 font-medium">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-6 pt-3.5 border-t border-card-border/60 w-full justify-center md:justify-start">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">Deal Price</div>
                    <div className="text-xl font-black text-foreground">Rs. 189,999</div>
                  </div>
                  <Link
                    href="/product/asus-rog-strix-g16"
                    className="border border-card-border bg-transparent hover:bg-slate-900 hover:text-white text-foreground text-xs font-black tracking-widest px-6 py-2.5 rounded-md transition-all uppercase block w-max text-center cursor-pointer"
                  >
                    View Specs &rarr;
                  </Link>
                </div>
              </div>

            </div>

            {/* Slide 3: Mobile Training Academy */}
            <div className="w-1/4 flex-shrink-0 p-8 md:p-12 flex flex-col-reverse md:flex-row items-center gap-8 justify-between bg-gradient-to-r from-[#edf8f6] to-[#e0f1ee] relative overflow-hidden min-h-[440px]">
              <video 
                src={carouselSlides[2].videoUrl} 
                autoPlay loop muted playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none mix-blend-overlay" 
              />
              
              {/* Decorative Icon on the left */}
              <div className="flex-1 flex items-center justify-center relative w-full z-10">
                <div className="w-48 h-48 md:w-56 md:h-56 relative shrink-0 flex items-center justify-center bg-card/40 border border-card-border rounded-full shadow-inner animate-pulse">
                  <GraduationCap className="w-20 h-20 text-primary" />
                </div>
              </div>

              {/* Text Info Block on the right */}
              <div className="flex-1 space-y-5 text-center md:text-left flex flex-col justify-center items-center md:items-start z-10 text-foreground">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{carouselSlides[2].subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-1 tracking-tight text-[#0d1e1c]">
                    {carouselSlides[2].title}
                  </h2>
                </div>

                <ul className="text-xs text-foreground/80 space-y-2.5 text-left">
                  {carouselSlides[2].specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 font-medium">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>

                <div className="pt-3.5 w-full flex justify-center md:justify-start">
                  <Link
                    href="/training"
                    className="border border-card-border bg-transparent hover:bg-slate-900 hover:text-white text-foreground text-xs font-black tracking-widest px-6 py-2.5 rounded-md transition-all uppercase block w-max text-center cursor-pointer"
                  >
                    Join Academy &rarr;
                  </Link>
                </div>
              </div>

            </div>

            {/* Slide 4: Mobile Repair */}
            <div className="w-1/4 flex-shrink-0 p-8 md:p-12 flex flex-col-reverse md:flex-row items-center gap-8 justify-between bg-gradient-to-r from-[#edf2f8] to-[#e0e9f4] relative overflow-hidden min-h-[440px]">
              <video 
                src={carouselSlides[3].videoUrl} 
                autoPlay loop muted playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none mix-blend-overlay" 
              />
              
              {/* Decorative Icon on the left */}
              <div className="flex-1 flex items-center justify-center relative w-full z-10">
                <div className="w-48 h-48 md:w-56 md:h-56 relative shrink-0 flex items-center justify-center bg-card/40 border border-card-border rounded-full shadow-inner animate-pulse">
                  <Wrench className="w-20 h-20 text-primary" />
                </div>
              </div>

              {/* Text Info Block on the right */}
              <div className="flex-1 space-y-5 text-center md:text-left flex flex-col justify-center items-center md:items-start z-10 text-foreground">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{carouselSlides[3].subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-1 tracking-tight text-[#0d1e1c]">
                    {carouselSlides[3].title}
                  </h2>
                </div>

                <ul className="text-xs text-foreground/80 space-y-2.5 text-left">
                  {carouselSlides[3].specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 font-medium">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>

                <div className="pt-3.5 w-full flex justify-center md:justify-start">
                  <Link
                    href="/repair"
                    className="border border-card-border bg-transparent hover:bg-slate-900 hover:text-white text-foreground text-xs font-black tracking-widest px-6 py-2.5 rounded-md transition-all uppercase block w-max text-center cursor-pointer"
                  >
                    Request Repair &rarr;
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 border-2 cursor-pointer ${
                  activeSlide === idx 
                    ? "bg-primary border-primary w-6" 
                    : "bg-transparent border-primary/70 w-2.5 hover:bg-primary/10"
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows (visible on hover) */}
          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center text-foreground hover:bg-background shadow-md cursor-pointer z-20 transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center text-foreground hover:bg-background shadow-md cursor-pointer z-20 transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Side Banner Cards */}
        <div className="flex flex-col gap-6">
          {/* Side Promo 1: Projectors */}
          <div className="flex-1 rounded-3xl overflow-hidden relative shadow-lg bg-card-bg border border-card-border p-6 flex flex-col justify-between min-h-[200px]">
            <div className="absolute top-0 right-0 w-36 h-full select-none z-0">
              <EditableImage imageId="static-img-4" defaultSrc="https://images.unsplash.com/photo-1535016120720-40c646be5580?w=200" className="object-cover w-full h-full" />
            </div>
            <div className="z-10 text-foreground space-y-2 max-w-[65%]">
              <div className="text-[10px] font-black text-[#00AFA2] uppercase tracking-widest">Projectors & Screens</div>
              <h3 className="text-lg font-extrabold leading-tight text-foreground">Grab Special Offers on Projectors</h3>
              <p className="text-xs text-foreground/75">Transform your living room into a theater.</p>
            </div>
            <Link
              href="/category/projector"
              className="z-10 w-max px-5 py-2.5 bg-primary hover:opacity-90 text-[#0d1e1c] font-black text-[11px] rounded-lg transition-opacity uppercase tracking-wider"
            >
              Shop Now &rarr;
            </Link>
          </div>

          {/* Side Promo 2: Smartphones */}
          <div className="flex-1 rounded-3xl overflow-hidden relative shadow-lg bg-card-bg border border-card-border p-6 flex flex-col justify-between min-h-[200px]">
            <div className="absolute top-0 right-0 w-36 h-full select-none z-0">
              <EditableImage imageId="static-img-5" defaultSrc="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200" className="object-cover w-full h-full" />
            </div>
            <div className="z-10 text-foreground space-y-2 max-w-[65%]">
              <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Best Deals</div>
              <h3 className="text-lg font-extrabold leading-tight text-foreground">Best Deals on Smartphones</h3>
              <p className="text-xs text-foreground/75">Smart choices, Smart savings, Smart prices.</p>
            </div>
            <Link
              href="/category/smartphone"
              className="z-10 w-max px-5 py-2.5 bg-primary hover:opacity-90 text-[#0d1e1c] font-black text-[11px] rounded-lg transition-opacity uppercase tracking-wider"
            >
              View Sales &rarr;
            </Link>
          </div>
        </div>

      </section>

            </SectionEditorWrapper>
);
      case 'categories_section': return (
      <SectionEditorWrapper key={sectionId} sectionId={sectionId}>

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between border-b border-card-border pb-4 mb-6">
          <h2 className="text-2xl font-black text-foreground tracking-tight">Shop By Categories</h2>
          <Link href="/category/all" className="text-xs font-bold text-primary hover:underline">
            View All &rarr;
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
                  <img
                    src={imgUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
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
      case 'services_section': return (
      <SectionEditorWrapper key={sectionId} sectionId={sectionId}>

      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex items-center justify-between border-b border-card-border pb-4 mb-2">
          <h2 className="text-2xl font-black text-foreground tracking-tight">Our Core Services</h2>
          <span className="text-[10px] uppercase font-bold text-slate-400">All-in-one Mobile Solutions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Mobile Repair Services */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 hover:shadow-xl transition-all flex flex-col justify-between group hover:border-primary/40">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">Professional Mobile Repairing</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Cracked display? Fast battery drainage? Software brick? Submit mobile details online, get price diagnostic estimates, drop off or mail your device, and track repairs step-by-step.
              </p>
            </div>
            <Link
              href="/repair"
              className="mt-4 w-full py-2.5 bg-primary hover:bg-primary-hover font-bold text-xs uppercase text-[#0d1e1c] rounded-xl text-center shadow-md active:scale-95 transition-all block"
            >
              Request Repair Desk &rarr;
            </Link>
          </div>

          {/* Card 2: Mobile Training Academy */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 hover:shadow-xl transition-all flex flex-col justify-between group hover:border-primary/40">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">Mobile Repair Training</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Learn chip-level soldering and schematics from industry experts. Choose hands-on physical classroom lab training at New Road or study online via pre-recorded videos and study guide PDFs.
              </p>
            </div>
            <Link
              href="/training"
              className="mt-4 w-full py-2.5 bg-primary hover:bg-primary-hover font-bold text-xs uppercase text-[#0d1e1c] rounded-xl text-center shadow-md active:scale-95 transition-all block"
            >
              Explore Training Courses &rarr;
            </Link>
          </div>

          {/* Card 3: Trader Listing Hub */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 hover:shadow-xl transition-all flex flex-col justify-between group hover:border-primary/40">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">Seller & Trader Platform</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Are you a trader or retailer? Create a trader profile, list your smart devices to sell live on our storefront, pay a low 10% platform commission fee, and check quick review statuses.
              </p>
            </div>
            <Link
              href="/register"
              className="mt-4 w-full py-2.5 bg-primary hover:bg-primary-hover font-bold text-xs uppercase text-[#0d1e1c] rounded-xl text-center shadow-md active:scale-95 transition-all block"
            >
              Register Trader Account &rarr;
            </Link>
          </div>

        </div>
      </section>

            </SectionEditorWrapper>
);
      case 'promo_banner_section': return (
      <SectionEditorWrapper key={sectionId} sectionId={sectionId}>

      <section className="max-w-7xl mx-auto px-6">
        <div className="w-full rounded-3xl bg-gradient-to-r from-slate-950 via-[#0a352e] to-slate-950 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-[#00AFA2]/15">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase">Easy Installments</span>
            <h3 className="text-2xl font-extrabold tracking-tight">BUY NOW, PAY LATER IN MONTHLY INSTALLMENTS</h3>
            <p className="text-xs text-slate-300">Get up to 0% Interest on selected Laptop models, Smartphones, and Tablets across Nepal.</p>
          </div>
          <Link
            href="/category/all?emi=true"
            className="px-6 py-3 bg-primary text-[#0d1e1c] hover:opacity-90 font-extrabold text-xs uppercase rounded-full shadow-md tracking-wider flex-shrink-0 transition-opacity"
          >
            Apply for EMI
          </Link>
        </div>
      </section>

            </SectionEditorWrapper>
);
      case 'new_arrivals_section': {
        const filteredProducts = products.filter(p => {
          const cat = p.category ? p.category.toLowerCase() : "";
          const tab = activeArrivalTab.toLowerCase();
          if (tab === "smart phone") return cat === "smartphone" || cat === "smart phone" || cat === "mobile";
          if (tab === "headphone") return cat === "headphone" || cat === "headphones";
          return cat === tab;
        });
        const displayProducts = filteredProducts.length > 0 ? filteredProducts.slice(0, 5) : products.slice(0, 5);

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col border-b border-card-border pb-2 mb-6">
                <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">New Arrivals at Store</h2>
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
                      {activeArrivalTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayProducts.map((product) => {
                  const discountPercent = product.discount > 0 ? product.discount : 5;
                  return (
                    <div
                      key={product.id}
                      className="bg-card-bg border border-card-border rounded-[2rem] overflow-hidden p-3.5 relative group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image box */}
                        <Link href={`/product/${product.id}`} className="block h-40 w-full relative overflow-hidden bg-background/80 rounded-[1.5rem] mb-3 flex items-center justify-center">
                          <EditableImage imageId={`arrival-img-${product.id}`} defaultSrc={product.image}
                            alt={product.title}
                            className="object-contain max-h-[85%] max-w-[85%] group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Discount tag bottom right */}
                          <span className="absolute bottom-2.5 right-2.5 bg-red-50 text-red-600 border border-red-200/50 text-[9px] font-black px-2 py-0.5 rounded-md">
                            {discountPercent}% OFF
                          </span>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-foreground/45 mb-1">
                          <span>{product.reviewsCount > 0 ? `(${product.reviewsCount} reviews)` : '(Be First to review)'}</span>
                          <span className="text-yellow-400">⭐</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[13px] font-bold text-foreground leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">
                          <Link href={`/product/${product.id}`}>{product.title}</Link>
                        </h3>
                      </div>

                      {/* Pricing */}
                      <div>
                        <div className="text-sm font-black text-foreground">
                          Rs. {product.price.toLocaleString()}
                        </div>
                        {product.originalPrice > product.price && (
                          <div className="text-[10px] text-foreground/40 line-through">
                            Rs. {product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      case 'limited_deals_section': {
        const dealsProducts = products.filter(p => p.discount > 0).slice(0, 5);
        const displayDeals = dealsProducts.length > 0 ? dealsProducts : products.slice(0, 5);

        return (
          <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
            <section className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border pb-4 mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Limited Time Deals</h2>
                  
                  {/* Countdown Timer capsule with gradient border */}
                  <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 p-[1.5px] rounded-full shadow-sm">
                    <div className="bg-card rounded-full px-4 py-1 flex items-center gap-1 text-[11px] font-bold text-foreground">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mr-1">ENDS IN</span>
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
                <Link href="/category/all?clearance=true" className="text-xs font-bold text-primary hover:underline">
                  View All Hot Deals &rarr;
                </Link>
              </div>

              {/* Product Cards Grid - 5 columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayDeals.map((product) => {
                  const discountPercent = product.discount > 0 ? product.discount : 3;
                  return (
                    <div
                      key={product.id}
                      className="bg-card-bg border border-card-border rounded-[2rem] overflow-hidden p-3.5 relative group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Discount Tag on top left */}
                        <span className="absolute top-3 left-3 bg-purple-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full z-10">
                          {discountPercent}% OFF
                        </span>

                        {/* Image box */}
                        <Link href={`/product/${product.id}`} className="block h-40 w-full relative overflow-hidden bg-background/80 rounded-[1.5rem] mb-3 flex items-center justify-center">
                          <EditableImage imageId={`deal-img-${product.id}`} defaultSrc={product.image}
                            alt={product.title}
                            className="object-contain max-h-[85%] max-w-[85%] group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-foreground/45 mb-1">
                          <span>{product.reviewsCount > 0 ? `(${product.reviewsCount} reviews)` : 'No reviews'}</span>
                          <span className="text-yellow-400">⭐</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[13px] font-bold text-foreground leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">
                          <Link href={`/product/${product.id}`}>{product.title}</Link>
                        </h3>
                      </div>

                      {/* Pricing */}
                      <div>
                        <div className="text-sm font-black text-foreground">
                          Rs. {product.price.toLocaleString()}
                        </div>
                        {product.originalPrice > product.price && (
                          <div className="text-[10px] text-foreground/40 line-through">
                            Rs. {product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </SectionEditorWrapper>
        );
      }

      case 'testimonials_section': return (
        <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
          <section className="bg-background py-12 border-y border-card-border/50">
            <div className="max-w-7xl mx-auto px-6 relative">
              <h2 className="text-3xl md:text-4xl font-black text-center text-foreground mb-10 tracking-tight">
                What Our Customers Say
              </h2>

              <div className="relative px-8">
                {/* Left Arrow */}
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-card-border bg-card-bg flex items-center justify-center text-foreground hover:bg-black/5 z-10 shadow transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Testimonials Grid (Displays 3 at a time) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((offset) => {
                    const index = (testimonialIndex + offset) % testimonials.length;
                    const t = testimonials[index];
                    return (
                      <div
                        key={index}
                        className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          {/* User info */}
                          <div className="flex items-center gap-3">
                            <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-card-border" />
                            <div>
                              <h4 className="font-extrabold text-sm text-foreground leading-tight">{t.name}</h4>
                              <p className="text-[10px] text-foreground/45 font-medium mt-0.5">{t.date}</p>
                            </div>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-0.5 text-yellow-400">
                            {[...Array(t.stars)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>

                          {/* Review text */}
                          <p className="text-xs text-foreground/70 leading-relaxed">
                            {t.text}
                          </p>
                        </div>

                        <div>
                          <span className="text-primary font-bold text-[11px] hover:underline cursor-pointer">
                            Read More
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-card-border bg-card-bg flex items-center justify-center text-foreground hover:bg-black/5 z-10 shadow transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="flex items-center justify-center gap-1.5 mt-8">
                {testimonials.map((_, idx) => {
                  const isActive = idx === testimonialIndex % testimonials.length;
                  return (
                    <button
                      key={idx}
                      onClick={() => setTestimonialIndex(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        isActive ? "bg-primary w-5 h-1.5" : "bg-card-border w-1.5 h-1.5 hover:bg-primary/50"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        </SectionEditorWrapper>
      );
      case 'blank_section': return (
        <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-card-bg border border-card-border rounded-3xl p-8 min-h-[200px] flex items-center justify-center">
              <BlockEditorWrapper blockType="TEXT">
                <p>Empty Section. Click to edit.</p>
              </BlockEditorWrapper>
            </div>
          </section>
        </SectionEditorWrapper>
      );
      default: return null;
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
