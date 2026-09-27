import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vfuvjtnxoqgfxtssxeec.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdXZqdG54b3FnZnh0c3N4ZWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MzM1OTgsImV4cCI6MjEwNjAwOTU5OH0.dLRJZuTv9zI28iO_IcCbO_LxrECbPA0ZBj1D4QaDMJU';

const sb = createClient(SUPABASE_URL, ANON_KEY);

async function test() {
  console.log('Testing Supabase Anon REST API...');
  
  // 1. Products
  const { data: products, error: pErr } = await sb.from('products').select('*');
  if (pErr) {
    console.error('Products error:', pErr);
  } else {
    console.log(`✅ Products in Supabase: ${products.length} items found!`);
  }

  // 2. Articles
  const { data: articles, error: aErr } = await sb.from('articles').select('*');
  if (aErr) {
    console.error('Articles error:', aErr);
  } else {
    console.log(`✅ Articles in Supabase: ${articles.length} items found!`);
  }

  // 3. Settings
  const { data: settings, error: sErr } = await sb.from('settings').select('*');
  if (sErr) {
    console.error('Settings error:', sErr);
  } else {
    console.log(`✅ Settings in Supabase: ${settings.length} items found!`);
  }

  // 4. Test Sign-in with the Admin credentials
  console.log('Testing Admin Sign In with credentials: harshvardhansinghdhakad@gmail.com / TheStyleRoom@7811 ...');
  const { data: authData, error: authErr } = await sb.auth.signInWithPassword({
    email: 'harshvardhansinghdhakad@gmail.com',
    password: 'TheStyleRoom@7811',
  });

  if (authErr) {
    console.error('❌ Admin Sign-in error:', authErr);
  } else {
    console.log('✅ Admin Sign-in SUCCESSFUL!');
    console.log('User ID:', authData.user?.id);
    console.log('Email:', authData.user?.email);
    console.log('Role/Metadata:', authData.user?.user_metadata);
    console.log('Session access token present:', !!authData.session?.access_token);
  }
}

test();
