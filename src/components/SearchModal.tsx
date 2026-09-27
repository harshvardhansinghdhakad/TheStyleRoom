"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { searchProducts } from '@/lib/products';
import { formatPrice, type Product } from '@/lib/supabase';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const POPULAR_SEARCHES = ['Mulberry Silk', 'Slip Dress', 'Linen Resort', 'Satin Blouse', 'Cocktail Gown', 'Poplin Top'];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = searchProducts(query);
    setResults(filtered.slice(0, 6));
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectKeyword = (term: string) => {
    setQuery(term);
    const filtered = searchProducts(term);
    setResults(filtered.slice(0, 6));
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-start animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#160a22]/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-4 sm:mt-16 px-3 sm:px-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden">
          {/* Search Header Form */}
          <form onSubmit={handleSearchSubmit} className="p-4 sm:p-6 border-b border-cream-200">
            <div className="relative flex items-center">
              <Search size={22} className="absolute left-4 text-[#67349a]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mulberry silk, slips, tops, couture dresses..."
                className="w-full pl-12 pr-12 py-3.5 bg-cream-50/80 focus:bg-white border border-cream-200 focus:border-[#67349a] rounded-2xl text-sm sm:text-base text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-4 focus:ring-[#67349a]/10 transition-all"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3.5 p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            {/* Popular Keywords Pill tags */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-3.5 flex-wrap">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-charcoal-400 mr-1 flex items-center gap-1">
                <Sparkles size={11} className="text-[#67349a]" /> Trending:
              </span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSelectKeyword(term)}
                  className="px-3 py-1 rounded-full text-xs bg-cream-100/80 hover:bg-[#67349a] hover:text-white text-charcoal-700 font-medium transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
            {query.trim() && results.length === 0 && (
              <div className="text-center py-10">
                <p className="font-serif text-lg text-charcoal-800 mb-1">No matching garments found</p>
                <p className="text-xs text-charcoal-500 mb-4">Try searching for &quot;silk&quot;, &quot;dress&quot;, or &quot;shirt&quot;.</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push('/shop');
                  }}
                  className="px-5 py-2 bg-[#67349a] text-white text-xs font-semibold rounded-full uppercase tracking-wider"
                >
                  Browse Full Collection
                </button>
              </div>
            )}

            {results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-charcoal-500 font-medium">
                  <span>Found {results.length} styles</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
                    }}
                    className="text-[#67349a] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    View All Results <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3.5 p-2.5 rounded-2xl border border-cream-200/80 hover:border-[#67349a]/40 hover:bg-cream-50/50 transition-all group"
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-20 object-cover rounded-xl bg-cream-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold tracking-widest uppercase text-[#7a3db4]">
                          {product.category === 'dresses' ? 'Dresses' : 'Capsules'}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-charcoal-900 group-hover:text-[#67349a] transition-colors truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs font-bold text-[#67349a] mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
