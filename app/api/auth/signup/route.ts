import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_thestyleroom_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_thestyleroom ||
  process.env.NEXT_PUBLIC_thestyleroom_URL ||
  process.env.NEXT_PUBLIC_THESTYLEROOM_URL ||
  'https://vfuvjtnxoqgfxtssxeec.supabase.co';

const SERVICE_ROLE_KEY =
  process.env.thestyleroom_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 },
      );
    }

    // If we have service role key, use admin API to auto-confirm users
    if (SERVICE_ROLE_KEY) {
      const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // Create user with auto-confirm via admin API
      const { data: adminData, error: adminError } =
        await adminClient.auth.admin.createUser({
          email: email.trim().toLowerCase(),
          password,
          email_confirm: true, // Auto-confirm the email
          user_metadata: {
            full_name: name?.trim() || email.split('@')[0],
            phone: phone?.trim() || '',
          },
        });

      if (adminError) {
        // If user already exists, return specific error
        if (
          adminError.message.includes('already been registered') ||
          adminError.message.includes('already exists')
        ) {
          return NextResponse.json(
            { error: 'This email is already registered. Please sign in instead.' },
            { status: 409 },
          );
        }
        return NextResponse.json(
          { error: adminError.message },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: adminData.user.id,
          email: adminData.user.email,
          name: name?.trim() || email.split('@')[0],
          confirmed: true,
        },
        message: 'Account created successfully! You can now sign in.',
      });
    }

    // Fallback: use standard anon signup (email confirmation may still be required)
    const ANON_KEY =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_thestyleroom_SUPABASE_ANON_KEY ||
      '';

    const anonClient = createClient(SUPABASE_URL, ANON_KEY);

    const { data, error } = await anonClient.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: name?.trim() || email.split('@')[0],
          phone: phone?.trim() || '',
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Check if a session was returned (means email confirmation is OFF)
    const confirmed = !!data.session;

    return NextResponse.json({
      success: true,
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            name: name?.trim() || email.split('@')[0],
            confirmed,
          }
        : null,
      message: confirmed
        ? 'Account created successfully!'
        : 'Account created! Please check your email to confirm your account before signing in.',
    });
  } catch (err) {
    console.error('Signup API error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 },
    );
  }
}
