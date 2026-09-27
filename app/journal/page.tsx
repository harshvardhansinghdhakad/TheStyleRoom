import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Style Journal — Fashion Editorial & Style Guides | The Style Room',
  description:
    'Read fashion forecasts, mulberry silk care masterclasses, and capsule wardrobe guides by The Style Room atelier stylists.',
  alternates: {
    canonical: 'https://the-style-room.vercel.app/journal',
  },
  openGraph: {
    title: 'The Style Journal — The Style Room Haute Atelier',
    description: 'Style notes, trend forecasts, and garment care masterclasses by resident stylists.',
    url: 'https://the-style-room.vercel.app/journal',
  },
};

export default function JournalPage() {
  const articles = getAllArticles();
  const featured = articles[0];
  const others = articles.slice(1);

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-8 md:py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-[#67349a] text-xs font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-3">
            <BookOpen size={14} />
            <span>The Style Journal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight mb-3">
            Stories, Style Notes & Atelier Insights
          </h1>
          <p className="text-charcoal-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Curated editorial reflections from our stylists in Indore — exploring seasonal silhouettes, fabric craftsmanship, and the art of intentional dressing.
          </p>
        </div>

        {/* Featured Main Article Banner */}
        {featured && (
          <Link
            href={`/journal/${featured.id}`}
            className="group mb-12 sm:mb-16 bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-cream-200/80 grid md:grid-cols-2 block"
          >
            <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-cream-100 min-h-[260px] md:min-h-[380px]">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 bg-[#67349a] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                {featured.category}
              </span>
            </div>
            <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-charcoal-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {featured.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> {featured.readTime}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mb-3 group-hover:text-[#67349a] transition-colors leading-snug">
                  {featured.title}
                </h2>
                <p className="text-charcoal-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {featured.excerpt}
                </p>
                <p className="text-xs text-charcoal-400 font-medium">By {featured.author}</p>
              </div>
              <div className="pt-6 border-t border-cream-200 flex items-center justify-between">
                <span className="text-xs font-bold text-[#67349a] uppercase tracking-wider inline-flex items-center gap-1.5">
                  Read Full Editorial <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Other Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {others.map((article) => (
            <Link
              key={article.id}
              href={`/journal/${article.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-cream-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[16/10] overflow-hidden bg-cream-100 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-[#241135]/90 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {article.category}
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2.5 text-[11px] text-charcoal-400 mb-2">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 group-hover:text-[#67349a] transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="text-charcoal-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-400 font-medium">By {article.author}</span>
                  <span className="text-xs font-bold text-[#67349a] uppercase tracking-wider inline-flex items-center gap-1">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
