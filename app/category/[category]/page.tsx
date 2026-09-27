import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, getProductsByCategory, type CategorySlug } from '@/lib/products';
import { Sparkles, ArrowLeft } from 'lucide-react';

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORIES[category as CategorySlug];

  if (!info) {
    return {
      title: 'Category Not Found | The Style Room',
    };
  }

  return {
    title: info.metaTitle,
    description: info.metaDescription,
    alternates: {
      canonical: `https://the-style-room.vercel.app/category/${category}`,
    },
    openGraph: {
      title: info.metaTitle,
      description: info.metaDescription,
      url: `https://the-style-room.vercel.app/category/${category}`,
      images: [
        {
          url: category === 'dresses' ? '/images/product-02.jpeg' : '/images/product-04.jpeg',
          width: 800,
          height: 1067,
          alt: info.name,
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return [{ category: 'dresses' }, { category: 'tops' }, { category: 'new' }];
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = CATEGORIES[category as CategorySlug];

  if (!categoryInfo) {
    notFound();
  }

  const products = getProductsByCategory(category);

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://the-style-room.vercel.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryInfo.name,
        item: `https://the-style-room.vercel.app/category/${category}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#fcfaf7] min-h-screen py-6 md:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-6 pb-4 border-b border-cream-200">
            <Link href="/" className="inline-flex items-center gap-1 text-[#67349a] font-semibold hover:underline">
              <ArrowLeft size={13} /> Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#67349a]">Collections</Link>
            <span>/</span>
            <span className="font-bold text-charcoal-800">{categoryInfo.name}</span>
          </div>

          {/* Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#67349a] bg-purple-50 px-4 py-1.5 rounded-full mb-3">
              <Sparkles size={13} />
              {categoryInfo.headline}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight mb-3">
              {categoryInfo.name}
            </h1>
            <p className="text-charcoal-500 text-xs sm:text-sm md:text-base leading-relaxed">
              {categoryInfo.description}
            </p>

            {/* Quick sibling links */}
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              <Link
                href="/category/dresses"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  category === 'dresses'
                    ? 'bg-[#241135] text-white shadow-sm'
                    : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                }`}
              >
                Women&apos;s Couture
              </Link>
              <Link
                href="/category/tops"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  category === 'tops'
                    ? 'bg-[#241135] text-white shadow-sm'
                    : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                }`}
              >
                Curated Tops
              </Link>
              <Link
                href="/category/new"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  category === 'new'
                    ? 'bg-[#241135] text-white shadow-sm'
                    : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                }`}
              >
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
