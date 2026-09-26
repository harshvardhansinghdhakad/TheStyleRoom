import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
