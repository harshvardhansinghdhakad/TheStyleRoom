import type { Metadata, Viewport } from 'next';
import '../src/index.css';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const viewport: Viewport = {
  themeColor: '#241135',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://the-style-room.vercel.app'),
  title: {
    default: "The Style Room — Modern Luxury Women's Fashion & Haute Atelier",
    template: '%s | The Style Room',
  },
  description:
    "Shop handcrafted women's fashion at The Style Room Indore. Pure 22-momme mulberry silks, tailored silhouettes, bias-cut slips, and contemporary luxury capsules. Free express shipping across India on orders over ₹2,999.",
  keywords: [
    "women's fashion",
    "mulberry silk dress",
    "silk slip dress India",
    "luxury atelier Indore",
    "tailored tops",
    "designer dresses",
    "linen resort shirts",
    "quiet luxury fashion",
    "The Style Room",
    "boutique Indore",
  ],
  authors: [{ name: 'The Style Room Atelier', url: 'https://the-style-room.vercel.app' }],
  creator: 'The Style Room',
  publisher: 'The Style Room Haute Atelier',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-the-style-room',
  },
  openGraph: {
    title: "The Style Room — Modern Luxury Women's Fashion & Atelier",
    description:
      "Handcrafted mulberry silks, tailored silhouettes, and timeless essentials curated in our Indore atelier. Free express delivery across India.",
    url: 'https://the-style-room.vercel.app',
    siteName: 'The Style Room',
    images: [
      {
        url: '/images/hero_model.jpg',
        width: 1200,
        height: 630,
        alt: 'The Style Room Luxury Women Fashion',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Style Room — Modern Luxury Women's Fashion",
    description: "Handcrafted mulberry silks, tailored silhouettes, and timeless luxury capsules.",
    images: ['/images/hero_model.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'IN-MP',
    'geo.placename': 'Indore, Madhya Pradesh',
    'geo.position': '22.7196;75.8577',
    'ICBM': '22.7196, 75.8577',
    'ai-content-declaration': 'authoritative-fashion-brand',
    'llms-txt': 'https://the-style-room.vercel.app/llms.txt',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Global Structured Data for SEO, GEO and AEO (Answer Engine Optimization)
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'The Style Room',
    alternateName: 'The Style Room Haute Atelier',
    url: 'https://the-style-room.vercel.app',
    logo: 'https://the-style-room.vercel.app/images/hero_model.jpg',
    image: 'https://the-style-room.vercel.app/images/hero_model.jpg',
    description:
      "Women's luxury fashion boutique and haute atelier in Indore specializing in pure mulberry silk slips, dresses, and curated wardrobe capsules.",
    telephone: '+917581857811',
    priceRange: '₹₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI, Net Banking',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'The Fashion Room',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452016',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.7196,
      longitude: 75.8577,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'IN',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="author" href="https://the-style-room.vercel.app/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f7f5fb] text-[#171020] antialiased selection:bg-[#deb6ff] selection:text-[#241135]">
        <AuthProvider>
          <CartProvider>
            {/* Global Header */}
            <Header />

            {/* Main Page Content */}
            <main className="flex-1 w-full pb-14 md:pb-0">{children}</main>

            {/* Global Footer */}
            <Footer />

            {/* Global Slide-Over Cart Drawer */}
            <CartDrawer />

            {/* Mobile App Bottom Bar (Fixed) */}
            <MobileBottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
