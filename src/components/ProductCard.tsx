"use client";
import { useState } from 'react';
import type { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/supabase';
import { useCart } from '@/lib/cart';

type ProductCardProps = {
  product: Product;
  onQuickView: (product: Product) => void;
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onQuickView(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-100 mb-4 shadow-sm">
        {!imageLoaded && !imageError && <div className="absolute inset-0 animate-pulse bg-cream-200" />}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
            <img src="/images/product-01.jpeg" alt="Image unavailable" className="w-full h-full object-cover opacity-40" />
          </div>
        ) : (
          <img
            src={product.image_url}
            alt={`${product.name} — ${product.category} at The Style Room`}
            loading="lazy"
            width={1200}
            height={1200}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${hovered ? 'scale-110' : 'scale-100'}`}
          />
        )}
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
            New
          </span>
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-charcoal-900/50 via-transparent to-transparent transition-all duration-300 flex items-end justify-center pb-6 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className={`px-6 py-2.5 bg-white text-charcoal-900 text-xs font-semibold tracking-wide uppercase rounded-full shadow-lg transition-all duration-300 ${
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="text-center px-1">
        <h3 className="font-serif text-lg font-medium text-charcoal-800 mb-1">{product.name}</h3>
        <p className="text-charcoal-400 text-xs uppercase tracking-wider mb-2">{product.category}</p>
        <p className="font-serif text-lg font-semibold text-rose-600">{formatPrice(product.price)}</p>
        <div className="flex justify-center gap-1.5 mt-2.5">
          {product.sizes.slice(0, 5).map((size) => (
            <span key={size} className="text-[11px] text-charcoal-400 font-medium border border-cream-200 rounded px-1.5 py-0.5">
              {size}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addItem(product, product.sizes[0]);
          }}
          className="mt-4 w-full py-3 bg-charcoal-900 text-white text-xs font-semibold tracking-wide uppercase rounded-full hover:bg-rose-500 transition-all duration-300 shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
