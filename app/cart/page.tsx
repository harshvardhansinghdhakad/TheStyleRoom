"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/supabase';
import { saveOrderToStore } from '@/lib/storeData';
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
  MapPin,
  Home,
  Briefcase,
  User,
  Sparkles,
} from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { user, openAuthModal, openAccountDrawer, addAddress } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Address & Checkout State
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'custom'>('custom');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Indore');
  const [state, setState] = useState('Madhya Pradesh');
  const [pincode, setPincode] = useState('452001');
  const [saveToAccount, setSaveToAccount] = useState(true);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = subtotal >= 2999 || subtotal === 0 ? 0 : 199;
  const finalTotal = Math.max(0, subtotal - discount + shippingCost);

  // Auto-fill from user profile / default address
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');

      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setCustomerName(defaultAddr.fullName || user.name);
        setCustomerPhone(defaultAddr.phone || user.phone || '');
        setAddressLine1(defaultAddr.addressLine1);
        setAddressLine2(defaultAddr.addressLine2 || '');
        setCity(defaultAddr.city);
        setState(defaultAddr.state);
        setPincode(defaultAddr.pincode);
      }
    }
  }, [user]);

  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (!user) return;
    const addr = user.addresses.find((a) => a.id === addrId);
    if (addr) {
      setCustomerName(addr.fullName);
      setCustomerPhone(addr.phone);
      setAddressLine1(addr.addressLine1);
      setAddressLine2(addr.addressLine2 || '');
      setCity(addr.city);
      setState(addr.state);
      setPincode(addr.pincode);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoCode.trim()) return;

    const code = promoCode.trim().toUpperCase();
    if (code === 'STYLE10' || code === 'FIRST500') {
      const disc = code === 'FIRST500' ? 500 : Math.round(subtotal * 0.1);
      setDiscount(disc);
      setAppliedCode(code);
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try code "STYLE10" for 10% off.');
    }
  };

  const getFullAddressString = () => {
    const parts = [addressLine1, addressLine2, `${city}, ${state} — ${pincode}`].filter(Boolean);
    return parts.join(', ');
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const phone = '917581857811';
    let msg = `*NEW ORDER INQUIRY — THE STYLE ROOM*\n\n`;
    if (customerName) msg += `• *Customer:* ${customerName}\n`;
    if (customerPhone) msg += `• *Phone:* ${customerPhone}\n`;
    const fullAddr = getFullAddressString();
    if (fullAddr) msg += `• *Delivery Address:* ${fullAddr}\n\n`;

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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !addressLine1.trim()) {
      alert('Please fill out customer name, contact phone, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    const orderRef = `TSR-${Math.floor(100000 + Math.random() * 900000)}`;

    // If user is logged in, opted to save, and was typing a custom address
    if (user && saveToAccount && selectedAddressId === 'custom') {
      try {
        await addAddress({
          fullName: customerName,
          phone: customerPhone,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          label: 'Home',
          isDefault: user.addresses.length === 0,
        });
      } catch {}
    }

    // Save order into the central store and Supabase
    try {
      await saveOrderToStore({
        id: orderRef,
        customer_id: user ? user.id : null,
        customer_name: customerName,
        customer_email: user ? user.email : `${customerPhone}@guest.the-style-room.vercel.app`,
        items: items.map((it) => ({
          product_id: it.product.id,
          name: it.product.name,
          size: it.size,
          quantity: it.quantity,
          price: it.product.price,
        })),
        total: finalTotal,
        status: 'confirmed',
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Order store persistence fallback:', err);
    }

    setPlacedOrderId(orderRef);
    setOrderPlaced(true);
    clearCart();
    setIsSubmitting(false);
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
            Thank you for shopping with The Style Room Atelier. Your bespoke order has been registered in our system and sent to our master tailors.
          </p>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 mb-6 text-xs text-[#522580] space-y-1 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-purple-200/60">
              <span className="font-semibold text-charcoal-500">Order Reference:</span>
              <span className="font-mono font-bold text-sm text-[#241135]">{placedOrderId}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-charcoal-500">Delivery To:</span>
              <span className="font-medium text-charcoal-800 truncate max-w-[200px]">{customerName}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-charcoal-500">Address:</span>
              <span className="font-medium text-charcoal-800 truncate max-w-[220px]">{getFullAddressString()}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-charcoal-500">Amount Paid:</span>
              <span className="font-bold text-[#67349a]">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {user ? (
              <button
                onClick={openAccountDrawer}
                className="inline-flex items-center justify-center w-full py-3.5 bg-[#241135] hover:bg-[#67349a] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all"
              >
                View Order in My Account
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signup')}
                className="inline-flex items-center justify-center w-full py-3.5 bg-[#241135] hover:bg-[#67349a] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all"
              >
                Create Account to Track Order
              </button>
            )}

            <Link
              href="/shop"
              className="inline-flex items-center justify-center w-full py-3 bg-cream-100 hover:bg-cream-200 text-charcoal-800 font-bold text-xs uppercase tracking-wider rounded-full transition-all"
            >
              Continue Shopping
            </Link>
          </div>
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

          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-[#67349a] hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-cream-200 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-[#67349a] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">
              Your shopping bag is empty
            </h2>
            <p className="text-charcoal-500 text-sm max-w-md mx-auto mb-8">
              Explore our handcrafted mulberry silk dresses, fluid tailored blouses, and contemporary wardrobe capsules.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#241135] hover:bg-[#67349a] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Item List (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm divide-y divide-cream-100">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="py-5 first:pt-0 last:pb-0 flex gap-4 sm:gap-6 items-center"
                  >
                    <Link
                      href={`/product/${item.product.id}`}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-cream-100 shrink-0 border border-cream-200"
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.id}`}
                        className="font-serif text-base sm:text-lg font-bold text-charcoal-900 hover:text-[#67349a] transition-colors truncate block"
                      >
                        {item.product.name}
                      </Link>

                      <div className="flex items-center gap-3 text-xs text-charcoal-500 mt-1">
                        <span>Size: <b className="text-charcoal-800">{item.size}</b></span>
                        <span>•</span>
                        <span className="capitalize">{item.product.category}</span>
                      </div>

                      <div className="text-sm font-bold text-charcoal-900 mt-2">
                        {formatPrice(item.product.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-cream-300 rounded-full bg-cream-50/50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="p-1.5 hover:text-[#67349a] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-3 text-xs font-bold text-charcoal-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="p-1.5 hover:text-[#67349a] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="p-1.5 text-charcoal-400 hover:text-rose-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-3 gap-3 text-xs text-charcoal-600">
                <div className="p-3 bg-white rounded-2xl border border-cream-200 text-center">
                  <Truck size={17} className="text-[#67349a] mx-auto mb-1" />
                  <span className="font-bold block">Free Express</span>
                  <span className="text-[10px] text-charcoal-400">On orders over ₹2,999</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-cream-200 text-center">
                  <RefreshCw size={17} className="text-[#67349a] mx-auto mb-1" />
                  <span className="font-bold block">30-Day Returns</span>
                  <span className="text-[10px] text-charcoal-400">Doorstep Pickup</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-cream-200 text-center">
                  <ShieldCheck size={17} className="text-[#67349a] mx-auto mb-1" />
                  <span className="font-bold block">100% Certified</span>
                  <span className="text-[10px] text-charcoal-400">Mulberry Silk</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary & Delivery Address Form (5 Columns) */}
            <div className="lg:col-span-5 space-y-5">
              
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
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle size={18} className="fill-white" />
                  <span>Order via WhatsApp Direct</span>
                </button>
              </div>

              {/* Delivery Address & Checkout Form */}
              <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4">
                
                {/* Guest vs Member Prompt */}
                {!user ? (
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#67349a]" />
                      <span className="text-xs text-[#411562]">
                        Have an account? <b>Sign In</b> for saved addresses
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="px-3 py-1 bg-[#67349a] text-white text-[10px] font-bold uppercase rounded-lg hover:bg-[#54297f]"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                    <div>
                      <h3 className="font-serif text-base font-bold text-charcoal-900">
                        Delivery Address
                      </h3>
                      <p className="text-[11px] text-charcoal-500">
                        Auto-filled for {user.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openAccountDrawer}
                      className="text-xs text-[#67349a] font-bold hover:underline"
                    >
                      Manage Addresses
                    </button>
                  </div>
                )}

                {/* Saved Address Selector (if logged in and has addresses) */}
                {user && user.addresses.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                      Select Saved Address:
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {user.addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedAddressId === addr.id
                              ? 'bg-purple-50/50 border-[#67349a] shadow-sm'
                              : 'bg-cream-50/50 border-cream-200 hover:border-purple-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery_address_selection"
                            checked={selectedAddressId === addr.id}
                            onChange={() => handleSelectSavedAddress(addr.id)}
                            className="mt-0.5 accent-[#67349a]"
                          />
                          <div className="text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-charcoal-900">
                              <span>{addr.fullName}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-[#67349a] uppercase">
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-charcoal-600 text-[11px] mt-0.5 line-clamp-1">
                              {addr.addressLine1}, {addr.city} — {addr.pincode}
                            </p>
                          </div>
                        </label>
                      ))}

                      {/* Option for different custom address */}
                      <label
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          selectedAddressId === 'custom'
                            ? 'bg-purple-50/50 border-[#67349a]'
                            : 'bg-cream-50/50 border-cream-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery_address_selection"
                          checked={selectedAddressId === 'custom'}
                          onChange={() => setSelectedAddressId('custom')}
                          className="accent-[#67349a]"
                        />
                        <span className="text-xs font-semibold text-charcoal-700">
                          + Enter a different address
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Address Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ananya Singhania"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                      Contact Mobile Number (Courier & WhatsApp Updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98201 00000"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                      Flat / House No. / Building / Street *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="e.g. Flat 402, Royal Residency, MG Road"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Indore"
                        className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-charcoal-700 uppercase mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="452001"
                        className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                      />
                    </div>
                  </div>

                  {user && selectedAddressId === 'custom' && (
                    <label className="flex items-center gap-2 text-xs text-charcoal-700 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveToAccount}
                        onChange={(e) => setSaveToAccount(e.target.checked)}
                        className="accent-[#67349a] rounded"
                      />
                      <span className="text-[11px]">Save this address to my profile for future orders</span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#241135] hover:bg-[#67349a] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'Confirming Order...' : `Confirm & Place Order (${formatPrice(finalTotal)})`}
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
