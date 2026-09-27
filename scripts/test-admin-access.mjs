import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vfuvjtnxoqgfxtssxeec.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdXZqdG54b3FnZnh0c3N4ZWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MzM1OTgsImV4cCI6MjEwNjAwOTU5OH0.dLRJZuTv9zI28iO_IcCbO_LxrECbPA0ZBj1D4QaDMJU';

const sb = createClient(SUPABASE_URL, ANON_KEY);

async function testAdminFlow() {
  console.log('1. Signing in as admin user...');
  const { data: auth, error: authErr } = await sb.auth.signInWithPassword({
    email: 'harshvardhansinghdhakad@gmail.com',
    password: 'TheStyleRoom@7811',
  });

  if (authErr) {
    console.error('Sign-in failed:', authErr.message);
    return;
  }

  console.log('Signed in successfully! Access token acquired.');
  console.log('User email:', auth.user.email);
  console.log('User ID:', auth.user.id);

  // Now create a client with the user's session token or using standard client that holds session
  // 2. Test reading orders as admin
  const { data: orders, error: ordErr } = await sb.from('orders').select('*');
  if (ordErr) {
    console.error('Error selecting orders:', ordErr);
  } else {
    console.log(`✅ Admin can read orders: ${orders.length} orders found!`);
  }

  // 3. Test reading customers as admin
  const { data: customers, error: custErr } = await sb.from('customers').select('*');
  if (custErr) {
    console.error('Error selecting customers:', custErr);
  } else {
    console.log(`✅ Admin can read customers: ${customers.length} customers found!`);
  }

  // 4. Test inserting a product as admin
  const testProdId = `test-prod-${Date.now()}`;
  const { error: insErr } = await sb.from('products').insert({
    id: testProdId,
    name: 'Admin Test Royal Silk Robe',
    description: 'Testing live production admin insertion',
    price: 4999,
    category: 'dresses',
    image_url: '/images/product-02.jpeg',
    sizes: ['S', 'M', 'L'],
    is_new: true,
    stock: 5,
  });

  if (insErr) {
    console.error('Admin product insert error:', insErr);
  } else {
    console.log('✅ Admin product insert SUCCEEDED!');
    // Delete it to clean up
    await sb.from('products').delete().eq('id', testProdId);
    console.log('✅ Test product cleaned up successfully!');
  }
}

testAdminFlow();
