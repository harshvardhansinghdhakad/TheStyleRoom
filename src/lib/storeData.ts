import { sampleProducts, type Product, type Order, type Customer, type Setting, isSupabaseConfigured, supabase } from './supabase';
import { ARTICLES, type Article } from './articles';

export interface CartAnalyticsEvent {
  productId: string;
  productName: string;
  price: number;
  size: string;
  timestamp: string;
}

export interface StoreAnalytics {
  totalCartAdditions: number;
  recentCartEvents: CartAnalyticsEvent[];
  totalLogins: number;
  lastLoginAt: string | null;
}

export type UserAddress = {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
};

export type AppUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  addresses: UserAddress[];
  createdAt: string;
  lastLoginAt: string;
  authProvider: 'email' | 'google';
};

// Storage Keys
const PRODUCTS_KEY = 'thestyleroom_products';
const ARTICLES_KEY = 'thestyleroom_articles';
const ORDERS_KEY = 'thestyleroom_orders';
const CUSTOMERS_KEY = 'thestyleroom_customers';
const ANALYTICS_KEY = 'thestyleroom_analytics';
const SETTINGS_KEY = 'thestyleroom_settings';

// Default initial orders
export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    customer_id: 'cust-1',
    customer_name: 'Ananya Singhania',
    customer_email: 'ananya.s@gmail.com',
    items: [
      { product_id: 'prod-1', name: 'Silk Slip Evening Dress', size: 'M', quantity: 1, price: 3499 },
      { product_id: 'prod-4', name: 'Satin Button-Down Blouse', size: 'S', quantity: 1, price: 2299 },
    ],
    total: 5798,
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ord-102',
    customer_id: 'cust-2',
    customer_name: 'Meera Kapoor',
    customer_email: 'meera.k@outlook.com',
    items: [
      { product_id: 'prod-2', name: 'Ribbed Knit Midi Dress', size: 'L', quantity: 1, price: 2899 },
    ],
    total: 2899,
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'ord-103',
    customer_id: 'cust-3',
    customer_name: 'Rhea Oberoi',
    customer_email: 'rhea.oberoi@yahoo.com',
    items: [
      { product_id: 'prod-7', name: 'Tailored Minimalist Jacket', size: 'M', quantity: 1, price: 4299 },
    ],
    total: 4299,
    status: 'shipped',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'ord-104',
    customer_id: 'cust-4',
    customer_name: 'Tanvi Verma',
    customer_email: 'tanvi.v@gmail.com',
    items: [
      { product_id: 'prod-5', name: 'Floral Tiered Maxi Dress', size: 'S', quantity: 1, price: 3799 },
    ],
    total: 3799,
    status: 'delivered',
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

export const initialCustomers: Customer[] = [
  { id: 'cust-1', name: 'Ananya Singhania', email: 'ananya.s@gmail.com', phone: '+91 98201 12345', created_at: '2026-01-10T10:00:00Z' },
  { id: 'cust-2', name: 'Meera Kapoor', email: 'meera.k@outlook.com', phone: '+91 98112 54321', created_at: '2026-01-12T14:30:00Z' },
  { id: 'cust-3', name: 'Rhea Oberoi', email: 'rhea.oberoi@yahoo.com', phone: '+91 98334 67890', created_at: '2026-01-15T09:15:00Z' },
  { id: 'cust-4', name: 'Tanvi Verma', email: 'tanvi.v@gmail.com', phone: '+91 98765 89123', created_at: '2026-01-20T16:45:00Z' },
];

export const initialSettings: Setting[] = [
  { id: 'set-1', key: 'store_name', value: 'The Style Room' },
  { id: 'set-2', key: 'support_email', value: 'support@the-style-room.vercel.app' },
  { id: 'set-3', key: 'support_phone', value: '+91 75818 57811' },
  { id: 'set-4', key: 'free_shipping_threshold', value: '2999' },
  { id: 'set-5', key: 'announcement_banner', value: 'COMPLIMENTARY EXPRESS SHIPPING ACROSS INDIA OVER ₹2,999' },
];

// Helper to safely get from localStorage
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

// Helper to safely set to localStorage
function setLocal<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // quota exceeded or private mode
  }
}

// --- PRODUCTS ---
export function getStoredProducts(): Product[] {
  return getLocal<Product[]>(PRODUCTS_KEY, sampleProducts);
}

export async function saveProductToStore(product: Product): Promise<Product[]> {
  const current = getStoredProducts();
  const existingIdx = current.findIndex((p) => p.id === product.id);
  let updated: Product[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = product;
  } else {
    updated = [product, ...current];
  }
  setLocal(PRODUCTS_KEY, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('products').upsert(product);
    } catch (err) {
      console.warn('Supabase product upsert fallback to local:', err);
    }
  }
  return updated;
}

export async function deleteProductFromStore(productId: string): Promise<Product[]> {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  setLocal(PRODUCTS_KEY, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (err) {
      console.warn('Supabase product delete error:', err);
    }
  }
  return updated;
}

// --- ARTICLES / BLOG ---
export function getStoredArticles(): Article[] {
  return getLocal<Article[]>(ARTICLES_KEY, ARTICLES);
}

export async function saveArticleToStore(article: Article): Promise<Article[]> {
  const current = getStoredArticles();
  const existingIdx = current.findIndex((a) => a.id === article.id);
  let updated: Article[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = article;
  } else {
    updated = [article, ...current];
  }
  setLocal(ARTICLES_KEY, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('articles').upsert(article);
    } catch (err) {
      console.warn('Supabase article upsert error:', err);
    }
  }
  return updated;
}

export async function deleteArticleFromStore(articleId: string): Promise<Article[]> {
  const current = getStoredArticles();
  const updated = current.filter((a) => a.id !== articleId);
  setLocal(ARTICLES_KEY, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('articles').delete().eq('id', articleId);
    } catch (err) {
      console.warn('Supabase article delete error:', err);
    }
  }
  return updated;
}

// --- ORDERS ---
export function getStoredOrders(): Order[] {
  return getLocal<Order[]>(ORDERS_KEY, initialOrders);
}

export async function saveOrderToStore(order: Order): Promise<Order[]> {
  const current = getStoredOrders();
  const updated = [order, ...current];
  setLocal(ORDERS_KEY, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('orders').insert(order);
    } catch (err) {
      console.warn('Supabase order insert error:', err);
    }
  }
  return updated;
}

export async function updateOrderStatusInStore(orderId: string, status: Order['status']): Promise<Order[]> {
  const current = getStoredOrders();
  const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
  setLocal(ORDERS_KEY, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (err) {
      console.warn('Supabase order status update error:', err);
    }
  }
  return updated;
}

// --- CUSTOMERS / SIGNUPS ---
export function getStoredCustomers(): Customer[] {
  return getLocal<Customer[]>(CUSTOMERS_KEY, initialCustomers);
}

export async function recordNewCustomer(customer: Customer): Promise<Customer[]> {
  const current = getStoredCustomers();
  const existingIdx = current.findIndex((c) => c.email.toLowerCase() === customer.email.toLowerCase());
  let updated: Customer[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...customer };
  } else {
    updated = [customer, ...current];
  }
  setLocal(CUSTOMERS_KEY, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('customers').upsert(customer);
    } catch (err) {
      console.warn('Supabase customer upsert error:', err);
    }
  }
  return updated;
}

// --- ANALYTICS (Cart Additions, Logins) ---
export function getStoreAnalytics(): StoreAnalytics {
  return getLocal<StoreAnalytics>(ANALYTICS_KEY, {
    totalCartAdditions: 18,
    recentCartEvents: [
      {
        productId: 'prod-1',
        productName: 'Silk Slip Evening Dress',
        price: 3499,
        size: 'M',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        productId: 'prod-4',
        productName: 'Satin Button-Down Blouse',
        price: 2299,
        size: 'S',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        productId: 'prod-2',
        productName: 'Ribbed Knit Midi Dress',
        price: 2899,
        size: 'L',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ],
    totalLogins: 42,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  });
}

export function trackCartAdditionEvent(product: Product, size: string): void {
  const current = getStoreAnalytics();
  const newEvent: CartAnalyticsEvent = {
    productId: product.id,
    productName: product.name,
    price: product.price,
    size,
    timestamp: new Date().toISOString(),
  };

  const updated: StoreAnalytics = {
    ...current,
    totalCartAdditions: current.totalCartAdditions + 1,
    recentCartEvents: [newEvent, ...current.recentCartEvents.slice(0, 19)],
  };
  setLocal(ANALYTICS_KEY, updated);
}

export function trackUserLoginEvent(): void {
  const current = getStoreAnalytics();
  const updated: StoreAnalytics = {
    ...current,
    totalLogins: current.totalLogins + 1,
    lastLoginAt: new Date().toISOString(),
  };
  setLocal(ANALYTICS_KEY, updated);
}

// --- SETTINGS ---
export function getStoredSettings(): Setting[] {
  return getLocal<Setting[]>(SETTINGS_KEY, initialSettings);
}

export async function saveSettingsToStore(settings: Setting[]): Promise<Setting[]> {
  setLocal(SETTINGS_KEY, settings);
  if (isSupabaseConfigured) {
    try {
      await supabase.from('settings').upsert(settings);
    } catch (err) {
      console.warn('Supabase settings upsert error:', err);
    }
  }
  return settings;
}
