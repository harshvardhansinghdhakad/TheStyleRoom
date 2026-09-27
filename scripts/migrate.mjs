import pg from 'pg';
import fs from 'fs';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Client } = pg;

const connectionConfigs = [
  {
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.vfuvjtnxoqgfxtssxeec',
    password: 'tMPQQlEw1ayvPd5b',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  },
  {
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.vfuvjtnxoqgfxtssxeec',
    password: 'tMPQQlEw1ayvPd5b',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  },
];

async function tryConnect() {
  for (const config of connectionConfigs) {
    console.log(`Connecting to ${config.host}:${config.port}...`);
    const client = new Client(config);
    try {
      await client.connect();
      console.log('✅ Connected successfully to Postgres!');
      return client;
    } catch (e) {
      console.warn('Connection failed:', e.message);
    }
  }
  throw new Error('All connection attempts failed');
}

async function run() {
  const client = await tryConnect();

  try {
    console.log('Reading supabase/schema.sql...');
    const schemaSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/schema.sql'), 'utf8');
    console.log('Executing schema.sql...');
    await client.query(schemaSql);
    console.log('✅ schema.sql executed successfully!');

    console.log('Reading supabase/seed.sql...');
    const seedSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/seed.sql'), 'utf8');
    console.log('Executing seed.sql...');
    await client.query(seedSql);
    console.log('✅ seed.sql executed successfully!');

    // Verify products table
    const res = await client.query('SELECT count(*) FROM public.products;');
    console.log(`✅ Verification: public.products count = ${res.rows[0].count}`);

    const resUsers = await client.query('SELECT count(*) FROM auth.users WHERE email = $1;', [
      'harshvardhansinghdhakad@gmail.com',
    ]);
    console.log(`✅ Admin in auth.users = ${resUsers.rows[0].count}`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

run();
