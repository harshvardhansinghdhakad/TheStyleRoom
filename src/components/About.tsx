"use client";
import { Sparkles, Truck, RefreshCw, ShieldCheck, HeartHandshake, Scissors, Award, ArrowRight } from 'lucide-react';

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
  { icon: Truck, title: 'Complimentary Shipping', desc: 'Fast delivery on all orders over ₹2,999' },
  { icon: RefreshCw, title: 'Hassle-Free 30-Day Returns', desc: 'Simple exchanges and full refunds' },
  { icon: ShieldCheck, title: '100% Certified Luxury', desc: 'Authentic craftsmanship guaranteed' },
];

export default function About({ onShopNow }: { onShopNow: () => void }) {
  return (
    <section id="about" className="py-16 md:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#67349a] text-xs font-semibold tracking-[0.3em] uppercase bg-rose-50 px-4 py-1.5 rounded-full mb-4">
            Our Story & Heritage
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-900 tracking-tight mb-6">
            Crafting Timeless Silhouettes for the Modern Woman
          </h1>
          <p className="text-charcoal-600 text-base md:text-lg leading-relaxed">
            Founded with a singular passion in Indore: to bridge traditional Indian textile mastery with contemporary minimalist luxury.
          </p>
        </div>

        {/* Story Section with Image */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.pexels.com/photos/8484131/pexels-photo-8484131.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="The Style Room Atelier and Boutique in Indore"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-xl p-6 max-w-[210px] border border-cream-200">
              <p className="font-serif text-4xl font-bold text-[#67349a] mb-1">15+</p>
              <p className="text-xs text-charcoal-600 font-medium">
                Years of elevating personal style across India
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 leading-snug">
              Every garment tells a story of intention, touch, and poise.
            </h2>
            <p className="text-charcoal-600 leading-relaxed text-sm md:text-base">
              At <strong className="text-charcoal-900 font-semibold">The Style Room</strong>, we reject the disposable cycle of ultra-fast fashion. We believe that true luxury is tactile — the whisper of pure mulberry silk against the skin, the crisp structure of organic combed cotton, and tailoring that honors every body contour.
            </p>
            <p className="text-charcoal-600 leading-relaxed text-sm md:text-base">
              From our flagship studio in Indore to closets across Mumbai, Delhi, Bengaluru, and beyond, each piece in our collection is created in mindful, limited editions to guarantee exceptional finish and enduring quality.
            </p>

            <div className="pt-4">
              <blockquote className="border-l-2 border-[#67349a] pl-4 italic text-charcoal-700 text-sm">
                “When you dress with intention, confidence follows naturally. That is the soul of The Style Room.”
              </blockquote>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mt-2">
                — The Atelier Creative Collective
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-2 bg-[#67349a] hover:bg-[#54297f] text-white px-7 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md"
              >
                <span>Explore The Collection</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="font-serif text-3xl font-bold text-charcoal-900 mb-2">Our Atelier Standards</h3>
            <p className="text-charcoal-500 text-xs sm:text-sm">The uncompromising values woven into every seam.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white p-7 rounded-2xl border border-cream-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#67349a] flex items-center justify-center mb-5">
                  <pillar.icon size={22} />
                </div>
                <h4 className="font-serif text-lg font-bold text-charcoal-900 mb-2">{pillar.title}</h4>
                <p className="text-xs text-charcoal-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Client Guarantees Strip */}
        <div className="bg-[#261238] text-white rounded-3xl p-8 md:p-12 shadow-xl grid md:grid-cols-3 gap-8 text-center md:text-left">
          {guarantees.map((item) => (
            <div key={item.title} className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#deb6ff] shrink-0">
                <item.icon size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-white/70">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
