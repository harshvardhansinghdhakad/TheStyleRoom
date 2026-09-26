import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: "The Style Room — Women's Fashion Boutique | One Piece, Shirts & Tops",
  description: "Shop the latest women's fashion at The Style Room. Discover curated one-piece dresses, stylish shirts, elegant tops, and new arrivals. Free shipping on orders over ₹5,000.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
