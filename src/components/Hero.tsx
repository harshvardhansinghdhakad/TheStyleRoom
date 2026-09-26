"use client";
import { ArrowRight, Mail, Menu, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';

type HeroProps = { 
  onShopNow: () => void; 
  onNewArrivals: () => void;
  onNavigate: (cat: 'dresses' | 'tops' | 'about' | 'journal') => void;
};

export default function Hero({ onShopNow, onNewArrivals, onNavigate }: HeroProps) {
  const { totalItems, openCart } = useCart();
  return (
    <section className="fashion-shell pt-3 md:pt-5" aria-label="Hero banner">
      <div className="contact-pill-wrap">
        <a href="mailto:support@thestyleroom.com" className="contact-pill"><span className="contact-icon"><Mail size={17}/></span>CONTACT US</a>
      </div>
      <div className="hero-card">
        <div className="hero-media">
          <img src="/images/hero_model.jpg" alt="VYRA new collection" />
          <div className="hero-image-wash" />
          <div className="hero-orb" />
        </div>
        <div className="hero-nav">
          <button className="brand-mark" onClick={onShopNow}>VYRA</button>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('dresses')}>Women</button>
            <button onClick={() => onNavigate('tops')}>Collections</button>
            <button onClick={() => onNavigate('about')}>About</button>
            <button onClick={() => onNavigate('journal')}>Journal</button>
          </nav>
          <div className="hero-actions">
            <Search size={18}/>
            <button className="relative" onClick={openCart} aria-label="Open cart"><ShoppingBag size={18}/>{totalItems > 0 && <span className="cart-dot">{totalItems}</span>}</button>
            <Menu size={19}/>
          </div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">OWN YOUR VIBE</p>
          <h1>Bold Looks<br/><span>Brighter<br/>Days</span></h1>
          <p className="hero-description">Premium streetwear for a smarter, bolder you.</p>
          <div className="hero-buttons">
            <button className="solid-cta" onClick={onShopNow}>Shop Now <ArrowRight size={18}/></button>
            <button className="ghost-cta" onClick={onNewArrivals}>Explore Collection</button>
          </div>
          <div className="hero-benefits">
            <span>♧ <b>Free</b><small>Shipping</small></span>
            <span>↻ <b>Easy</b><small>Returns</small></span>
            <span>♢ <b>Secure</b><small>Payments</small></span>
          </div>
        </div>
        <div className="hero-slides"><b>01</b><span>02</span><span>03</span></div>
      </div>
    </section>
  );
}
