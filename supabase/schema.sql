-- ==============================================================================
-- THE STYLE ROOM — HAUTE ATELIER INDORE
-- Supabase Database Schema & Production RLS Security Rules
-- Execute this script in your Supabase Project SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------
-- 1. ADMIN AUTHORIZATION FUNCTION & SECURITY RULE
-- ------------------------------------------------------------------------------
-- Primary Super Admin: harshvardhansinghdhakad@gmail.com
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'harshvardhansinghdhakad@gmail.com'
    OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.role() = 'service_role'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('dresses', 'tops', 'new')),
  image_url TEXT NOT NULL,
  sizes TEXT[] DEFAULT ARRAY['XS', 'S', 'M', 'L', 'XL'],
  is_new BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated admin to manage products" ON public.products;

CREATE POLICY "Allow public read access on products" 
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admin to manage products" 
  ON public.products FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. ARTICLES / BLOG TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT DEFAULT '4 min read',
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  image TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  meta_description TEXT,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on articles" ON public.articles;
DROP POLICY IF EXISTS "Allow authenticated admin to manage articles" ON public.articles;

CREATE POLICY "Allow public read access on articles" 
  ON public.articles FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admin to manage articles" 
  ON public.articles FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) DEFAULT 0,
  discount NUMERIC(10, 2) DEFAULT 0,
  shipping NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users and admin to view orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin to update orders" ON public.orders;

CREATE POLICY "Allow public insert on orders" 
  ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users and admin to view orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid()::text = customer_id OR public.is_admin());

CREATE POLICY "Allow admin to update orders" 
  ON public.orders FOR UPDATE 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. CUSTOMERS & PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  addresses JSONB DEFAULT '[]'::jsonb,
  orders_count INTEGER DEFAULT 0,
  total_spent NUMERIC(10, 2) DEFAULT 0,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage own profile" ON public.customers;
DROP POLICY IF EXISTS "Allow admin to view all customers" ON public.customers;

CREATE POLICY "Allow users to manage own profile" 
  ON public.customers FOR ALL 
  USING (auth.uid()::text = id OR public.is_admin())
  WITH CHECK (auth.uid()::text = id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admin to update settings" ON public.settings;

CREATE POLICY "Allow public read on settings" 
  ON public.settings FOR SELECT USING (true);

CREATE POLICY "Allow admin to update settings" 
  ON public.settings FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. ANALYTICS & ACTIVITY LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert on analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow admin to view analytics" ON public.analytics_events;

CREATE POLICY "Allow insert on analytics_events" 
  ON public.analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to view analytics" 
  ON public.analytics_events FOR SELECT 
  USING (public.is_admin());
