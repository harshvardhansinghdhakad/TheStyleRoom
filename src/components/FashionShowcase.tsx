"use client";
import Link from 'next/link';
import { ArrowUpRight, Globe2, Heart, Star, Sparkles } from 'lucide-react';

const cards = [
  {
    title: 'Women’s Silk Slips & Dresses',
    kicker: 'EFFORTLESS COUTURE',
    desc: 'Bias-cut mulberry silks crafted for all moments',
    image: '/images/category_jacket.jpg',
    href: '/category/dresses',
  },
  {
    title: 'Tailored Tops & Resort Wear',
    kicker: 'TIMELESS CAPSULES',
    desc: 'Breezy poplin blouses & relaxed linen layers',
    image: '/images/category_pants.jpg',
    href: '/category/tops',
  },
];

const arrivals = [
  { title: 'Mulberry Silks', image: '/images/category_jacket.jpg', href: '/category/dresses' },
  { title: 'Linen Resorwear', image: '/images/category_pants.jpg', href: '/category/tops' },
  { title: 'Atelier Accents', image: '/images/arrival_sunglasses.jpg', href: '/shop' },
  { title: 'Signature Footwear', image: '/images/arrival_footwear.jpg', href: '/shop' },
];

export default function FashionShowcase() {
  return (
    <>
      {/* Category Section */}
      <section className="showcase-section">
        <div className="section-heading-row">
          <div>
            <p className="purple-eyebrow flex items-center gap-1.5">
              <Sparkles size={12} />
              SHOP BY CATEGORY
            </p>
            <h2>Curated for Every Moment</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#67349a] hover:underline">
            View All Pieces <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="category-card group block relative min-h-[300px] sm:min-h-[340px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover filter saturate-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="category-overlay absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#220c33]/90 via-[#220c33]/60 to-transparent" />
              <div className="category-copy absolute left-6 bottom-6 sm:top-8 sm:bottom-auto text-white">
                <p className="text-[10px] font-bold tracking-[0.25em] text-[#deb6ff] uppercase mb-1.5">
                  {card.kicker}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                  {card.title}
                </h3>
                <span className="block text-xs sm:text-sm text-white/80 max-w-xs mb-4">
                  {card.desc}
                </span>
                <span className="inline-flex items-center gap-2 bg-white text-[#241135] group-hover:bg-[#deb6ff] rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-md">
                  Explore Edit <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Arrival Banner */}
      <section className="arrival-banner">
        <img
          src="/images/arrival_banner_model.jpg"
          alt="New arrivals drop at The Style Room"
          className="w-full h-full object-cover object-[center_35%]"
        />
        <div className="arrival-wash" />
        <div className="arrival-copy">
          <p className="text-[10px] sm:text-xs tracking-[0.28em] text-[#deb6ff] font-bold uppercase mb-2">
            * 2026 COUTURE RELEASE *
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Same Quiet Luxury.<br />
            <span className="text-[#d6b2f4] italic font-normal">Fresh Arrivals.</span>
          </h2>
          <Link
            href="/category/new"
            className="inline-flex items-center gap-2 bg-white text-[#25122f] hover:bg-[#deb6ff] rounded-full px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xl"
          >
            Discover New Drops <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* Arrival Grid Showcase */}
      <section className="arrivals-section">
        <div className="arrivals-title mb-6">
          <p className="purple-eyebrow">SPRING ATELIER PICKS</p>
          <h2>Trending Edits</h2>
          <p className="text-charcoal-500 text-xs sm:text-sm">Silhouettes crafted for modern presence, fluid motion, and enduring ease.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          {arrivals.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="arrival-card group relative min-h-[220px] sm:min-h-[280px] rounded-2xl overflow-hidden block shadow-sm hover:shadow-lg transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover filter saturate-85 group-hover:scale-106 transition-transform duration-500"
              />
              <span className="absolute z-10 bottom-3.5 left-3.5 text-white font-serif text-base sm:text-xl font-bold">
                {item.title}
              </span>
              <i className="absolute z-10 top-3 right-3 w-8 h-8 rounded-full bg-white text-[#4b1f6d] flex items-center justify-center shadow-md group-hover:bg-[#67349a] group-hover:text-white transition-colors">
                <ArrowUpRight size={16} />
              </i>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefit Strip */}
      <section className="benefit-strip">
        <div>
          <Globe2 className="text-[#67349a]" />
          <div>
            <b>Express Delivery<br /><span>Across All of India</span></b>
          </div>
        </div>
        <div>
          <Heart className="text-[#67349a]" />
          <div>
            <b>Loved & Trusted<br /><span>By 10,000+ Patrons</span></b>
          </div>
        </div>
        <div>
          <Star className="text-[#67349a]" />
          <div>
            <b>Artisanal Quality<br /><span>Pure Mulberry Silks</span></b>
          </div>
        </div>
        <div>
          <Sparkles className="text-[#67349a]" />
          <div>
            <b>Indore Atelier<br /><span>15+ Years Craft Legacy</span></b>
          </div>
        </div>
      </section>
    </>
  );
}
