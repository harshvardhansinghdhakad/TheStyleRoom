/**
 * The Style Room — Supabase Database Seeder Script
 * Run with: node scripts/seed.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Auto-read from .env.local if not already in process.env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_thestyleroom_SUPABASE_URL ||
  process.env.thestyleroom_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.thestyleroom_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_thestyleroom_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.log('⚠️ Supabase URL or Key not found.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('🚀 Seeding Supabase database for The Style Room...');
  
  // 1. Seed Admin
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'harshvardhansinghdhakad@gmail.com',
      password: 'TheStyleRoom@7811',
      options: {
        data: {
          full_name: 'Harshvardhan Singh Dhakad (Store Owner)',
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
