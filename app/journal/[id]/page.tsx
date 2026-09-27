import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllArticles, getArticleById } from '@/lib/articles';
import { ArrowLeft, Calendar, Clock, User, Share2, Sparkles, ArrowRight } from 'lucide-react';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    return { title: 'Article Not Found | The Style Room' };
  }

  return {
    title: `${article.title} | The Style Room Journal`,
    description: article.metaDescription,
    alternates: {
      canonical: `https://the-style-room.vercel.app/journal/${article.id}`,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `https://the-style-room.vercel.app/journal/${article.id}`,
      type: 'article',
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ id: a.id }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: `https://the-style-room.vercel.app${article.image}`,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Style Room',
      logo: {
        '@type': 'ImageObject',
        url: 'https://the-style-room.vercel.app/images/hero_model.jpg',
      },
    },
    datePublished: '2026-02-01',
    description: article.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="bg-[#fcfaf7] min-h-screen py-6 md:py-14 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-8 pb-4 border-b border-cream-200">
            <Link href="/" className="hover:text-[#67349a]">Home</Link>
            <span>/</span>
            <Link href="/journal" className="inline-flex items-center gap-1 text-[#67349a] font-semibold hover:underline">
              The Style Journal
            </Link>
            <span>/</span>
            <span className="font-bold text-charcoal-800 truncate max-w-xs">{article.title}</span>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <span className="inline-block text-[#67349a] text-xs font-bold tracking-[0.25em] uppercase bg-purple-50 px-3.5 py-1.5 rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 leading-tight mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-cream-200 text-xs text-charcoal-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-charcoal-800">
                  <User size={14} className="text-[#67349a]" />
                  {article.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {article.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {article.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Featured Image */}
          <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-3xl bg-cream-100 shadow-xl mb-10 border border-cream-200">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Excerpt Callout */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-l-4 border-[#67349a] shadow-sm mb-10">
            <p className="font-serif text-lg sm:text-xl text-charcoal-800 italic leading-relaxed">
              &ldquo;{article.excerpt}&rdquo;
            </p>
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-6 text-charcoal-700 text-base sm:text-lg leading-relaxed font-sans pb-12 border-b border-cream-200">
            {article.content.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Shop the Story Box */}
          <div className="my-12 p-8 sm:p-10 rounded-3xl bg-[#241135] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#deb6ff] mb-1">
                <Sparkles size={12} /> SHOP THE EDITORIAL
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                Elevate Your Wardrobe With Mulberry Silks
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-lg">
                Explore handcrafted dresses and tailoring featured in this guide, with complimentary express delivery across India.
              </p>
            </div>
            <Link
              href="/shop"
              className="px-7 py-3.5 bg-white text-[#241135] hover:bg-[#deb6ff] rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-lg inline-flex items-center gap-1.5"
            >
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Back link */}
          <div className="pt-4">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#67349a] hover:underline"
            >
              <ArrowLeft size={14} /> Back to All Articles
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
