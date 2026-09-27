"use client";
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: 'How long does delivery take across India?',
    a: 'We ship via premium express couriers (Bluedart, Delhivery Air). Metro cities typically receive orders within 2 to 4 business days. Other regions take 3 to 5 business days.',
  },
  {
    q: 'Can I request bespoke sizing or custom alterations?',
    a: 'Yes! Our Indore atelier offers complimentary waist and length adjustments on selected dresses and outerwear. Contact our concierge via WhatsApp or phone before or right after placing your order.',
  },
  {
    q: 'What is your returns and exchange policy?',
    a: 'We offer an easy 30-day exchange and return window for all unworn garments with original tags and packaging intact. Reverse pickup is coordinated free of charge.',
  },
  {
    q: 'Are your silks authentic 100% pure mulberry silk?',
    a: 'Every silk garment from The Style Room is crafted exclusively from certified 100% pure mulberry silk (ranging from 19 to 22 momme) tested for hypoallergenic and breathability standards.',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-[#67349a] text-xs font-semibold tracking-[0.25em] uppercase bg-rose-50 px-4 py-1.5 rounded-full mb-3">
            Client Concierge
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900 mb-4 tracking-tight">
            We Would Love to Hear From You
          </h1>
          <p className="text-charcoal-600 text-sm md:text-base leading-relaxed">
            Have questions regarding sizing, curated styling recommendations, or your recent order? Our dedicated client care team in Indore is ready to assist.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Phone */}
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-cream-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#67349a] flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1">Direct Call & WhatsApp</h3>
                <a
                  href="tel:+917581857811"
                  className="text-sm font-semibold text-[#67349a] hover:underline"
                >
                  +91 75818 57811
                </a>
                <p className="text-xs text-charcoal-500 mt-1">Available Mon – Sat, 10:00 AM – 7:00 PM IST</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-cream-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#67349a] flex items-center justify-center shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1">Email Concierge</h3>
                <a
                  href="mailto:support@thestyleroom.com"
                  className="text-sm text-charcoal-700 hover:text-[#67349a] block font-medium"
                >
                  support@thestyleroom.com
                </a>
                <a
                  href="mailto:hello@thestyleroom.com"
                  className="text-xs text-charcoal-500 hover:text-[#67349a] block mt-0.5"
                >
                  hello@thestyleroom.com
                </a>
                <p className="text-xs text-charcoal-400 mt-1">We typically reply within 2–4 business hours</p>
              </div>
            </div>

            {/* Atelier Address */}
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-cream-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#67349a] flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1">Boutique Atelier</h3>
                <p className="text-sm text-charcoal-700 font-medium">The Style Room Flagship</p>
                <p className="text-xs text-charcoal-500">The Fashion Room, Indore, Madhya Pradesh 452016, India</p>
                <p className="text-xs text-charcoal-400 mt-1">Private styling consultations by appointment</p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-6 rounded-2xl bg-[#261238] text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2 text-[#deb6ff]">
                <Clock size={16} />
                <h4 className="text-xs font-semibold uppercase tracking-wider">Atelier Hours</h4>
              </div>
              <p className="text-sm font-medium">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
              <p className="text-xs text-white/70 mt-1">Sunday: Reserved for private bridal & festive appointments</p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-cream-200 shadow-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-900 mb-2">
              Send an Inquiry
            </h2>
            <p className="text-charcoal-500 text-xs sm:text-sm mb-6">
              Fill in your details below and our personal stylist will respond shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-[#67349a] focus:ring-2 focus:ring-[#67349a]/20 transition-all"
                    placeholder="e.g. Radhika Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-[#67349a] focus:ring-2 focus:ring-[#67349a]/20 transition-all"
                    placeholder="radhika@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-[#67349a] focus:ring-2 focus:ring-[#67349a]/20 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  How Can We Help? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-[#67349a] focus:ring-2 focus:ring-[#67349a]/20 transition-all resize-none"
                  placeholder="Inquire about sizing, custom tailoring, or order tracking..."
                />
              </div>

              <button
                type="submit"
                disabled={sent}
                className={`w-full py-4 rounded-full font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  sent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#241135] text-white hover:bg-[#67349a]'
                }`}
              >
                {sent ? (
                  <>
                    <Check size={18} /> Thank You! Inquiry Received
                  </>
                ) : (
                  <>
                    <Send size={15} /> Submit Message
                  </>
                )}
              </button>

              {sent && (
                <p className="text-center text-xs text-emerald-700 font-medium animate-fade-in">
                  Our atelier concierge will contact you within 2–4 hours.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-cream-200">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#67349a] uppercase tracking-wider font-semibold">
              <HelpCircle size={14} /> Frequently Asked Questions
            </span>
            <h3 className="font-serif text-3xl font-bold text-charcoal-900 mt-2">
              Common Inquiries
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-base md:text-lg font-semibold text-charcoal-900 hover:text-[#67349a] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} className="shrink-0 text-[#67349a]" /> : <ChevronDown size={18} className="shrink-0 text-charcoal-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-cream-100 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
