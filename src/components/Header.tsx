"use client";
import { useState } from 'react';
import { Search, ShoppingBag, X, Shield, ArrowRight, Phone, Mail } from 'lucide-react';
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
      {/* Top Announcement Bar */}
      <div className="bg-[#241135] text-[#e8d8f5] text-[11px] font-medium py-1.5 px-4 tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4 text-xs font-normal">
            <span className="flex items-center gap-1.5 text-cream-200">
              <Phone size={12} className="text-purple-300" /> +91 75818 57811
            </span>
            <span className="text-purple-300/40">|</span>
            <span className="flex items-center gap-1.5 text-cream-200">
              <Mail size={12} className="text-purple-300" /> support@thestyleroom.com
            </span>
          </div>
          <div className="mx-auto sm:mx-0 font-medium tracking-widest text-[10px] sm:text-[11px]">
            ✨ COMPLIMENTARY EXPRESS SHIPPING ACROSS INDIA OVER ₹2,999 ✨
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#admin"
              className="text-[#d8b5f8] hover:text-white flex items-center gap-1 transition-colors text-[11px] font-medium"
              title="Admin Portal"
            >
              <Shield size={12} /> Admin Portal
            </a>
          </div>
        </div>
      </div>

      {/* Main Desktop Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex flex-col text-left group transition-transform active:scale-95"
            aria-label="The Style Room Home"
          >
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-[0.16em] text-[#241135] uppercase group-hover:text-[#67349a] transition-colors leading-none">
              The Style Room
            </span>
            <span className="text-[9px] uppercase tracking-[0.38em] text-[#8e50bc] font-sans font-semibold mt-1">
              Luxury Atelier • India
            </span>
          </button>

          {/* Desktop Navigation Links — FULL HEADER (NO THREE LINES ON DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => {
              const isActive = activeCategory === item.cat;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.cat)}
                  className={`relative py-2 text-[13px] font-semibold tracking-wider uppercase transition-colors ${
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

          {/* Actions: Search, Cart, Contact CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input on Desktop */}
            <div className="relative hidden md:flex items-center">
              <Search
                size={16}
                className="absolute left-3.5 text-charcoal-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search styles, silks, tops..."
                className="w-48 lg:w-56 pl-9 pr-7 py-2 bg-cream-100/80 hover:bg-cream-100 focus:bg-white border border-cream-200 focus:border-[#7b3fb0] rounded-full text-xs text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-[#7b3fb0]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-charcoal-400 hover:text-charcoal-700"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-charcoal-700 hover:text-[#67349a] rounded-full hover:bg-cream-100"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>

            {/* Shopping Cart Button */}
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
                  ? 'bg-[#67349a] text-white'
                  : 'bg-[#67349a] hover:bg-[#54297f] text-white hover:shadow-md'
              }`}
            >
              <span>Contact Us</span>
              <ArrowRight size={13} />
            </button>

            {/* Mobile Menu Toggle (Only on small screens < 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal-800 hover:text-[#67349a] rounded-lg hover:bg-cream-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : (
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-charcoal-800 rounded-full" />
                  <span className="w-4 h-0.5 bg-charcoal-800 rounded-full" />
                  <span className="w-full h-0.5 bg-charcoal-800 rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {searchOpen && (
          <div className="md:hidden pb-3 px-1 animate-fade-in">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-charcoal-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search modern dresses, tops, silk..."
                className="w-full pl-9 pr-8 py-2 bg-cream-100 border border-cream-200 rounded-full text-xs focus:outline-none focus:border-[#67349a]"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-charcoal-400"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-white px-4 py-4 space-y-2 shadow-xl animate-fade-in">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.cat)}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors ${
                activeCategory === item.cat
                  ? 'bg-rose-50 text-[#67349a]'
                  : 'text-charcoal-800 hover:bg-cream-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-cream-200 flex justify-between items-center text-xs text-charcoal-500">
            <a href="#admin" className="text-[#67349a] font-medium flex items-center gap-1">
              <Shield size={14} /> Store Admin Panel
            </a>
            <a href="tel:+917581857811" className="text-charcoal-600">
              +91 75818 57811
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
