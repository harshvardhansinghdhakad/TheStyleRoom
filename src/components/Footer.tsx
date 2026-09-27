"use client";
import { useState } from 'react';
import { Instagram, Facebook, Youtube, ArrowUpRight, Check, Shield } from 'lucide-react';
import type { Category } from '@/components/Header';

type FooterProps = {
  onCategoryChange: (cat: Category) => void;
};

export default function Footer({ onCategoryChange }: FooterProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="fashion-footer bg-[#1a0c26] text-[#f8f0ff] pt-14 pb-8 px-4 sm:px-6 lg:px-8 border-t border-[#3b1f52]">
      {/* Newsletter Card */}
      <div className="newsletter-card max-w-6xl mx-auto mb-16 rounded-3xl bg-gradient-to-r from-[#29113d] to-[#3a1854] border border-[#6d3498]/40 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="max-w-xl text-center md:text-left">
          <p className="purple-eyebrow text-xs font-semibold tracking-[0.25em] text-[#d4a8f9] uppercase mb-2">
            STAY IN TOUCH
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            Join The Style Room Society
          </h2>
          <p className="text-[#c9b8d8] text-xs sm:text-sm leading-relaxed">
            Receive exclusive seasonal previews, invitations to private trunk shows, and ₹500 off your first atelier order.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="newsletter-form w-full md:w-auto flex-1 max-w-md flex items-center bg-[#1c0c2a]/80 border border-[#7e45ad] rounded-full p-1.5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-[#9f8cae] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-[#deb6ff] hover:bg-white text-[#241135] font-semibold text-xs px-5 py-2.5 rounded-full transition-colors shrink-0"
          >
            {subscribed ? (
              <>
                <Check size={14} /> Subscribed
              </>
            ) : (
              <>
                Subscribe <ArrowUpRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-[#3b1f52]/60">
        {/* Brand Information */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-wider text-white uppercase">
            The Style Room
          </h3>
          <p className="text-xs sm:text-sm text-[#baa9c8] leading-relaxed max-w-sm">
            Curated contemporary luxury. Handcrafted silhouettes designed with timeless elegance, ethical tailoring, and unmatched craftsmanship.
          </p>
          <div className="pt-2 text-xs text-[#baa9c8] space-y-1">
            <p>Atelier Showroom: The Fashion Room, Indore, MP 452016</p>
            <p>Direct Concierge: +91 75818 57811 (10 AM - 7 PM IST)</p>
            <p>Inquiries: hello@thestyleroom.com</p>
          </div>
          <div className="flex items-center gap-4 pt-3 text-[#dcb8ff]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Shop Navigation */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm tracking-wider uppercase text-white font-sans">
            Shop Boutique
          </h4>
          <ul className="space-y-2 text-xs text-[#b8a7c6]">
            <li>
              <button onClick={() => onCategoryChange('dresses')} className="hover:text-white transition-colors">
                Women's Collection
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryChange('tops')} className="hover:text-white transition-colors">
                Curated Collections
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryChange('new')} className="hover:text-white transition-colors">
                New Arrivals Drop
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryChange('dresses')} className="hover:text-white transition-colors">
                Silk & Satin Edit
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryChange('tops')} className="hover:text-white transition-colors">
                Resort & Linen
              </button>
            </li>
          </ul>
        </div>

        {/* Brand & Editorial */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm tracking-wider uppercase text-white font-sans">
            Atelier
          </h4>
          <ul className="space-y-2 text-xs text-[#b8a7c6]">
            <li>
              <button onClick={() => onCategoryChange('about')} className="hover:text-white transition-colors">
                Our Story & Heritage
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryChange('journal')} className="hover:text-white transition-colors">
                The Style Journal
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryChange('about')} className="hover:text-white transition-colors">
                Sustainable Craftsmanship
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryChange('contact')} className="hover:text-white transition-colors">
                Boutique Visits
              </button>
            </li>
            <li>
              <a href="#admin" className="text-[#d8b5f8] hover:text-white transition-colors inline-flex items-center gap-1 font-medium">
                <Shield size={12} /> Admin Login
              </a>
            </li>
          </ul>
        </div>

        {/* Client Care */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm tracking-wider uppercase text-white font-sans">
            Client Services
          </h4>
          <ul className="space-y-2 text-xs text-[#b8a7c6]">
            <li>
              <button onClick={() => onCategoryChange('contact')} className="hover:text-white transition-colors">
                Contact Concierge
              </button>
            </li>
            <li>
              <a href="mailto:support@thestyleroom.com?subject=Track%20Order" className="hover:text-white transition-colors">
                Track Your Shipment
              </a>
            </li>
            <li>
              <a href="mailto:support@thestyleroom.com?subject=Return%20Request" className="hover:text-white transition-colors">
                30-Day Returns & Exchange
              </a>
            </li>
            <li>
              <button onClick={() => onCategoryChange('contact')} className="hover:text-white transition-colors">
                Custom Fitting & Sizing
              </button>
            </li>
            <li>
              <a href="mailto:support@thestyleroom.com" className="hover:text-white transition-colors">
                Shipping & Delivery Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9b88a8]">
        <p>© 2026 The Style Room. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Cookie Preferences</span>
        </div>
        <p className="flex items-center gap-1 text-[#dcb8ff]">
          <span>India (INR ₹)</span>
        </p>
      </div>
    </footer>
  );
}
