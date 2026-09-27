"use client";
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/supabase';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] animate-fade-in">
      <div className="absolute inset-0 bg-[#140822]/60 backdrop-blur-sm" onClick={closeCart} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#67349a]" />
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              Shopping Bag {totalItems > 0 && `(${totalItems})`}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={20} className="text-charcoal-600" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-2.5 bg-purple-50 border-b border-purple-100 text-xs text-[#522580] flex items-center justify-between">
          {subtotal >= 2999 ? (
            <span className="font-semibold text-emerald-700">✓ You have unlocked FREE Express Delivery!</span>
          ) : (
            <span>
              Add <b>{formatPrice(2999 - subtotal)}</b> more for <b>FREE Express Delivery</b>
            </span>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-cream-300 mb-4" />
              <p className="font-serif text-xl text-charcoal-700 mb-2">Your shopping bag is empty</p>
              <p className="text-xs text-charcoal-400 mb-6">Explore our curated silks and capsules to add items.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="px-6 py-2.5 bg-[#67349a] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-md"
              >
                Shop All Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 bg-cream-50/60 rounded-2xl p-3 border border-cream-200/80 shadow-sm"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl bg-cream-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm font-bold text-charcoal-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-charcoal-500 mb-1">Size: <span className="font-semibold">{item.size}</span></p>
                    <p className="text-xs font-bold text-[#67349a] mb-2">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-cream-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-cream-100 text-charcoal-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-cream-100 text-charcoal-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-[11px] text-charcoal-400 hover:text-rose-600 transition-colors font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 px-6 py-5 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-600 font-medium">Subtotal</span>
              <span className="font-serif text-2xl font-bold text-charcoal-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] text-charcoal-400">
              Shipping & taxes calculated at checkout. Express delivery across India.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-3 bg-purple-50 text-[#67349a] font-bold text-xs tracking-wider uppercase rounded-full hover:bg-purple-100 transition-all text-center flex items-center justify-center border border-purple-200"
              >
                View Full Bag
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-3 bg-[#241135] text-white font-bold text-xs tracking-wider uppercase rounded-full hover:bg-[#67349a] transition-all text-center flex items-center justify-center gap-1 shadow-md"
              >
                Checkout <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
