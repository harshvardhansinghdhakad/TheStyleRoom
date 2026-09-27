import { sampleProducts, type Product } from './supabase';

export type CategorySlug = 'all' | 'dresses' | 'tops' | 'new';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  headline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export const CATEGORIES: Record<CategorySlug, CategoryInfo> = {
  all: {
    slug: 'all',
    name: 'All Collections',
    headline: 'Curated Atelier Wardrobe',
    description: 'Explore our complete range of handcrafted mulberry silks, fluid tailoring, and contemporary women’s capsules.',
    metaTitle: "Women's Fashion Collections | The Style Room Boutique",
    metaDescription: "Explore all women's fashion at The Style Room. Handcrafted mulberry silks, tailored silhouettes, and timeless essentials. Free express shipping over ₹2,999.",
  },
  dresses: {
    slug: 'dresses',
    name: "Women's Couture & Dresses",
    headline: 'Silks, Slips & Evening Silhouettes',
    description: 'From 22-momme pure mulberry silk slips to structured evening silhouettes drafted by our master tailors.',
    metaTitle: "Designer Dresses & Silk Slips for Women | The Style Room",
    metaDescription: "Shop luxury women's dresses at The Style Room. Pure mulberry silk slips, pleated cocktail gowns, and elegant evening wear handcrafted in Indore.",
  },
  tops: {
    slug: 'tops',
    name: 'Curated Tops & Capsules',
    headline: 'Resort Shirts, Blouses & Tailored Layers',
    description: 'Elevated organic cotton poplin blouses, breezy resort linen shirts, and minimalist jackets designed for effortless versatility.',
    metaTitle: "Curated Tops, Blouses & Shirts for Women | The Style Room",
    metaDescription: "Discover luxury women's tops, satin button-down blouses, organic poplin shirts, and lightweight jackets at The Style Room.",
  },
  new: {
    slug: 'new',
    name: 'New Arrivals Drop',
    headline: 'Runway Unveiled — Seasonal Drop',
    description: 'Fresh couture and atelier additions just landed in our Indore showroom. Stay ahead with the newest luxury silhouettes.',
    metaTitle: "New Arrivals Drop — Latest Fashion 2026 | The Style Room",
    metaDescription: "Shop the newest fashion drops at The Style Room. Fresh couture dresses, chic tops, and curated modern luxury arrivals.",
  },
};

/**
 * Returns all products, either from local storage (client-side) or the default sample products.
 */
export function getAllProducts(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('thestyleroom_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }
  return sampleProducts;
}

/**
 * Returns a product by ID.
 */
export function getProductById(id: string): Product | undefined {
  const products = getAllProducts();
  return products.find((p) => p.id === id);
}

/**
 * Returns products filtered by category.
 */
export function getProductsByCategory(category: string): Product[] {
  const products = getAllProducts();
  if (category === 'new') {
    return products.filter((p) => p.is_new);
  }
  if (category === 'dresses' || category === 'tops') {
    return products.filter((p) => p.category === category);
  }
  return products;
}

/**
 * Search products by keyword in name or description.
 */
export function searchProducts(query: string, category?: string): Product[] {
  let products = getAllProducts();
  if (category && category !== 'all') {
    if (category === 'new') {
      products = products.filter((p) => p.is_new);
    } else {
      products = products.filter((p) => p.category === category);
    }
  }
  if (!query.trim()) return products;

  const q = query.trim().toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
  );
}

/**
 * Returns related products for a given product.
 */
export function getRelatedProducts(currentProduct: Product, limit = 4): Product[] {
  const products = getAllProducts();
  return products
    .filter((p) => p.id !== currentProduct.id)
    .sort((a, b) => (a.category === currentProduct.category ? -1 : 1))
    .slice(0, limit);
}
