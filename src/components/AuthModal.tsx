"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { X, Mail, Lock, User, Phone, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    authModalInitialMode,
    signIn,
    signUp,
    signInWithGoogle,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalInitialMode);
      setError(null);
      setSuccess(null);
    }
  }, [authModalOpen, authModalInitialMode]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid email or password');
        } else {
          setSuccess('Welcome back! Signed in successfully.');
          setTimeout(() => closeAuthModal(), 800);
        }
      } else {
        if (!name.trim()) {
          setError('Please provide your full name');
          setLoading(false);
          return;
        }
        const res = await signUp(email, password, name, phone);
        if (!res.success) {
          setError(res.error || 'Failed to create account');
        } else {
          setSuccess('Account created! Welcome to The Style Room.');
          setTimeout(() => closeAuthModal(), 800);
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140820]/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-[#241135] via-[#4e1c75] to-[#241135] text-white p-6 text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-purple-200 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#deb6ff] text-[10px] uppercase font-bold tracking-widest mb-2 border border-white/15">
            <Sparkles size={11} />
            <span>The Style Room Client Privilege</span>
          </div>

          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#fdfafe]">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Atelier Account'}
          </h3>
          <p className="text-xs text-purple-200 mt-1">
            Access saved delivery addresses, express checkout & order history
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-cream-200 bg-cream-50/50">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'signin'
                ? 'text-[#67349a] border-b-2 border-[#67349a] bg-white'
                : 'text-charcoal-400 hover:text-charcoal-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'signup'
                ? 'text-[#67349a] border-b-2 border-[#67349a] bg-white'
                : 'text-charcoal-400 hover:text-charcoal-700'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6">
          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-cream-50 border border-cream-300 text-charcoal-800 rounded-full font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-charcoal-400">
              <span className="bg-white px-3">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rhea Kapoor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] focus:ring-1 focus:ring-[#67349a] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Mobile Number (For WhatsApp / Delivery)
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="tel"
                      placeholder="+91 98201 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] focus:ring-1 focus:ring-[#67349a] outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="email"
                  required
                  placeholder="your.name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] focus:ring-1 focus:ring-[#67349a] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider">
                  Password *
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link will be sent to your email.')}
                    className="text-[10px] text-[#67349a] hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-cream-300 focus:border-[#67349a] focus:ring-1 focus:ring-[#67349a] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#241135] hover:bg-[#67349a] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : mode === 'signin' ? (
                'Sign In to Account'
              ) : (
                'Create Account & Continue'
              )}
            </button>
          </form>

          <p className="mt-4 pt-3 border-t border-cream-200 text-center text-[10px] text-charcoal-400">
            Secure 256-bit SSL encrypted atelier authentication
          </p>
        </div>
      </div>
    </div>
  );
}
