import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Keep the client constructible during Next.js static prerendering.
// Real Supabase credentials must still be supplied at runtime via NEXT_PUBLIC_*.
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const clientUrl = supabaseUrl ?? 'https://placeholder.supabase.co';
const clientKey = supabaseAnonKey ?? 'placeholder-anon-key';

export const supabase = createClient(clientUrl, clientKey);

export function hasSupabaseEnv(): boolean {
  return hasSupabaseConfig;
}

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
