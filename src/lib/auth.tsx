"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, type Order } from './supabase';
import {
  type AppUser,
  type UserAddress,
  recordNewCustomer,
  trackUserLoginEvent,
  getStoredOrders,
} from './storeData';

const AUTH_USER_STORAGE_KEY = 'thestyleroom_auth_user_v1';

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  authModalOpen: boolean;
  accountDrawerOpen: boolean;
  authModalInitialMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  openAccountDrawer: () => void;
  closeAccountDrawer: () => void;
  signUp: (email: string, pass: string, name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<UserAddress>;
  updateAddress: (id: string, address: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  updateProfile: (profile: { name?: string; phone?: string }) => Promise<void>;
  getUserOrders: () => Order[];
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapSupabaseUserToAppUser(sbUser: SupabaseUser, existingAddresses: UserAddress[] = []): AppUser {
  const email = sbUser.email ?? '';
  const meta = sbUser.user_metadata || {};
  const name = meta.full_name || meta.name || email.split('@')[0];
  const phone = meta.phone || undefined;
  const avatar = meta.avatar_url || undefined;
  const isGoogle = sbUser.app_metadata?.provider === 'google';

  return {
    id: sbUser.id,
    email,
    name,
    phone,
    avatar,
    addresses: existingAddresses,
    createdAt: sbUser.created_at || new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    authProvider: isGoogle ? 'google' : 'email',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'signup'>('signin');

  // Load addresses from Supabase customers table
  const syncCustomerProfileFromDb = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        const dbAddresses: UserAddress[] = Array.isArray(data.addresses) ? data.addresses : [];
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            name: data.name || prev.name,
            phone: data.phone || prev.phone,
            addresses: dbAddresses.length > 0 ? dbAddresses : prev.addresses,
          };
        });
      }
    } catch (e) {
      console.warn('Customer profile sync error:', e);
    }
  }, []);

  // Initialize and listen to live Supabase session
  useEffect(() => {
    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        const currentSession = data?.session ?? null;
        setSession(currentSession);

        if (currentSession?.user) {
          const appUser = mapSupabaseUserToAppUser(currentSession.user);
          setUser(appUser);
          syncCustomerProfileFromDb(currentSession.user.id);
        } else {
          // Check cached session
          const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed?.id && parsed?.email) {
                setUser(parsed);
              }
            } catch {}
          }
        }
      } catch (err) {
        console.warn('Auth initialization notice:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      if (sess?.user) {
        const appUser = mapSupabaseUserToAppUser(sess.user);
        setUser((prev) => ({
          ...appUser,
          addresses: prev?.addresses?.length ? prev.addresses : [],
        }));
        try {
          localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(appUser));
        } catch {}
        syncCustomerProfileFromDb(sess.user.id);
      } else {
        setUser(null);
        try {
          localStorage.removeItem(AUTH_USER_STORAGE_KEY);
        } catch {}
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [syncCustomerProfileFromDb]);

  // Sync to local storage
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } catch {}
  }, [user]);

  const openAuthModal = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalInitialMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);
  const openAccountDrawer = useCallback(() => setAccountDrawerOpen(true), []);
  const closeAccountDrawer = useCallback(() => setAccountDrawerOpen(false), []);

  // Sign Up using server-side API for auto-confirm, then sign in for session
  const signUp = useCallback(
    async (email: string, pass: string, name: string, phone: string) => {
      try {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !pass) {
          return { success: false, error: 'Please enter a valid email and password' };
        }
        if (pass.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters long' };
        }

        // Step 1: Create & auto-confirm user via server-side API
        const signupRes = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: pass,
            name: name.trim(),
            phone: phone.trim(),
          }),
        });

        const signupData = await signupRes.json();

        if (!signupRes.ok || signupData.error) {
          return { success: false, error: signupData.error || 'Registration failed' };
        }

        // Step 2: Now sign in client-side to get a real session
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: pass,
          });

        if (signInError) {
          // Account was created but auto-sign-in failed
          return {
            success: false,
            error: `Account created but sign-in failed: ${signInError.message}. Please try signing in manually.`,
          };
        }

        if (signInData.user) {
          const newUser: AppUser = {
            id: signInData.user.id,
            email: cleanEmail,
            name: name.trim() || cleanEmail.split('@')[0],
            phone: phone.trim() || undefined,
            addresses: [],
            createdAt: signInData.user.created_at || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            authProvider: 'email',
          };

          setUser(newUser);
          setSession(signInData.session);
          trackUserLoginEvent();

          // Save customer profile to Supabase database
          await recordNewCustomer({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone || null,
            created_at: newUser.createdAt,
          });
        }

        setAuthModalOpen(false);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        return { success: false, error: message };
      }
    },
    [],
  );

  // Sign In with real Supabase Auth
  const signIn = useCallback(async (email: string, pass: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !pass) {
        return { success: false, error: 'Please enter your email and password' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const appUser = mapSupabaseUserToAppUser(data.user);
        setUser(appUser);
        setSession(data.session);
        trackUserLoginEvent();

        // Update / record customer in Supabase
        await recordNewCustomer({
          id: appUser.id,
          name: appUser.name,
          email: appUser.email,
          phone: appUser.phone || null,
          created_at: appUser.createdAt,
        });

        // Fetch their saved addresses
        syncCustomerProfileFromDb(data.user.id);
      }

      setAuthModalOpen(false);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please check your credentials.';
      return { success: false, error: message };
    }
  }, [syncCustomerProfileFromDb]);

  // Google Sign In via Supabase OAuth
  const signInWithGoogle = useCallback(async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://the-style-room.vercel.app';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: origin,
        },
      });

      if (error) {
        console.error('Supabase Google OAuth error:', error.message);
        alert(error.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in could not be initiated.';
      alert(message);
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out exception:', e);
    }
    setUser(null);
    setSession(null);
    try {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch {}
    setAccountDrawerOpen(false);
  }, []);

  // Address Management with real Supabase persistence
  const persistAddressesToSupabase = async (addresses: UserAddress[], targetUser: AppUser) => {
    try {
      await supabase
        .from('customers')
        .upsert({
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.name,
          phone: targetUser.phone || null,
          addresses: addresses,
        });
    } catch (e) {
      console.warn('Error saving addresses to Supabase:', e);
    }
  };

  const addAddress = useCallback(
    async (newAddrData: Omit<UserAddress, 'id'>) => {
      const newAddress: UserAddress = {
        ...newAddrData,
        id: `addr-${Date.now().toString(36)}`,
      };

      setUser((prev) => {
        if (!prev) return null;
        let addresses = prev.addresses || [];
        if (newAddress.isDefault) {
          addresses = addresses.map((a) => ({ ...a, isDefault: false }));
        } else if (addresses.length === 0) {
          newAddress.isDefault = true;
        }
        const updatedAddresses = [...addresses, newAddress];
        persistAddressesToSupabase(updatedAddresses, prev);
        return {
          ...prev,
          addresses: updatedAddresses,
        };
      });

      return newAddress;
    },
    [],
  );

  const updateAddress = useCallback(async (id: string, updatedFields: Partial<UserAddress>) => {
    setUser((prev) => {
      if (!prev) return null;
      let addresses = prev.addresses.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
      if (updatedFields.isDefault) {
        addresses = addresses.map((a) => (a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }));
      }
      persistAddressesToSupabase(addresses, prev);
      return { ...prev, addresses };
    });
  }, []);

  const deleteAddress = useCallback(async (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const remaining = prev.addresses.filter((a) => a.id !== id);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      persistAddressesToSupabase(remaining, prev);
      return { ...prev, addresses: remaining };
    });
  }, []);

  const setDefaultAddress = useCallback(async (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      persistAddressesToSupabase(updated, prev);
      return { ...prev, addresses: updated };
    });
  }, []);

  const updateProfile = useCallback(async (profile: { name?: string; phone?: string }) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        name: profile.name ?? prev.name,
        phone: profile.phone ?? prev.phone,
      };
      supabase.from('customers').upsert({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        phone: updated.phone || null,
        addresses: updated.addresses,
      }).then();
      return updated;
    });
  }, []);

  const getUserOrders = useCallback((): Order[] => {
    const all = getStoredOrders();
    if (!user) return [];
    return all.filter(
      (o) =>
        (o.customer_id && o.customer_id === user.id) ||
        (o.customer_email && o.customer_email.toLowerCase() === user.email.toLowerCase()),
    );
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        authModalOpen,
        accountDrawerOpen,
        authModalInitialMode,
        openAuthModal,
        closeAuthModal,
        openAccountDrawer,
        closeAccountDrawer,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        updateProfile,
        getUserOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
