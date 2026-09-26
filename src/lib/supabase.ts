import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_thestyleroom ||
  process.env.NEXT_PUBLIC_thestyleroom_URL ||
  process.env.NEXT_PUBLIC_THESTYLEROOM_URL;

const rawSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_thestyleroom_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_thestyleroom_ANON_KEY ||
  process.env.NEXT_PUBLIC_THESTYLEROOM_ANON_KEY;

// Keep the client constructible during Next.js static prerendering.
// Real Supabase credentials must still be supplied at runtime via NEXT_PUBLIC_*.
export const isSupabaseConfigured = Boolean(
  rawSupabaseUrl &&
  rawSupabaseAnonKey &&
  !rawSupabaseUrl.includes('placeholder')
);

export function hasSupabaseEnv(): boolean {
  return isSupabaseConfigured;
}

const clientUrl = rawSupabaseUrl || 'https://placeholder.supabase.co';
const clientKey = rawSupabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(clientUrl, clientKey);

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: 'dresses' | 'tops';
  image_url: string;
  sizes: string[];
  is_new: boolean;
  stock: number;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export type Setting = {
  id: string;
  key: string;
  value: string;
};

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export const sampleProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Silk Slip Evening Dress',
    description: 'A timeless silhouette crafted from rich mulberry silk with subtle side slit detail.',
    price: 3499,
    category: 'dresses',
    image_url: '/images/product-02.jpeg',
    sizes: ['XS', 'S', 'M', 'L'],
    is_new: true,
    stock: 12,
    created_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Ribbed Knit Midi Dress',
    description: 'Effortless all-day style in flattering stretch knit that hugs curves comfortably.',
    price: 2899,
    category: 'dresses',
    image_url: '/images/product-03.jpeg',
    sizes: ['S', 'M', 'L'],
    is_new: true,
    stock: 15,
    created_at: new Date('2026-01-02').toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Oversized Linen Resort Shirt',
    description: 'Lightweight breathable linen shirt with relaxed dropped shoulders and shell buttons.',
    price: 1899,
    category: 'tops',
    image_url: '/images/product-04.jpeg',
    sizes: ['S', 'M', 'L', 'XL'],
    is_new: false,
    stock: 20,
    created_at: new Date('2026-01-03').toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Satin Button-Down Blouse',
    description: 'Gleaming satin drape tailored for modern boardroom-to-evening versatility.',
    price: 2299,
    category: 'tops',
    image_url: '/images/product-05.jpeg',
    sizes: ['XS', 'S', 'M', 'L'],
    is_new: true,
    stock: 10,
    created_at: new Date('2026-01-04').toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Floral Tiered Maxi Dress',
    description: 'Romantic tiered layers with subtle botanical prints and soft ruffle accents.',
    price: 3799,
    category: 'dresses',
    image_url: '/images/product-06.jpeg',
    sizes: ['S', 'M', 'L'],
    is_new: false,
    stock: 8,
    created_at: new Date('2026-01-05').toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Cropped Structured Poplin Top',
    description: 'Crisp organic cotton poplin with square neckline and gathered waist definition.',
    price: 1599,
    category: 'tops',
    image_url: '/images/product-07.jpeg',
    sizes: ['XS', 'S', 'M'],
    is_new: false,
    stock: 16,
    created_at: new Date('2026-01-06').toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Tailored Minimalist Jacket',
    description: 'Clean architectural cut designed to layer seamlessly over dresses and denim.',
    price: 4299,
    category: 'tops',
    image_url: '/images/product-08.jpeg',
    sizes: ['S', 'M', 'L'],
    is_new: true,
    stock: 14,
    created_at: new Date('2026-01-07').toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Pleated Halter Cocktail Dress',
    description: 'Flowing accordion pleats with graceful halter neckline for celebratory moments.',
    price: 3699,
    category: 'dresses',
    image_url: '/images/product-09.jpeg',
    sizes: ['S', 'M', 'L'],
    is_new: true,
    stock: 9,
    created_at: new Date('2026-01-08').toISOString(),
  },
  {
    id: 'prod-9',
    name: 'Classic Supima Cotton Top',
    description: 'Super-soft everyday staple made from premium long-staple combed cotton.',
    price: 1199,
    category: 'tops',
    image_url: '/images/product-10.jpeg',
    sizes: ['S', 'M', 'L', 'XL'],
    is_new: false,
    stock: 25,
    created_at: new Date('2026-01-09').toISOString(),
  },
  {
    id: 'prod-10',
    name: 'Bohemian Belted Wrap Dress',
    description: 'Feminine V-neck silhouette with self-tie waist and breezy hemline movement.',
    price: 2999,
    category: 'dresses',
    image_url: '/images/product-12.jpeg',
    sizes: ['XS', 'S', 'M', 'L'],
    is_new: false,
    stock: 11,
    created_at: new Date('2026-01-10').toISOString(),
  },
];

