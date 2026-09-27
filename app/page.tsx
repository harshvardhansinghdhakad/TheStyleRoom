import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import FashionShowcase from '@/components/FashionShowcase';
import { getAllProducts } from '@/lib/products';
import { getAllArticles } from '@/lib/articles';
import { Sparkles, ArrowRight, BookOpen, Scissors, Award, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const allProducts = getAllProducts();
  const featuredProducts = allProducts.slice(0, 8);
  const articles = getAllArticles().slice(0, 2);

  // Structured Data (JSON-LD) for Google Organization & WebSite
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'The Style Room',
    url: 'https://the-style-room.vercel.app',
    logo: 'https://the-style-room.vercel.app/images/hero_model.jpg',
    description: "Women's luxury fashion boutique and haute atelier in Indore specializing in pure mulberry silk slips, dresses, and curated wardrobe capsules.",
    telephone: '+917581857811',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'The Fashion Room',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452016',
      addressCountry: 'IN',
    },
    priceRange: '₹₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Main Luxury Hero Poster */}
      <Hero />

      {/* Curated Collection Section */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 md:py-16 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#67349a] bg-purple-50 px-3.5 py-1.5 rounded-full mb-2">
              <Sparkles size={12} />
              THE ATELIER EDIT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 tracking-tight">
              Curated Silhouettes
            </h2>
            <p className="text-charcoal-500 text-xs sm:text-sm mt-1 max-w-xl">
              Handcrafted in 22-momme pure mulberry silk and crisp organic poplin. Each piece designed for effortless drape.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#67349a] hover:text-[#4f2379] uppercase tracking-wider transition-colors shrink-0"
          >
            <span>View All Pieces</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* 4-Column Responsive Grid (2-col mobile, 4-col desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Fashion Showcase Categories & Banners */}
      <FashionShowcase />

      {/* Atelier Story / Heritage Teaser */}
      <section className="py-12 md:py-20 bg-cream-50/70 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-3xl shadow-xl border border-cream-200">
                <img
                  src="https://images.pexels.com/photos/8484131/pexels-photo-8484131.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="The Style Room Atelier and Boutique in Indore"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-5 border border-cream-200 max-w-[200px] sm:max-w-[220px]">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#67349a] mb-0.5">15+ Years</p>
                <p className="text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider">
                  Couture Heritage in Indore
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <span className="inline-block text-[#67349a] text-xs font-bold tracking-[0.28em] uppercase bg-purple-50 px-3.5 py-1.5 rounded-full mb-3">
                OUR ATELIER HERITAGE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mb-4 leading-tight">
                Crafting Timeless Silhouettes for the Discerning Woman
              </h2>
              <p className="text-charcoal-600 text-xs sm:text-sm leading-relaxed mb-6">
                Rooted in central India’s rich textile traditions, The Style Room bridges artisanal precision with fluid contemporary luxury. Every pattern is drafted by master tailors to ensure unmatched fit and all-day comfort.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-3 bg-white rounded-2xl border border-cream-200 shadow-sm">
                  <Scissors size={18} className="text-[#67349a] mb-1.5" />
                  <h4 className="font-bold text-xs text-charcoal-900 mb-0.5">Master Cut</h4>
                  <p className="text-[10px] text-charcoal-500">Drafted for movement and silhouette drape.</p>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-cream-200 shadow-sm">
                  <Award size={18} className="text-[#67349a] mb-1.5" />
                  <h4 className="font-bold text-xs text-charcoal-900 mb-0.5">22-Momme Silk</h4>
                  <p className="text-[10px] text-charcoal-500">Pure certified mulberry silk fibers.</p>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-cream-200 shadow-sm">
                  <HeartHandshake size={18} className="text-[#67349a] mb-1.5" />
                  <h4 className="font-bold text-xs text-charcoal-900 mb-0.5">Ethical Craft</h4>
                  <p className="text-[10px] text-charcoal-500">Conscious small-batch atelier studio.</p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#241135] hover:bg-[#67349a] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Style Journal Teaser Section */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#67349a] bg-purple-50 px-3.5 py-1.5 rounded-full mb-2">
              <BookOpen size={12} />
              THE STYLE JOURNAL
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900">
              Editorial & Style Notes
            </h2>
          </div>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#67349a] hover:underline uppercase tracking-wider"
          >
            <span>Read Journal</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/journal/${article.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[16/9] overflow-hidden bg-cream-100 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-[#241135]/90 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {article.category}
                </span>
              </div>
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-charcoal-400 mb-2">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900 group-hover:text-[#67349a] transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="text-charcoal-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#67349a] uppercase tracking-wider">
                  Read Full Article <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
