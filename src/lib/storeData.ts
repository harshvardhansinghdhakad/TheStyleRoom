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
export async function fetchLiveProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      setLocal(PRODUCTS_KEY, data);
      return data;
    }
  } catch (err) {
    console.warn('Error fetching live products from Supabase:', err);
  }
  return getStoredProducts();
}

export function getStoredProducts(): Product[] {
  return getLocal<Product[]>(PRODUCTS_KEY, sampleProducts);
}

export async function saveProductToStore(product: Product): Promise<Product[]> {
  try {
    const { error } = await supabase.from('products').upsert(product);
    if (error) {
      console.error('Supabase product upsert error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase product upsert network error:', err);
  }

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
  return updated;
}

export async function deleteProductFromStore(productId: string): Promise<Product[]> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Supabase product delete error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase product delete network error:', err);
  }

  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  setLocal(PRODUCTS_KEY, updated);
  return updated;
}

// --- ARTICLES / BLOG ---
export async function fetchLiveArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped: Article[] = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        readTime: d.read_time || '4 min read',
        date: d.date,
        author: d.author,
        image: d.image,
        excerpt: d.excerpt,
        metaDescription: d.meta_description || d.excerpt || '',
        content: Array.isArray(d.content) ? d.content : [],
      }));
      setLocal(ARTICLES_KEY, mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Error fetching live articles from Supabase:', err);
  }
  return getStoredArticles();
}

export function getStoredArticles(): Article[] {
  return getLocal<Article[]>(ARTICLES_KEY, ARTICLES);
}

export async function saveArticleToStore(article: Article): Promise<Article[]> {
  try {
    const dbPayload = {
      id: article.id,
      title: article.title,
      category: article.category,
      read_time: article.readTime,
      date: article.date,
      author: article.author,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
    };
    const { error } = await supabase.from('articles').upsert(dbPayload);
    if (error) {
      console.error('Supabase article upsert error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase article upsert network error:', err);
  }

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
  return updated;
}

export async function deleteArticleFromStore(articleId: string): Promise<Article[]> {
  try {
    const { error } = await supabase.from('articles').delete().eq('id', articleId);
    if (error) {
      console.error('Supabase article delete error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase article delete network error:', err);
  }

  const current = getStoredArticles();
  const updated = current.filter((a) => a.id !== articleId);
  setLocal(ARTICLES_KEY, updated);
  return updated;
}

// --- ORDERS ---
export async function fetchLiveOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      setLocal(ORDERS_KEY, data);
      return data;
    }
  } catch (err) {
    console.warn('Error fetching live orders from Supabase:', err);
  }
  return getStoredOrders();
}

export function getStoredOrders(): Order[] {
  return getLocal<Order[]>(ORDERS_KEY, initialOrders);
}

export async function saveOrderToStore(order: Order): Promise<Order[]> {
  try {
    const { error } = await supabase.from('orders').insert(order);
    if (error) {
      console.error('Supabase order insert error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase order insert network error:', err);
  }

  const current = getStoredOrders();
  const updated = [order, ...current];
  setLocal(ORDERS_KEY, updated);
  return updated;
}

export async function updateOrderStatusInStore(orderId: string, status: Order['status']): Promise<Order[]> {
  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
      console.error('Supabase order update error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase order status update network error:', err);
  }

  const current = getStoredOrders();
  const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
  setLocal(ORDERS_KEY, updated);
  return updated;
}

// --- CUSTOMERS / SIGNUPS ---
export async function fetchLiveCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      setLocal(CUSTOMERS_KEY, data);
      return data;
    }
  } catch (err) {
    console.warn('Error fetching live customers from Supabase:', err);
  }
  return getStoredCustomers();
}

export function getStoredCustomers(): Customer[] {
  return getLocal<Customer[]>(CUSTOMERS_KEY, initialCustomers);
}

export async function recordNewCustomer(customer: Customer): Promise<Customer[]> {
  try {
    const { error } = await supabase.from('customers').upsert(customer);
    if (error) {
      console.error('Supabase customer upsert error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase customer upsert network error:', err);
  }

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
  return updated;
}

// --- ANALYTICS (Cart Additions, Logins) ---
export async function fetchLiveAnalytics(): Promise<StoreAnalytics> {
  let cartCount = 0;
  let recentEvents: CartAnalyticsEvent[] = [];
  let loginCount = 0;
  let lastLogin: string | null = null;

  try {
    const { data: events } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (events && events.length > 0) {
      const cartEvts = events.filter((e: any) => e.event_type === 'cart_add');
      const loginEvts = events.filter((e: any) => e.event_type === 'user_login');
      cartCount = cartEvts.length;
      loginCount = loginEvts.length;
      lastLogin = loginEvts[0]?.created_at || null;
      recentEvents = cartEvts.slice(0, 15).map((e: any) => ({
        productId: e.metadata?.product_id || '',
        productName: e.metadata?.product_name || 'Atelier Item',
        price: Number(e.metadata?.price) || 0,
        size: e.metadata?.size || 'M',
        timestamp: e.created_at,
      }));
    }
  } catch (err) {
    console.warn('Error fetching analytics events from Supabase:', err);
  }

  const cached = getStoreAnalytics();
  return {
    totalCartAdditions: Math.max(cartCount, cached.totalCartAdditions),
    recentCartEvents: recentEvents.length > 0 ? recentEvents : cached.recentCartEvents,
    totalLogins: Math.max(loginCount, cached.totalLogins),
    lastLoginAt: lastLogin || cached.lastLoginAt,
  };
}

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
  const newEvent: CartAnalyticsEvent = {
    productId: product.id,
    productName: product.name,
    price: product.price,
    size,
    timestamp: new Date().toISOString(),
  };

  const current = getStoreAnalytics();
  const updated: StoreAnalytics = {
    ...current,
    totalCartAdditions: current.totalCartAdditions + 1,
    recentCartEvents: [newEvent, ...current.recentCartEvents.slice(0, 19)],
  };
  setLocal(ANALYTICS_KEY, updated);

  // Send real-time event to Supabase in background
  (async () => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: 'cart_add',
        metadata: {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          size,
        },
      });
    } catch (err) {
      console.warn('Analytics event insert failed:', err);
    }
  })();
}

export function trackUserLoginEvent(): void {
  const current = getStoreAnalytics();
  const updated: StoreAnalytics = {
    ...current,
    totalLogins: current.totalLogins + 1,
    lastLoginAt: new Date().toISOString(),
  };
  setLocal(ANALYTICS_KEY, updated);

  // Send real-time event to Supabase in background
  (async () => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: 'user_login',
        metadata: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.warn('Login event insert failed:', err);
    }
  })();
}

// --- SETTINGS ---
export async function fetchLiveSettings(): Promise<Setting[]> {
  try {
    const { data, error } = await supabase.from('settings').select('*');
    if (!error && data && data.length > 0) {
      setLocal(SETTINGS_KEY, data);
      return data;
    }
  } catch (err) {
    console.warn('Error fetching live settings from Supabase:', err);
  }
  return getStoredSettings();
}

export function getStoredSettings(): Setting[] {
  return getLocal<Setting[]>(SETTINGS_KEY, initialSettings);
}

export async function saveSettingsToStore(settings: Setting[]): Promise<Setting[]> {
  try {
    const { error } = await supabase.from('settings').upsert(settings);
    if (error) {
      console.error('Supabase settings upsert error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase settings upsert network error:', err);
  }
  setLocal(SETTINGS_KEY, settings);
  return settings;
}

