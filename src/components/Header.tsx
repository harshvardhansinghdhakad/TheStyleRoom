"use client";
import { useState } from 'react';
import { Search, ShoppingBag, X, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart';

export type Category = 'home' | 'new' | 'dresses' | 'tops' | 'about' | 'journal' | 'contact';

type HeaderProps = {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

export default function Header({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks: { label: string; cat: Category }[] = [
    { label: 'Home', cat: 'home' },
    { label: 'Women', cat: 'dresses' },
    { label: 'Collections', cat: 'tops' },
    { label: 'New Arrivals', cat: 'new' },
    { label: 'About Us', cat: 'about' },
    { label: 'Journal', cat: 'journal' },
    { label: 'Contact Us', cat: 'contact' },
  ];

  const handleNav = (cat: Category) => {
    onCategoryChange(cat);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200/80 transition-all shadow-sm">
      {/* Main Header Container (Purple bar completely removed as requested) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          
          {/* Custom Designed Luxury Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group transition-transform active:scale-95 flex-shrink-0"
            aria-label="The Style Room Home"
          >
            {/* Elegant Monogram Atelier Emblem */}
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#2b1240] via-[#4e1c75] to-[#7b3fb0] p-[1.5px] shadow-md group-hover:shadow-purple-200 transition-all">
              <div className="w-full h-full rounded-full bg-[#1e0a2f] flex items-center justify-center border border-white/20">
                <span className="font-serif text-sm md:text-base font-bold tracking-widest text-[#e8c7ff] uppercase">
                  TSR
                </span>
              </div>
            </div>

            {/* Distinctive Logo Typography (whitespace-nowrap prevents any awkward two-line break) */}
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-serif text-xl sm:text-2xl md:text-[26px] font-extrabold tracking-[0.2em] text-[#1f0b33] uppercase leading-tight group-hover:text-[#67349a] transition-colors">
                The Style Room
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.42em] text-[#7a3db4] font-sans font-bold flex items-center gap-1.5 mt-0.5">
                <span>HAUTE ATELIER</span>
                <span className="w-1 h-1 rounded-full bg-[#7a3db4]" />
                <span>BOUTIQUE</span>
              </span>
            </div>
          </button>

          {/* Full Desktop Navigation Links (No 3 lines on desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((item) => {
              const isActive = activeCategory === item.cat;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.cat)}
                  className={`relative py-2 text-xs xl:text-[13px] font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#67349a]'
                      : 'text-charcoal-700 hover:text-[#67349a]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#67349a] rounded-full animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons: Compact Search Icon, Cart, Contact Us */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Small Compact Search Icon Button (No bulky input box) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2.5 rounded-full transition-all ${
                searchOpen || searchQuery
                  ? 'bg-purple-100 text-[#67349a]'
                  : 'text-charcoal-700 hover:text-[#67349a] hover:bg-cream-100'
              }`}
              aria-label="Toggle search"
              title="Search styles"
            >
              <Search size={20} />
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-charcoal-800 hover:text-[#67349a] rounded-full hover:bg-cream-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={21} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#67349a] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Contact Us CTA Button in Header */}
            <button
              onClick={() => handleNav('contact')}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-sm ${
                activeCategory === 'contact'
                  ? 'bg-[#67349a] text-white shadow-md'
                  : 'bg-[#67349a] hover:bg-[#54297f] text-white hover:shadow-md'
              }`}
            >
              <span>Contact Us</span>
              <ArrowRight size={13} />
            </button>

            {/* Mobile Menu Toggle (Only on mobile/tablet < 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal-800 hover:text-[#67349a] rounded-lg hover:bg-cream-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-charcoal-800 rounded-full" />
                  <span className="w-4 h-0.5 bg-charcoal-800 rounded-full" />
                  <span className="w-full h-0.5 bg-charcoal-800 rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Clean Floating Search Drawer (Toggles open when search icon is clicked) */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-cream-200 animate-slide-up">
            <div className="max-w-xl mx-auto relative flex items-center">
              <Search size={17} className="absolute left-4 text-[#67349a]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by keyword: silk, slip dress, resort shirt, poplin top..."
                className="w-full pl-11 pr-10 py-2.5 bg-cream-50 border border-cream-300 focus:border-[#67349a] focus:bg-white rounded-full text-xs sm:text-sm text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-[#67349a]/20 shadow-inner transition-all"
                autoFocus
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 text-charcoal-400 hover:text-charcoal-700"
                >
                  <X size={15} />
                </button>
              ) : (
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3.5 text-charcoal-400 hover:text-charcoal-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-center text-[11px] text-charcoal-500 mt-2">
                Press Enter or scroll down to view live matching catalog results
              </p>
            )}
          </div>
        )}
      </div>

      {/* Mobile Drawer (Only for mobile screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-white px-4 py-4 space-y-2 shadow-xl animate-fade-in">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.cat)}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors ${
                activeCategory === item.cat
                  ? 'bg-purple-50 text-[#67349a]'
                  : 'text-charcoal-800 hover:bg-cream-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-cream-200 flex justify-between items-center text-xs text-charcoal-500">
            <a href="#admin" className="text-[#67349a] font-medium flex items-center gap-1">
              Store Admin Portal
            </a>
            <button
              onClick={() => handleNav('contact')}
              className="text-xs font-semibold text-[#67349a]"
            >
              Concierge Contact →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
