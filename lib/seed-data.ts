import { Product } from "./db-simulation";

export function get100SeedProducts(): Product[] {
  const categories = [
    "laptop", "apple", "smartphone", "tablet", "pc-components",
    "monitor", "projector", "earbuds", "drone", "headphone"
  ];
  
  const products: Product[] = [];

  // Category details templates
  const categoryTemplates: {
    [key: string]: {
      brands: string[];
      names: string[];
      images: string[];
      desc: string;
      specKeys: string[];
      specValues: string[][];
    };
  } = {
    laptop: {
      brands: ["Asus", "Lenovo", "HP", "Dell", "Acer"],
      names: ["ROG Strix G16", "TUF Gaming A15", "Legion 5 Pro", "Yoga Slim 7 Carbon", "Victus 16", "Spectre x360", "XPS 13", "G15 Performance", "Nitro V 15", "Predator Helios Neo"],
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80"
      ],
      desc: "Premium laptop engineered for gaming, coding, and multitasking.",
      specKeys: ["Processor", "GPU", "RAM", "Storage", "Display"],
      specValues: [
        ["Intel Core i7-14650HX", "NVIDIA RTX 4060 8GB", "16GB DDR5", "1TB SSD", "16-inch 165Hz IPS"],
        ["AMD Ryzen 7 7735HS", "NVIDIA RTX 4050 6GB", "16GB DDR5", "512GB SSD", "15.6-inch 144Hz"],
        ["Intel Core i9-13900HX", "NVIDIA RTX 4070 8GB", "32GB DDR5", "1TB SSD", "16-inch WQXGA 240Hz"]
      ]
    },
    apple: {
      brands: ["Apple"],
      names: ["MacBook Pro 14 M3", "MacBook Air 13 M3", "MacBook Pro 16 M3 Max", "iPhone 16 Pro Max", "iPhone 16 Plus", "iPad Pro M4", "iPad Air M2", "Apple Watch Series 10", "Apple Watch Ultra 2", "iMac 24-inch"],
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"
      ],
      desc: "Original Apple hardware offering premium reliability and ecosystem performance.",
      specKeys: ["Chip", "Display", "Memory", "Storage", "OS"],
      specValues: [
        ["Apple M3 Chip", "14.2-inch Liquid Retina XDR", "16GB Unified", "512GB SSD", "macOS Sonoma"],
        ["A18 Pro Bionic", "6.9-inch Super Retina OLED", "8GB RAM", "256GB NVMe", "iOS 18"],
        ["Apple M4 Bionic", "11-inch Ultra Retina Tandem OLED", "8GB Unified", "256GB SSD", "iPadOS 18"]
      ]
    },
    smartphone: {
      brands: ["Xiaomi", "Samsung", "OnePlus", "Realme"],
      names: ["Galaxy S24 Ultra", "Galaxy Z Fold 6", "Galaxy A55 5G", "OnePlus 12", "OnePlus Nord 4", "Xiaomi 14 Ultra", "Redmi Note 13 Pro", "Poco F6 Pro", "Realme GT 6", "Realme 12 Pro+"],
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80"
      ],
      desc: "Latest Android smartphone featuring crystal display and high resolution multi-cameras.",
      specKeys: ["Processor", "Display", "Battery", "Main Camera", "Charge Speed"],
      specValues: [
        ["Snapdragon 8 Gen 3", "6.8-inch Dynamic AMOLED 120Hz", "5000mAh", "200MP Quad Camera", "45W Fast Charge"],
        ["MediaTek Dimensity 8300", "6.67-inch Crystal AMOLED 120Hz", "5000mAh", "64MP Triple Camera", "67W Turbo Charge"],
        ["Snapdragon 7+ Gen 3", "6.78-inch OLED 120Hz", "5500mAh", "50MP Dual Camera", "100W SuperVOOC"]
      ]
    },
    tablet: {
      brands: ["Xiaomi", "Samsung", "Lenovo", "OnePlus"],
      names: ["Pad 8 Productivity", "Pad 6 Pro", "Redmi Pad SE", "Galaxy Tab S9 Ultra", "Galaxy Tab S9 FE", "Galaxy Tab A9+", "Lenovo Tab P12", "Lenovo Tab M10", "OnePlus Pad 2", "OnePlus Pad Go"],
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"
      ],
      desc: "High productivity tablet with multi-window coding capabilities.",
      specKeys: ["Processor", "Display", "Battery Life", "Stylus Support", "Weight"],
      specValues: [
        ["Snapdragon 8s Gen 4", "11.2-inch 3.2K 144Hz", "9200mAh (Up to 14 Hours)", "Focus Pen Active", "490 grams"],
        ["Snapdragon 8 Gen 2", "14.6-inch Dynamic AMOLED 120Hz", "11200mAh (Up to 16 Hours)", "S Pen included", "732 grams"],
        ["Helio G99 Octa-core", "11-inch IPS 90Hz Display", "8000mAh (Up to 10 Hours)", "Capacitive Pen Only", "465 grams"]
      ]
    },
    "pc-components": {
      brands: ["NVIDIA", "Intel", "AMD", "Corsair", "Samsung"],
      names: ["GeForce RTX 4090", "GeForce RTX 4070 Ti", "Radeon RX 7900 XTX", "Core i9-14900K", "Ryzen 7 7800X3D", "Vengeance 32GB RAM", "990 Pro 2TB SSD", "ASUS Thor 1000W PSU", "Kraken Elite 360", "H9 Flow ATX Case"],
      images: [
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80",
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80"
      ],
      desc: "Authentic desktop computer components for gaming rigs and programming machines.",
      specKeys: ["Form Factor", "Interface", "Performance", "Power Draw", "Warranty"],
      specValues: [
        ["ATX Standard", "PCIe 4.0 x16", "Top Tier performance", "350W TDP", "3 Years Warranty"],
        ["LGA 1700 / AM5", "DDR5 / PCIe 5.0", "Max coding compilation speed", "125W Base TDP", "3 Years Warranty"],
        ["M.2 2280 NVMe", "PCIe 4.0 x4", "7450 MB/s Read Speed", "Under 10W Active", "5 Years Warranty"]
      ]
    },
    monitor: {
      brands: ["LG", "Samsung", "Dell", "MSI", "Asus"],
      names: ["UltraGear 27GP850", "Odyssey G9 49-inch", "UltraSharp 27-inch", "Optix G241 Gaming", "ROG Swift 32 OLED", "Ego Ergonomic Monitor", "ProArt Creator Display", "Creator Curved 34", "TUF Gaming 27-inch", "LG DualUp 28-inch"],
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80"
      ],
      desc: "Stunning high refresh rate display panel for professional color grading and coders.",
      specKeys: ["Resolution", "Refresh Rate", "Panel Type", "Brightness", "Color Accuracy"],
      specValues: [
        ["2560 x 1440 QHD", "165Hz (Overclock to 180Hz)", "Nano IPS", "350 nits", "98% DCI-P3"],
        ["5120 x 1440 Dual QHD", "240Hz", "OLED Quantum Dot", "400 nits Peak", "99% DCI-P3 Color"],
        ["3840 x 2160 4K UHD", "60Hz Professional Creator", "IPS Black Panel", "400 nits", "100% sRGB Delta E < 2"]
      ]
    },
    projector: {
      brands: ["Epson", "BenQ", "Xiaomi", "Anker"],
      names: ["Mi Laser Projector 4K", "Nebula Capsule 3 Mini", "EpiqVision LS300 Ultra", "BenQ TK700STi 4K", "Nebula Cosmos 4K Laser", "BenQ GV30 Mobile", "ViewSonic M2 Smart", "Optoma UHD38x", "XGIMI Horizon Pro", "Epson EF-12 Portable"],
      images: [
        "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80"
      ],
      desc: "Ultimate home theater projector with Android TV and smart auto-focus.",
      specKeys: ["Resolution", "Lumen Brightness", "Laser Type", "Contrast Ratio", "Speakers"],
      specValues: [
        ["4K UHD HDR10", "2000 ANSI Lumens", "ALPD 3.0 Laser Light", "1500:1 Contrast", "Built-in Harman Kardon 30W"],
        ["1080p Full HD", "300 ANSI Lumens", "LED Projection source", "100,000:1 Contrast", "Built-in 8W Dolby Speaker"]
      ]
    },
    earbuds: {
      brands: ["Xiaomi", "Anker", "JBL", "Sony", "Redmi"],
      names: ["Xiaomi Buds 5", "Redmi Buds 6 Active", "Soundcore Liberty 4", "Soundcore R50i TWS", "Sony WF-1000XM5", "JBL Tour Pro 2", "AirPods Pro 2", "Galaxy Buds 3 Pro", "OnePlus Buds Pro 3", "Nothing Ear (2)"],
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80"
      ],
      desc: "High comfort wireless Bluetooth earbuds with intelligent active noise cancelling.",
      specKeys: ["Bluetooth", "Battery Playtime", "Waterproof Rating", "Drivers", "ANC Level"],
      specValues: [
        ["Bluetooth 5.3", "30 Hours total playtime", "IPX5 Sweatproof", "10mm Dynamic Drivers", "35dB Hybrid ANC"],
        ["Bluetooth 5.4", "40 Hours total (ANC Off)", "IP54 Rating", "11mm Dual-magnet Drivers", "43dB Intelligent ANC"],
        ["Bluetooth 5.3 with LDAC", "36 Hours total", "IPX4 splashproof", "9.2mm + 6mm Dual Drivers", "48dB Adaptive Noise Cancellation"]
      ]
    },
    drone: {
      brands: ["DJI", "Autel", "Potensic"],
      names: ["Mini 4 Pro Fly More", "Avata 2 FPV Drone", "Mavic 3 Pro Cine", "Air 3 Dual Camera", "Mini 3 Pro Standard", "Tello Toy Drone", "EVO Lite+ Quadcopter", "EVO Nano Nano Drone", "Atom 4K GPS Drone", "Mavic Air 2S Combo"],
      images: [
        "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80"
      ],
      desc: "Premium camera drone with 3-axis gimbal stabilizing and omni obstacle detection.",
      specKeys: ["Takeoff Weight", "Camera Sensor", "Max Flight Time", "Video Transmission", "Obstacle Sensing"],
      specValues: [
        ["Under 249 grams", "1/1.3-inch CMOS 48MP", "34 minutes (Standard)", "20 km FHD O4 Transmission", "Omnidirectional active sensing"],
        ["958 grams", "4/3 Hasselblad Camera", "43 minutes flight", "15 km O3+ Transmission", "Omnidirectional Obstacle avoidance"]
      ]
    },
    headphone: {
      brands: ["Anker", "UGREEN", "Sony", "Bose", "Havit"],
      names: ["Soundcore Space One", "HiTune Max5c Pro", "Sony WH-1000XM5", "Bose QuietComfort Ultra", "Havit H2002d Gaming", "Sennheiser Accentum", "JBL Tune 770NC", "Beats Studio Pro", "Skullcandy Hesh ANC", "Sony WH-CH720N"],
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80"
      ],
      desc: "Premium sound clarity over-ear headphones with custom spatial audio drivers.",
      specKeys: ["ANC Depth", "Driver Size", "Audio Codecs", "Battery Playtime", "Weight"],
      specValues: [
        ["Adaptive ANC up to 98%", "40mm Dynamic", "Hi-Res Audio LDAC", "40 Hours ANC On", "250 grams"],
        ["Active Hybrid ANC", "40mm Bio-Diaphragm", "AAC / SBC Codec", "75 Hours ANC Off", "220 grams"],
        ["Industry Leading ANC", "30mm Custom Driver", "LDAC, AAC, SBC", "30 Hours ANC On", "250 grams"]
      ]
    }
  };

  // Generate exactly 10 distinct products per category
  categories.forEach((cat) => {
    const template = categoryTemplates[cat];
    if (!template) return;

    for (let i = 0; i < 10; i++) {
      const name = template.names[i] || `${cat} Model ${i + 1}`;
      const brand = template.brands[i % template.brands.length];
      const image = template.images[i % template.images.length];
      
      // Calculate realistic base prices
      let basePrice = 4999;
      if (cat === "laptop") basePrice = 85000 + i * 15000;
      else if (cat === "apple") basePrice = 69999 + i * 20000;
      else if (cat === "smartphone") basePrice = 24999 + i * 8000;
      else if (cat === "tablet") basePrice = 19999 + i * 12000;
      else if (cat === "pc-components") basePrice = 4500 + i * 15000;
      else if (cat === "monitor") basePrice = 15999 + i * 8000;
      else if (cat === "projector") basePrice = 29999 + i * 15000;
      else if (cat === "drone") basePrice = 12999 + i * 18000;
      else if (cat === "headphone") basePrice = 3999 + i * 4000;
      else if (cat === "earbuds") basePrice = 2499 + i * 2000;

      const discount = i % 3 === 0 ? 5 + i * 2 : 0; // custom discounts
      const originalPrice = discount > 0 ? Math.round(basePrice / (1 - discount / 100)) : basePrice;

      const specsChoice = template.specValues[i % template.specValues.length];
      const specsObj: { [key: string]: string } = {};
      template.specKeys.forEach((key, keyIdx) => {
        specsObj[key] = specsChoice[keyIdx] || "Standard Specification";
      });

      products.push({
        id: `${cat}-item-${i + 1}`,
        title: `${name} | Genuine product warranty`,
        price: basePrice,
        originalPrice,
        discount,
        rating: Number((4.2 + (i % 8) * 0.1).toFixed(1)),
        reviewsCount: 5 + i * 12,
        image,
        category: cat,
        brand,
        description: template.desc,
        inStock: i !== 8, // item index 8 is out of stock for testing
        featured: i < 2,
        trending: i > 7,
        emiAvailable: basePrice > 25000,
        specs: specsObj,
        variants: cat === "laptop" ? {
          type: "Configuration",
          options: ["8GB + 256GB", "16GB + 512GB"],
          priceModifiers: [0, 15000]
        } : cat === "apple" ? {
          type: "Storage",
          options: ["128GB", "256GB"],
          priceModifiers: [0, 18000]
        } : undefined
      });
    }
  });

  return products;
}
