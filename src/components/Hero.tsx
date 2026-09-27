"use client";
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

type HeroProps = {
  onShopNow?: () => void;
  onNewArrivals?: () => void;
};

export default function Hero({ onShopNow, onNewArrivals }: HeroProps) {
  return (
    <section className="fashion-shell pt-3 pb-6 md:pt-6 md:pb-8" aria-label="The Style Room Hero Banner">
      <div className="hero-card relative min-h-[540px] sm:min-h-[600px] md:min-h-[640px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Background Visuals */}
        <div className="hero-media absolute inset-0">
          <img
            src="/images/hero_model.jpg"
            alt="The Style Room luxury fashion collection"
            className="w-full h-full object-cover object-center md:object-[center_35%]"
          />
          <div className="hero-image-wash absolute inset-0" />
          <div className="hero-orb absolute" />
        </div>

        {/* Poster Top Badge & Seasonal Announcement */}
        <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase px-3.5 py-1.5 rounded-full shadow-lg">
            <Sparkles size={13} className="text-[#e2b9ff]" />
            <span>Spring / Summer 2026 Couture Edit</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-white/80 text-xs tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEW ARRIVALS IN STORE</span>
          </div>
        </div>

        {/* Poster Main Content / Typography */}
        <div className="relative z-10 px-5 sm:px-8 md:px-12 pb-8 md:pb-12 max-w-2xl text-white">
          <p className="eyebrow text-xs md:text-sm tracking-[0.3em] font-semibold text-[#ddb7ff] mb-2 sm:mb-3 uppercase">
            Curated Contemporary Fashion
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-3 sm:mb-4">
            Curated Elegance,<br />
            <span className="text-[#deb6ff] italic font-normal">Uncompromising</span> Style.
          </h1>
          <p className="text-white/85 text-xs sm:text-base md:text-lg max-w-lg mb-6 sm:mb-8 leading-relaxed font-light">
            Indulge in artisanal silhouettes, pure mulberry silks, and bespoke tailoring designed to elevate your everyday presence with effortless grace.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 sm:mb-10">
            {onShopNow ? (
              <button
                onClick={onShopNow}
                className="inline-flex items-center justify-center gap-2.5 bg-white text-[#251135] hover:bg-rose-50 px-7 sm:px-8 py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <span>Explore Collection</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2.5 bg-white text-[#251135] hover:bg-rose-50 px-7 sm:px-8 py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <span>Explore Collection</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {onNewArrivals ? (
              <button
                onClick={onNewArrivals}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 sm:px-7 py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300"
              >
                <span>New Arrivals Drop</span>
              </button>
            ) : (
              <Link
                href="/category/new"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 sm:px-7 py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300"
              >
                <span>New Arrivals Drop</span>
              </Link>
            )}
          </div>

          {/* Value Props Strip on Main Poster */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 sm:pt-6 border-t border-white/15 text-white/90 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Truck size={15} className="text-[#deb6ff] shrink-0" />
              <div>
                <b className="block font-semibold">Free Express</b>
                <span className="text-white/70 text-[9px] sm:text-[10px]">Over ₹2,999</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <RefreshCw size={15} className="text-[#deb6ff] shrink-0" />
              <div>
                <b className="block font-semibold">30-Day Returns</b>
                <span className="text-white/70 text-[9px] sm:text-[10px]">Hassle-Free</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck size={15} className="text-[#deb6ff] shrink-0" />
              <div>
                <b className="block font-semibold">100% Authentic</b>
                <span className="text-white/70 text-[9px] sm:text-[10px]">Luxury Craft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Counter on Corner */}
        <div className="absolute z-10 bottom-6 right-6 hidden md:flex items-center gap-2 text-white/70 text-xs font-mono">
          <span className="text-white font-bold border-b-2 border-white pb-0.5">01</span>
          <span>/</span>
          <span>03</span>
          <span className="text-[10px] tracking-wider text-[#deb6ff] ml-1">THE SILK EDIT</span>
        </div>
      </div>
    </section>
  );
}
