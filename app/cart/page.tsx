"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/supabase';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  MessageCircle,
  Tag,
  Check,
} from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingCost = subtotal >= 2999 || subtotal === 0 ? 0 : 199;
  const finalTotal = Math.max(0, subtotal - discount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'STYLE10' || promoCode.trim().toUpperCase() === 'FIRST500') {
      const disc = promoCode.trim().toUpperCase() === 'FIRST500' ? 500 : Math.round(subtotal * 0.1);
      setDiscount(disc);
      setAppliedCode(promoCode.trim().toUpperCase());
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try code "STYLE10" for 10% off.');
    }
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const phone = '917581857811';
    let msg = `*NEW ORDER INQUIRY — THE STYLE ROOM*\n\n`;
    if (customerName) msg += `• *Customer:* ${customerName}\n`;
    if (customerPhone) msg += `• *Phone:* ${customerPhone}\n`;
    if (customerAddress) msg += `• *Address:* ${customerAddress}\n\n`;

    msg += `*Order Items:*\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.name} (Size: ${item.size}) x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}\n`;
    });

    msg += `\n• *Subtotal:* ${formatPrice(subtotal)}`;
    if (discount > 0) msg += `\n• *Discount (${appliedCode}):* -${formatPrice(discount)}`;
    msg += `\n• *Shipping:* ${shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}`;
    msg += `\n• *Grand Total:* ${formatPrice(finalTotal)}\n\n`;
    msg += `Please confirm my order and share bank transfer/UPI payment details. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setOrderPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (orderPlaced) {
    return (
      <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 animate-fade-in flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center border border-cream-200 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-2">Order Confirmed!</h1>
          <p className="text-charcoal-600 text-sm leading-relaxed mb-6">
            Thank you for shopping with The Style Room Atelier. Your booking has been received. Our concierge will contact you via WhatsApp/SMS with tracking updates.
          </p>
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 mb-6 text-xs text-[#522580] space-y-1">
            <p>Order Reference: <b>TSR-{Math.floor(100000 + Math.random() * 900000)}</b></p>
            <p>Atelier Location: Indore, Madhya Pradesh</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center w-full py-3.5 bg-[#241135] hover:bg-[#67349a] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-8 md:py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-cream-200 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Your Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
              {totalItems} item{totalItems === 1 ? '' : 's'} selected for purchase
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-charcoal-400 hover:text-rose-600 transition-colors"
            >
              Empty Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-cream-200 max-w-lg mx-auto p-8 shadow-sm">
            <ShoppingBag size={56} className="text-purple-200 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mb-6 max-w-sm mx-auto">
              Explore our handcrafted mulberry silks, bias-cut slips, and tailored resort shirts.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#241135] hover:bg-[#67349a] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Items List (8 Columns) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Express Shipping Meter */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs text-[#522580]">
                {subtotal >= 2999 ? (
                  <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                    <Check size={16} /> You have unlocked FREE Express Delivery across India!
                  </span>
                ) : (
                  <span>
                    Add <b>{formatPrice(2999 - subtotal)}</b> more to qualify for <b>FREE Express Delivery</b>.
                  </span>
                )}
                <span className="font-bold text-[#67349a]">{formatPrice(subtotal)} / ₹2,999</span>
              </div>

              {/* Items Card List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-cream-200/90 shadow-sm"
                  >
                    <Link
                      href={`/product/${item.product.id}`}
                      className="w-24 h-32 rounded-xl overflow-hidden bg-cream-100 shrink-0"
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal-900 hover:text-[#67349a] transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() => removeItem(item.product.id, item.size)}
                            className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-charcoal-500 mt-0.5">
                          Size: <span className="font-bold text-charcoal-800">{item.size}</span> • Category: <span className="capitalize">{item.product.category}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-100">
                        {/* Quantity Buttons */}
                        <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="px-3 py-1 text-charcoal-600 hover:bg-cream-200 font-bold transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-3 py-1 text-xs font-bold min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="px-3 py-1 text-charcoal-600 hover:bg-cream-200 font-bold transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-serif text-lg font-bold text-[#67349a]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 text-[11px] text-charcoal-600">
                <div className="p-3 bg-white rounded-2xl border border-cream-200 text-center">
                  <Truck size={17} className="text-[#67349a] mx-auto mb-1" />
                  <span className="font-bold block">Express Shipping</span>
                  <span className="text-[10px] text-charcoal-400">2-4 Business Days</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-cream-200 text-center">
                  <RefreshCw size={17} className="text-[#67349a] mx-auto mb-1" />
                  <span className="font-bold block">30-Day Returns</span>
                  <span className="text-[10px] text-charcoal-400">Doorstep Pickup</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-cream-200 text-center">
                  <ShieldCheck size={17} className="text-[#67349a] mx-auto mb-1" />
                  <span className="font-bold block">100% Certified</span>
                  <span className="text-[10px] text-charcoal-400">Pure Mulberry Silk</span>
                </div>
              </div>

            </div>

            {/* RIGHT: Order Summary & Checkout Form (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Summary Box */}
              <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-bold text-charcoal-900 border-b border-cream-200 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-2 text-xs text-charcoal-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-charcoal-900">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({appliedCode})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Coupon (e.g. STYLE10)"
                        className="w-full pl-8 pr-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs uppercase focus:outline-none focus:border-[#67349a]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#241135] text-white text-xs font-bold rounded-xl hover:bg-[#67349a] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[11px] text-rose-600 mt-1">{promoError}</p>}
                  {appliedCode && (
                    <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                      ✓ Coupon {appliedCode} applied!
                    </p>
                  )}
                </form>

                <div className="pt-3 border-t border-cream-200 flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-charcoal-900">Total Payable</span>
                  <span className="font-serif text-2xl font-bold text-[#67349a]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                {/* Direct WhatsApp Ordering */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle size={18} className="fill-white" />
                  <span>Order via WhatsApp Direct</span>
                </button>

                <div className="relative text-center text-xs text-charcoal-400 my-2">
                  <span className="bg-white px-2 relative z-10">or enter details below</span>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cream-200" />
                  </div>
                </div>

                {/* Fast Checkout Details Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ananya Sharma"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 uppercase mb-1">
                      Phone Number (for Courier & Tracking)
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 uppercase mb-1">
                      Delivery Address & City
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Apartment, Street name, City, Pincode"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#241135] hover:bg-[#67349a] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xl"
                  >
                    Confirm Order ({formatPrice(finalTotal)})
                  </button>
                </form>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
