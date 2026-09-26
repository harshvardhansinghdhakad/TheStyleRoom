"use client";
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import { X, Check, ShoppingBag } from 'lucide-react';

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] ?? '');
      setAdded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  const handleAdd = () => {
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-cream-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 rounded-full hover:bg-white shadow-md transition-all hover:scale-110"
          aria-label="Close"
        >
          <X size={20} className="text-charcoal-700" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-[3/4] md:aspect-auto md:h-full overflow-hidden bg-cream-100">
            <img
              src={imageError ? '/images/product-01.jpeg' : product.image_url}
              alt={`${product.name} — ${product.category} at The Style Room`}
              width={1200}
              height={1200}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            {product.is_new && (
              <span className="inline-block self-start bg-rose-50 text-rose-600 text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
                New Arrival
              </span>
            )}
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-900 mb-2">{product.name}</h2>
            <p className="text-charcoal-400 text-sm uppercase tracking-wider capitalize mb-4">{product.category}</p>
            <p className="font-serif text-3xl font-semibold text-rose-600 mb-6">{formatPrice(product.price)}</p>
            <p className="text-charcoal-600 leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8">
              <p className="text-sm font-medium text-charcoal-700 mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-charcoal-900 bg-charcoal-900 text-white shadow-md'
                        : 'border-cream-200 text-charcoal-700 hover:border-charcoal-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={added}
              className={`w-full py-4 rounded-full font-semibold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-charcoal-900 text-white hover:bg-rose-500 shadow-lg'
              }`}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
