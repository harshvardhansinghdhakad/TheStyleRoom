"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  Heart,
  Share2,
  Truck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Check,
  MessageCircle,
  Star,
  Ruler,
  MapPin,
} from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import ProductCard from '@/components/ProductCard';

type ProductDetailViewProps = {
  product: Product;
  allProducts: Product[];
  onBack?: () => void;
  onSelectProduct?: (product: Product) => void;
};

export default function ProductDetailView({
  product,
  allProducts,
  onBack,
  onSelectProduct,
}: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Scroll to top whenever product changes
  useEffect(() => {
    setSelectedSize(product.sizes[0] || 'M');
    setActiveImageIndex(0);
    setAdded(false);
    setPincodeStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Gallery images (main image + complementary atelier perspective images)
  const galleryImages = [
    product.image_url,
    product.category === 'dresses' ? '/images/product-02.jpeg' : '/images/product-04.jpeg',
    '/images/product-06.jpeg',
    '/images/product-08.jpeg',
  ];

  // Suggestion / Similar products (same category or others, excluding current)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 4);

  const originalPrice = product.price + Math.round(product.price * 0.3);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 600);
  };

  // Generate WhatsApp customized booking message
  const handleWhatsAppBooking = () => {
    const phone = '917581857811';
    const message = `Hello The Style Room! 🌸\n\nI would like to order / book this item:\n\n• *Product:* ${product.name}\n• *Category:* ${product.category.toUpperCase()}\n• *Price:* ${formatPrice(product.price)}\n• *Selected Size:* ${selectedSize}\n• *Quantity:* ${quantity}\n• *Product SKU:* ${product.id}\n\nPlease confirm availability and payment details. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPincodeStatus('✓ Delivery available in 2–4 business days • Express Courier & Cash on Delivery Available');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian Pincode.');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator
          .share({
            title: `${product.name} | The Style Room`,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }
    }
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url,
    description: product.description || `Handcrafted ${product.name} from The Style Room Indore Atelier.`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'The Style Room',
    },
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : `https://the-style-room.vercel.app/product/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#fcfaf7] min-h-screen py-5 md:py-10 animate-fade-in pb-28 md:pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation & Share */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-cream-200">
            <nav className="flex items-center gap-2 text-xs text-charcoal-500 font-medium">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-[#67349a] hover:underline font-semibold"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <span>/</span>
              <Link href="/" className="hover:text-[#67349a]">Home</Link>
              <span>/</span>
              <Link href={product.category === 'dresses' ? '/category/dresses' : '/category/tops'} className="uppercase text-charcoal-500 hover:text-[#67349a]">
                {product.category === 'dresses' ? 'Dresses' : 'Tops & Capsules'}
              </Link>
              <span>/</span>
              <span className="text-charcoal-800 font-bold truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="inline-flex items-center gap-1.5 text-xs text-charcoal-600 hover:text-rose-500 transition-colors"
              >
                <Heart
                  size={16}
                  className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''}
                />
                <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-charcoal-600 hover:text-[#67349a] transition-colors"
              >
                <Share2 size={15} />
                <span className="hidden sm:inline">{copySuccess ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Main Product Section (2-Column E-Commerce Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 mb-20 items-start">
            
            {/* LEFT: Image Showcase Gallery */}
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
              
              {/* Thumbnails list */}
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 shrink-0">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 md:w-20 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-cream-100 ${
                      activeImageIndex === idx
                        ? 'border-[#67349a] shadow-md scale-102'
                        : 'border-cream-200/80 hover:border-cream-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`View angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Featured Image */}
              <div className="flex-1 relative aspect-[3/4] rounded-3xl overflow-hidden bg-cream-100 shadow-xl border border-cream-200/80 group">
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.is_new && (
                    <span className="inline-flex items-center gap-1.5 bg-[#241135]/90 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                      <Sparkles size={11} className="text-[#deb6ff]" /> NEW ATELIER ARRIVAL
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-md text-[#67349a] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm">
                    {product.category === 'dresses' ? 'SILK & SATIN EDIT' : 'CURATED CAPSULE'}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Product Details & Buying Actions */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              
              {/* Atelier Brand Kicker & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7a3db4]">
                  THE STYLE ROOM ATELIER
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  <span>4.9</span>
                  <span className="text-charcoal-400 font-normal">(128 Reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price Box */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 mb-6 shadow-sm">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-serif text-3xl font-extrabold text-[#67349a]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-charcoal-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-500">
                  Inclusive of all taxes • Free express shipping on this item
                </p>
              </div>

              {/* Description */}
              <p className="text-charcoal-600 text-sm leading-relaxed mb-6">
                {product.description ||
                  'Crafted with intentional precision in our atelier. Featuring fine artisan stitching, premium drape, and comfortable all-day luxury.'}
              </p>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold tracking-wider uppercase text-charcoal-800">
                    Select Size
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#67349a] hover:underline"
                  >
                    <Ruler size={13} /> Size Chart
                  </button>
                </div>

                {/* Size Buttons */}
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[50px] py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider transition-all border ${
                          isSelected
                            ? 'bg-[#241135] text-white border-[#241135] shadow-md scale-105'
                            : 'bg-white text-charcoal-800 border-cream-300 hover:border-[#67349a] hover:bg-cream-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Expandable Size Guide */}
                {showSizeGuide && (
                  <div className="mt-3 p-4 bg-white rounded-2xl border border-cream-200 text-xs text-charcoal-600 animate-slide-up shadow-sm">
                    <h4 className="font-bold text-charcoal-900 mb-2">Standard Atelier Sizing (Inches):</h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="p-1.5 bg-cream-50 rounded"><b>XS:</b> Bust 32, Waist 26</div>
                      <div className="p-1.5 bg-cream-50 rounded"><b>S:</b> Bust 34, Waist 28</div>
                      <div className="p-1.5 bg-cream-50 rounded"><b>M:</b> Bust 36, Waist 30</div>
                      <div className="p-1.5 bg-cream-50 rounded"><b>L:</b> Bust 38, Waist 32</div>
                    </div>
                    <p className="mt-2 text-[10px] text-charcoal-400">
                      Complimentary custom sizing adjustments are available upon request via WhatsApp.
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold tracking-wider uppercase text-charcoal-700">Quantity:</span>
                <div className="flex items-center border border-cream-300 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-charcoal-600 hover:bg-cream-100 font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold min-w-[28px] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-charcoal-600 hover:bg-cream-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS: Add to Bag & DIRECT WHATSAPP BOOKING */}
              <div className="space-y-3 mb-8">
                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`w-full py-4 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg active:scale-98 ${
                    added
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : 'bg-[#241135] text-white hover:bg-[#67349a] hover:shadow-xl'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add to Bag ({formatPrice(product.price * quantity)})
                    </>
                  )}
                </button>

                {/* DIRECT WHATSAPP BOOKING BUTTON */}
                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="w-full py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md hover:shadow-lg active:scale-98"
                  title="Direct WhatsApp Order with customized dress and size details"
                >
                  <MessageCircle size={19} className="fill-white" />
                  <span>Book Directly on WhatsApp</span>
                </button>

                <p className="text-center text-[11px] text-charcoal-500">
                  💬 Instant consultation & booking on WhatsApp: <b>+91 75818 57811</b>
                </p>
              </div>

              {/* Pincode Delivery Check */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 mb-6">
                <span className="block text-xs font-bold tracking-wider uppercase text-charcoal-800 mb-2">
                  Estimate Delivery & COD Check
                </span>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit Pincode"
                      className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs focus:outline-none focus:border-[#67349a]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#241135] text-white text-xs font-semibold rounded-xl hover:bg-[#67349a] transition-colors"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className={`mt-2 text-xs font-medium ${pincodeStatus.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {pincodeStatus}
                  </p>
                )}
              </div>

              {/* Atelier Guarantees */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-cream-200 text-charcoal-700 text-[11px]">
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-cream-200">
                  <Truck size={17} className="text-[#67349a] mb-1" />
                  <span className="font-bold">Free Express</span>
                  <span className="text-[10px] text-charcoal-400">All India</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-cream-200">
                  <RefreshCw size={17} className="text-[#67349a] mb-1" />
                  <span className="font-bold">30 Days</span>
                  <span className="text-[10px] text-charcoal-400">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-cream-200">
                  <ShieldCheck size={17} className="text-[#67349a] mb-1" />
                  <span className="font-bold">100% Luxury</span>
                  <span className="text-[10px] text-charcoal-400">Certified Silk</span>
                </div>
              </div>

            </div>
          </div>

          {/* SUGGESTIONS & RELATED PRODUCTS SECTION */}
          <div className="pt-12 border-t-2 border-cream-200/80">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.25em] uppercase text-[#67349a] bg-purple-50 px-4 py-1.5 rounded-full mb-2">
                <Sparkles size={13} /> CURATED RECOMMENDATIONS
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">
                You May Also Love
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-500">
                Handpicked coordinating pieces and bestselling atelier designs for your wardrobe.
              </p>
            </div>

            {/* Related Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onQuickView={onSelectProduct ? () => onSelectProduct(relProduct) : undefined}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* STICKY BOTTOM BAR FOR MOBILE PHONES */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-charcoal-500 uppercase tracking-wider">Price (Size {selectedSize})</span>
          <span className="font-serif text-lg font-bold text-[#67349a]">{formatPrice(product.price * quantity)}</span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-5 bg-[#241135] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95"
        >
          <ShoppingBag size={15} />
          <span>Add to Bag</span>
        </button>
      </div>
    </>
  );
}
