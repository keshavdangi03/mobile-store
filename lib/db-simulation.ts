export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number; // percentage, e.g. 28 for 28%
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  trending?: boolean;
  emiAvailable?: boolean;
  specs: { [key: string]: string };
  variants?: {
    type: string; // e.g. "Storage" or "Color"
    options: string[];
    priceModifiers: number[]; // relative price changes
  };
  addons?: {
    name: string;
    options: string[];
    priceModifiers: number[];
  };
  isApproved?: boolean;
  isTraderProduct?: boolean;
  traderEmail?: string;
  status?: string;
  feedback?: string;
  commissionPercent?: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  items: {
    productId: string;
    productTitle: string;
    price: number;
    quantity: number;
    variant?: string;
    addon?: string;
    image: string;
  }[];
  totalPrice: number;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export const INITIAL_CATEGORIES = [
  { slug: "laptop", name: "Laptop", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80", count: 24 },
  { slug: "apple", name: "Apple", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=120&h=120&fit=crop&q=80", count: 18 },
  { slug: "smartphone", name: "Smart Phone", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&h=120&fit=crop&q=80", count: 32 },
  { slug: "tablet", name: "Tablet", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=120&h=120&fit=crop&q=80", count: 12 },
  { slug: "pc-components", name: "PC Components", image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=120&h=120&fit=crop&q=80", count: 45 },
  { slug: "monitor", name: "Monitor", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=120&h=120&fit=crop&q=80", count: 15 },
  { slug: "projector", name: "Projector", image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=120&h=120&fit=crop&q=80", count: 8 },
  { slug: "earbuds", name: "Earbuds", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120&h=120&fit=crop&q=80", count: 20 },
  { slug: "drone", name: "Drone", image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=120&h=120&fit=crop&q=80", count: 6 },
  { slug: "headphone", name: "Headphone", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop&q=80", count: 14 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "xiaomi-pad-8",
    title: "Xiaomi Pad 8 | Snapdragon 8s Gen 4 Mobile Platform",
    price: 59999,
    originalPrice: 65999,
    discount: 9,
    rating: 4.8,
    reviewsCount: 34,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    category: "tablet",
    brand: "Xiaomi",
    description: "Experience power and productivity with the all-new Xiaomi Pad 8. Featuring a massive 9200mAh battery, 144Hz Crystal-Clear display, Snapdragon 8s Gen 4 processor, and robust storage settings. Perfect for students, designers, and creators.",
    inStock: true,
    featured: true,
    emiAvailable: true,
    specs: {
      "Processor": "Snapdragon 8s Gen 4",
      "Display": "11.2-inch 3.2K 144Hz Refresh Rate",
      "Battery": "9200mAh with 45W Turbo Charging",
      "Camera": "50MP Dual Rear Camera + 20MP Front",
      "OS": "Xiaomi HyperOS (Android 15)",
      "Warranty": "1 Year Official Warranty"
    },
    variants: {
      type: "Configuration",
      options: ["8GB + 128GB", "8GB + 256GB"],
      priceModifiers: [0, 10000] // +10,000 for 256GB (Rs. 69,999)
    },
    addons: {
      name: "Bundles",
      options: ["Tablet Only", "With Focus Pen Pro OR Keyboard", "With Focus Pen Pro & Keyboard"],
      priceModifiers: [0, 8000, 16000]
    }
  },
  {
    id: "anker-soundcore-space-one",
    title: "Anker Soundcore Space One Active Noise Cancelling Headphones",
    price: 14499,
    originalPrice: 19999,
    discount: 28,
    rating: 4.6,
    reviewsCount: 48,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    category: "headphone",
    brand: "Anker",
    description: "Soundcore Space One features upgraded active noise cancelling technology, ultra-clear Hi-Res Audio, 40-hour play time, and comfortable padded earcups for long listening sessions.",
    inStock: true,
    featured: true,
    emiAvailable: false,
    specs: {
      "Battery Life": "40 Hours (ANC On) / 55 Hours (ANC Off)",
      "Connection": "Bluetooth 5.3 & 3.5mm Aux",
      "ANC Level": "Custom Adaptive up to 98% Reduction",
      "Drivers": "40mm Dynamic Drivers",
      "Charging": "USB-C Fast Charging"
    },
    variants: {
      type: "Color",
      options: ["Jet Black", "Sky Blue", "Latte Cream"],
      priceModifiers: [0, 0, 500]
    }
  },
  {
    id: "ugreen-hitune-max5c",
    title: "UGREEN HiTune Max5c | Noise Cancelling Wireless Headphones",
    price: 6499,
    originalPrice: 6999,
    discount: 7,
    rating: 4.4,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
    category: "headphone",
    brand: "UGREEN",
    description: "Budget friendly comfort meets exceptional depth. Deep Bass technology, clear voice call mics, and lightweight headband makes the HiTune Max5c a reliable companion.",
    inStock: true,
    specs: {
      "Battery Life": "75 Hours ANC Off",
      "Bluetooth": "5.4",
      "ANC Depth": "43dB Hybrid Active Noise Cancellation",
      "Latency": "0.06s Ultra Low Latency Mode"
    }
  },
  {
    id: "asus-rog-strix-g16",
    title: "ASUS ROG Strix G16 Gaming Laptop (2025 Edition)",
    price: 189999,
    originalPrice: 215000,
    discount: 11,
    rating: 4.9,
    reviewsCount: 12,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
    category: "laptop",
    brand: "Asus",
    description: "Rule the battlefield with the Asus ROG Strix G16. Packed with Intel Core i7 14th Gen, NVIDIA RTX 4060, a bright 165Hz ROG Nebula display, and custom triple fan cooling technology.",
    inStock: true,
    featured: true,
    trending: true,
    emiAvailable: true,
    specs: {
      "Processor": "Intel Core i7-14650HX",
      "Graphics": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "Memory": "16GB DDR5 5600MHz (Upgradable)",
      "Storage": "1TB PCIe 4.0 NVMe SSD",
      "Display": "16-inch WUXGA 165Hz IPS Aspect Ratio 16:10"
    },
    variants: {
      type: "RAM & SSD Upgrade",
      options: ["16GB RAM / 1TB SSD", "32GB RAM / 2TB SSD"],
      priceModifiers: [0, 22000]
    }
  },
  {
    id: "apple-iphone-16-pro",
    title: "Apple iPhone 16 Pro | 256GB Premium Edition",
    price: 174999,
    originalPrice: 189999,
    discount: 7,
    rating: 4.9,
    reviewsCount: 27,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    category: "apple",
    brand: "Apple",
    description: "Features a stunning titanium design, the innovative Camera Control button, and the revolutionary A18 Pro chip that takes smartphone speeds to the next level.",
    inStock: true,
    featured: true,
    trending: true,
    emiAvailable: true,
    specs: {
      "Processor": "A18 Pro Chip with 16-Core Neural Engine",
      "Display": "6.3-inch Super Retina XDR OLED 120Hz ProMotion",
      "Camera": "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
      "Material": "Grade 5 Titanium with Textured Matte Glass Back",
      "Weight": "199 grams"
    },
    variants: {
      type: "Color",
      options: ["Natural Titanium", "Desert Titanium", "Black Titanium", "White Titanium"],
      priceModifiers: [0, 0, 0, 0]
    }
  },
  {
    id: "dji-mini-4-pro",
    title: "DJI Mini 4 Pro Drone with Fly More Combo",
    price: 125999,
    originalPrice: 139999,
    discount: 10,
    rating: 4.7,
    reviewsCount: 15,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80",
    category: "drone",
    brand: "DJI",
    description: "Fly safer and further with the DJI Mini 4 Pro. Weighing under 249g, it records in 4K HDR vertical video, supports omnidirectional obstacle sensing, and features a 45-minute flight time.",
    inStock: true,
    specs: {
      "Weight": "Under 249 grams",
      "Video Quality": "4K/60fps HDR & True Vertical Shooting",
      "Flight Time": "Up to 34 mins (Standard) / 45 mins (Plus Battery)",
      "Range": "20 km FHD Video Transmission"
    }
  },
  {
    id: "xiaomi-buds-5",
    title: "Xiaomi Buds 5 Active Noise Cancelling Earbuds",
    price: 4999,
    originalPrice: 5999,
    discount: 16,
    rating: 4.3,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    category: "earbuds",
    brand: "Xiaomi",
    description: "Sleek comfort with intelligent noise suppression. The Xiaomi Buds 5 feature custom spatial audio, low-latency, and sweat resistance IP54, perfect for active lifestyles.",
    inStock: true,
    specs: {
      "Battery Life": "Up to 39 Hours with charging case",
      "Driver Size": "11mm Dual-magnet Dynamic Driver",
      "Audio Codec": "aptX Lossless & Hi-Res Audio"
    }
  },
  {
    id: "anker-soundcore-r50i",
    title: "Anker Soundcore R50i True Wireless Earbuds",
    price: 2499,
    originalPrice: 3499,
    discount: 28,
    rating: 4.5,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    category: "earbuds",
    brand: "Anker",
    description: "Thumping bass and IPX5 rating makes it an incredibly solid choice for the daily commute. 10-min charge gives 2 hours of playback.",
    inStock: true,
    trending: true,
    specs: {
      "Driver": "10mm Drivers with BassUp technology",
      "Battery Playtime": "10 Hours (Single Charge) / 30 Hours (Total)",
      "App Control": "22 Preset EQs via Soundcore App"
    }
  }
];

// Helper to check environment
const isClient = typeof window !== "undefined";

export function getProducts(): Product[] {
  if (!isClient) return INITIAL_PRODUCTS;
  
  const saved = localStorage.getItem("zolpa_products");
  if (!saved) {
    localStorage.setItem("zolpa_products", JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(saved);
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id);
}

export function saveProduct(product: Product): void {
  if (!isClient) return;
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index > -1) {
    products[index] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem("zolpa_products", JSON.stringify(products));
}

export function deleteProduct(id: string): void {
  if (!isClient) return;
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  localStorage.setItem("zolpa_products", JSON.stringify(products));
}

export function resetDatabase(): void {
  if (!isClient) return;
  localStorage.setItem("zolpa_products", JSON.stringify(INITIAL_PRODUCTS));
  localStorage.removeItem("zolpa_orders");
}

export function getOrders(): Order[] {
  if (!isClient) return [];
  const saved = localStorage.getItem("zolpa_orders");
  return saved ? JSON.parse(saved) : [];
}

export function saveOrder(order: Order): void {
  if (!isClient) return;
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem("zolpa_orders", JSON.stringify(orders));
}

export function updateOrderStatus(orderId: string, status: Order['status']): void {
  if (!isClient) return;
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index > -1) {
    orders[index].status = status;
    localStorage.setItem("zolpa_orders", JSON.stringify(orders));
  }
}
