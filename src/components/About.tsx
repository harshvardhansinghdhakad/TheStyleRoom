import { Sparkles, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders over ₹5,000' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: 'Your data is protected' },
  { icon: Sparkles, title: 'Quality Craft', desc: 'Curated with care' },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.pexels.com/photos/8484131/pexels-photo-8484131.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="The Style Room boutique interior with curated women's fashion collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block bg-white rounded-2xl shadow-xl p-6 max-w-[200px]">
              <p className="font-serif text-4xl font-bold text-rose-600 mb-1">15+</p>
              <p className="text-sm text-charcoal-500">Years of curating timeless fashion</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-rose-600 text-sm font-semibold tracking-[0.2em] uppercase mb-4">About Us</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal-900 mb-6 text-balance">
              Fashion that celebrates every woman
            </h2>
            <p className="text-charcoal-600 leading-relaxed mb-6">
              At The Style Room, we believe that great style should feel effortless. Our collections are thoughtfully
              designed to blend timeless elegance with modern trends, offering pieces that transition seamlessly
              from day to night.
            </p>
            <p className="text-charcoal-600 leading-relaxed mb-10">
              Every garment is selected with quality, comfort, and sustainability in mind — because you deserve
              clothing that looks beautiful and feels right.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center">
                    <feature.icon size={20} className="text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-800 text-sm">{feature.title}</h3>
                    <p className="text-xs text-charcoal-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
