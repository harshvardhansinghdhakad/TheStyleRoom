import type { Metadata } from 'next';
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: 'Contact Client Concierge & Atelier Visit | The Style Room',
  description:
    'Connect with The Style Room personal concierge in Indore for size consultations, bespoke fittings, and showroom appointments. Call +91 75818 57811.',
  alternates: {
    canonical: 'https://the-style-room.vercel.app/contact',
  },
  openGraph: {
    title: 'Contact Concierge — The Style Room Haute Atelier',
    description: 'Boutique appointments, styling consultations, and inquiries in Indore, India.',
    url: 'https://the-style-room.vercel.app/contact',
  },
};

const faqs = [
  {
    question: 'How long does delivery take across India?',
    answer: 'We ship via premium express couriers (Bluedart, Delhivery Air). Metro cities typically receive orders within 2 to 4 business days. Other regions take 3 to 5 business days.',
  },
  {
    question: 'Can I request bespoke sizing or custom alterations?',
    answer: 'Yes! Our Indore atelier offers complimentary waist and length adjustments on selected dresses and outerwear. Contact our concierge via WhatsApp or phone before or right after placing your order.',
  },
  {
    question: 'What is your returns and exchange policy?',
    answer: 'We offer an easy 30-day exchange and return window for all unworn garments with original tags and packaging intact. Reverse pickup is coordinated free of charge.',
  },
  {
    question: 'Are your silks authentic 100% pure mulberry silk?',
    answer: 'Every silk garment from The Style Room is crafted exclusively from certified 100% pure mulberry silk (ranging from 19 to 22 momme) tested for hypoallergenic and breathability standards.',
  },
];

export default function ContactPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Contact />
    </>
  );
}
