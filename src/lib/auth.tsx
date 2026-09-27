"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type Order } from './supabase';
import {
  type AppUser,
  type UserAddress,
  recordNewCustomer,
  trackUserLoginEvent,
  getStoredOrders,
} from './storeData';

const AUTH_USER_STORAGE_KEY = 'thestyleroom_auth_user_v1';
const ALL_USERS_STORAGE_KEY = 'thestyleroom_registered_users_v1';

// Initial default user for smooth demo experience
const defaultDemoUser: AppUser = {
  id: 'usr-101',
  email: 'ananya.s@gmail.com',
  name: 'Ananya Singhania',
  phone: '+91 98201 12345',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      isDefault: true,
      fullName: 'Ananya Singhania',
      phone: '+91 98201 12345',
      pincode: '452001',
      addressLine1: 'Flat 402, Royal Palms Residency',
      addressLine2: 'Race Course Road, Near High Court',
      city: 'Indore',
      state: 'Madhya Pradesh',
    },
    {
      id: 'addr-2',
      label: 'Work',
      isDefault: false,
      fullName: 'Ananya Singhania (Studio)',
      phone: '+91 98201 12345',
      pincode: '452010',
      addressLine1: 'Suite 601, Brilliant Titanium',
      addressLine2: 'Scheme No 78, Vijay Nagar',
      city: 'Indore',
      state: 'Madhya Pradesh',
    },
  ],
  createdAt: '2026-01-10T10:00:00.000Z',
  lastLoginAt: new Date().toISOString(),
  authProvider: 'email',
};

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'signup'>('signin');

  // Load user from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch {
      // ignore parse error
    } finally {
      setIsLoading(false);
    }

    // If Supabase is configured, also listen to real Supabase session
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data?.session ?? null);
      }).catch(() => {});

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, sess) => {
        setSession(sess);
        if (sess?.user) {
          const email = sess.user.email ?? '';
          const name = sess.user.user_metadata?.full_name || sess.user.user_metadata?.name || email.split('@')[0];
          const phone = sess.user.user_metadata?.phone || '';
          const avatar = sess.user.user_metadata?.avatar_url || '';

          setUser((prev) => {
            const updated: AppUser = {
              id: sess.user.id,
              email,
              name,
              phone,
              avatar,
              addresses: prev?.addresses || [],
              createdAt: prev?.createdAt || sess.user.created_at || new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              authProvider: sess.user.app_metadata?.provider === 'google' ? 'google' : 'email',
            };
            try {
              localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      });
      return () => listener?.subscription?.unsubscribe();
    }
  }, []);

  // Sync user state to localStorage whenever it changes
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

  // Sign Up
  const signUp = useCallback(
    async (email: string, pass: string, name: string, phone: string) => {
      try {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !pass) {
          return { success: false, error: 'Please enter a valid email and password' };
        }

        // Try Supabase Auth if configured
        if (isSupabaseConfigured) {
          try {
            const res = await supabase.auth.signUp({
              email: cleanEmail,
              password: pass,
              options: {
                data: { full_name: name, phone },
              },
            });
            if (res.error) {
              console.warn('Supabase sign up error:', res.error.message);
            }
          } catch (err) {
            console.warn('Supabase sign up network exception:', err);
          }
        }

        // Create or update local user
        const newUser: AppUser = {
          id: `usr-${Date.now().toString(36)}`,
          email: cleanEmail,
          name: name.trim() || cleanEmail.split('@')[0],
          phone: phone.trim() || undefined,
          addresses: [],
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          authProvider: 'email',
        };

        setUser(newUser);
        trackUserLoginEvent();

        // Register in customer database for Admin Panel
        await recordNewCustomer({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || null,
          created_at: newUser.createdAt,
        });

        // Store into registered users pool
        try {
          const allRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
          const all = allRaw ? JSON.parse(allRaw) : [];
          all.push(newUser);
          localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(all));
        } catch {}

        setAuthModalOpen(false);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        return { success: false, error: message };
      }
    },
    [],
  );

  // Sign In
  const signIn = useCallback(async (email: string, pass: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !pass) {
        return { success: false, error: 'Please enter your email and password' };
      }

      // Supabase Auth if configured
      if (isSupabaseConfigured) {
        try {
          const res = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: pass,
          });
          if (res.error) {
            console.warn('Supabase sign in notice:', res.error.message);
          }
        } catch (err) {
          console.warn('Supabase network exception:', err);
        }
      }

      // Check registered users in local storage
      let matchedUser: AppUser | null = null;
      try {
        const allRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
        if (allRaw) {
          const all: AppUser[] = JSON.parse(allRaw);
          matchedUser = all.find((u) => u.email.toLowerCase() === cleanEmail) || null;
        }
      } catch {}

      if (!matchedUser) {
        // If it's the demo account
        if (cleanEmail === defaultDemoUser.email) {
          matchedUser = defaultDemoUser;
        } else {
          // Auto create/restore user session gracefully
          matchedUser = {
            id: `usr-${Date.now().toString(36)}`,
            email: cleanEmail,
            name: cleanEmail.split('@')[0].replace('.', ' '),
            addresses: [],
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            authProvider: 'email',
          };
        }
      }

      const activeUser: AppUser = {
        ...matchedUser,
        lastLoginAt: new Date().toISOString(),
      };

      setUser(activeUser);
      trackUserLoginEvent();

      await recordNewCustomer({
        id: activeUser.id,
        name: activeUser.name,
        email: activeUser.email,
        phone: activeUser.phone || null,
        created_at: activeUser.createdAt,
      });

      setAuthModalOpen(false);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      return { success: false, error: message };
    }
  }, []);

  // Google Sign In
  const signInWithGoogle = useCallback(async () => {
    trackUserLoginEvent();
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
          },
        });
        return;
      } catch (err) {
        console.warn('Supabase OAuth notice:', err);
      }
    }

    // Google Sign In Simulator / Instant Login
    const googleUser: AppUser = {
      id: `usr-google-${Date.now().toString(36)}`,
      email: 'client@gmail.com',
      name: 'Google Verified Client',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      addresses: [
        {
          id: 'addr-g1',
          label: 'Home',
          isDefault: true,
          fullName: 'Google Verified Client',
          phone: '+91 98201 99999',
          pincode: '452001',
          addressLine1: 'B-12 High Street Atelier Heights',
          addressLine2: 'MG Road, South Tukoganj',
          city: 'Indore',
          state: 'Madhya Pradesh',
        },
      ],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      authProvider: 'google',
    };

    setUser(googleUser);
    await recordNewCustomer({
      id: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      phone: '+91 98201 99999',
      created_at: googleUser.createdAt,
    });
    setAuthModalOpen(false);
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setUser(null);
    setSession(null);
    try {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch {}
    setAccountDrawerOpen(false);
  }, []);

  // Address Management
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
        return {
          ...prev,
          addresses: [...addresses, newAddress],
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
      return { ...prev, addresses: updated };
    });
  }, []);

  const updateProfile = useCallback(async (profile: { name?: string; phone?: string }) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        name: profile.name ?? prev.name,
        phone: profile.phone ?? prev.phone,
      };
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
