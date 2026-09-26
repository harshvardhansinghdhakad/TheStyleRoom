"use client";
import { ArrowUpRight, Globe2, Heart, Star } from 'lucide-react';

type Props = { onCategory: (cat: 'new' | 'dresses' | 'tops') => void };

const cards = [
  { title: 'Jackets', kicker: 'EFFORTLESS STYLE', desc: 'Layer up in confidence', image: '/images/category_jacket.jpg', cat: 'tops' as const },
  { title: 'Pants', kicker: 'ALL-DAY COMFORT', desc: 'Made to move with you', image: '/images/category_pants.jpg', cat: 'tops' as const },
];
const arrivals = [
  { title: 'Jackets', image: '/images/category_jacket.jpg' },
  { title: 'Pants', image: '/images/category_pants.jpg' },
  { title: 'Sunglasses', image: '/images/arrival_sunglasses.jpg' },
  { title: 'Footwear', image: '/images/arrival_footwear.jpg' },
];

export default function FashionShowcase({ onCategory }: Props) {
  return <>
    <section className="showcase-section">
      <div className="section-heading-row"><div><p className="purple-eyebrow">SHOP BY CATEGORY</p><h2>Style for Every You</h2></div><button onClick={() => onCategory('new')}>View All <ArrowUpRight size={16}/></button></div>
      <div className="category-grid">
        {cards.map((card) => <button key={card.title} onClick={() => onCategory(card.cat)} className="category-card">
          <img src={card.image} alt={card.title}/><div className="category-overlay"/><div className="category-copy"><p>{card.kicker}</p><h3>{card.title}</h3><span>{card.desc}</span><b>Explore Now <ArrowUpRight size={14}/></b></div>
        </button>)}
      </div>
    </section>

    <section className="arrival-banner">
      <img src="/images/arrival_banner_model.jpg" alt="New arrivals"/><div className="arrival-wash"/>
      <div className="arrival-copy"><p>* NEW COLLECTION *</p><h2>Same Energy<br/><span>New Arrivals</span></h2><button onClick={() => onCategory('new')}>Discover Now <ArrowUpRight size={17}/></button></div>
    </section>

    <section className="arrivals-section">
      <div className="arrivals-title"><p className="purple-eyebrow">NEW COLLECTION</p><h2>New Arrivals</h2><p>Pieces made for movement, comfort and everyday confidence.</p></div>
      <div className="arrival-grid">{arrivals.map((item) => <button key={item.title} onClick={() => onCategory(item.title === 'Pants' ? 'tops' : 'new')} className="arrival-card"><img src={item.image} alt={item.title}/><span>{item.title}</span><i><ArrowUpRight size={18}/></i></button>)}</div>
    </section>

    <section className="benefit-strip">
      <div><Globe2/><b>Worldwide<br/><span>Shipping</span></b></div><div><Heart/><b>Loved by<br/><span>10k+ Customers</span></b></div><div><Star/><b>Modern<br/><span>Designs</span></b></div><div><Globe2/><b>Sustainable<br/><span>Materials</span></b></div>
    </section>
  </>;
}
