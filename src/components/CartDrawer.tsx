"use client";
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/supabase';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] animate-fade-in">
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={closeCart} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-cream-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-charcoal-700" />
            <h2 className="font-serif text-xl font-semibold text-charcoal-900">
              Shopping Cart {totalItems > 0 && `(${totalItems})`}
            </h2>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-cream-100 rounded-full transition-colors" aria-label="Close cart">
            <X size={20} className="text-charcoal-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-cream-300 mb-4" />
              <p className="font-serif text-xl text-charcoal-700 mb-2">Your cart is empty</p>
              <p className="text-sm text-charcoal-400">Start shopping to add items to your cart.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 bg-white rounded-2xl p-3 shadow-sm">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl bg-cream-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-medium text-charcoal-800 truncate">{item.product.name}</h3>
                    <p className="text-xs text-charcoal-400 mb-2">Size: {item.size}</p>
                    <p className="text-sm font-semibold text-rose-600 mb-2">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-cream-200 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-1.5 hover:bg-cream-100 rounded-full transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} className="text-charcoal-600" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-1.5 hover:bg-cream-100 rounded-full transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} className="text-charcoal-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-xs text-charcoal-400 hover:text-rose-500 transition-colors"
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
          <div className="border-t border-cream-200 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-charcoal-600">Subtotal</span>
              <span className="font-serif text-2xl font-semibold text-charcoal-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-charcoal-400">Shipping and taxes calculated at checkout.</p>
            <button className="w-full py-4 bg-charcoal-900 text-white font-semibold text-sm tracking-wide uppercase rounded-full hover:bg-rose-500 transition-all shadow-lg">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
