"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, formatPrice, type Product, type Order, type Customer, type Setting } from '@/lib/supabase';
import type { Article } from '@/lib/articles';
import {
  getStoredProducts,
  saveProductToStore,
  deleteProductFromStore,
  getStoredArticles,
  saveArticleToStore,
  deleteArticleFromStore,
  getStoredOrders,
  updateOrderStatusInStore,
  getStoredCustomers,
  getStoreAnalytics,
  getStoredSettings,
  saveSettingsToStore,
  type StoreAnalytics,
} from '@/lib/storeData';
import {
  LayoutDashboard,
  Package,
  Plus,
  Pencil,
  Trash2,
  ShoppingCart,
  Users,
  Settings,
  X,
  Check,
  Search,
  AlertCircle,
  ArrowLeft,
  Save,
  TrendingUp,
  DollarSign,
  Boxes,
  Eye,
  Lock,
  Mail,
  LogOut,
  BookOpen,
  ShoppingBag,
  Activity,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  Tag,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

type Section = 'dashboard' | 'products' | 'journal' | 'orders' | 'customers' | 'analytics' | 'settings';

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: 'dresses' | 'tops';
  image_url: string;
  sizes: string[];
  is_new: boolean;
  stock: string;
};

const emptyProductForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: 'tops',
  image_url: '',
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  is_new: false,
  stock: '15',
};

type ArticleFormData = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  content: string;
};

const emptyArticleForm: ArticleFormData = {
  id: '',
  title: '',
  category: 'Trend Report',
  readTime: '4 min read',
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  author: 'Aria Sharma • Atelier Stylist',
  image: '/images/product-02.jpeg',
  excerpt: '',
  content: '',
};

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function AdminPanel({ onExit }: { onExit: () => void }) {
  const [session, setSession] = useState<Session | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [section, setSection] = useState<Section>('dashboard');

  // Core Data
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<StoreAnalytics>({
    totalCartAdditions: 0,
    recentCartEvents: [],
    totalLogins: 0,
    lastLoginAt: null,
  });
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Product Form Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormData>(emptyProductForm);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<Product | null>(null);

  // Article / Blog Form Modal
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [articleForm, setArticleForm] = useState<ArticleFormData>(emptyArticleForm);
  const [articleFormError, setArticleFormError] = useState<string | null>(null);
  const [deleteArticleConfirm, setDeleteArticleConfirm] = useState<Article | null>(null);

  // Order Details Modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Auth check
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthChecking(false);
      return;
    }
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data?.session ?? null);
        setAuthChecking(false);
      })
      .catch(() => setAuthChecking(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  // Load all data
  const refreshAllData = useCallback(() => {
    setLoading(true);
    try {
      const p = getStoredProducts();
      const a = getStoredArticles();
      const o = getStoredOrders();
      const c = getStoredCustomers();
      const an = getStoreAnalytics();
      const s = getStoredSettings();

      setProducts(p);
      setArticles(a);
      setOrders(o);
      setCustomers(c);
      setAnalytics(an);
      setSettings(s);

      const map: Record<string, string> = {};
      s.forEach((item) => {
        map[item.key] = item.value;
      });
      setSettingsForm(map);
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session || demoMode) {
      refreshAllData();
    }
  }, [session, demoMode, refreshAllData]);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    setSession(null);
    setDemoMode(false);
    onExit();
  };

  // --- PRODUCT CRUD ---
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setProductFormError(null);
    setShowProductForm(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description || '',
      price: String(prod.price),
      category: prod.category,
      image_url: prod.image_url,
      sizes: prod.sizes,
      is_new: prod.is_new,
      stock: String(prod.stock ?? 0),
    });
    setProductFormError(null);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError(null);
    if (!productForm.name.trim()) {
      setProductFormError('Product name is required');
      return;
    }
    if (!productForm.price.trim() || Number(productForm.price) <= 0) {
      setProductFormError('Please enter a valid price');
      return;
    }
    if (!productForm.image_url.trim()) {
      setProductFormError('Please provide an image URL');
      return;
    }

    const payload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      price: Number(productForm.price),
      category: productForm.category,
      image_url: productForm.image_url.trim(),
      sizes: productForm.sizes.length > 0 ? productForm.sizes : ['Free Size'],
      is_new: productForm.is_new,
      stock: parseInt(productForm.stock, 10) || 0,
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
    };

    const updated = await saveProductToStore(payload);
    setProducts(updated);
    setShowProductForm(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const updated = await deleteProductFromStore(id);
    setProducts(updated);
    setDeleteProductConfirm(null);
  };

  const toggleProductSize = (size: string) => {
    setProductForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // --- BLOG / ARTICLE CRUD ---
  const openAddArticle = () => {
    setEditingArticle(null);
    setArticleForm(emptyArticleForm);
    setArticleFormError(null);
    setShowArticleForm(true);
  };

  const openEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArticleForm({
      id: art.id,
      title: art.title,
      category: art.category,
      readTime: art.readTime,
      date: art.date,
      author: art.author,
      image: art.image,
      excerpt: art.excerpt,
      content: art.content.join('\n\n'),
    });
    setArticleFormError(null);
    setShowArticleForm(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setArticleFormError(null);
    if (!articleForm.title.trim()) {
      setArticleFormError('Article title is required');
      return;
    }
    if (!articleForm.excerpt.trim()) {
      setArticleFormError('Article excerpt is required');
      return;
    }

    const paragraphs = articleForm.content
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const generatedSlug =
      editingArticle?.id ||
      articleForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const payload: Article = {
      id: generatedSlug || `article-${Date.now()}`,
      title: articleForm.title.trim(),
      category: articleForm.category.trim(),
      readTime: articleForm.readTime.trim() || '4 min read',
      date: articleForm.date.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: articleForm.author.trim() || 'The Style Room Atelier',
      image: articleForm.image.trim() || '/images/product-02.jpeg',
      excerpt: articleForm.excerpt.trim(),
      metaDescription: articleForm.excerpt.trim(),
      content: paragraphs.length > 0 ? paragraphs : [articleForm.excerpt.trim()],
    };

    const updated = await saveArticleToStore(payload);
    setArticles(updated);
    setShowArticleForm(false);
  };

  const handleDeleteArticle = async (id: string) => {
    const updated = await deleteArticleFromStore(id);
    setArticles(updated);
    setDeleteArticleConfirm(null);
  };

  // --- ORDER STATUS UPDATE ---
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updated = await updateOrderStatusInStore(orderId, status);
    setOrders(updated);
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder({ ...viewingOrder, status });
    }
  };

  // --- SETTINGS SAVE ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    const updatedSettings: Setting[] = Object.entries(settingsForm).map(([key, value], idx) => ({
      id: `set-${idx + 1}`,
      key,
      value,
    }));
    await saveSettingsToStore(updatedSettings);
    setSettings(updatedSettings);
    setSavingSettings(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Calculated Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);

  // "kitne prudcut bike"
  const totalUnitsSold = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.items.reduce((iSum, it) => iSum + (it.quantity || 1), 0), 0);

  const totalStock = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#faf8fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-200 border-t-[#67349a] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session && !demoMode) {
    return <AdminLogin onExit={onExit} onDemoLogin={() => setDemoMode(true)} />;
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());
    if (orderFilter === 'all') return matchesSearch;
    return matchesSearch && o.status === orderFilter;
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)),
  );

  const navItems: { id: Section; label: string; icon: typeof Package; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: products.length },
    { id: 'journal', label: 'Blog & Journal', icon: BookOpen, badge: articles.length },
    { id: 'orders', label: 'Orders & Sales', icon: ShoppingCart, badge: orders.length },
    { id: 'customers', label: 'Members & Signups', icon: Users, badge: customers.length },
    { id: 'analytics', label: 'Cart & User Activity', icon: Activity },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6fb] flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="md:w-64 md:min-h-screen bg-[#1c092a] text-white md:flex md:flex-col shrink-0 border-r border-[#31144a]">
        
        {/* Atelier Logo Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#31144a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#67349a] to-[#9b51e0] flex items-center justify-center shadow-md">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-white leading-tight">Admin Atelier</h1>
              <p className="text-[10px] text-purple-300 uppercase tracking-widest font-semibold">The Style Room</p>
            </div>
          </div>
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 md:hidden"
            aria-label="Exit admin"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex md:flex-col gap-1 p-2 md:p-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSection(item.id);
                  setSearch('');
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#67349a] text-white shadow-md'
                    : 'text-purple-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className="shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-[#31144a] text-purple-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="hidden md:block mt-auto p-4 border-t border-[#31144a] space-y-2">
          <button
            onClick={refreshAllData}
            className="flex items-center gap-2 text-xs text-purple-200 hover:text-white transition-colors w-full px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <RefreshCw size={14} />
            <span>Sync Live Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-rose-300 hover:text-rose-100 transition-colors w-full px-3 py-2 rounded-xl hover:bg-rose-900/30"
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-purple-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-1">
              <span>Admin Atelier</span>
              <span>/</span>
              <span className="capitalize font-bold text-[#67349a]">{section}</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1f0b33] capitalize">
              {section === 'dashboard'
                ? 'Store Performance Overview'
                : section === 'journal'
                ? 'Blog & Journal Management'
                : section === 'orders'
                ? 'Orders & Revenue Management'
                : section === 'customers'
                ? 'Members & Signup Analytics'
                : section === 'analytics'
                ? 'Cart Additions & User Activity'
                : `${section} Management`}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-200 text-[#67349a] hover:bg-purple-50 text-xs font-semibold"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">View Storefront</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 animate-fade-in">
            <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-xs text-rose-500 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-purple-200 border-t-[#67349a] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* 1. DASHBOARD TAB */}
            {section === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* 5 Core Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Revenue */}
                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-emerald-600 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">Total Sales</span>
                      <DollarSign size={18} />
                    </div>
                    <div className="font-serif text-2xl font-bold text-charcoal-900">{formatPrice(totalRevenue)}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1">Confirmed Revenue</span>
                  </div>

                  {/* Products Sold ("kitne prudcut bike") */}
                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[#67349a] mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">Products Sold</span>
                      <ShoppingBag size={18} />
                    </div>
                    <div className="font-serif text-2xl font-bold text-[#67349a]">{totalUnitsSold} Units</div>
                    <span className="text-[10px] text-charcoal-500 mt-1">{orders.length} total orders</span>
                  </div>

                  {/* Cart Additions ("card me kitne itemr add kiye") */}
                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-blue-600 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">Cart Additions</span>
                      <ShoppingCart size={18} />
                    </div>
                    <div className="font-serif text-2xl font-bold text-blue-600">
                      {analytics.totalCartAdditions} Times
                    </div>
                    <span className="text-[10px] text-charcoal-500 mt-1">Items added to bag</span>
                  </div>

                  {/* Signups ("ktiene logo ne sigh up") */}
                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-purple-600 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">Registered Users</span>
                      <Users size={18} />
                    </div>
                    <div className="font-serif text-2xl font-bold text-charcoal-900">{customers.length} Members</div>
                    <span className="text-[10px] text-purple-600 font-semibold mt-1">Atelier Accounts</span>
                  </div>

                  {/* Total Logins ("login kiya") */}
                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-amber-600 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">Total Logins</span>
                      <Activity size={18} />
                    </div>
                    <div className="font-serif text-2xl font-bold text-amber-600">{analytics.totalLogins} Logins</div>
                    <span className="text-[10px] text-charcoal-500 mt-1">
                      {analytics.lastLoginAt ? 'Active recently' : 'No logins yet'}
                    </span>
                  </div>
                </div>

                {/* Grid: Recent Orders + Live Bag Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-charcoal-900">Recent Orders Placed</h3>
                      <button
                        onClick={() => setSection('orders')}
                        className="text-xs font-bold text-[#67349a] hover:underline"
                      >
                        View All ({orders.length})
                      </button>
                    </div>

                    <div className="divide-y divide-cream-100">
                      {orders.slice(0, 5).map((ord) => (
                        <div key={ord.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-charcoal-900">{ord.id}</span>
                              <span className="text-xs text-charcoal-500">• {ord.customer_name}</span>
                            </div>
                            <p className="text-[10px] text-charcoal-400 mt-0.5">
                              {ord.items.length} item(s) • {new Date(ord.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#241135] block">{formatPrice(ord.total)}</span>
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'confirmed'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Cart Additions Activity Feed ("card me kitne item add kiye") */}
                  <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-[#67349a]" />
                        <h3 className="font-serif text-lg font-bold text-charcoal-900">Live Cart Additions Stream</h3>
                      </div>
                      <span className="text-xs text-charcoal-500 font-medium">
                        Total {analytics.totalCartAdditions}
                      </span>
                    </div>

                    <div className="divide-y divide-cream-100">
                      {analytics.recentCartEvents.length === 0 ? (
                        <p className="text-xs text-charcoal-400 py-6 text-center">No cart events recorded yet.</p>
                      ) : (
                        analytics.recentCartEvents.slice(0, 5).map((evt, idx) => (
                          <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-charcoal-800">{evt.productName}</span>
                              <p className="text-[10px] text-charcoal-400 mt-0.5">
                                Size: {evt.size} • {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <span className="font-bold text-[#67349a]">{formatPrice(evt.price)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. PRODUCTS TAB */}
            {section === 'products' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative max-w-md w-full">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="text"
                      placeholder="Search garments by name or category..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-cream-200 text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <button
                    onClick={openAddProduct}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#67349a] hover:bg-[#54297f] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
                  >
                    <Plus size={15} />
                    <span>Add New Garment</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border border-purple-100/80 p-4 shadow-sm flex flex-col justify-between">
                      <div className="flex gap-3">
                        <img src={p.image_url} alt={p.name} className="w-20 h-24 rounded-xl object-cover shrink-0 bg-cream-100" />
                        <div className="overflow-hidden flex-1">
                          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#67349a]">
                            {p.category}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-charcoal-900 mt-1 truncate">{p.name}</h4>
                          <p className="text-xs font-bold text-[#67349a] mt-0.5">{formatPrice(p.price)}</p>
                          <p className="text-[11px] text-charcoal-500 mt-1">Stock: <b>{p.stock}</b> in Indore atelier</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-cream-100 text-xs">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="px-2.5 py-1 text-charcoal-600 hover:text-[#67349a] font-semibold inline-flex items-center gap-1"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteProductConfirm(p)}
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BLOG & JOURNAL MANAGEMENT TAB (NEW) */}
            {section === 'journal' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative max-w-md w-full">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="text"
                      placeholder="Search articles by title, author, or category..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-cream-200 text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <button
                    onClick={openAddArticle}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#67349a] hover:bg-[#54297f] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
                  >
                    <Plus size={15} />
                    <span>Write New Article</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((art) => (
                    <div key={art.id} className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden flex flex-col justify-between">
                      <div className="aspect-[16/9] overflow-hidden bg-cream-100 relative">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#1c092a]/90 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                          {art.category}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[10px] text-charcoal-400 mb-1">
                            <span>{art.date}</span>
                            <span>•</span>
                            <span>{art.readTime}</span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-charcoal-900 leading-snug mb-1">
                            {art.title}
                          </h4>
                          <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                            {art.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-cream-100">
                          <span className="text-[10px] text-charcoal-400 font-medium truncate max-w-[130px]">
                            By {art.author}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditArticle(art)}
                              className="p-1.5 text-charcoal-500 hover:text-[#67349a]"
                              title="Edit Article"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteArticleConfirm(art)}
                              className="p-1.5 text-charcoal-500 hover:text-rose-600"
                              title="Delete Article"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ORDERS & SALES TAB */}
            {section === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Search & Status Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative max-w-md w-full">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="text"
                      placeholder="Search orders by TSR code, customer name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-cream-200 text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                    {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrderFilter(st)}
                        className={`px-3 py-1 text-[11px] font-bold uppercase rounded-lg border transition-all ${
                          orderFilter === st
                            ? 'bg-[#67349a] text-white border-[#67349a]'
                            : 'bg-white text-charcoal-600 border-cream-200 hover:bg-purple-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-cream-50 text-[10px] uppercase font-bold tracking-wider text-charcoal-500 border-b border-cream-200">
                        <tr>
                          <th className="p-4">Order Ref</th>
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">Items Ordered</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Status & Update</th>
                          <th className="p-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-100">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-purple-50/20 transition-colors">
                            <td className="p-4">
                              <span className="font-mono font-bold text-xs text-[#67349a]">{ord.id}</span>
                              <p className="text-[10px] text-charcoal-400 mt-0.5">
                                {new Date(ord.created_at).toLocaleDateString()}
                              </p>
                            </td>

                            <td className="p-4">
                              <span className="font-bold text-charcoal-900 block">{ord.customer_name}</span>
                              <span className="text-[11px] text-charcoal-500 block">{ord.customer_email}</span>
                            </td>

                            <td className="p-4">
                              <span className="font-semibold text-charcoal-800">
                                {ord.items.length} item(s)
                              </span>
                              <p className="text-[10px] text-charcoal-500 truncate max-w-[200px]">
                                {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                              </p>
                            </td>

                            <td className="p-4 font-bold text-sm text-[#241135]">
                              {formatPrice(ord.total)}
                            </td>

                            <td className="p-4">
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                                className="px-2 py-1 text-[11px] font-bold uppercase rounded-lg border border-cream-300 focus:border-[#67349a] outline-none bg-white cursor-pointer"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td className="p-4 text-right">
                              <button
                                onClick={() => setViewingOrder(ord)}
                                className="px-3 py-1 bg-purple-50 text-[#67349a] hover:bg-purple-100 font-bold rounded-lg text-[11px]"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 5. MEMBERS & SIGNUPS TAB */}
            {section === 'customers' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="relative max-w-md w-full">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="text"
                      placeholder="Search member name, email or phone..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-cream-200 text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>
                  <span className="text-xs text-charcoal-500 font-semibold">{filteredCustomers.length} registered</span>
                </div>

                <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cream-50 text-[10px] uppercase font-bold tracking-wider text-charcoal-500 border-b border-cream-200">
                      <tr>
                        <th className="p-4">Member Name</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Phone / WhatsApp</th>
                        <th className="p-4">Member Since</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {filteredCustomers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-purple-50/20">
                          <td className="p-4 font-bold text-charcoal-900">{cust.name}</td>
                          <td className="p-4 text-charcoal-600">{cust.email}</td>
                          <td className="p-4 text-charcoal-600">{cust.phone || '—'}</td>
                          <td className="p-4 text-charcoal-500">{new Date(cust.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              Active Member
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. ANALYTICS & CART ACTIVITY TAB */}
            {section === 'analytics' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500">Cart Additions Rate</span>
                    <div className="font-serif text-3xl font-bold text-blue-600 mt-1">{analytics.totalCartAdditions}</div>
                    <p className="text-xs text-charcoal-500 mt-1">Times garments were placed in bags</p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500">User Sessions / Logins</span>
                    <div className="font-serif text-3xl font-bold text-[#67349a] mt-1">{analytics.totalLogins}</div>
                    <p className="text-xs text-charcoal-500 mt-1">Sign in sessions tracked</p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500">Completed Orders</span>
                    <div className="font-serif text-3xl font-bold text-emerald-600 mt-1">{orders.length}</div>
                    <p className="text-xs text-charcoal-500 mt-1">Checkout completions</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">
                    Comprehensive Real-Time Cart Log
                  </h3>
                  <div className="divide-y divide-cream-100">
                    {analytics.recentCartEvents.map((evt, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#67349a] flex items-center justify-center font-bold">
                            #{idx + 1}
                          </div>
                          <div>
                            <span className="font-bold text-charcoal-900">{evt.productName}</span>
                            <p className="text-[10px] text-charcoal-400">
                              Selected Size: <b>{evt.size}</b>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#67349a]">{formatPrice(evt.price)}</span>
                          <p className="text-[10px] text-charcoal-400">{new Date(evt.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {section === 'settings' && (
              <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm animate-fade-in space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900">Store Global Configurations</h3>
                  <p className="text-xs text-charcoal-500 mt-1">Manage announcement banner, free shipping threshold, and support contacts.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.store_name || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, store_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                      Announcement Banner Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcement_banner || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement_banner: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                        Free Express Delivery Minimum (₹)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.free_shipping_threshold || '2999'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, free_shipping_threshold: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                        Concierge WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={settingsForm.support_phone || '+91 75818 57811'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, support_phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="py-3 px-6 bg-[#241135] hover:bg-[#67349a] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    {savingSettings ? 'Saving...' : 'Save Store Settings'}
                  </button>

                  {settingsSaved && (
                    <p className="text-xs text-emerald-600 font-bold animate-fade-in">
                      ✓ Settings saved and active across website!
                    </p>
                  )}
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {/* PRODUCT FORM MODAL */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                {editingProduct ? 'Edit Garment Silhouette' : 'Add New Garment to Collection'}
              </h3>
              <button onClick={() => setShowProductForm(false)} className="text-charcoal-400 hover:text-charcoal-800">
                <X size={18} />
              </button>
            </div>

            {productFormError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {productFormError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Mulberry Silk Slip Dress"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="3499"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as 'dresses' | 'tops' })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none bg-white"
                  >
                    <option value="dresses">Dresses & Couture</option>
                    <option value="tops">Tops & Blouses</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Image URL / Path *</label>
                <input
                  type="text"
                  required
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="/images/product-02.jpeg"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Stock Units</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  placeholder="15"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleProductSize(sz)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border transition-all ${
                        productForm.sizes.includes(sz)
                          ? 'bg-[#67349a] text-white border-[#67349a]'
                          : 'border-cream-300 text-charcoal-600 hover:bg-cream-100'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Artisanal craftsmanship notes, fabric weight, etc."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={productForm.is_new}
                  onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })}
                  className="accent-[#67349a]"
                />
                <span className="text-xs font-bold text-charcoal-700">Mark as New Arrival Drop</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-[#241135] hover:bg-[#67349a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
              >
                {editingProduct ? 'Update Product' : 'Add Product to Atelier'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE / BLOG FORM MODAL (NEW) */}
      {showArticleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                {editingArticle ? 'Edit Journal Editorial' : 'Write New Style Journal Article'}
              </h3>
              <button onClick={() => setShowArticleForm(false)} className="text-charcoal-400 hover:text-charcoal-800">
                <X size={18} />
              </button>
            </div>

            {articleFormError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {articleFormError}
              </div>
            )}

            <form onSubmit={handleSaveArticle} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="The 2026 Trend Forecast: Fluid Tailoring"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    placeholder="Trend Report / Style Guide"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                    placeholder="4 min read"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Author Name & Title</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    placeholder="Aria Sharma • Atelier Stylist"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    value={articleForm.image}
                    onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                    placeholder="/images/category_jacket.jpg"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Excerpt / Summary (Meta Description) *</label>
                <textarea
                  rows={2}
                  required
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  placeholder="Summary of article for readers and search engines..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                  Full Article Body (Separate paragraphs with double enter)
                </label>
                <textarea
                  rows={6}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Paragraph 1...&#10;&#10;Paragraph 2...&#10;&#10;Paragraph 3..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#241135] hover:bg-[#67349a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
              >
                {editingArticle ? 'Update Article' : 'Publish Article to Journal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div>
                <span className="font-mono text-sm font-bold text-[#67349a]">{viewingOrder.id}</span>
                <p className="text-[10px] text-charcoal-400">
                  Placed on {new Date(viewingOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="text-charcoal-400 hover:text-charcoal-800">
                <X size={18} />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 bg-cream-50 rounded-2xl space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-charcoal-400 block mb-1">Delivery Recipient</span>
              <p className="font-bold text-charcoal-900">{viewingOrder.customer_name}</p>
              <p className="text-charcoal-600">{viewingOrder.customer_email}</p>
              {viewingOrder.customer_phone && <p className="text-charcoal-600">Phone: {viewingOrder.customer_phone}</p>}
              {viewingOrder.shipping_address && (
                <p className="text-charcoal-700 font-medium pt-1">
                  Address: {typeof viewingOrder.shipping_address === 'string' ? viewingOrder.shipping_address : JSON.stringify(viewingOrder.shipping_address)}
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-charcoal-400 block">Garments Ordered</span>
              <div className="divide-y divide-cream-100">
                {viewingOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-charcoal-800">{it.name}</span>
                      <p className="text-[10px] text-charcoal-500">Size: {it.size} • Qty: {it.quantity}</p>
                    </div>
                    <span className="font-bold text-charcoal-900">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Status Updater */}
            <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-charcoal-500">Grand Total:</span>
                <div className="font-serif text-xl font-bold text-[#67349a]">{formatPrice(viewingOrder.total)}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-charcoal-600">Status:</span>
                <select
                  value={viewingOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(viewingOrder.id, e.target.value as Order['status'])}
                  className="px-3 py-1.5 text-xs font-bold uppercase rounded-xl border border-cream-300 focus:border-[#67349a] outline-none bg-white cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATIONS */}
      {deleteProductConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-purple-100 shadow-xl text-center space-y-3">
            <h4 className="font-serif text-lg font-bold text-charcoal-900">Delete Product?</h4>
            <p className="text-xs text-charcoal-600">
              Are you sure you want to delete <b>{deleteProductConfirm.name}</b> from the store catalog?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteProductConfirm(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteProductConfirm.id)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteArticleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-purple-100 shadow-xl text-center space-y-3">
            <h4 className="font-serif text-lg font-bold text-charcoal-900">Delete Article?</h4>
            <p className="text-xs text-charcoal-600">
              Are you sure you want to delete <b>{deleteArticleConfirm.title}</b> from The Style Journal?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteArticleConfirm(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteArticleConfirm.id)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Login Screen Component
function AdminLogin({ onExit, onDemoLogin }: { onExit: () => void; onDemoLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSupabaseConfigured) {
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (err) {
        // If Supabase returned invalid login but matched owner credentials in demo fallback
        if (
          email.trim().toLowerCase() === 'harshvardhansinghdhakad@gmail.com' &&
          password === 'TheStyleRoom@7811'
        ) {
          onDemoLogin();
        } else {
          setError(err.message);
        }
      }
    } else {
      if (
        (email.trim().toLowerCase() === 'harshvardhansinghdhakad@gmail.com' &&
          password === 'TheStyleRoom@7811') ||
        email.toLowerCase().includes('admin') ||
        password.length >= 6
      ) {
        onDemoLogin();
      } else {
        setError('Invalid credentials. Use harshvardhansinghdhakad@gmail.com or 1-Click Instant Enter.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#140620] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 max-w-md w-full border border-purple-100 space-y-6 animate-scale-in">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#241135] to-[#67349a] text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock size={22} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Atelier Admin Portal</h2>
          <p className="text-xs text-charcoal-500 mt-1">Management console for products, blogs, orders & clients</p>
        </div>

        {/* Instant Access Button */}
        <button
          onClick={onDemoLogin}
          className="w-full py-3.5 bg-[#67349a] hover:bg-[#54297f] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles size={15} />
          <span>1-Click Instant Admin Access (Direct Enter)</span>
        </button>

        {/* Helpful Default Credentials Box */}
        <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 text-left space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#67349a]">
              Admin Credentials
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('harshvardhansinghdhakad@gmail.com');
                setPassword('TheStyleRoom@7811');
              }}
              className="text-[10px] font-bold text-[#67349a] underline hover:text-[#54297f]"
            >
              Click to Auto-fill
            </button>
          </div>
          <p className="text-[11px] text-charcoal-700 font-mono">
            Email: <b className="text-charcoal-900">harshvardhansinghdhakad@gmail.com</b>
          </p>
          <p className="text-[11px] text-charcoal-700 font-mono">
            Password: <b className="text-charcoal-900">TheStyleRoom@7811</b>
          </p>
        </div>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cream-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-charcoal-400">
            <span className="bg-white px-3">or sign in manually</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Admin Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="harshvardhansinghdhakad@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#241135] hover:bg-[#67349a] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={onExit}
            className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-900 inline-flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            <span>Return to Boutique</span>
          </button>
        </div>
      </div>
    </div>
  );
}
