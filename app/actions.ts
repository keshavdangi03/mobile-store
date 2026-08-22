"use server";

import { prisma } from "@/lib/prisma";
import { Product, Order, INITIAL_CATEGORIES } from "@/lib/db-simulation";
import { get100SeedProducts } from "@/lib/seed-data";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export async function seed100Database(): Promise<boolean> {
  try {
    await prisma.product.deleteMany();
    await prisma.order.deleteMany();
    const seedProducts = get100SeedProducts();
    const seedData = seedProducts.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      image: p.image,
      category: p.category,
      brand: p.brand,
      description: p.description,
      inStock: p.inStock,
      featured: p.featured || false,
      trending: p.trending || false,
      emiAvailable: p.emiAvailable || false,
      specs: p.specs || {},
      variants: (p.variants || null) as any,
      addons: (p.addons || null) as any,
    }));
    await prisma.product.createMany({
      data: seedData,
    });
    return true;
  } catch (err) {
    console.error("Error seeding 100 products:", err);
    return false;
  }
}

export async function getDbProducts(): Promise<Product[]> {
  try {
    const count = await prisma.product.count();
    if (count < 15) {
      // Seed rich 100 products catalog if database is empty or has mock starter data
      await seed100Database();
    }

    const items = await prisma.product.findMany({
      where: { isApproved: true },
      orderBy: { id: "asc" }
    });

    return items.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      image: item.image,
      category: item.category,
      brand: item.brand,
      description: item.description,
      inStock: item.inStock,
      featured: item.featured,
      trending: item.trending,
      emiAvailable: item.emiAvailable,
      specs: item.specs as { [key: string]: string },
      variants: item.variants as Product["variants"],
      addons: item.addons as Product["addons"],
      isApproved: item.isApproved ?? undefined,
      isTraderProduct: item.isTraderProduct ?? undefined,
      traderEmail: item.traderEmail ?? undefined,
      status: item.status ?? undefined,
      feedback: item.feedback ?? undefined,
      commissionPercent: item.commissionPercent ?? undefined,
    }));
  } catch (err) {
    console.error("Error in getDbProducts server action:", err);
    return [];
  }
}

export async function getDbProductById(id: string): Promise<Product | null> {
  try {
    const item = await prisma.product.findUnique({
      where: { id },
    });
    if (!item) return null;
    return {
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      image: item.image,
      category: item.category,
      brand: item.brand,
      description: item.description,
      inStock: item.inStock,
      featured: item.featured,
      trending: item.trending,
      emiAvailable: item.emiAvailable,
      specs: item.specs as { [key: string]: string },
      variants: item.variants as Product["variants"],
      addons: item.addons as Product["addons"],
      isApproved: item.isApproved ?? undefined,
      isTraderProduct: item.isTraderProduct ?? undefined,
      traderEmail: item.traderEmail ?? undefined,
      status: item.status ?? undefined,
      feedback: item.feedback ?? undefined,
      commissionPercent: item.commissionPercent ?? undefined,
    };
  } catch (err) {
    console.error("Error in getDbProductById server action:", err);
    return null;
  }
}

export async function saveDbProduct(product: Product): Promise<boolean> {
  try {
    const data = {
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      image: product.image,
      category: product.category,
      brand: product.brand,
      description: product.description,
      inStock: product.inStock,
      featured: product.featured || false,
      trending: product.trending || false,
      emiAvailable: product.emiAvailable || false,
      specs: product.specs || {},
      variants: (product.variants || null) as any,
      addons: (product.addons || null) as any,
      isApproved: product.isApproved !== undefined ? product.isApproved : true,
      isTraderProduct: product.isTraderProduct || false,
      traderEmail: product.traderEmail || null,
      status: product.status || "Approved",
      feedback: product.feedback || null,
      commissionPercent: product.commissionPercent !== undefined ? product.commissionPercent : 10,
    };

    await prisma.product.upsert({
      where: { id: product.id },
      update: data,
      create: {
        id: product.id,
        ...data,
      },
    });
    return true;
  } catch (err) {
    console.error("Error in saveDbProduct server action:", err);
    return false;
  }
}

export async function deleteDbProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    console.error("Error in deleteDbProduct server action:", err);
    return false;
  }
}

export async function getDbOrders(): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return orders.map((o: any) => ({
      id: o.id,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerEmail: o.customerEmail,
      address: o.address,
      city: o.city,
      items: o.items as Order["items"],
      totalPrice: o.totalPrice,
      paymentMethod: o.paymentMethod,
      status: o.status as Order["status"],
      createdAt: o.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("Error in getDbOrders server action:", err);
    return [];
  }
}

export async function saveDbOrder(order: Order): Promise<boolean> {
  try {
    await prisma.order.create({
      data: {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        address: order.address,
        city: order.city,
        items: order.items as any,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: new Date(order.createdAt),
      },
    });
    return true;
  } catch (err) {
    console.error("Error in saveDbOrder server action:", err);
    return false;
  }
}

export async function updateDbOrderStatus(orderId: string, status: Order["status"]): Promise<boolean> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return true;
  } catch (err) {
    console.error("Error in updateDbOrderStatus server action:", err);
    return false;
  }
}

// Trader Actions
export async function getAdminTraderProducts(): Promise<Product[]> {
  try {
    const items = await prisma.product.findMany({
      where: { isTraderProduct: true },
      orderBy: { id: "asc" }
    });
    return items.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      image: item.image,
      category: item.category,
      brand: item.brand,
      description: item.description,
      inStock: item.inStock,
      featured: item.featured,
      trending: item.trending,
      emiAvailable: item.emiAvailable,
      specs: item.specs as any,
      variants: item.variants as any,
      addons: item.addons as any,
      isApproved: item.isApproved ?? undefined,
      isTraderProduct: item.isTraderProduct ?? undefined,
      traderEmail: item.traderEmail ?? undefined,
      status: item.status ?? undefined,
      feedback: item.feedback ?? undefined,
      commissionPercent: item.commissionPercent ?? undefined,
    }));
  } catch (err) {
    console.error("Error in getAdminTraderProducts:", err);
    return [];
  }
}

export async function getTraderProducts(email: string): Promise<Product[]> {
  try {
    const items = await prisma.product.findMany({
      where: { traderEmail: email },
      orderBy: { id: "asc" }
    });
    return items.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      image: item.image,
      category: item.category,
      brand: item.brand,
      description: item.description,
      inStock: item.inStock,
      featured: item.featured,
      trending: item.trending,
      emiAvailable: item.emiAvailable,
      specs: item.specs as any,
      variants: item.variants as any,
      addons: item.addons as any,
      isApproved: item.isApproved ?? undefined,
      isTraderProduct: item.isTraderProduct ?? undefined,
      traderEmail: item.traderEmail ?? undefined,
      status: item.status ?? undefined,
      feedback: item.feedback ?? undefined,
      commissionPercent: item.commissionPercent ?? undefined,
    }));
  } catch (err) {
    console.error("Error in getTraderProducts:", err);
    return [];
  }
}

export async function approveTraderProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        isApproved: true,
        status: "Approved",
        feedback: null
      }
    });
    return true;
  } catch (err) {
    console.error("Error in approveTraderProduct:", err);
    return false;
  }
}

export async function rejectTraderProduct(id: string, feedback: string): Promise<boolean> {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        isApproved: false,
        status: "Rejected",
        feedback: feedback
      }
    });
    return true;
  } catch (err) {
    console.error("Error in rejectTraderProduct:", err);
    return false;
  }
}

// Repair Actions
export async function createRepairRequest(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  brand: string;
  modelName: string;
  problemType: string;
  description: string;
  paymentMethod?: string;
}): Promise<boolean> {
  try {
    await prisma.repairRequest.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        brand: data.brand,
        modelName: data.modelName,
        problemType: data.problemType,
        description: data.description,
        paymentMethod: data.paymentMethod || "Cash on Delivery",
        status: "Pending",
        paymentStatus: "Unpaid"
      }
    });
    return true;
  } catch (err) {
    console.error("Error in createRepairRequest:", err);
    return false;
  }
}

export async function getRepairRequestsByEmail(email: string): Promise<any[]> {
  try {
    const items = await prisma.repairRequest.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: "desc" }
    });
    return items.map((item: any) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("Error in getRepairRequestsByEmail:", err);
    return [];
  }
}

export async function getAllRepairRequests(): Promise<any[]> {
  try {
    const items = await prisma.repairRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    return items.map((item: any) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("Error in getAllRepairRequests:", err);
    return [];
  }
}

export async function updateRepairRequestStatus(
  id: string,
  status: string,
  feedback?: string,
  cost?: number
): Promise<boolean> {
  try {
    const updateData: any = { status };
    if (feedback !== undefined) updateData.adminFeedback = feedback;
    if (cost !== undefined) updateData.estimateCost = cost;
    await prisma.repairRequest.update({
      where: { id },
      data: updateData
    });
    return true;
  } catch (err) {
    console.error("Error in updateRepairRequestStatus:", err);
    return false;
  }
}

export async function updateRepairPaymentStatus(
  id: string,
  paymentMethod: string,
  paymentStatus: string
): Promise<boolean> {
  try {
    await prisma.repairRequest.update({
      where: { id },
      data: {
        paymentMethod,
        paymentStatus
      }
    });
    return true;
  } catch (err) {
    console.error("Error in updateRepairPaymentStatus:", err);
    return false;
  }
}

// Course Actions
const INITIAL_COURSES = [
  {
    id: "physical-repair-course",
    title: "Master Mobile Hardware Repairing Course (Physical)",
    description: "Become a certified mobile repair technician. Hands-on physical training covering diagnostic tools, chip-level soldering, screen replacement, and motherboard troubleshooting at our state-of-the-art training lab in New Road.",
    type: "physical",
    price: 15000,
    duration: "6 Weeks",
    location: "Mobile Store Training Center, New Road, Kathmandu",
    schedule: "Mon - Fri, 8:00 AM - 10:00 AM",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80",
    videos: [] as any,
    notes: [] as any
  },
  {
    id: "online-software-course",
    title: "Mobile Software Diagnostics & Repairing (Online)",
    description: "Self-paced online course with pre-recorded high-definition video lectures and study guides. Learn how to flash ROMs, unlock bootloaders, remove FRP locks, repair IMEI, and debug OS-level issues.",
    type: "online",
    price: 5000,
    duration: "Self-paced",
    location: null,
    schedule: null,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
    videos: [
      { title: "Introduction to Mobile OS Architecture", duration: "12:45", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { title: "Flashing Android ROMs & Custom Recoveries", duration: "18:20", url: "https://www.w3schools.com/html/movie.mp4" },
      { title: "iPhone DFU Mode & iOS Restoration Tools", duration: "14:15", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ] as any,
    notes: [
      { title: "Mobile OS Flashing Guide PDF", downloadUrl: "#" },
      { title: "Diagnostic Error Codes Cheat Sheet", downloadUrl: "#" }
    ] as any
  }
];

export async function getCourses(): Promise<any[]> {
  try {
    const seedFlagPath = path.join(process.cwd(), "prisma", ".seeded_courses");
    const count = await prisma.course.count();
    if (count === 0 && !fs.existsSync(seedFlagPath)) {
      await prisma.course.createMany({
        data: INITIAL_COURSES
      });
      try {
        fs.writeFileSync(seedFlagPath, "done");
      } catch (fsErr) {
        console.error("Error writing course seed flag file:", fsErr);
      }
    }
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "asc" }
    });
    return courses.map((c: any) => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    }));
  } catch (err) {
    console.error("Error in getCourses:", err);
    return [];
  }
}

export async function createCourseEnrollment(data: {
  courseId: string;
  courseTitle: string;
  courseType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountPaid: number;
  paymentMethod: string;
}): Promise<boolean> {
  try {
    await prisma.courseEnrollment.create({
      data: {
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        courseType: data.courseType,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        amountPaid: data.amountPaid,
        paymentMethod: data.paymentMethod,
        status: "Completed"
      }
    });
    return true;
  } catch (err) {
    console.error("Error in createCourseEnrollment:", err);
    return false;
  }
}

export async function getCourseEnrollmentsByEmail(email: string): Promise<any[]> {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: "desc" }
    });
    const courses = await prisma.course.findMany();
    return enrollments.map((item: any) => {
      const matchedCourse = courses.find((c: any) => c.id === item.courseId);
      return {
        ...item,
        videos: matchedCourse?.videos || [],
        notes: matchedCourse?.notes || [],
        createdAt: item.createdAt.toISOString()
      };
    });
  } catch (err) {
    console.error("Error in getCourseEnrollmentsByEmail:", err);
    return [];
  }
}

export async function getAllCourseEnrollments(): Promise<any[]> {
  try {
    const items = await prisma.courseEnrollment.findMany({
      orderBy: { createdAt: "desc" }
    });
    return items.map((item: any) => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    }));
  } catch (err) {
    console.error("Error in getAllCourseEnrollments:", err);
    return [];
  }
}

export async function createCourse(data: {
  title: string;
  description: string;
  type: string;
  price: number;
  duration: string;
  image?: string;
  location?: string;
  schedule?: string;
}): Promise<boolean> {
  try {
    await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        price: data.price,
        duration: data.duration,
        image: data.image || null,
        location: data.location || null,
        schedule: data.schedule || null,
        videos: [] as any,
        notes: [] as any
      }
    });
    return true;
  } catch (err) {
    console.error("Error in createCourse:", err);
    return false;
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    await prisma.courseEnrollment.deleteMany({
      where: { courseId: id }
    });
    await prisma.course.delete({
      where: { id }
    });
    return true;
  } catch (err) {
    console.error("Error in deleteCourse:", err);
    return false;
  }
}

export async function updateCourseVideos(id: string, videos: any[]): Promise<boolean> {
  try {
    await prisma.course.update({
      where: { id },
      data: { videos: videos as any }
    });
    return true;
  } catch (err) {
    console.error("Error in updateCourseVideos:", err);
    return false;
  }
}

export async function updateCourseNotes(id: string, notes: any[]): Promise<boolean> {
  try {
    await prisma.course.update({
      where: { id },
      data: { notes: notes as any }
    });
    return true;
  } catch (err) {
    console.error("Error in updateCourseNotes:", err);
    return false;
  }
}

export async function cancelRepairRequest(id: string, reason: string): Promise<boolean> {
  try {
    await prisma.repairRequest.update({
      where: { id },
      data: {
        status: "Cancelled",
        cancelReason: reason
      }
    });
    return true;
  } catch (err) {
    console.error("Error in cancelRepairRequest:", err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CMS & Site Customization Database Actions
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_INITIAL_SECTIONS = {
  "/": [
    "hero_section",
    "categories_section",
    "new_arrivals_section",
    "services_section",
    "promo_banner_section",
    "limited_deals_section",
    "testimonials_section"
  ]
};

const DEFAULT_INITIAL_GLOBAL_SECTIONS = {
  promoBar: {
    enabled: false,
    text: "🎉 Shrawan Sale is LIVE! Get up to 30% OFF on all laptops and smartphones!",
    bgColor: "#00AFA2",
    textColor: "#ffffff",
    link: "/category/all",
    linkText: "Shop Now",
    closeable: true,
    emoji: "🎉",
  },
  announcementBanner: {
    enabled: false,
    type: "promo",
    message: "Free delivery on all orders above Rs. 5,000! Limited time offer.",
    icon: "🚚",
    closeable: true,
    link: "",
    linkText: "",
  },
};

const DEFAULT_INITIAL_HEADER_SETTINGS = {
  topNotice: "🎉 Free Delivery inside Kathmandu Valley on orders over Rs. 5,000! Call: +977-9800000000",
  phone: "+977-9800000000",
  location: "New Road, Kathmandu",
  quickLinks: [
    { id: "1", label: "Mobile Training", link: "/training", color: "#00AFA2", icon: "GraduationCap" },
    { id: "2", label: "Repair Services", link: "/repair", color: "#00AFA2", icon: "Wrench" },
    { id: "3", label: "Stock Clearance", link: "/category/all?clearance=true", color: "#f97316", icon: "Flame" },
    { id: "4", label: "EMI Products", link: "/category/all?emi=true", color: "#3b82f6", icon: "CreditCard" },
  ]
};

const DEFAULT_INITIAL_FOOTER_SETTINGS = {
  about: "Expert Mobile Solutions - Your #1 destination in Nepal for genuine smartphones, laptops, chip-level repairs, and vocational academy training.",
  phone: "+977-9800000000",
  email: "support@mobilestore.com.np",
  address: "Pako New Road, Kathmandu, Nepal",
};

export async function getDbCmsConfig(): Promise<any> {
  try {
    let settings = await prisma.globalSettings.findUnique({
      where: { id: "global" }
    });

    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: {
          id: "global",
          theme: "professional-1",
          sectionsByRoute: DEFAULT_INITIAL_SECTIONS as any,
          sectionCustomizations: {} as any,
          customSectionsData: {} as any,
          globalSections: DEFAULT_INITIAL_GLOBAL_SECTIONS as any,
          headerSettings: DEFAULT_INITIAL_HEADER_SETTINGS as any,
          footerSettings: DEFAULT_INITIAL_FOOTER_SETTINGS as any,
          categories: INITIAL_CATEGORIES as any,
          savedAssets: [] as any,
          imageOverrides: {} as any,
          styleOverrides: {} as any,
        }
      });
    }

    return {
      theme: settings.theme || "professional-1",
      sectionsByRoute: settings.sectionsByRoute || DEFAULT_INITIAL_SECTIONS,
      sectionCustomizations: settings.sectionCustomizations || {},
      customSectionsData: settings.customSectionsData || {},
      globalSections: settings.globalSections || DEFAULT_INITIAL_GLOBAL_SECTIONS,
      headerSettings: settings.headerSettings || DEFAULT_INITIAL_HEADER_SETTINGS,
      footerSettings: settings.footerSettings || DEFAULT_INITIAL_FOOTER_SETTINGS,
      categories: settings.categories || INITIAL_CATEGORIES,
      savedAssets: settings.savedAssets || [],
      imageOverrides: settings.imageOverrides || {},
      styleOverrides: settings.styleOverrides || {},
      siteTitle: settings.siteTitle || "Expert Mobile Solutions",
      siteDescription: settings.siteDescription || "Premier Mobile Store, Repair & Training Center",
    };
  } catch (err) {
    console.error("Error in getDbCmsConfig:", err);
    return {
      theme: "professional-1",
      sectionsByRoute: DEFAULT_INITIAL_SECTIONS,
      sectionCustomizations: {},
      customSectionsData: {},
      globalSections: DEFAULT_INITIAL_GLOBAL_SECTIONS,
      headerSettings: DEFAULT_INITIAL_HEADER_SETTINGS,
      footerSettings: DEFAULT_INITIAL_FOOTER_SETTINGS,
      categories: INITIAL_CATEGORIES,
      savedAssets: [],
      imageOverrides: {},
      styleOverrides: {},
    };
  }
}

export async function saveDbCmsConfig(data: {
  theme?: string;
  sectionsByRoute?: any;
  sectionCustomizations?: any;
  customSectionsData?: any;
  globalSections?: any;
  headerSettings?: any;
  footerSettings?: any;
  categories?: any;
  savedAssets?: any;
  imageOverrides?: any;
  styleOverrides?: any;
  siteTitle?: string;
  siteDescription?: string;
}): Promise<boolean> {
  try {
    const updateData: any = {};
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.sectionsByRoute !== undefined) updateData.sectionsByRoute = data.sectionsByRoute;
    if (data.sectionCustomizations !== undefined) updateData.sectionCustomizations = data.sectionCustomizations;
    if (data.customSectionsData !== undefined) updateData.customSectionsData = data.customSectionsData;
    if (data.globalSections !== undefined) updateData.globalSections = data.globalSections;
    if (data.headerSettings !== undefined) updateData.headerSettings = data.headerSettings;
    if (data.footerSettings !== undefined) updateData.footerSettings = data.footerSettings;
    if (data.categories !== undefined) updateData.categories = data.categories;
    if (data.savedAssets !== undefined) updateData.savedAssets = data.savedAssets;
    if (data.imageOverrides !== undefined) updateData.imageOverrides = data.imageOverrides;
    if (data.styleOverrides !== undefined) updateData.styleOverrides = data.styleOverrides;
    if (data.siteTitle !== undefined) updateData.siteTitle = data.siteTitle;
    if (data.siteDescription !== undefined) updateData.siteDescription = data.siteDescription;

    await prisma.globalSettings.upsert({
      where: { id: "global" },
      update: updateData,
      create: {
        id: "global",
        theme: data.theme || "professional-1",
        sectionsByRoute: data.sectionsByRoute || (DEFAULT_INITIAL_SECTIONS as any),
        sectionCustomizations: data.sectionCustomizations || ({} as any),
        customSectionsData: data.customSectionsData || ({} as any),
        globalSections: data.globalSections || (DEFAULT_INITIAL_GLOBAL_SECTIONS as any),
        headerSettings: data.headerSettings || (DEFAULT_INITIAL_HEADER_SETTINGS as any),
        footerSettings: data.footerSettings || (DEFAULT_INITIAL_FOOTER_SETTINGS as any),
        categories: data.categories || (INITIAL_CATEGORIES as any),
        savedAssets: data.savedAssets || ([] as any),
        imageOverrides: data.imageOverrides || ({} as any),
        styleOverrides: data.styleOverrides || ({} as any),
      }
    });

    try {
      revalidatePath("/", "layout");
    } catch (revErr) {
      // ignore in non-request contexts
    }

    return true;
  } catch (err) {
    console.error("Error in saveDbCmsConfig:", err);
    return false;
  }
}

export async function getDbTheme(): Promise<string> {
  try {
    const settings = await prisma.globalSettings.findUnique({
      where: { id: "global" },
      select: { theme: true }
    });
    return settings?.theme || "professional-1";
  } catch (err) {
    console.error("Error in getDbTheme:", err);
    return "professional-1";
  }
}

export async function saveDbTheme(theme: string): Promise<boolean> {
  try {
    await prisma.globalSettings.upsert({
      where: { id: "global" },
      update: { theme },
      create: { id: "global", theme }
    });
    try {
      revalidatePath("/", "layout");
    } catch {}
    return true;
  } catch (err) {
    console.error("Error in saveDbTheme:", err);
    return false;
  }
}

export async function getDbCategories(): Promise<any[]> {
  try {
    const settings = await prisma.globalSettings.findUnique({
      where: { id: "global" },
      select: { categories: true }
    });
    if (settings?.categories && Array.isArray(settings.categories) && (settings.categories as any[]).length > 0) {
      return settings.categories as any[];
    }
    return INITIAL_CATEGORIES;
  } catch (err) {
    console.error("Error in getDbCategories:", err);
    return INITIAL_CATEGORIES;
  }
}

export async function saveDbCategories(categories: any[]): Promise<boolean> {
  try {
    await prisma.globalSettings.upsert({
      where: { id: "global" },
      update: { categories: categories as any },
      create: { id: "global", categories: categories as any }
    });
    try {
      revalidatePath("/", "layout");
    } catch {}
    return true;
  } catch (err) {
    console.error("Error in saveDbCategories:", err);
    return false;
  }
}

export async function getDbHeaderSettings(): Promise<any> {
  try {
    const settings = await prisma.globalSettings.findUnique({
      where: { id: "global" },
      select: { headerSettings: true }
    });
    return settings?.headerSettings || DEFAULT_INITIAL_HEADER_SETTINGS;
  } catch (err) {
    console.error("Error in getDbHeaderSettings:", err);
    return DEFAULT_INITIAL_HEADER_SETTINGS;
  }
}

export async function saveDbHeaderSettings(headerSettings: any): Promise<boolean> {
  try {
    await prisma.globalSettings.upsert({
      where: { id: "global" },
      update: { headerSettings: headerSettings as any },
      create: { id: "global", headerSettings: headerSettings as any }
    });
    try {
      revalidatePath("/", "layout");
    } catch {}
    return true;
  } catch (err) {
    console.error("Error in saveDbHeaderSettings:", err);
    return false;
  }
}

export async function getDbFooterSettings(): Promise<any> {
  try {
    const settings = await prisma.globalSettings.findUnique({
      where: { id: "global" },
      select: { footerSettings: true }
    });
    return settings?.footerSettings || DEFAULT_INITIAL_FOOTER_SETTINGS;
  } catch (err) {
    console.error("Error in getDbFooterSettings:", err);
    return DEFAULT_INITIAL_FOOTER_SETTINGS;
  }
}

export async function saveDbFooterSettings(footerSettings: any): Promise<boolean> {
  try {
    await prisma.globalSettings.upsert({
      where: { id: "global" },
      update: { footerSettings: footerSettings as any },
      create: { id: "global", footerSettings: footerSettings as any }
    });
    try {
      revalidatePath("/", "layout");
    } catch {}
    return true;
  } catch (err) {
    console.error("Error in saveDbFooterSettings:", err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// User Authentication & Account Database Actions
// ─────────────────────────────────────────────────────────────────────────────

export interface DbUserSession {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isTrader: boolean;
  avatar?: string | null;
  address?: string | null;
  city?: string | null;
}

export async function registerDbUser(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  isTrader?: boolean;
}): Promise<{ success: boolean; error?: string; user?: DbUserSession }> {
  try {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(data.phone ? [{ phone: data.phone.trim() }] : [])
        ]
      }
    });

    if (existing) {
      return { success: false, error: "An account with this email or phone already exists." };
    }

    const created = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        phone: data.phone?.trim() || null,
        password: data.password,
        role: data.isTrader ? "trader" : "customer",
        isTrader: !!data.isTrader,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
      }
    });

    return {
      success: true,
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        role: created.role,
        isTrader: created.isTrader,
        avatar: created.avatar,
        address: created.address,
        city: created.city,
      }
    };
  } catch (err: any) {
    console.error("Error in registerDbUser:", err);
    return { success: false, error: "Database error during user registration." };
  }
}

export async function loginDbUser(
  emailOrPhone: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: DbUserSession }> {
  try {
    const normalized = emailOrPhone.trim().toLowerCase();
    
    // Check admin credentials
    if (normalized === "admin" && password === "admin") {
      return {
        success: true,
        user: {
          id: "admin-user",
          name: "Store Administrator",
          email: "admin@mobilestore.com",
          phone: "+977-9800000000",
          role: "admin",
          isTrader: false,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
        }
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalized },
          { phone: emailOrPhone.trim() }
        ]
      }
    });

    if (!user) {
      // Auto-create guest user in database for smooth visitor experience
      const isEmail = normalized.includes("@");
      const guest = await prisma.user.create({
        data: {
          name: isEmail ? normalized.split("@")[0] : "Customer",
          email: isEmail ? normalized : `${normalized}@mobilestore.com`,
          phone: !isEmail ? emailOrPhone.trim() : "9800000000",
          password: password,
          role: "customer",
          isTrader: false,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
        }
      });
      return {
        success: true,
        user: {
          id: guest.id,
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          role: guest.role,
          isTrader: guest.isTrader,
          avatar: guest.avatar,
          address: guest.address,
          city: guest.city,
        }
      };
    }

    if (user.password !== password) {
      return { success: false, error: "Incorrect password." };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isTrader: user.isTrader,
        avatar: user.avatar,
        address: user.address,
        city: user.city,
      }
    };
  } catch (err: any) {
    console.error("Error in loginDbUser:", err);
    return { success: false, error: "Database error during login." };
  }
}

export async function getDbUserByEmail(email: string): Promise<DbUserSession | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isTrader: user.isTrader,
      avatar: user.avatar,
      address: user.address,
      city: user.city,
    };
  } catch (err) {
    console.error("Error in getDbUserByEmail:", err);
    return null;
  }
}

export async function updateDbUserProfile(
  email: string,
  data: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    avatar?: string;
  }
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { email: email.trim().toLowerCase() },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
      }
    });
    return true;
  } catch (err) {
    console.error("Error in updateDbUserProfile:", err);
    return false;
  }
}

export async function getDbAllUsers(): Promise<DbUserSession[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
    return users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isTrader: u.isTrader,
      avatar: u.avatar,
      address: u.address,
      city: u.city,
    }));
  } catch (err) {
    console.error("Error in getDbAllUsers:", err);
    return [];
  }
}


