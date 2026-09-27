import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Truck,
  RefreshCw,
  ShieldCheck,
  HeartHandshake,
  Scissors,
  Award,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Heritage & Story — Luxury Atelier | The Style Room',
  description:
    'Learn about the heritage of The Style Room, our Indore atelier, 15+ years of master tailoring, ethical sourcing of 22-momme pure mulberry silks, and commitment to quiet luxury.',
  alternates: {
    canonical: 'https://the-style-room.vercel.app/about',
  },
  openGraph: {
    title: 'Our Heritage & Story — The Style Room Atelier',
    description:
      'Discover 15+ years of artisanal craftsmanship in Indore. Ethically sourced mulberry silks, master drapery, and timeless women’s luxury.',
    url: 'https://the-style-room.vercel.app/about',
    images: ['https://images.pexels.com/photos/8484131/pexels-photo-8484131.jpeg'],
  },
};

const pillars = [
  {
    icon: Sparkles,
    title: 'Artisanal Fabrics',
    desc: 'Pure 22-momme mulberry silks, breathable organic cotton poplin, and natural linens sourced ethically.',
  },
  {
    icon: Scissors,
    title: 'Master Atelier Cut',
    desc: 'Each pattern is drafted by master tailors in our Indore studio for flattering drape and effortless comfort.',
  },
  {
    icon: HeartHandshake,
    title: 'Fair & Conscious',
    desc: 'Zero-compromise ethical working conditions, fair artisan wages, and mindful small-batch production.',
  },
  {
    icon: Award,
    title: '15+ Years Legacy',
    desc: 'Over a decade and a half curating timeless fashion for discerning women across India.',
  },
];

const guarantees = [
  { icon: Truck, title: 'Complimentary Shipping', desc: 'Fast express delivery on all orders over ₹2,999' },
  { icon: RefreshCw, title: 'Hassle-Free 30-Day Returns', desc: 'Simple exchanges and doorstep reverse pickup' },
  { icon: ShieldCheck, title: '100% Certified Luxury', desc: 'Authentic 22-momme mulberry silk craftsmanship' },
];

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About The Style Room Atelier',
    description:
      'The Style Room is an independent women’s luxury boutique and atelier in Indore, known for pure mulberry silks, tailored silhouettes, and conscious fashion.',
    publisher: {
      '@type': 'Organization',
      name: 'The Style Room',
      url: 'https://the-style-room.vercel.app',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <section className="py-12 md:py-20 bg-cream-50/60 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-[#67349a] text-xs font-bold tracking-[0.3em] uppercase bg-purple-50 px-4 py-1.5 rounded-full mb-3">
              Our Story & Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-900 tracking-tight mb-4 sm:mb-6">
              Crafting Timeless Silhouettes for the Modern Woman
            </h1>
            <p className="text-charcoal-600 text-sm sm:text-base md:text-lg leading-relaxed">
              Founded with a singular passion in Indore: to bridge traditional Indian textile mastery with contemporary minimalist luxury.
            </p>
          </div>

          {/* Story Section with Atelier Photography */}
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 sm:mb-24">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl border border-cream-200">
                <img
                  src="https://images.pexels.com/photos/8484131/pexels-photo-8484131.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="The Style Room Atelier and Boutique in Indore"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5 border border-cream-200 max-w-[220px]">
                <p className="font-serif text-3xl font-bold text-[#67349a]">15+ Years</p>
                <p className="text-xs text-charcoal-600 font-medium">Of dedicated haute atelier craftsmanship in Indore</p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[#67349a] text-xs font-bold tracking-widest uppercase">The Philosophy</span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 leading-tight">
                Quiet Luxury, Intentional Design & Pure Fabrics
              </h2>
              <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
                In a world obsessed with fast trends, The Style Room was born out of an appreciation for enduring beauty. We believe that true luxury lies in how a garment makes you feel against your skin — the breathability of pure linen, the unmistakable hand of 22-momme mulberry silk, and the confidence of an impeccably tailored cut.
              </p>
              <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
                Every silhouette is designed, draped, and perfected in our Indore atelier. We reject mass factory production in favor of mindful micro-batches, ensuring that every seam, pleat, and hem receives master artisan care.
              </p>

              <div className="pt-2 space-y-2.5">
                {[
                  '100% Certified Pure Mulberry Silks & Organic Cottons',
                  'Fair-wage atelier craftsmanship and zero child labor',
                  'Complimentary bespoke sizing adjustments on request',
                  'Personalized client concierge based in Indore',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-charcoal-700">
                    <CheckCircle size={16} className="text-[#67349a] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#241135] hover:bg-[#67349a] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
                >
                  <span>Explore The Collection</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="mb-20 sm:mb-24" id="craftsmanship">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-[0.25em] text-[#67349a] uppercase">Our Commitments</span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 mt-2">
                The Pillars of The Style Room
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#67349a] flex items-center justify-center mb-4">
                      <Icon size={22} />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-charcoal-900 mb-2">{pillar.title}</h4>
                    <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guarantees Strip */}
          <div className="bg-[#241135] text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              {guarantees.map((g, idx) => {
                const Icon = g.icon;
                return (
                  <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#deb6ff] flex items-center justify-center shrink-0">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h5 className="font-serif text-lg font-bold text-white mb-1">{g.title}</h5>
                      <p className="text-xs text-white/70">{g.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center py-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mb-4">
              Experience Handcrafted Elegance Today
            </h3>
            <p className="text-charcoal-600 text-sm max-w-lg mx-auto mb-6">
              Browse our latest mulberry silk dresses, linen shirts, and evening capsules with free express delivery.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#67349a] hover:bg-[#54297f] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all"
              >
                Browse Shop
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-white border border-cream-300 hover:border-[#67349a] text-charcoal-800 font-bold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all"
              >
                Visit Indore Atelier
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
