"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/supabase';
import type { UserAddress } from '@/lib/storeData';
import {
  X,
  User,
  MapPin,
  Package,
  Plus,
  Trash2,
  Edit2,
  Check,
  LogOut,
  Shield,
  Phone,
  Mail,
  Home,
  Briefcase,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const INDIAN_STATES = [
  'Madhya Pradesh',
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Gujarat',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Punjab',
  'Haryana',
  'Kerala',
  'Goa',
  'Other',
];

export default function AccountDrawer() {
  const {
    user,
    accountDrawerOpen,
    closeAccountDrawer,
    signOut,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    updateProfile,
    getUserOrders,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'addresses' | 'orders' | 'profile'>('addresses');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Indore');
  const [state, setState] = useState('Madhya Pradesh');
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [isDefault, setIsDefault] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  if (!accountDrawerOpen || !user) return null;

  const orders = getUserOrders();

  const resetForm = () => {
    setFullName(user.name || '');
    setPhone(user.phone || '');
    setPincode('452001');
    setAddressLine1('');
    setAddressLine2('');
    setCity('Indore');
    setState('Madhya Pradesh');
    setLabel('Home');
    setIsDefault(user.addresses.length === 0);
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setShowAddressForm(true);
  };

  const handleEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setPincode(addr.pincode);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city);
    setState(addr.state);
    setLabel(addr.label);
    setIsDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !addressLine1.trim() || !pincode.trim() || !city.trim()) {
      alert('Please fill all required address fields');
      return;
    }

    if (editingAddressId) {
      await updateAddress(editingAddressId, {
        fullName,
        phone,
        pincode,
        addressLine1,
        addressLine2,
        city,
        state,
        label,
        isDefault,
      });
    } else {
      await addAddress({
        fullName,
        phone,
        pincode,
        addressLine1,
        addressLine2,
        city,
        state,
        label,
        isDefault,
      });
    }

    resetForm();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: editName || user.name, phone: editPhone || user.phone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'TR';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#160724]/60 backdrop-blur-sm transition-opacity"
        onClick={closeAccountDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#faf8fc] shadow-2xl flex flex-col border-l border-purple-100">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#241135] via-[#4a1b72] to-[#241135] text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-purple-200 border border-white/15">
                  Atelier Member
                </span>
                {user.authProvider === 'google' && (
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Google Connected
                  </span>
                )}
              </div>
              <button
                onClick={closeAccountDrawer}
                className="p-1.5 rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Account Drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Overview */}
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center font-serif text-lg font-bold text-white shadow-md">
                  {initials}
                </div>
              )}
              <div className="overflow-hidden">
                <h2 className="font-serif text-xl font-bold text-white truncate">{user.name}</h2>
                <p className="text-xs text-purple-200 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                {user.phone && (
                  <p className="text-xs text-purple-300 truncate flex items-center gap-1.5 mt-0.5">
                    <Phone size={12} className="shrink-0" />
                    <span>{user.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-cream-200 bg-white px-4">
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'addresses'
                  ? 'border-[#67349a] text-[#67349a]'
                  : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <MapPin size={15} />
              <span>Saved Addresses ({user.addresses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'orders'
                  ? 'border-[#67349a] text-[#67349a]'
                  : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <Package size={15} />
              <span>My Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('profile');
                setEditName(user.name);
                setEditPhone(user.phone || '');
              }}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'profile'
                  ? 'border-[#67349a] text-[#67349a]'
                  : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <User size={15} />
              <span>Profile</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* TAB 1: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-charcoal-900">Delivery Addresses</h3>
                    <p className="text-xs text-charcoal-500">
                      Saved addresses automatically pre-fill during checkout
                    </p>
                  </div>
                  {!showAddressForm && (
                    <button
                      onClick={handleOpenAddForm}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#67349a] hover:bg-[#54297f] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      <Plus size={13} />
                      <span>Add New</span>
                    </button>
                  )}
                </div>

                {/* Add / Edit Address Form */}
                {showAddressForm && (
                  <form
                    onSubmit={handleSaveAddress}
                    className="p-5 bg-white rounded-2xl border border-purple-100 shadow-md space-y-3 animate-fade-in"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                      <h4 className="font-serif text-sm font-bold text-[#241135]">
                        {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                      </h4>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs text-charcoal-400 hover:text-charcoal-700"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Recipient name"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-cream-300 focus:border-[#67349a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98201 00000"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-cream-300 focus:border-[#67349a] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                        Flat, House No., Building, Apartment *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. Flat 402, Royal Residency"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-cream-300 focus:border-[#67349a] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                        Area, Street, Sector, Landmark
                      </label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="e.g. Race Course Road, Near High Court"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-cream-300 focus:border-[#67349a] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="452001"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-cream-300 focus:border-[#67349a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Indore"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-cream-300 focus:border-[#67349a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                          State *
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs rounded-lg border border-cream-300 focus:border-[#67349a] outline-none bg-white"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-charcoal-600">Label:</span>
                        {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setLabel(lbl)}
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                              label === lbl
                                ? 'bg-purple-100 border-[#67349a] text-[#67349a]'
                                : 'border-cream-300 text-charcoal-600 hover:bg-cream-100'
                            }`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-charcoal-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isDefault}
                          onChange={(e) => setIsDefault(e.target.checked)}
                          className="accent-[#67349a] rounded"
                        />
                        <span className="text-[11px]">Set as default</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-3 py-2.5 bg-[#241135] hover:bg-[#67349a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                      {editingAddressId ? 'Save Changes' : 'Save Delivery Address'}
                    </button>
                  </form>
                )}

                {/* List of Saved Addresses */}
                {user.addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-cream-300 p-6">
                    <MapPin size={32} className="text-charcoal-300 mx-auto mb-2" />
                    <h4 className="font-serif text-base font-bold text-charcoal-800">No Addresses Saved Yet</h4>
                    <p className="text-xs text-charcoal-500 mt-1 mb-4 max-w-xs mx-auto">
                      Save your shipping address now for effortless 1-click checkout on all future orders.
                    </p>
                    <button
                      onClick={handleOpenAddForm}
                      className="px-4 py-2 bg-[#67349a] text-white text-xs font-bold uppercase tracking-wider rounded-full"
                    >
                      Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 bg-white rounded-2xl border transition-all ${
                          addr.isDefault
                            ? 'border-[#67349a] shadow-[0_4px_16px_rgba(103,52,154,0.08)] bg-purple-50/20'
                            : 'border-cream-200 hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cream-100 text-charcoal-700">
                              {addr.label === 'Home' && <Home size={11} />}
                              {addr.label === 'Work' && <Briefcase size={11} />}
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#67349a] text-white">
                                Default
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!addr.isDefault && (
                              <button
                                onClick={() => setDefaultAddress(addr.id)}
                                className="text-[10px] text-[#67349a] hover:underline font-semibold"
                              >
                                Make Default
                              </button>
                            )}
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="p-1 text-charcoal-400 hover:text-charcoal-700"
                              title="Edit Address"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => deleteAddress(addr.id)}
                              className="p-1 text-charcoal-400 hover:text-rose-600"
                              title="Delete Address"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs font-bold text-charcoal-900">{addr.fullName}</p>
                        <p className="text-xs text-charcoal-600 mt-0.5">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </p>
                        <p className="text-xs text-charcoal-600">
                          {addr.city}, {addr.state} — <span className="font-semibold text-charcoal-800">{addr.pincode}</span>
                        </p>
                        <p className="text-[11px] text-charcoal-500 mt-1">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">Your Order History</h3>
                  <span className="text-xs text-charcoal-500">{orders.length} order(s) placed</span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-cream-300 p-6">
                    <Package size={32} className="text-charcoal-300 mx-auto mb-2" />
                    <h4 className="font-serif text-base font-bold text-charcoal-800">No Orders Placed Yet</h4>
                    <p className="text-xs text-charcoal-500 mt-1 mb-4">
                      Explore our handcrafted mulberry silks and couture collections.
                    </p>
                    <Link
                      href="/shop"
                      onClick={closeAccountDrawer}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#241135] hover:bg-[#67349a] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all"
                    >
                      <span>Explore Shop</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 bg-white rounded-2xl border border-cream-200 shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-cream-100 pb-2">
                          <div>
                            <span className="text-xs font-bold text-[#67349a] font-mono">{ord.id}</span>
                            <p className="text-[10px] text-charcoal-400">
                              {new Date(ord.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'confirmed'
                                ? 'bg-purple-100 text-purple-800'
                                : ord.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="space-y-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-charcoal-800 font-medium">
                                {it.name} <span className="text-charcoal-400">({it.size} x{it.quantity})</span>
                              </span>
                              <span className="font-semibold text-charcoal-900">
                                {formatPrice(it.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-cream-100 text-xs">
                          <span className="text-charcoal-500 font-medium">Order Total:</span>
                          <span className="font-bold text-sm text-[#241135]">{formatPrice(ord.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-charcoal-900">Profile Details</h3>
                
                <form onSubmit={handleSaveProfile} className="p-5 bg-white rounded-2xl border border-cream-200 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-cream-200 bg-cream-100 text-charcoal-500 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-600 uppercase mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 98201 00000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#241135] hover:bg-[#67349a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                  >
                    Update Profile
                  </button>

                  {profileSaved && (
                    <p className="text-center text-xs text-emerald-600 font-semibold animate-fade-in">
                      Profile updated successfully!
                    </p>
                  )}
                </form>

                {/* Direct link to Store Admin Portal */}
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield size={18} className="text-[#67349a]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#241135]">Store Admin Portal</h4>
                      <p className="text-[10px] text-charcoal-500">Manage products, blogs, orders & clients</p>
                    </div>
                  </div>
                  <Link
                    href="/admin"
                    onClick={closeAccountDrawer}
                    className="px-3 py-1.5 bg-[#67349a] text-white text-[11px] font-bold uppercase rounded-lg hover:bg-[#54297f] transition-all inline-flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={14} />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
