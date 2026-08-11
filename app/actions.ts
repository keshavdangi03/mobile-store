"use server";

import { prisma } from "@/lib/prisma";
import { Product, Order } from "@/lib/db-simulation";
import { get100SeedProducts } from "@/lib/seed-data";

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
