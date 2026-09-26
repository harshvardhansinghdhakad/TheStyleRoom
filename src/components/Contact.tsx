"use client";
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-rose-600 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Get in Touch</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal-900 mb-4 text-balance">
            We'd love to hear from you
          </h2>
          <p className="text-charcoal-500 max-w-xl mx-auto">
            Questions about sizing, orders, or styling? Our team is here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-100 transition-all hover:shadow-md">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                <Mail size={20} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-800 mb-1">Email Us</h3>
                <p className="text-charcoal-500 text-sm">hello@thestyleroom.com</p>
                <p className="text-charcoal-500 text-sm">support@thestyleroom.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-100 transition-all hover:shadow-md">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                <Phone size={20} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-800 mb-1">Call Us</h3>
                <a href="tel:+917581857811" className="text-charcoal-500 text-sm hover:text-rose-500 transition-colors">+91 75818 57811</a>
                <p className="text-charcoal-500 text-sm">Mon–Sat, 10am–7pm IST</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-100 transition-all hover:shadow-md">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                <MapPin size={20} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-800 mb-1">Visit Us</h3>
                <p className="text-charcoal-500 text-sm">The Fashion Room</p>
                <p className="text-charcoal-500 text-sm">Indore, India 452016</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-cream-100 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-cream-100 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 bg-cream-100 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              disabled={sent}
              className={`w-full py-4 rounded-full font-semibold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                sent ? 'bg-green-600 text-white' : 'bg-charcoal-900 text-white hover:bg-rose-500'
              }`}
            >
              {sent ? (
                <>
                  <Check size={18} /> Message Sent
                </>
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
