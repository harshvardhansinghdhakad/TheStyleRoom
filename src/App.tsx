"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, sampleProducts, type Product } from '@/lib/supabase';
import { CartProvider } from '@/lib/cart';
import Header, { type Category } from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import FashionShowcase from '@/components/FashionShowcase';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Journal from '@/components/Journal';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

const categoryTitles: Record<Category, string> = {
  home: 'Curated Collection',
  new: 'New Arrivals Drop',
  dresses: "Women's Collection",
  tops: 'Curated Capsules',
  about: 'Our Heritage & Atelier',
  journal: 'The Style Journal',
  contact: 'Client Concierge',
};

const categorySubtitles: Record<Category, string> = {
  home: 'Discover handcrafted silhouettes, pure mulberry silks, and effortless contemporary tailoring.',
  new: 'Fresh runway-inspired pieces just unveiled in our atelier — stay ahead with our newest drops.',
  dresses: 'From bias-cut mulberry silk slips to structured evening silhouettes crafted for every moment.',
  tops: 'Elevated resort wear, luxury cotton poplin blouses, and minimalist tailored layers.',
  about: '15+ years of curating timeless modern elegance from our Indore atelier.',
  journal: 'Style notes, trend forecasts, and garment care insights from our resident stylists.',
  contact: 'Connect with our personal shopping stylists and client care concierge.',
};

const categoryMeta: Record<Category, { title: string; description: string }> = {
  home: {
    title: "The Style Room — Modern Luxury Fashion & Atelier",
    description: "Shop curated luxury fashion at The Style Room. Handcrafted mulberry silks, tailored silhouettes, and timeless essentials. Free express shipping on orders over ₹2,999.",
  },
  new: {
    title: "New Arrivals Drop — Latest Fashion | The Style Room",
    description: "Explore the newest seasonal arrivals at The Style Room. Fresh couture pieces just landed.",
  },
  dresses: {
    title: "Women's Fashion Collection | The Style Room",
    description: "Explore women's luxury fashion at The Style Room. Silk slip dresses, evening gowns, and everyday elegance.",
  },
  tops: {
    title: "Curated Collections & Capsules | The Style Room",
    description: "Browse curated wardrobe capsules at The Style Room. Effortless shirts, blouses, and tailoring.",
  },
  about: {
    title: "About Our Atelier & Story | The Style Room",
    description: "Learn about the heritage of The Style Room, our Indore atelier, and commitment to sustainable luxury.",
  },
  journal: {
    title: "The Style Journal — Editorial & Insights | The Style Room",
    description: "Read the latest fashion insights, runway trend analyses, and garment care guides on The Style Room Journal.",
  },
  contact: {
    title: "Contact Client Concierge | The Style Room",
    description: "Get in touch with The Style Room concierge in Indore for orders, sizing assistance, and appointments.",
  },
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSubfilter, setSelectedSubfilter] = useState<string>('all');

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
    fetchProducts();
  };

  const getBaseProducts = (): Product[] => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('thestyleroom_products');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return sampleProducts;
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // If Supabase is not configured yet
    if (!isSupabaseConfigured) {
      let filtered = [...getBaseProducts()];
      if (activeCategory === 'new') {
        filtered = filtered.filter((p) => p.is_new);
      } else if (activeCategory === 'dresses' || activeCategory === 'tops') {
        filtered = filtered.filter((p) => p.category === activeCategory);
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
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
      } else if (activeCategory === 'dresses' || activeCategory === 'tops') {
        query = query.eq('category', activeCategory);
      }
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`);
      }
      const { data, error: fetchError } = await query.order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setProducts(data && data.length > 0 ? data : getBaseProducts());
    } catch {
      // Graceful local fallback
      setProducts(getBaseProducts());
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
      ? {
          title: `Search: "${searchQuery}" | The Style Room`,
          description: `Search results for "${searchQuery}" at The Style Room luxury boutique.`,
        }
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
    setSelectedSubfilter('all');
    if (cat === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const showHero = activeCategory === 'home' && !searchQuery;

  // Filter products by subcategory if applicable
  const displayProducts = products.filter((p) => {
    if (selectedSubfilter === 'all') return true;
    if (selectedSubfilter === 'silk') return p.name.toLowerCase().includes('silk') || p.name.toLowerCase().includes('satin');
    if (selectedSubfilter === 'casual') return p.name.toLowerCase().includes('cotton') || p.name.toLowerCase().includes('linen');
    if (selectedSubfilter === 'evening') return p.price > 3000;
    return true;
  });

  return (
    <CartProvider>
      <div className="min-h-screen fashion-page bg-[#f7f5fb]">
        {/* Full Desktop & Mobile Header (No three lines on desktop) */}
        <Header
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Hero Section (Main Poster) with rich researched fashion copy */}
        {showHero && (
          <Hero
            onShopNow={() => handleCategoryChange('dresses')}
            onNewArrivals={() => handleCategoryChange('new')}
          />
        )}

        {/* Dedicated About Page */}
        {activeCategory === 'about' && !searchQuery && (
          <About onShopNow={() => handleCategoryChange('dresses')} />
        )}

        {/* Dedicated Journal Page */}
        {activeCategory === 'journal' && !searchQuery && (
          <Journal onShopNow={() => handleCategoryChange('dresses')} />
        )}

        {/* Dedicated Contact Page */}
        {activeCategory === 'contact' && !searchQuery && (
          <Contact />
        )}

        {/* Product Catalog Section (For Home, New Arrivals, Women, Collections, and Search) */}
        {(activeCategory === 'home' ||
          activeCategory === 'new' ||
          activeCategory === 'dresses' ||
          activeCategory === 'tops' ||
          searchQuery) && (
          <section
            id="products"
            className={`px-4 sm:px-6 lg:px-8 ${showHero ? 'py-12 md:py-20' : 'pt-10 md:pt-14 pb-16 md:pb-24'}`}
          >
            <div className="max-w-7xl mx-auto">
              {/* Category Page Title Banner */}
              <div className="text-center mb-10 animate-fade-in">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#67349a] bg-rose-50 px-4 py-1.5 rounded-full mb-3">
                  <Sparkles size={13} />
                  {searchQuery ? 'Store Catalog Search' : categoryTitles[activeCategory]}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 mb-3 tracking-tight">
                  {searchQuery ? `Results for "${searchQuery}"` : categoryTitles[activeCategory]}
                </h2>
                <p className="text-charcoal-500 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
                  {searchQuery
                    ? `Found ${products.length} matching handcrafted garment${products.length === 1 ? '' : 's'}.`
                    : categorySubtitles[activeCategory]}
                </p>

                {/* Subcategory Filter Pills for Women / Collections */}
                {(activeCategory === 'dresses' || activeCategory === 'tops' || activeCategory === 'new') && !searchQuery && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setSelectedSubfilter('all')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                        selectedSubfilter === 'all'
                          ? 'bg-[#241135] text-white shadow-sm'
                          : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      All Pieces
                    </button>
                    <button
                      onClick={() => setSelectedSubfilter('silk')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                        selectedSubfilter === 'silk'
                          ? 'bg-[#67349a] text-white shadow-sm'
                          : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      Silk & Satin Edit
                    </button>
                    <button
                      onClick={() => setSelectedSubfilter('casual')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                        selectedSubfilter === 'casual'
                          ? 'bg-[#67349a] text-white shadow-sm'
                          : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      Cotton & Linen
                    </button>
                    <button
                      onClick={() => setSelectedSubfilter('evening')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                        selectedSubfilter === 'evening'
                          ? 'bg-[#67349a] text-white shadow-sm'
                          : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      Evening Couture
                    </button>
                  </div>
                )}
              </div>

              {/* Loading State */}
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

              {/* Error State */}
              {error && (
                <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 max-w-lg mx-auto p-8 shadow-sm">
                  <p className="text-rose-600 font-semibold mb-2">Unable to connect to live database.</p>
                  <p className="text-xs text-charcoal-500 mb-4">{error}</p>
                  <button
                    onClick={() => fetchProducts()}
                    className="px-5 py-2 bg-[#67349a] text-white text-xs font-semibold rounded-full"
                  >
                    Retry Loading
                  </button>
                </div>
              )}

              {/* Product Cards Grid — EXACT CARD DESIGN PRESERVED */}
              {!loading && !error && (
                <>
                  {displayProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-cream-200 max-w-xl mx-auto p-10 shadow-sm">
                      <p className="font-serif text-2xl text-charcoal-800 mb-2">No garments found in this view</p>
                      <p className="text-xs text-charcoal-500 mb-6">
                        Try adjusting your search keywords or explore another capsule collection.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedSubfilter('all');
                          setSearchQuery('');
                          handleCategoryChange('dresses');
                        }}
                        className="px-6 py-2.5 bg-[#67349a] text-white text-xs font-semibold tracking-wider uppercase rounded-full shadow-md"
                      >
                        Browse All Women's Fashion
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
                      {displayProducts.map((product) => (
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
        )}

        {/* Home-only Fashion Showcases & Categories */}
        {activeCategory === 'home' && !searchQuery && (
          <FashionShowcase onCategory={(cat) => handleCategoryChange(cat)} />
        )}

        {/* Global Footer with The Style Room branding & links */}
        <Footer onCategoryChange={(cat) => handleCategoryChange(cat)} />

        {/* Modals & Overlays */}
        <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;
