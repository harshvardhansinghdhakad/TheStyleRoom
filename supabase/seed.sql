-- ==============================================================================
-- THE STYLE ROOM — HAUTE ATELIER INDORE
-- Supabase Database Seed Script (Admin User + Products + Articles + Settings + Orders)
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------
-- 1. SEED SUPER ADMIN USER IN SUPABASE AUTH (auth.users)
-- Email: harshvardhansinghdhakad@gmail.com
-- Password: TheStyleRoom@7811
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  admin_uid UUID := 'a0000000-0000-0000-0000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'harshvardhansinghdhakad@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_uid,
      'authenticated',
      'authenticated',
      'harshvardhansinghdhakad@gmail.com',
      crypt('TheStyleRoom@7811', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
      '{"full_name":"Harshvardhan Singh Dhakad (Store Owner)","phone":"+91 75818 57811","is_admin":true}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_uid,
      format('{"sub":"%s","email":"%s"}', admin_uid, 'harshvardhansinghdhakad@gmail.com')::jsonb,
      'email',
      NOW(),
      NOW(),
      NOW()
    );
  ELSE
    -- If already exists, update password and metadata to ensure correct credentials
    UPDATE auth.users
    SET
      encrypted_password = crypt('TheStyleRoom@7811', gen_salt('bf')),
      raw_user_meta_data = '{"full_name":"Harshvardhan Singh Dhakad (Store Owner)","phone":"+91 75818 57811","is_admin":true}'::jsonb,
      raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
      email_confirmed_at = NOW(),
      updated_at = NOW()
    WHERE email = 'harshvardhansinghdhakad@gmail.com';
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. SEED ADMIN IN CUSTOMERS TABLE
-- ------------------------------------------------------------------------------
INSERT INTO public.customers (id, name, email, phone, addresses, orders_count, total_spent, last_login, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Harshvardhan Singh Dhakad (Store Owner)',
  'harshvardhansinghdhakad@gmail.com',
  '+91 75818 57811',
  '[]'::jsonb,
  0,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone;

-- Also seed demo client customers
INSERT INTO public.customers (id, name, email, phone, addresses, orders_count, total_spent, last_login, created_at)
VALUES
  ('cust-1', 'Ananya Singhania', 'ananya.s@gmail.com', '+91 98201 12345', '[{"id":"addr-1","label":"Home","isDefault":true,"fullName":"Ananya Singhania","phone":"+91 98201 12345","pincode":"452001","addressLine1":"Flat 402, Royal Palms Residency","addressLine2":"Race Course Road","city":"Indore","state":"Madhya Pradesh"}]'::jsonb, 2, 8697, NOW(), NOW() - INTERVAL '15 days'),
  ('cust-2', 'Meera Kapoor', 'meera.k@outlook.com', '+91 98112 54321', '[]'::jsonb, 1, 2899, NOW(), NOW() - INTERVAL '12 days'),
  ('cust-3', 'Rhea Oberoi', 'rhea.oberoi@yahoo.com', '+91 98334 67890', '[]'::jsonb, 1, 4299, NOW(), NOW() - INTERVAL '10 days'),
  ('cust-4', 'Tanvi Verma', 'tanvi.v@gmail.com', '+91 98765 89123', '[]'::jsonb, 1, 3799, NOW(), NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. SEED PRODUCTS
-- ------------------------------------------------------------------------------
INSERT INTO public.products (id, name, description, price, category, image_url, sizes, is_new, stock, created_at)
VALUES
  ('prod-1', 'Silk Slip Evening Dress', 'A timeless silhouette crafted from rich 22-momme mulberry silk with subtle side slit detail.', 3499, 'dresses', '/images/product-02.jpeg', ARRAY['XS', 'S', 'M', 'L'], true, 12, NOW() - INTERVAL '20 days'),
  ('prod-2', 'Ribbed Knit Midi Dress', 'Effortless all-day style in flattering stretch knit that hugs curves comfortably.', 2899, 'dresses', '/images/product-03.jpeg', ARRAY['S', 'M', 'L'], true, 15, NOW() - INTERVAL '18 days'),
  ('prod-3', 'Oversized Linen Resort Shirt', 'Lightweight breathable linen shirt with relaxed dropped shoulders and shell buttons.', 1899, 'tops', '/images/product-04.jpeg', ARRAY['S', 'M', 'L', 'XL'], false, 20, NOW() - INTERVAL '16 days'),
  ('prod-4', 'Satin Button-Down Blouse', 'Gleaming satin drape tailored for modern boardroom-to-evening versatility.', 2299, 'tops', '/images/product-05.jpeg', ARRAY['XS', 'S', 'M', 'L'], true, 10, NOW() - INTERVAL '14 days'),
  ('prod-5', 'Floral Tiered Maxi Dress', 'Romantic tiered layers with subtle botanical prints and soft ruffle accents.', 3799, 'dresses', '/images/product-06.jpeg', ARRAY['S', 'M', 'L'], false, 8, NOW() - INTERVAL '12 days'),
  ('prod-6', 'Cropped Structured Poplin Top', 'Crisp organic cotton poplin with square neckline and gathered waist definition.', 1599, 'tops', '/images/product-07.jpeg', ARRAY['XS', 'S', 'M'], false, 16, NOW() - INTERVAL '10 days'),
  ('prod-7', 'Tailored Minimalist Jacket', 'Clean architectural cut designed to layer seamlessly over dresses and denim.', 4299, 'tops', '/images/product-08.jpeg', ARRAY['S', 'M', 'L'], true, 14, NOW() - INTERVAL '8 days'),
  ('prod-8', 'Pleated Halter Cocktail Dress', 'Flowing accordion pleats with graceful halter neckline for celebratory moments.', 3699, 'dresses', '/images/product-09.jpeg', ARRAY['S', 'M', 'L'], true, 9, NOW() - INTERVAL '6 days'),
  ('prod-9', 'Classic Supima Cotton Top', 'Super-soft everyday staple made from premium long-staple combed cotton.', 1199, 'tops', '/images/product-10.jpeg', ARRAY['S', 'M', 'L', 'XL'], false, 25, NOW() - INTERVAL '4 days'),
  ('prod-10', 'Bohemian Belted Wrap Dress', 'Feminine V-neck silhouette with self-tie waist and breezy hemline movement.', 2999, 'dresses', '/images/product-12.jpeg', ARRAY['XS', 'S', 'M', 'L'], false, 11, NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url;

-- ------------------------------------------------------------------------------
-- 4. SEED EDITORIAL ARTICLES / BLOG
-- ------------------------------------------------------------------------------
INSERT INTO public.articles (id, title, category, read_time, date, author, image, excerpt, meta_description, content, created_at)
VALUES
  (
    'fluid-tailoring-2026',
    'The 2026 Trend Forecast: The Return of Fluid Tailoring & Pure Mulberry Silk',
    'Trend Report',
    '5 min read',
    'February 24, 2026',
    'Aria Sharma • Atelier Stylist',
    '/images/category_jacket.jpg',
    'Fashion is moving away from restrictive silhouettes towards effortless, fluid draping that moves with your body from morning meetings to evening galas.',
    'Discover the 2026 fashion trend forecast: fluid tailoring, 22-momme pure mulberry silk, and effortless silhouettes by The Style Room Atelier.',
    '["In our Spring/Summer 2026 atelier preview, the predominant theme is liberating sophistication. Modern women no longer need to compromise between structural presence and tactile comfort.","Our designers worked directly with artisan silk weavers to introduce 22-momme pure mulberry silk that resists creasing while creating a natural, subtle sheen that catches ambient light effortlessly.","Pair a fluid, unlined blazer with our signature bias-cut silk slip dress for an understated monochromatic aesthetic that commands attention without uttering a word.","The modern palette embraces earthy terracottas, muted lavender lilacs, and rich midnight obsidian. Each shade is developed to flatter diverse skin tones naturally."]'::jsonb,
    NOW() - INTERVAL '20 days'
  ),
  (
    'capsule-wardrobe-essentials',
    'The 8-Piece Capsule Wardrobe: Mastering Everyday Minimalism',
    'Style Guide',
    '4 min read',
    'February 18, 2026',
    'Priya Mehra • Creative Director',
    '/images/product-04.jpeg',
    'How to streamline your morning routine with 8 versatile foundational pieces that seamlessly combine into over 24 distinct, high-impact outfits.',
    'Master intentional dressing with an 8-piece capsule wardrobe. Learn how to mix mulberry silks, linen shirts, and tailoring into 24+ outfits.',
    '["A curated wardrobe is not about having fewer options; it is about having better options. When every garment in your closet has intentional proportions, getting dressed becomes an act of effortless luxury.","The foundation starts with our Supima Cotton Top and the Relaxed Linen Resort Shirt. Add two statement dresses — one structured day dress and one evening silk slip — followed by versatile tailored trousers and an unconstructed lightweight jacket.","Investing in higher-grade organic textiles guarantees longevity: garments that look richer after every wash rather than fading into fast-fashion obsolescence.","By selecting cohesive tones — ivory, taupe, deep plum, and classic navy — every single top naturally coordinates with every bottom in your collection."]'::jsonb,
    NOW() - INTERVAL '15 days'
  ),
  (
    'silk-care-masterclass',
    'The Atelier Guide: Caring for Pure Mulberry Silk & Fine Linen',
    'Care & Longevity',
    '3 min read',
    'January 29, 2026',
    'Devika Ray • Textile Conservator',
    '/images/product-02.jpeg',
    'Sustainable luxury starts with proper garment care. Discover the artisanal methods to maintain the lustrous hand-feel of your silks for decades.',
    'Step-by-step masterclass on caring for pure mulberry silk, washing silk slips, and pressing fine linens from The Style Room textile conservators.',
    '["True luxury garments are heirloom investments. Mulberry silk contains natural protein fibers (fibroin) that react best to pH-neutral cleansing agents and cool temperature baths.","Never wring or twist natural silk. Instead, roll your garment gently inside a clean Turkish cotton towel to absorb moisture before laying flat on a drying rack away from direct sunlight.","For travel, use a garment steamer on low setting held 6 inches away to let the fibers naturally relax, preserving the garment’s bespoke drape and breathability.","Store your silks in breathable muslin garment bags rather than plastic protectors to avoid trapping moisture and preserve fiber elasticity."]'::jsonb,
    NOW() - INTERVAL '30 days'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content;

-- ------------------------------------------------------------------------------
-- 5. SEED ORDERS
-- ------------------------------------------------------------------------------
INSERT INTO public.orders (id, customer_id, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, discount, shipping, total, status, created_at)
VALUES
  (
    'ord-101',
    'cust-1',
    'Ananya Singhania',
    'ananya.s@gmail.com',
    '+91 98201 12345',
    'Flat 402, Royal Palms Residency, Race Course Road, Indore, MP — 452001',
    '[{"product_id":"prod-1","name":"Silk Slip Evening Dress","size":"M","quantity":1,"price":3499},{"product_id":"prod-4","name":"Satin Button-Down Blouse","size":"S","quantity":1,"price":2299}]'::jsonb,
    5798,
    0,
    0,
    5798,
    'pending',
    NOW() - INTERVAL '4 hours'
  ),
  (
    'ord-102',
    'cust-2',
    'Meera Kapoor',
    'meera.k@outlook.com',
    '+91 98112 54321',
    'B-14 Malabar Hill, Walkeshwar Road, Mumbai, MH — 400006',
    '[{"product_id":"prod-2","name":"Ribbed Knit Midi Dress","size":"L","quantity":1,"price":2899}]'::jsonb,
    2899,
    0,
    199,
    3098,
    'confirmed',
    NOW() - INTERVAL '24 hours'
  ),
  (
    'ord-103',
    'cust-3',
    'Rhea Oberoi',
    'rhea.oberoi@yahoo.com',
    '+91 98334 67890',
    'Villa 12, Palm Meadows, Whitefield, Bangalore, KA — 560066',
    '[{"product_id":"prod-7","name":"Tailored Minimalist Jacket","size":"M","quantity":1,"price":4299}]'::jsonb,
    4299,
    0,
    0,
    4299,
    'shipped',
    NOW() - INTERVAL '48 hours'
  ),
  (
    'ord-104',
    'cust-4',
    'Tanvi Verma',
    'tanvi.v@gmail.com',
    '+91 98765 89123',
    '72 Defence Colony, Ring Road, New Delhi, DL — 110024',
    '[{"product_id":"prod-5","name":"Floral Tiered Maxi Dress","size":"S","quantity":1,"price":3799}]'::jsonb,
    3799,
    0,
    0,
    3799,
    'delivered',
    NOW() - INTERVAL '96 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. SEED STORE SETTINGS
-- ------------------------------------------------------------------------------
INSERT INTO public.settings (id, key, value)
VALUES
  ('set-1', 'store_name', 'The Style Room'),
  ('set-2', 'support_email', 'support@the-style-room.vercel.app'),
  ('set-3', 'support_phone', '+91 75818 57811'),
  ('set-4', 'free_shipping_threshold', '2999'),
  ('set-5', 'announcement_banner', 'COMPLIMENTARY EXPRESS SHIPPING ACROSS INDIA OVER ₹2,999')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
