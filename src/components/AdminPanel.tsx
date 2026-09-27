"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, sampleProducts, formatPrice, type Product, type Order, type Customer, type Setting } from '@/lib/supabase';
import {
  LayoutDashboard,
  Package,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
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
} from 'lucide-react';

type Section = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';

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

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: 'tops',
  image_url: '',
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  is_new: false,
  stock: '0',
};

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const defaultOrders: Order[] = [
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

const defaultCustomers: Customer[] = [
  { id: 'cust-1', name: 'Ananya Singhania', email: 'ananya.s@gmail.com', phone: '+91 98201 12345', created_at: '2026-01-10T10:00:00Z' },
  { id: 'cust-2', name: 'Meera Kapoor', email: 'meera.k@outlook.com', phone: '+91 98112 54321', created_at: '2026-01-12T14:30:00Z' },
  { id: 'cust-3', name: 'Rhea Oberoi', email: 'rhea.oberoi@yahoo.com', phone: '+91 98334 67890', created_at: '2026-01-15T09:15:00Z' },
  { id: 'cust-4', name: 'Tanvi Verma', email: 'tanvi.v@gmail.com', phone: '+91 98765 89123', created_at: '2026-01-20T16:45:00Z' },
];

const defaultSettings: Setting[] = [
  { id: 'set-1', key: 'store_name', value: 'The Style Room' },
  { id: 'set-2', key: 'support_email', value: 'support@thestyleroom.com' },
  { id: 'set-3', key: 'support_phone', value: '+91 75818 57811' },
  { id: 'set-4', key: 'free_shipping_threshold', value: '2999' },
  { id: 'set-5', key: 'announcement_banner', value: 'COMPLIMENTARY EXPRESS SHIPPING ACROSS INDIA OVER ₹2,999' },
];

export default function AdminPanel({ onExit }: { onExit: () => void }) {
  const [session, setSession] = useState<Session | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [section, setSection] = useState<Section>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setAuthChecking(false);
    }).catch(() => setAuthChecking(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const loadLocalFallback = useCallback(() => {
    try {
      const storedProds = typeof window !== 'undefined' ? localStorage.getItem('thestyleroom_products') : null;
      setProducts(storedProds ? JSON.parse(storedProds) : sampleProducts);

      const storedOrders = typeof window !== 'undefined' ? localStorage.getItem('thestyleroom_orders') : null;
      setOrders(storedOrders ? JSON.parse(storedOrders) : defaultOrders);

      const storedCusts = typeof window !== 'undefined' ? localStorage.getItem('thestyleroom_customers') : null;
      setCustomers(storedCusts ? JSON.parse(storedCusts) : defaultCustomers);

      const storedSets = typeof window !== 'undefined' ? localStorage.getItem('thestyleroom_settings') : null;
      setSettings(storedSets ? JSON.parse(storedSets) : defaultSettings);
    } catch {
      setProducts(sampleProducts);
      setOrders(defaultOrders);
      setCustomers(defaultCustomers);
      setSettings(defaultSettings);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (demoMode || !isSupabaseConfigured) {
      loadLocalFallback();
      setLoading(false);
      return;
    }

    try {
      const [prodRes, ordRes, custRes, setRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('settings').select('*'),
      ]);
      if (prodRes.error) throw prodRes.error;
      if (ordRes.error) throw ordRes.error;
      if (custRes.error) throw custRes.error;
      if (setRes.error) throw setRes.error;
      setProducts(prodRes.data ?? []);
      setOrders(ordRes.data ?? []);
      setCustomers(custRes.data ?? []);
      setSettings(setRes.data ?? []);
    } catch {
      // Graceful local fallback if Supabase tables are empty or offline
      loadLocalFallback();
    } finally {
      setLoading(false);
    }
  }, [demoMode, loadLocalFallback]);

  useEffect(() => {
    if (session || demoMode) fetchAll();
  }, [session, demoMode, fetchAll]);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    setSession(null);
    setDemoMode(false);
    onExit();
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session && !demoMode) {
    return <AdminLogin onExit={onExit} onDemoLogin={() => setDemoMode(true)} />;
  }

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      category: product.category,
      image_url: product.image_url,
      sizes: product.sizes,
      is_new: product.is_new,
      stock: String(product.stock ?? 0),
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.name.trim()) { setFormError('Product name is required'); return; }
    if (!form.price.trim() || Number(form.price) <= 0) { setFormError('Valid price is required'); return; }
    if (!form.image_url.trim()) { setFormError('Image path is required'); return; }

    setSaving(true);
    try {
      const payload: Product = {
        id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        category: form.category,
        image_url: form.image_url.trim(),
        sizes: form.sizes,
        is_new: form.is_new,
        stock: parseInt(form.stock, 10) || 0,
        created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
      };

      if (isSupabaseConfigured && !demoMode) {
        try {
          if (editingProduct) {
            await supabase.from('products').update(payload).eq('id', editingProduct.id);
          } else {
            await supabase.from('products').insert(payload);
          }
        } catch {}
      }

      setProducts((prev) => {
        let updated: Product[];
        if (editingProduct) {
          updated = prev.map((p) => (p.id === editingProduct.id ? payload : p));
        } else {
          updated = [payload, ...prev];
        }
        try {
          localStorage.setItem('thestyleroom_products', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      if (isSupabaseConfigured && !demoMode) {
        try {
          await supabase.from('products').delete().eq('id', product.id);
        } catch {}
      }
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== product.id);
        try {
          localStorage.setItem('thestyleroom_products', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      if (isSupabaseConfigured && !demoMode) {
        try {
          await supabase.from('orders').update({ status }).eq('id', orderId);
        } catch {}
      }
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
        try {
          localStorage.setItem('thestyleroom_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      if (isSupabaseConfigured && !demoMode) {
        try {
          await supabase.from('settings').update({ value }).eq('key', key);
        } catch {}
      }
      setSettings((prev) => {
        const updated = prev.map((s) => (s.key === key ? { ...s, value } : s));
        try {
          localStorage.setItem('thestyleroom_settings', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);
  const totalStock = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const navItems: { id: Section; label: string; icon: typeof Package }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 md:min-h-screen bg-charcoal-900 text-cream-100 md:flex md:flex-col flex-shrink-0">
        <div className="flex items-center justify-between md:justify-start p-4 md:p-6 md:border-b md:border-charcoal-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-white leading-tight">Admin Panel</h1>
              <p className="text-[10px] text-charcoal-300 uppercase tracking-wider">The Style Room</p>
            </div>
          </div>
          <button
            onClick={onExit}
            className="md:hidden p-2 text-charcoal-300 hover:text-white"
            aria-label="Exit admin"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <nav className="flex md:flex-col gap-1 p-2 md:p-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  section === item.id
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-white'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden md:block mt-auto p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-white transition-colors w-full px-4 py-2.5 rounded-xl hover:bg-charcoal-800"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* Mobile logout button */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-800 mb-4 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4 animate-fade-in">
            <AlertCircle size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-rose-700">{error}</p>
              <button onClick={() => setError(null)} className="text-xs text-rose-500 hover:underline mt-1">Dismiss</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-charcoal-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {section === 'dashboard' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-900 mb-6">Dashboard</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                  <StatCard icon={Package} label="Products" value={products.length} color="bg-blue-50 text-blue-600" />
                  <StatCard icon={ShoppingCart} label="Orders" value={orders.length} color="bg-rose-50 text-rose-600" />
                  <StatCard icon={Users} label="Customers" value={customers.length} color="bg-green-50 text-green-600" />
                  <StatCard icon={Boxes} label="Total Stock" value={totalStock} color="bg-amber-50 text-amber-600" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                        <DollarSign size={20} className="text-rose-500" />
                      </div>
                      <div>
                        <p className="text-sm text-charcoal-400">Total Revenue</p>
                        <p className="font-serif text-2xl font-semibold text-charcoal-900">{formatPrice(totalRevenue)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <TrendingUp size={20} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm text-charcoal-400">Pending Orders</p>
                        <p className="font-serif text-2xl font-semibold text-charcoal-900">{pendingOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-cream-200 p-6">
                  <h3 className="font-medium text-charcoal-800 mb-4">Recent Orders</h3>
                  {orders.length === 0 ? (
                    <p className="text-sm text-charcoal-400">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-charcoal-800">{order.customer_name}</p>
                            <p className="text-xs text-charcoal-400">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-charcoal-800">{formatPrice(Number(order.total))}</span>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Products */}
            {section === 'products' && (
              <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-900">Products</h2>
                  <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white text-sm font-medium rounded-xl hover:bg-rose-600 transition-colors shadow-sm"
                  >
                    <Plus size={18} /> Add Product
                  </button>
                </div>

                <div className="relative mb-4 max-w-md">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
                      <div className="flex gap-4 p-4">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-charcoal-800 truncate">{product.name}</h3>
                          <p className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">{product.category}</p>
                          <p className="font-semibold text-rose-600 text-sm">{formatPrice(product.price)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                            {product.is_new && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">New</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex border-t border-cream-100">
                        <button
                          onClick={() => openEditForm(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-charcoal-600 hover:bg-cream-50 transition-colors"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-rose-500 hover:bg-rose-50 transition-colors border-l border-cream-100"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-charcoal-400">No products found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Orders */}
            {section === 'orders' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-900 mb-6">Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-cream-200">
                    <ShoppingCart size={40} className="mx-auto text-charcoal-200 mb-3" />
                    <p className="text-charcoal-400">No orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-cream-200 p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-charcoal-800">{order.customer_name}</h3>
                              <StatusBadge status={order.status} />
                            </div>
                            <p className="text-xs text-charcoal-400">{order.customer_email}</p>
                            <p className="text-xs text-charcoal-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-serif text-xl font-semibold text-charcoal-900">{formatPrice(Number(order.total))}</p>
                            <p className="text-xs text-charcoal-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        <div className="border-t border-cream-100 pt-3">
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-charcoal-600">
                                  {item.name} <span className="text-charcoal-400">— Size {item.size} × {item.quantity}</span>
                                </span>
                                <span className="text-charcoal-600 font-medium">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-cream-100">
                          <span className="text-xs text-charcoal-400 mr-2">Update status:</span>
                          {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateOrderStatus(order.id, s)}
                              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all capitalize ${
                                order.status === s
                                  ? 'bg-charcoal-900 text-white'
                                  : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Customers */}
            {section === 'customers' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-900 mb-6">Customers</h2>
                {customers.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-cream-200">
                    <Users size={40} className="mx-auto text-charcoal-200 mb-3" />
                    <p className="text-charcoal-400">No customers yet.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-cream-200 bg-cream-50">
                            <th className="text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider px-4 py-3">Name</th>
                            <th className="text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider px-4 py-3">Email</th>
                            <th className="text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Phone</th>
                            <th className="text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.map((customer) => (
                            <tr key={customer.id} className="border-b border-cream-100 last:border-0 hover:bg-cream-50 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-charcoal-800">{customer.name}</td>
                              <td className="px-4 py-3 text-sm text-charcoal-600">{customer.email}</td>
                              <td className="px-4 py-3 text-sm text-charcoal-600 hidden sm:table-cell">{customer.phone || '—'}</td>
                              <td className="px-4 py-3 text-sm text-charcoal-400 hidden md:table-cell">{new Date(customer.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {section === 'settings' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-900 mb-6">Website Settings</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-6">
                  <div className="space-y-5">
                    {settings.map((setting) => (
                      <SettingField key={setting.key} setting={setting} onSave={updateSetting} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-md" onClick={() => setShowForm(false)} />
          <div className="relative bg-cream-50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-cream-200 sticky top-0 bg-cream-50 z-10 rounded-t-3xl">
              <h2 className="font-serif text-xl font-semibold text-charcoal-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-cream-100 rounded-full transition-colors" aria-label="Close">
                <X size={20} className="text-charcoal-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-700">{formError}</p>
                </div>
              )}

              {/* Image preview */}
              <div>
                <label className="text-sm font-medium text-charcoal-700 mb-1.5 block">Product Image</label>
                <div className="flex gap-3">
                  <div className="w-24 h-28 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-cream-200">
                    {form.image_url ? (
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-charcoal-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="/images/product-01.jpeg"
                      className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                    <p className="text-xs text-charcoal-400 mt-1">Enter the image file path (e.g. /images/product-01.jpeg)</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal-700 mb-1.5 block">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. FLORAL ONE PIECE"
                  className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal-700 mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal-700 mb-1.5 block">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="200"
                    className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal-700 mb-1.5 block">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal-700 mb-1.5 block">Category</label>
                <div className="flex gap-2">
                  {(['dresses', 'tops'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                        form.category === cat
                          ? 'bg-charcoal-900 text-white shadow-md'
                          : 'bg-white border border-cream-200 text-charcoal-600 hover:border-charcoal-400'
                      }`}
                    >
                      {cat === 'dresses' ? 'One Piece' : 'Shirts & Tops'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal-700 mb-1.5 block">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((size) => {
                    const selected = form.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            sizes: selected
                              ? prev.sizes.filter((s) => s !== size)
                              : [...prev.sizes, size],
                          }));
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selected
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-white border border-cream-200 text-charcoal-500 hover:border-charcoal-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_new: !form.is_new })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.is_new ? 'bg-rose-500' : 'bg-charcoal-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${form.is_new ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm text-charcoal-700">Mark as New Arrival</span>
              </label>
            </div>

            <div className="flex gap-3 p-6 border-t border-cream-200 sticky bottom-0 bg-cream-50 rounded-b-3xl">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-charcoal-600 bg-cream-100 hover:bg-cream-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} /> {editingProduct ? 'Save Changes' : 'Add Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-md" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-cream-50 rounded-3xl shadow-2xl max-w-sm w-full animate-scale-in p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">Delete Product?</h3>
                <p className="text-sm text-charcoal-500">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-charcoal-600 bg-cream-100 hover:bg-cream-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm"
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

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Package; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-4 md:p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="font-serif text-2xl font-semibold text-charcoal-900">{value}</p>
      <p className="text-xs text-charcoal-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const colors: Record<Order['status'], string> = {
    pending: 'bg-amber-50 text-amber-600',
    confirmed: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    delivered: 'bg-green-50 text-green-600',
    cancelled: 'bg-rose-50 text-rose-600',
  };
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize ${colors[status]}`}>
      {status}
    </span>
  );
}

function SettingField({ setting, onSave }: { setting: Setting; onSave: (key: string, value: string) => void }) {
  const [value, setValue] = useState(setting.value);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setValue(setting.value); }, [setting.value]);

  const handleSave = () => {
    onSave(setting.key, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatLabel = (key: string) =>
    key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div>
      <label className="text-sm font-medium text-charcoal-700 mb-1.5 block">{formatLabel(setting.key)}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
        />
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-charcoal-900 hover:bg-charcoal-800 transition-colors shadow-sm whitespace-nowrap"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function AdminLogin({ onExit, onDemoLogin }: { onExit: () => void; onDemoLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. You can also click Instant Demo Access below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-8 md:p-10 animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#67349a] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">
              The Style Room Admin
            </h1>
            <p className="text-xs text-charcoal-500 uppercase tracking-widest">
              Atelier Store Management
            </p>
          </div>

          {/* Instant 1-Click Demo Login */}
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-[#67349a]/20 text-center">
            <p className="text-xs font-semibold text-[#67349a] mb-2 uppercase tracking-wider">
              Preview Mode Available
            </p>
            <button
              type="button"
              onClick={onDemoLogin}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase text-white bg-[#67349a] hover:bg-[#54297f] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Instant Demo Access (Test All Features)</span>
            </button>
            <p className="text-[11px] text-charcoal-500 mt-2">
              Full CRUD access to add products, update orders, and test store settings without database credentials.
            </p>
          </div>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-cream-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-charcoal-400 font-semibold tracking-wider uppercase">
              Or Sign In With Supabase
            </span>
            <div className="flex-grow border-t border-cream-200"></div>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl p-3 animate-fade-in">
              <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#67349a] focus:ring-2 focus:ring-[#67349a]/20 transition-all"
                  placeholder="admin@thestyleroom.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#67349a] focus:ring-2 focus:ring-[#67349a]/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase text-white bg-charcoal-900 hover:bg-[#67349a] transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In to Atelier</>
              )}
            </button>
          </form>

          <button
            onClick={onExit}
            className="w-full mt-5 flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-charcoal-500 hover:text-charcoal-900 transition-colors"
          >
            <ArrowLeft size={14} /> Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
}
