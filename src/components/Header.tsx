"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, X, ArrowRight, Shield, Sparkles, User as UserIcon, Image as ImageIcon } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import SearchModal from '@/components/SearchModal';
import AuthModal from '@/components/AuthModal';
import AccountDrawer from '@/components/AccountDrawer';

export default function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { user, openAuthModal, openAccountDrawer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    { label: 'Women', href: '/category/dresses' },
    { label: 'Collections', href: '/category/tops' },
    { label: 'New Arrivals', href: '/category/new' },
    { label: 'About Us', href: '/about' },
    { label: 'Journal', href: '/journal' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-[0_2px_15px_rgba(36,17,53,0.03)] transition-all w-full">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-[#1f0a2f] via-[#431464] to-[#1f0a2f] text-white py-1.5 px-3 text-center text-[10px] sm:text-[11px] font-medium tracking-widest uppercase flex items-center justify-center gap-2">
          <Sparkles size={11} className="text-[#e2b9ff]" />
          <span>Complimentary Express Shipping Across India on Orders Over ₹2,999</span>
          <Sparkles size={11} className="text-[#e2b9ff]" />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6 w-full">
            
            {/* Custom Designed Luxury Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 text-left group transition-transform active:scale-95 shrink-0"
              aria-label="The Style Room — Luxury Fashion Boutique"
            >
              {/* Monogram Atelier Emblem */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#2b1240] via-[#4e1c75] to-[#7b3fb0] p-[1.5px] shadow-sm group-hover:shadow-purple-200 transition-all shrink-0">
                <div className="w-full h-full rounded-full bg-[#1e0a2f] flex items-center justify-center border border-white/20">
                  <span className="font-serif text-xs sm:text-sm md:text-base font-bold tracking-widest text-[#e8c7ff] uppercase">
                    TSR
                  </span>
                </div>
              </div>

              {/* Logo Typography */}
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-serif text-lg sm:text-xl lg:text-[23px] font-extrabold tracking-[0.16em] text-[#1f0b33] uppercase leading-tight group-hover:text-[#67349a] transition-colors">
                  The Style Room
                </span>
                <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.38em] text-[#7a3db4] font-sans font-bold flex items-center gap-1 mt-0.5">
                  <span>HAUTE ATELIER</span>
                  <span className="w-1 h-1 rounded-full bg-[#7a3db4]" />
                  <span>INDORE</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-7 shrink-0">
              {navLinks.map((item) => {
                const active = isLinkActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative py-2 text-xs xl:text-[13px] font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${
                      active
                        ? 'text-[#67349a]'
                        : 'text-charcoal-700 hover:text-[#67349a]'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#67349a] rounded-full animate-fade-in" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-full text-charcoal-700 hover:text-[#67349a] hover:bg-purple-50 transition-all"
                aria-label="Open search dialog"
                title="Search garments"
              >
                <Search size={19} />
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={openCart}
                className="relative p-2 sm:p-2.5 text-charcoal-800 hover:text-[#67349a] rounded-full hover:bg-purple-50 transition-colors"
                aria-label="Shopping Cart"
                title="View cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#67349a] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Account / Login Button */}
              {user ? (
                <button
                  onClick={openAccountDrawer}
                  className="flex items-center gap-1.5 py-1 px-2.5 sm:px-3 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#522580] transition-all text-xs font-semibold"
                  title="My Atelier Account & Saved Addresses"
                  aria-label="User Account"
                >
                  <div className="w-5 h-5 rounded-full bg-[#67349a] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-charcoal-700 hover:text-[#67349a] hover:bg-purple-50 transition-all text-xs font-semibold border border-cream-200"
                  title="Sign In / Register"
                  aria-label="Sign In"
                >
                  <UserIcon size={16} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Gallery Link */}
              <Link
                href="/gallery"
                className="p-2 sm:p-2.5 rounded-full text-charcoal-700 hover:text-[#67349a] hover:bg-purple-50 transition-all"
                aria-label="View Gallery"
                title="View Gallery"
              >
                <ImageIcon size={19} />
              </Link>

              {/* Contact Us Link */}
              <Link
                href="/contact"
                className={`hidden sm:inline-flex relative py-2 text-[11px] xl:text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${
                  pathname === '/contact'
                    ? 'text-[#67349a]'
                    : 'text-charcoal-700 hover:text-[#67349a]'
                }`}
              >
                Contact
                {pathname === '/contact' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#67349a] rounded-full animate-fade-in" />
                )}
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-charcoal-800 hover:text-[#67349a] rounded-lg hover:bg-purple-50"
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
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-100 bg-white px-4 py-5 space-y-1 shadow-xl animate-fade-in max-h-[80vh] overflow-y-auto">
            {navLinks.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-colors ${
                    active
                      ? 'bg-purple-50 text-[#67349a]'
                      : 'text-charcoal-800 hover:bg-cream-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-cream-200 mt-3 space-y-2">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAccountDrawer();
                  }}
                  className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-purple-50 text-[#67349a] text-xs font-bold uppercase tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <UserIcon size={14} />
                    <span>My Account ({user.name.split(' ')[0]})</span>
                  </span>
                  <span className="text-[10px] text-purple-700 bg-white px-2 py-0.5 rounded-md">
                    {user.addresses.length} Addresses
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-purple-50 text-[#67349a] text-xs font-bold uppercase tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <UserIcon size={14} />
                    <span>Sign In / Create Account</span>
                  </span>
                  <ArrowRight size={14} />
                </button>
              )}

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between w-full py-2 px-4 rounded-xl text-charcoal-700 hover:bg-cream-100 text-xs font-semibold uppercase tracking-wider"
              >
                <span>Client Concierge Support</span>
                <ArrowRight size={13} />
              </Link>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-4 text-xs text-charcoal-500 hover:text-[#67349a] font-medium"
              >
                <Shield size={14} />
                <span>Store Admin Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Global Interactive Auth Modal */}
      <AuthModal />

      {/* Global User Account & Saved Addresses Drawer */}
      <AccountDrawer />
    </>
  );
}
