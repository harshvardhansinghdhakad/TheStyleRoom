"use client";
import { useState } from 'react';
import type { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import { ShoppingBag, Eye, Heart, Check, Sparkles } from 'lucide-react';

type ProductCardProps = {
  product: Product;
  onQuickView: (product: Product) => void;
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, product.sizes[0] || 'M');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Realistic original comparison price for luxury perception
  const originalPrice = product.price + Math.round(product.price * 0.3);

  return (
    <div
      className="group relative flex flex-col justify-between bg-white rounded-3xl p-3 sm:p-3.5 border border-cream-200/90 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onQuickView(product)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream-100 mb-3.5 shadow-inner">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-cream-200 to-cream-100" />
        )}

        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
            <img
              src="/images/product-01.jpeg"
              alt="The Style Room Fashion"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
        ) : (
          <img
            src={product.image_url}
            alt={`${product.name} — Luxury Fashion at The Style Room`}
            loading="lazy"
            width={800}
            height={1067}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${hovered ? 'scale-108' : 'scale-100'}`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.is_new && (
            <span className="inline-flex items-center gap-1 bg-[#241135]/90 backdrop-blur-md text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md border border-white/20">
              <Sparkles size={10} className="text-[#deb6ff]" /> NEW
            </span>
          )}
          <span className="bg-white/85 backdrop-blur-md text-[#67349a] text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm">
            {product.category === 'dresses' ? 'SILK EDIT' : 'CAPSULE'}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md flex items-center justify-center text-charcoal-700 hover:text-rose-500 shadow-sm transition-all z-10 active:scale-90"
          aria-label="Wishlist"
        >
          <Heart
            size={15}
            className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'transition-colors'}
          />
        </button>

        {/* Quick View Hover Overlay Button */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center p-4 ${
            hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 hover:bg-white text-[#241135] text-xs font-semibold tracking-wider uppercase rounded-full shadow-xl hover:scale-105 transition-all"
          >
            <Eye size={13} /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="px-1 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a3db4]">
              {product.category === 'dresses' ? "Women's Couture" : 'Curated Atelier'}
            </span>
            <span className="text-[10px] text-charcoal-400 font-medium">In Stock</span>
          </div>

          <h3 className="font-serif text-base font-bold text-charcoal-900 group-hover:text-[#67349a] transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-serif text-lg font-bold text-[#67349a]">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-charcoal-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
              Save 25%
            </span>
          </div>

          {/* Available Sizes Chips */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <span className="text-[10px] text-charcoal-400 font-medium mr-0.5">Sizes:</span>
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="text-[10px] text-charcoal-600 font-semibold bg-cream-100 border border-cream-200 rounded-md px-1.5 py-0.5 hover:border-[#67349a] transition-colors"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          disabled={justAdded}
          className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-md'
              : 'bg-[#241135] text-white hover:bg-[#67349a] hover:shadow-md'
          }`}
        >
          {justAdded ? (
            <>
              <Check size={14} /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag size={13} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
