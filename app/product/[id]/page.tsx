import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getAllProducts, getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/supabase';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found | The Style Room',
    };
  }

  const title = `${product.name} | The Style Room Atelier`;
  const description =
    product.description ||
    `Handcrafted ${product.name} in pure artisanal fabrics, designed in our Indore atelier. Available in sizes ${product.sizes.join(', ')} for ${formatPrice(product.price)}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://the-style-room.vercel.app/product/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://the-style-room.vercel.app/product/${product.id}`,
      type: 'website',
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 1067,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image_url],
    },
  };
}

export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = getAllProducts();

  return (
    <ProductDetailView
      product={product}
      allProducts={allProducts}
    />
  );
}
