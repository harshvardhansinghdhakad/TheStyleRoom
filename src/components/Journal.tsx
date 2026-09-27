"use client";
import { useState } from 'react';
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles, Share2 } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  author: string;
  content: string[];
};

const articles: Article[] = [
  {
    id: 'fluid-tailoring-2026',
    title: 'The 2026 Trend Forecast: The Return of Fluid Tailoring & Pure Mulberry Silk',
    category: 'Trend Report',
    readTime: '5 min read',
    date: 'February 24, 2026',
    author: 'Aria Sharma • Atelier Stylist',
    image: '/images/category_jacket.jpg',
    excerpt:
      'Fashion is moving away from restrictive silhouettes towards effortless, fluid draping that moves with your body from morning meetings to evening galas.',
    content: [
      'In our Spring/Summer 2026 atelier preview, the predominant theme is liberating sophistication. Modern women no longer need to compromise between structural presence and tactile comfort.',
      'Our designers worked directly with artisan silk weavers to introduce 22-momme pure mulberry silk that resists creasing while creating a natural, subtle sheen that catches ambient light effortlessly.',
      'Pair a fluid, unlined blazer with our signature bias-cut silk slip dress for an understated monochromatic aesthetic that commands attention without uttering a word.',
    ],
  },
  {
    id: 'capsule-wardrobe-essentials',
    title: 'The 8-Piece Capsule Wardrobe: Mastering Everyday Minimalism',
    category: 'Style Guide',
    readTime: '4 min read',
    date: 'February 18, 2026',
    author: 'Priya Mehra • Creative Director',
    image: '/images/product-04.jpeg',
    excerpt:
      'How to streamline your morning routine with 8 versatile foundational pieces that seamlessly combine into over 24 distinct, high-impact outfits.',
    content: [
      'A curated wardrobe is not about having fewer options; it is about having better options. When every garment in your closet has intentional proportions, getting dressed becomes an act of effortless luxury.',
      'The foundation starts with our Supima Cotton Top and the Relaxed Linen Resort Shirt. Add two statement dresses — one structured day dress and one evening silk slip — followed by versatile tailored trousers and an unconstructed lightweight jacket.',
      'Investing in higher-grade organic textiles guarantees longevity: garments that look richer after every wash rather than fading into fast-fashion obsolescence.',
    ],
  },
  {
    id: 'silk-care-masterclass',
    title: 'The Atelier Guide: Caring for Pure Mulberry Silk & Fine Linen',
    category: 'Care & Longevity',
    readTime: '3 min read',
    date: 'January 29, 2026',
    author: 'Devika Ray • Textile Conservator',
    image: '/images/product-02.jpeg',
    excerpt:
      'Sustainable luxury starts with proper garment care. Discover the artisanal methods to maintain the lustrous hand-feel of your silks for decades.',
    content: [
      'True luxury garments are heirloom investments. Mulberry silk contains natural protein fibers (fibroin) that react best to pH-neutral cleansing agents and cool temperature baths.',
      'Never wring or twist natural silk. Instead, roll your garment gently inside a clean Turkish cotton towel to absorb moisture before laying flat on a drying rack away from direct sunlight.',
      'For travel, use a garment steamer on low setting held 6 inches away to let the fibers naturally relax, preserving the garment’s bespoke drape and breathability.',
    ],
  },
];

export default function Journal({ onShopNow }: { onShopNow: () => void }) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <section className="py-16 md:py-24 bg-cream-50" id="journal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#67349a]/10 text-[#67349a] text-xs font-semibold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-4">
            <BookOpen size={14} />
            <span>The Style Journal</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900 mb-4 tracking-tight">
            Stories, Style Notes & Atelier Insights
          </h1>
          <p className="text-charcoal-600 text-sm md:text-base leading-relaxed">
            Curated editorial reflections from our atelier stylists in Indore — exploring seasonal silhouettes, fabric craftsmanship, and the art of intentional dressing.
          </p>
        </div>

        {/* Featured Main Article */}
        <div className="mb-16 bg-white rounded-3xl overflow-hidden shadow-xl border border-cream-200/80 grid md:grid-cols-2 group">
          <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src={articles[0].image}
              alt={articles[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-4 left-4 bg-[#67349a] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
              {articles[0].category}
            </span>
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 text-xs text-charcoal-400 mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> {articles[0].date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {articles[0].readTime}
                </span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-900 mb-4 group-hover:text-[#67349a] transition-colors leading-snug">
                {articles[0].title}
              </h2>
              <p className="text-charcoal-600 text-sm leading-relaxed mb-6">
                {articles[0].excerpt}
              </p>
              <p className="text-xs text-charcoal-400 font-medium">By {articles[0].author}</p>
            </div>
            <div className="pt-6 border-t border-cream-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(articles[0])}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#67349a] hover:text-[#54297f] tracking-wider uppercase"
              >
                Read Article <ArrowRight size={14} />
              </button>
              <button onClick={onShopNow} className="text-xs text-charcoal-500 hover:text-charcoal-900 underline">
                Shop The Edit →
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Articles Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {articles.slice(1).map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-cream-200/80 flex flex-col transition-all duration-300 group"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-[#241135] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-charcoal-400 mb-2.5">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-3 group-hover:text-[#67349a] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-charcoal-600 text-xs md:text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-400">By {article.author}</span>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#67349a] hover:text-[#54297f]"
                  >
                    Read Story <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Journal Subscription Banner */}
        <div className="bg-[#2a133d] text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#deb6ff] uppercase tracking-widest font-semibold mb-2">
              <Sparkles size={14} /> The Atelier Newsletter
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2">
              Receive Our Bi-Weekly Style Dispatch
            </h3>
            <p className="text-white/80 text-xs sm:text-sm">
              Exclusive trend forecasts, private sale previews, and garment care guides delivered straight to your inbox.
            </p>
          </div>
          <button
            onClick={onShopNow}
            className="bg-white text-[#241135] hover:bg-rose-50 px-7 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase shadow-md transition-colors shrink-0"
          >
            Explore All Collections
          </button>
        </div>

        {/* Article Reading Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 shadow-2xl relative animate-scale-in">
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-600 flex items-center justify-center text-sm font-bold transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
              <span className="text-[10px] font-bold text-[#67349a] uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
                {selectedArticle.category}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-900 mt-3 mb-3">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-charcoal-400 mb-6">
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
                <span>•</span>
                <span>By {selectedArticle.author}</span>
              </div>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4 text-charcoal-700 text-sm md:text-base leading-relaxed">
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-cream-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-900"
                >
                  ← Back to Journal
                </button>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    onShopNow();
                  }}
                  className="bg-[#67349a] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#54297f] transition-colors"
                >
                  Shop Featured Looks
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
