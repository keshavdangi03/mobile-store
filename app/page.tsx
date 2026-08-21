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
  Store
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

export default function Home() {
  const { addToCart } = useCart();
  const { isEditMode, sectionsByRoute } = useCmsStore();
  const pageSections = sectionsByRoute['/'] || [];
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(true);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);

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

  // Slide Carousel data
  const carouselSlides = [
    {
      id: "xiaomi-pad-8",
      bgGradient: "from-emerald-900 to-teal-800",
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
      bgGradient: "from-purple-950 to-indigo-900",
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
      bgGradient: "from-teal-900 via-emerald-900 to-green-800",
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
      bgGradient: "from-blue-950 via-indigo-900 to-slate-900",
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
    switch (baseId) {
      case 'hero_section': return (
      <SectionEditorWrapper key={sectionId} sectionId={sectionId}>

      <section className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Carousel Slide Box */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-xl min-h-[440px] flex flex-col bg-card-bg text-foreground border border-card-border">
          {activeSlide === 0 && (
            // Slide 1: Interactive Xiaomi Pad 8
            <div className={`flex-1 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between bg-gradient-to-tr ${carouselSlides[0].bgGradient}`}>
              <div className="flex-1 space-y-6">
                <div>
                  <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full">{carouselSlides[0].subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">{carouselSlides[0].title}</h2>
                </div>
                
                <ul className="text-xs md:text-sm text-foreground/80 space-y-2">
                  {carouselSlides[0].specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>

                {/* Configuration Interactive Pills */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-foreground/60 w-full md:w-auto">Config:</span>
                    {["8GB + 128GB", "8GB + 256GB"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setHeroVariant(v)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                          heroVariant === v
                            ? "bg-secondary border-secondary text-white"
                            : "bg-transparent border-card-border hover:bg-foreground/5 text-foreground/80"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-foreground/60 w-full md:w-auto">Bundle:</span>
                    {["Tablet Only", "With Focus Pen Pro OR Keyboard", "With Focus Pen Pro & Keyboard"].map((a) => (
                      <button
                        key={a}
                        onClick={() => setHeroAddon(a)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                          heroAddon === a
                            ? "bg-primary border-primary text-white"
                            : "bg-transparent border-card-border hover:bg-foreground/5 text-foreground/80"
                        }`}
                      >
                        {a === "Tablet Only" ? "Only" : a.replace("With ", "")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Dynamic Price & Add Call */}
                <div className="flex items-center gap-4 pt-4 border-t border-card-border">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-foreground/60">Total Price</div>
                    <div className="text-2xl font-black text-white">Rs. {getHeroPrice().toLocaleString()}</div>
                  </div>
                  <button
                    onClick={handleHeroAddToCart}
                    className="px-6 py-2.5 bg-white text-emerald-900 hover:bg-black/5 font-extrabold text-sm rounded-full transition-all shadow-md active:scale-95"
                  >
                    Shop Now →
                  </button>
                </div>
              </div>

              {/* Pad Image */}
              <div className="w-48 h-48 md:w-64 md:h-64 relative flex-shrink-0">
                <EditableImage imageId="dynamic-img-1" defaultSrc={carouselSlides[0].image}
                  alt="Xiaomi Pad 8"
                  className="object-contain w-full h-full drop-shadow-2xl rounded-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          )}

          {activeSlide === 1 && (
            // Slide 2: ASUS ROG
            <div className={`flex-1 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between bg-gradient-to-tr ${carouselSlides[1].bgGradient}`}>
              <div className="flex-1 space-y-6">
                <div>
                  <span className="text-primary bg-white/25 dark:bg-purple-900/60 text-white font-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded-full">{carouselSlides[1].subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">{carouselSlides[1].title}</h2>
                </div>
                
                <ul className="text-xs md:text-sm text-foreground/80 space-y-2">
                  {carouselSlides[1].specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary-hover flex-shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex items-center gap-4">
                  <div>
                    <div className="text-[10px] text-foreground/60 uppercase font-bold">Deal Price</div>
                    <div className="text-2xl font-black text-white">Rs. 189,999</div>
                  </div>
                  <Link
                    href="/product/asus-rog-strix-g16"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-sm rounded-full transition-all"
                  >
                    View Specs &rarr;
                  </Link>
                </div>
              </div>

              {/* Asus Image */}
              <div className="w-48 h-48 md:w-64 md:h-64 relative flex-shrink-0">
                <EditableImage imageId="dynamic-img-2" defaultSrc={carouselSlides[1].image}
                  alt="Asus ROG"
                  className="object-contain w-full h-full drop-shadow-2xl rounded-2xl"
                />
              </div>
            </div>
          )}

          {activeSlide === 2 && (
            // Slide 3: Mobile Training Academy
            <div className={`flex-1 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between bg-gradient-to-tr ${carouselSlides[2].bgGradient} relative overflow-hidden`}>
              <video 
                src={carouselSlides[2].videoUrl} 
                autoPlay loop muted playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none mix-blend-overlay" 
              />
              <div className="flex-1 space-y-6 z-10">
                <div>
                  <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full">{carouselSlides[2].subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">{carouselSlides[2].title}</h2>
                </div>
                
                <ul className="text-xs md:text-sm text-foreground/80 space-y-2">
                  {carouselSlides[2].specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href="/training"
                    className="px-6 py-2.5 bg-secondary hover:bg-emerald-500 text-white font-extrabold text-xs uppercase rounded-full transition-all"
                  >
                    Join Academy &rarr;
                  </Link>
                </div>
              </div>

              {/* Decorative Vector */}
              <div className="w-48 h-48 md:w-64 md:h-64 relative flex-shrink-0 flex items-center justify-center bg-card-border/30 border border-card-border rounded-full z-10 blur-0">
                <GraduationCap className="w-20 h-20 text-primary animate-pulse" />
              </div>
            </div>
          )}

          {activeSlide === 3 && (
            // Slide 4: Mobile Repair
            <div className={`flex-1 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between bg-gradient-to-tr ${carouselSlides[3].bgGradient} relative overflow-hidden`}>
              <video 
                src={carouselSlides[3].videoUrl} 
                autoPlay loop muted playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none mix-blend-overlay" 
              />
              <div className="flex-1 space-y-6 z-10">
                <div>
                  <span className="text-primary bg-white/25 text-white font-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded-full">{carouselSlides[3].subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">{carouselSlides[3].title}</h2>
                </div>
                
                <ul className="text-xs md:text-sm text-foreground/80 space-y-2">
                  {carouselSlides[3].specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href="/repair"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase rounded-full transition-all"
                  >
                    Request Repair &rarr;
                  </Link>
                </div>
              </div>

              {/* Decorative Vector */}
              <div className="w-48 h-48 md:w-64 md:h-64 relative flex-shrink-0 flex items-center justify-center bg-card-border/30 border border-card-border rounded-full z-10 blur-0">
                <Wrench className="w-20 h-20 text-primary animate-pulse" />
              </div>
            </div>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeSlide === idx ? "bg-primary w-6" : "bg-card-border hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Side Banner Cards */}
        <div className="flex flex-col gap-6">
          {/* Side Promo 1: Projectors */}
          <div className="flex-1 rounded-3xl overflow-hidden relative shadow-lg bg-card-bg border border-card-border p-6 flex flex-col justify-between min-h-[200px]">
            <div className="absolute top-0 right-0 w-32 h-full opacity-30 select-none">
              <EditableImage imageId="static-img-4" defaultSrc="https://images.unsplash.com/photo-1535016120720-40c646be5580?w=200" className="object-cover w-full h-full" />
            </div>
            <div className="z-10 text-foreground space-y-2">
              <span className="text-[10px] font-bold text-accent-green bg-emerald-900/60 px-2 py-0.5 rounded uppercase tracking-wider">Projectors & Screens</span>
              <h3 className="text-xl font-bold leading-tight">Grab Special Offers on Projectors</h3>
              <p className="text-xs text-foreground/60">Transform your living room into a theater.</p>
            </div>
            <Link
              href="/category/projector"
              className="z-10 w-max px-4 py-1.5 bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs rounded-full transition-colors"
            >
              Shop Now &rarr;
            </Link>
          </div>

          {/* Side Promo 2: Smartphones */}
          <div className="flex-1 rounded-3xl overflow-hidden relative shadow-lg bg-card-bg border border-card-border p-6 flex flex-col justify-between min-h-[200px]">
            <div className="absolute top-0 right-0 w-32 h-full opacity-35 select-none">
              <EditableImage imageId="static-img-5" defaultSrc="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200" className="object-cover w-full h-full" />
            </div>
            <div className="z-10 text-foreground space-y-2">
              <span className="text-[10px] font-bold text-orange-400 bg-orange-900/60 px-2 py-0.5 rounded uppercase tracking-wider">Best Deals</span>
              <h3 className="text-xl font-bold leading-tight">Best Deals on Smartphones</h3>
              <p className="text-xs text-foreground/60">Smart choices, Smart savings, Smart prices.</p>
            </div>
            <Link
              href="/category/smartphone"
              className="z-10 w-max px-4 py-1.5 bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs rounded-full transition-colors"
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
          {INITIAL_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Laptop;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center p-4 bg-card-bg rounded-2xl hover:scale-105 hover:shadow-md border border-card-border hover:border-primary/20 transition-all text-center group"
              >
                <div className="w-11 h-11 rounded-full bg-primary/5 dark:bg-slate-800/80 flex items-center justify-center text-primary mb-2 transition-colors group-hover:bg-primary/10">
                  <Icon className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
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
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 hover:shadow-xl transition-all flex flex-col justify-between group hover:border-blue-500/20">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">Professional Mobile Repairing</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Cracked display? Fast battery drainage? Software brick? Submit mobile details online, get price diagnostic estimates, drop off or mail your device, and track repairs step-by-step.
              </p>
            </div>
            <Link
              href="/repair"
              className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-xs uppercase text-white rounded-xl text-center shadow-md active:scale-95 transition-all block"
            >
              Request Repair Desk &rarr;
            </Link>
          </div>

          {/* Card 2: Mobile Training Academy */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 hover:shadow-xl transition-all flex flex-col justify-between group hover:border-emerald-500/20">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">Mobile Repair Training</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Learn chip-level soldering and schematics from industry experts. Choose hands-on physical classroom lab training at New Road or study online via pre-recorded videos and study guide PDFs.
              </p>
            </div>
            <Link
              href="/training"
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs uppercase text-white rounded-xl text-center shadow-md active:scale-95 transition-all block"
            >
              Explore Training Courses &rarr;
            </Link>
          </div>

          {/* Card 3: Trader Listing Hub */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 hover:shadow-xl transition-all flex flex-col justify-between group hover:border-purple-500/20">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">Seller & Trader Platform</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Are you a trader or retailer? Create a trader profile, list your smart devices to sell live on our storefront, pay a low 10% platform commission fee, and check quick review statuses.
              </p>
            </div>
            <Link
              href="/register"
              className="mt-4 w-full py-2.5 bg-purple-600 hover:bg-purple-500 font-bold text-xs uppercase text-white rounded-xl text-center shadow-md active:scale-95 transition-all block"
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
        <div className="w-full rounded-3xl bg-gradient-to-r from-purple-900 via-primary to-indigo-900 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold tracking-widest text-purple-300 bg-white/10 px-2.5 py-1 rounded-full uppercase">Easy Installments</span>
            <h3 className="text-2xl font-extrabold tracking-tight">BUY NOW, PAY LATER IN MONTHLY INSTALLMENTS</h3>
            <p className="text-xs text-purple-200">Get up to 0% Interest on selected Laptop models, Smartphones, and Tablets across Nepal.</p>
          </div>
          <Link
            href="/category/all?emi=true"
            className="px-6 py-3 bg-white text-primary hover:bg-black/5 font-extrabold text-xs uppercase rounded-full shadow-md tracking-wider flex-shrink-0 transition-colors"
          >
            Apply for EMI
          </Link>
        </div>
      </section>

            </SectionEditorWrapper>
);
      case 'limited_deals_section': return (
      <SectionEditorWrapper key={sectionId} sectionId={sectionId}>

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border pb-4 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-foreground tracking-tight">Limited Time Deals</h2>
            <div className="flex items-center gap-1 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-bold text-xs">
              ⏱️ ENDS IN:
              <span className="font-mono bg-red-600 dark:bg-red-500 text-white px-1.5 py-0.2 rounded text-[10px]">
                {padLeft(timeLeft.hours)}
              </span>:
              <span className="font-mono bg-red-600 dark:bg-red-500 text-white px-1.5 py-0.2 rounded text-[10px]">
                {padLeft(timeLeft.minutes)}
              </span>:
              <span className="font-mono bg-red-600 dark:bg-red-500 text-white px-1.5 py-0.2 rounded text-[10px]">
                {padLeft(timeLeft.seconds)}
              </span>
            </div>
          </div>
          <Link href="/category/all?clearance=true" className="text-xs font-bold text-primary hover:underline">
            View All Hot Deals &rarr;
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-card-bg border border-card-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative"
            >
              {/* Discount Tag */}
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  {product.discount}% OFF
                </span>
              )}

              {/* Image box */}
              <Link href={`/product/${product.id}`} className="block h-48 w-full relative overflow-hidden bg-card-bg border-b border-card-border">
                <EditableImage imageId="dynamic-img-3" defaultSrc={product.image}
                  alt={product.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Info box */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-black/5  px-1.5 py-0.5 rounded">
                      {product.brand}
                    </span>
                    <span className="text-[10px] font-bold text-foreground/40">{product.category}</span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground leading-tight hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/product/${product.id}`}>{product.title}</Link>
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs font-bold text-foreground/80">{product.rating}</span>
                    <span className="text-[10px] text-foreground/40">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-foreground">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-foreground/40 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* CTA Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 py-2 text-center border border-card-border hover:border-primary/50 text-foreground text-xs font-bold rounded-lg transition-colors"
                    >
                      Detail Specs
                    </Link>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="py-2 px-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-sm"
                      title="Add to Cart"
                    >
                      🛒 Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

            </SectionEditorWrapper>
);
      case 'blank_section': return (
        <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-card-bg border border-card-border rounded-3xl p-8 min-h-[200px] flex items-center justify-center">
              <BlockEditorWrapper blockId={`${sectionId}-text`} defaultText="Empty Section. Click to edit." />
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
          <div className="bg-gradient-to-r from-teal-700 via-primary to-teal-900 text-white p-4 rounded-2xl shadow-xl mb-4 max-w-xs relative animate-in fade-in slide-in-from-bottom-2 duration-200">
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
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">WhatsApp Chat</h4>
                <p className="text-[10px] text-emerald-100 font-medium leading-none mt-1">Connect with us instantly</p>
              </div>
            </div>

            {/* Body content */}
            <div className="p-4 bg-white  space-y-4">
              <p className="text-xs text-foreground/75 leading-relaxed">
                Have questions? Chat with our team directly on WhatsApp.
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=9801000000&text=Hi,%20I'm%20interested%20in%20your%20products!"
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
