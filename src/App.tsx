"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, sampleProducts, type Product } from '@/lib/supabase';
import { CartProvider } from '@/lib/cart';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import FashionShowcase from '@/components/FashionShowcase';

import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';

type Category = 'home' | 'new' | 'dresses' | 'tops';

const categoryTitles: Record<Category, string> = {
  home: '',
  new: 'New Arrivals',
  dresses: 'One Piece',
  tops: 'Shirts & Tops',
};

const categorySubtitles: Record<Category, string> = {
  home: '',
  new: 'Fresh styles just landed — discover the latest additions to our collection.',
  dresses: 'From flowing maxis to sleek slips, find the perfect one-piece for every occasion.',
  tops: 'Elevated shirts and tops to complete your look.',
};

const categoryMeta: Record<Category, { title: string; description: string }> = {
  home: {
    title: "The Style Room — Women's Fashion Boutique | One Piece, Shirts & Tops",
    description: "Shop the latest women's fashion at The Style Room. Discover curated one-piece dresses, stylish shirts, elegant tops, and new arrivals. Free shipping on orders over ₹5,000.",
  },
  new: {
    title: "New Arrivals — Latest Women's Fashion | The Style Room",
    description: "Shop the newest women's fashion arrivals at The Style Room. Fresh one-piece dresses, shirts, and tops just landed. Stay ahead of the trend with our latest collection.",
  },
  dresses: {
    title: "One Piece Dresses — Women's Fashion | The Style Room",
    description: "Shop one-piece dresses at The Style Room. From flowing maxis to sleek slips, find the perfect one-piece for every occasion. Quality pieces for the modern woman.",
  },
  tops: {
    title: "Shirts & Tops — Women's Fashion | The Style Room",
    description: "Shop elevated shirts and tops at The Style Room. Complete your look with our curated collection of stylish shirts, blouses, and tops for the modern woman.",
  },
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  // Read the hash only after hydration; `window` is unavailable during Next.js prerendering.
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHashChange = () => setIsAdmin(window.location.hash === '#admin');
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const exitAdmin = () => {
    if (typeof window !== 'undefined') {
      window.location.hash = '';
    }
    setIsAdmin(false);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // If Supabase is not configured yet (e.g. at build time or before adding env vars)
    if (!isSupabaseConfigured) {
      let filtered = [...sampleProducts];
      if (activeCategory === 'new') {
        filtered = filtered.filter((p) => p.is_new);
      } else if (activeCategory !== 'home') {
        filtered = filtered.filter((p) => p.category === activeCategory);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
        );
      }
      setProducts(filtered);
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from('products').select('*');
      if (activeCategory === 'new') {
        query = query.eq('is_new', true);
      } else if (activeCategory !== 'home') {
        query = query.eq('category', activeCategory);
      }
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`);
      }
      const { data, error: fetchError } = await query.order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setProducts(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (isAdmin) return;
    fetchProducts();
  }, [fetchProducts, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const meta = searchQuery
      ? { title: `Search: ${searchQuery} | The Style Room`, description: `Search results for "${searchQuery}" at The Style Room — women's fashion boutique.` }
      : categoryMeta[activeCategory];
    document.title = meta.title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', meta.description);
  }, [activeCategory, searchQuery, isAdmin]);

  if (isAdmin) {
    return <AdminPanel onExit={exitAdmin} />;
  }

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    if (cat === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const showHero = activeCategory === 'home' && !searchQuery;

  return (
    <CartProvider>
      <div className="min-h-screen fashion-page">
        <Header
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {showHero && (
          <Hero
            onShopNow={() => handleCategoryChange('dresses')}
            onNewArrivals={() => handleCategoryChange('new')}
          />
        )}

        {/* Products section */}
        <section
          id="products"
          className={`px-4 sm:px-6 lg:px-8 ${showHero ? 'py-16 md:py-24' : 'pt-24 md:pt-28 pb-16 md:pb-24'}`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            {(activeCategory !== 'home' || searchQuery) && (
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-900 mb-3">
                  {searchQuery ? `Search Results` : categoryTitles[activeCategory]}
                </h2>
                {!searchQuery && (
                  <p className="text-charcoal-500 max-w-xl mx-auto">{categorySubtitles[activeCategory]}</p>
                )}
                {searchQuery && (
                  <p className="text-charcoal-500">
                    {products.length} {products.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                  </p>
                )}
              </div>
            )}

            {/* Home: New Arrivals preview */}
            {activeCategory === 'home' && !searchQuery && (
              <div className="mb-16">
                <div className="text-center mb-10">
                  <p className="text-rose-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Just In</p>
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-900 mb-3">New Arrivals</h2>
                  <p className="text-charcoal-500 max-w-xl mx-auto">Discover the latest pieces in our collection.</p>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] rounded-2xl bg-cream-200 mb-4" />
                    <div className="h-4 bg-cream-200 rounded mb-2" />
                    <div className="h-4 bg-cream-200 rounded w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-20">
                <p className="text-rose-600 mb-2">Something went wrong loading the products.</p>
                <p className="text-sm text-charcoal-400">{error}</p>
              </div>
            )}

            {/* Products grid */}
            {!loading && !error && (
              <>
                {products.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-serif text-2xl text-charcoal-700 mb-2">No products found</p>
                    <p className="text-charcoal-400">Try a different search or browse a category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Home-only sections */}
        {activeCategory === 'home' && !searchQuery && (
          <FashionShowcase onCategory={(cat) => handleCategoryChange(cat)} />
        )}

        <Footer
          onCategoryChange={(cat) => handleCategoryChange(cat as Category)}
        />

        <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;
