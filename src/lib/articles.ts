export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  metaDescription: string;
  content: string[];
}

export const ARTICLES: Article[] = [
  {
    id: 'fluid-tailoring-2026',
    title: 'The 2026 Trend Forecast: The Return of Fluid Tailoring & Pure Mulberry Silk',
    category: 'Trend Report',
    readTime: '5 min read',
    date: 'February 24, 2026',
    author: 'Aria Sharma • Atelier Stylist',
    image: '/images/category_jacket.jpg',
    excerpt:
      'Fashion is moving away from restrictive silhouettes towards effortless, fluid draping that moves with your body from morning meetings to evening galas.',
    metaDescription:
      'Discover the 2026 fashion trend forecast: fluid tailoring, 22-momme pure mulberry silk, and effortless silhouettes by The Style Room Atelier.',
    content: [
      'In our Spring/Summer 2026 atelier preview, the predominant theme is liberating sophistication. Modern women no longer need to compromise between structural presence and tactile comfort.',
      'Our designers worked directly with artisan silk weavers to introduce 22-momme pure mulberry silk that resists creasing while creating a natural, subtle sheen that catches ambient light effortlessly.',
      'Pair a fluid, unlined blazer with our signature bias-cut silk slip dress for an understated monochromatic aesthetic that commands attention without uttering a word.',
      'The modern palette embraces earthy terracottas, muted lavender lilacs, and rich midnight obsidian. Each shade is developed to flatter diverse skin tones naturally.',
    ],
  },
  {
    id: 'capsule-wardrobe-essentials',
    title: 'The 8-Piece Capsule Wardrobe: Mastering Everyday Minimalism',
    category: 'Style Guide',
    readTime: '4 min read',
    date: 'February 18, 2026',
    author: 'Priya Mehra • Creative Director',
    image: '/images/product-04.jpeg',
    excerpt:
      'How to streamline your morning routine with 8 versatile foundational pieces that seamlessly combine into over 24 distinct, high-impact outfits.',
    metaDescription:
      'Master intentional dressing with an 8-piece capsule wardrobe. Learn how to mix mulberry silks, linen shirts, and tailoring into 24+ outfits.',
    content: [
      'A curated wardrobe is not about having fewer options; it is about having better options. When every garment in your closet has intentional proportions, getting dressed becomes an act of effortless luxury.',
      'The foundation starts with our Supima Cotton Top and the Relaxed Linen Resort Shirt. Add two statement dresses — one structured day dress and one evening silk slip — followed by versatile tailored trousers and an unconstructed lightweight jacket.',
      'Investing in higher-grade organic textiles guarantees longevity: garments that look richer after every wash rather than fading into fast-fashion obsolescence.',
      'By selecting cohesive tones — ivory, taupe, deep plum, and classic navy — every single top naturally coordinates with every bottom in your collection.',
    ],
  },
  {
    id: 'silk-care-masterclass',
    title: 'The Atelier Guide: Caring for Pure Mulberry Silk & Fine Linen',
    category: 'Care & Longevity',
    readTime: '3 min read',
    date: 'January 29, 2026',
    author: 'Devika Ray • Textile Conservator',
    image: '/images/product-02.jpeg',
    excerpt:
      'Sustainable luxury starts with proper garment care. Discover the artisanal methods to maintain the lustrous hand-feel of your silks for decades.',
    metaDescription:
      'Step-by-step masterclass on caring for pure mulberry silk, washing silk slips, and pressing fine linens from The Style Room textile conservators.',
    content: [
      'True luxury garments are heirloom investments. Mulberry silk contains natural protein fibers (fibroin) that react best to pH-neutral cleansing agents and cool temperature baths.',
      'Never wring or twist natural silk. Instead, roll your garment gently inside a clean Turkish cotton towel to absorb moisture before laying flat on a drying rack away from direct sunlight.',
      'For travel, use a garment steamer on low setting held 6 inches away to let the fibers naturally relax, preserving the garment’s bespoke drape and breathability.',
      'Store your silks in breathable muslin garment bags rather than plastic protectors to avoid trapping moisture and preserve fiber elasticity.',
    ],
  },
];

export function getAllArticles(): Article[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('thestyleroom_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }
  return ARTICLES;
}

export function getArticleById(id: string): Article | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.id === id);
}
