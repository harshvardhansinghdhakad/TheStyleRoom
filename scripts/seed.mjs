/**
 * The Style Room — Supabase Database Seeder Script
 * Run with: node scripts/seed.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.log('⚠️ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment.');
  console.log('💡 TIP: You can directly paste and execute `supabase/schema.sql` and `supabase/seed.sql` in the Supabase SQL Editor:');
  console.log('👉 https://supabase.com/dashboard/project/_/sql');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('🚀 Seeding Supabase database for The Style Room...');
  
  // 1. Seed Admin
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@the-style-room.vercel.app',
      password: 'admin123',
      options: {
        data: {
          full_name: 'Atelier Store Administrator',
          is_admin: true,
        },
      },
    });
    if (error) {
      console.log('ℹ️ Admin user registration notice:', error.message);
    } else {
      console.log('✅ Admin user seeded:', data.user?.email);
    }
  } catch (err) {
    console.log('Admin user seed notice:', err.message);
  }

  console.log('🎉 Done! For complete tables and policies, execute `supabase/schema.sql` and `supabase/seed.sql` in Supabase SQL Editor.');
}

run();
