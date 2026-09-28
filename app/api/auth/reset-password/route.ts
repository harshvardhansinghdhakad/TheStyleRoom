import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_thestyleroom_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_thestyleroom ||
  process.env.NEXT_PUBLIC_thestyleroom_URL ||
  process.env.NEXT_PUBLIC_THESTYLEROOM_URL ||
  'https://vfuvjtnxoqgfxtssxeec.supabase.co';

const ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_thestyleroom_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_THESTYLEROOM_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdXZqdG54b3FnZnh0c3N4ZWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MzM1OTgsImV4cCI6MjEwNjAwOTU5OH0.dLRJZuTv9zI28iO_IcCbO_LxrECbPA0ZBj1D4QaDMJU';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 },
      );
    }

    const supabase = createClient(SUPABASE_URL, ANON_KEY);

    const origin =
      request.headers.get('origin') ||
      request.headers.get('referer')?.replace(/\/$/, '') ||
      'https://the-style-room.vercel.app';

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${origin}/auth/reset-password`,
      },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message:
        'If an account exists with this email, a password reset link has been sent. Please check your inbox.',
    });
  } catch (err) {
    console.error('Reset password API error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 },
    );
  }
}
