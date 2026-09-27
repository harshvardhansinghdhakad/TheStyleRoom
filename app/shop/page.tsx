"use client";
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';
import { Sparkles, SlidersHorizontal, Search, X } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubfilter, setSelectedSubfilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  const allProducts = getAllProducts();

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by main category
    if (selectedCategory === 'dresses') {
      result = result.filter((p) => p.category === 'dresses');
    } else if (selectedCategory === 'tops') {
      result = result.filter((p) => p.category === 'tops');
    } else if (selectedCategory === 'new') {
      result = result.filter((p) => p.is_new);
    }

    // Filter by subfilter
    if (selectedSubfilter === 'silk') {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes('silk') ||
          p.name.toLowerCase().includes('satin') ||
          (p.description && p.description.toLowerCase().includes('silk'))
      );
    } else if (selectedSubfilter === 'cotton') {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes('cotton') ||
          p.name.toLowerCase().includes('linen') ||
          p.name.toLowerCase().includes('poplin') ||
          (p.description && (p.description.toLowerCase().includes('cotton') || p.description.toLowerCase().includes('linen')))
      );
    } else if (selectedSubfilter === 'evening') {
      result = result.filter((p) => p.price >= 3000);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    }

    return result;
  }, [allProducts, selectedCategory, selectedSubfilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubfilter('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-8 md:py-14 animate-fade-in">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Category Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#67349a] bg-purple-50 px-4 py-1.5 rounded-full mb-3">
            <Sparkles size={13} />
            ATELIER CATALOGUE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight mb-3">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Curated Collections'}
          </h1>
          <p className="text-charcoal-500 text-xs sm:text-sm md:text-base leading-relaxed">
            Discover handcrafted mulberry silks, lightweight resort layers, and intentional silhouettes designed in our Indore studio.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-cream-200/90 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Pieces' },
                { id: 'dresses', label: "Women's Couture" },
                { id: 'tops', label: 'Capsules & Tops' },
                { id: 'new', label: 'New Arrivals' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    setSelectedSubfilter('all');
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-[#241135] text-white shadow-md'
                      : 'bg-cream-100/70 text-charcoal-700 hover:bg-cream-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort & Search in Filter row */}
            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 md:w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter garments..."
                  className="w-full pl-9 pr-7 py-2 bg-cream-50 border border-cream-200 rounded-full text-xs text-charcoal-800 focus:outline-none focus:border-[#67349a]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  aria-label="Sort garments by"
                  className="bg-cream-50 border border-cream-200 text-charcoal-700 text-xs font-semibold rounded-full px-3.5 py-2 pr-8 focus:outline-none focus:border-[#67349a] appearance-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <SlidersHorizontal size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Subfilter Pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-cream-200/60 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider mr-1">
              Fabric & Occasion:
            </span>
            {[
              { id: 'all', label: 'All Styles' },
              { id: 'silk', label: 'Mulberry Silk & Satin' },
              { id: 'cotton', label: 'Cotton & Linen' },
              { id: 'evening', label: 'Evening Couture' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubfilter(sub.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  selectedSubfilter === sub.id
                    ? 'bg-[#67349a] text-white'
                    : 'bg-white text-charcoal-600 border border-cream-200 hover:bg-cream-100'
                }`}
              >
                {sub.label}
              </button>
            ))}

            {(selectedCategory !== 'all' || selectedSubfilter !== 'all' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="ml-auto text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <X size={12} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-6 text-xs text-charcoal-500 px-1 font-medium">
          <span>Showing {filteredProducts.length} handcrafted pieces</span>
          <span>Complimentary delivery on orders above ₹2,999</span>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-cream-200 max-w-lg mx-auto p-8 shadow-sm">
            <p className="font-serif text-2xl text-charcoal-800 mb-2">No garments found</p>
            <p className="text-xs text-charcoal-500 mb-6">
              Try adjusting your search query or selected fabric filter to explore more pieces.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#67349a] text-white text-xs font-semibold tracking-wider uppercase rounded-full shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#67349a]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
