"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Layers, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';

type MobileBottomNavProps = {
  onOpenSearch?: () => void;
};

export default function MobileBottomNav({ onOpenSearch }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  const navItems = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Shop', href: '/shop', icon: Layers, exact: false },
    { label: 'New', href: '/category/new', icon: Sparkles, exact: false },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-purple-100 shadow-[0_-4px_20px_rgba(36,17,53,0.06)] px-2 py-1.5 safe-area-pb"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#67349a] font-bold scale-105' : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              <Icon size={19} className={isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'} />
              <span className="text-[10px] tracking-wider mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-charcoal-500 hover:text-[#67349a] transition-all"
          aria-label="Search Catalog"
        >
          <Search size={19} className="stroke-[1.8]" />
          <span className="text-[10px] tracking-wider mt-0.5">Search</span>
        </button>

        {/* Bag Trigger */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-charcoal-500 hover:text-[#67349a] transition-all relative"
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag size={19} className="stroke-[1.8]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#67349a] text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5 shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider mt-0.5">Bag</span>
        </button>
      </div>
    </nav>
  );
}
