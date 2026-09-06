'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Shield,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Building2,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick helper accounts for instant presentation testing
  const handleQuickFill = (roleName: string, id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter both your phone/email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to authenticate. Please check your credentials.');
      }

      // Success: redirect to assigned portal or requested redirect
      const destination = redirectTarget || data.redirectUrl || '/portal/citizen';
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center font-black text-2xl shadow-md shadow-terracotta/20 group-hover:scale-105 transition-transform">
            जो
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-charcoal flex items-center gap-1.5">
              JoharSetu
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sand-100 text-sand-800 border border-sand-300">
                SIH 2026
              </span>
            </span>
            <p className="text-xs text-charcoal-muted">Dept of Higher & Technical Education, Jharkhand</p>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-extrabold text-charcoal">Sign in to your Portal</h2>
        <p className="mt-1 text-sm text-charcoal-muted">
          Access your personalized dashboard with Role-Based Security
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-soft border border-charcoal-border/70">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-2">
                Phone Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted/60">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+91 94311 00000 or email@domain.gov.in"
                  className="block w-full pl-10 pr-3.5 py-3 rounded-xl border border-charcoal-border bg-canvas/40 text-charcoal placeholder-charcoal-light focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-10 py-3 rounded-xl border border-charcoal-border bg-canvas/40 text-charcoal placeholder-charcoal-light focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-muted/60 hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md shadow-terracotta/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-charcoal-border/50 text-center">
            <p className="text-sm text-charcoal-muted">
              Don't have an account yet?{' '}
              <Link href="/register" className="font-bold text-terracotta hover:underline">
                Create new account
              </Link>
            </p>
          </div>

          {/* Quick Demo Previews */}
          <div className="mt-8 pt-6 border-t border-dashed border-charcoal-border">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Evaluation Quick-Select (Judge Demo)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('Citizen', '9431182910', 'Johar@2026')}
                className="p-2.5 rounded-xl border border-charcoal-border hover:border-terracotta bg-canvas/60 hover:bg-terracotta-50 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-xs">
                  🏡
                </div>
                <div>
                  <div className="font-bold text-charcoal">Citizen</div>
                  <div className="text-[10px] text-charcoal-muted">Village Khunti</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('Govt Admin', 'admin@jharkhand.gov.in', 'Johar@2026')}
                className="p-2.5 rounded-xl border border-charcoal-border hover:border-sand-500 bg-canvas/60 hover:bg-sand-50 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-sand/20 text-sand-800 flex items-center justify-center font-bold text-xs">
                  🏛️
                </div>
                <div>
                  <div className="font-bold text-charcoal">Govt Officer</div>
                  <div className="text-[10px] text-charcoal-muted">24-Dist GIS</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('HEI Faculty', 'faculty@bitmesra.ac.in', 'Johar@2026')}
                className="p-2.5 rounded-xl border border-charcoal-border hover:border-blue-400 bg-canvas/60 hover:bg-blue-50 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  🎓
                </div>
                <div>
                  <div className="font-bold text-charcoal">HEI Mentor</div>
                  <div className="text-[10px] text-charcoal-muted">BIT Mesra</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('CSR Corporate', 'csr@tatasteel.com', 'Johar@2026')}
                className="p-2.5 rounded-xl border border-charcoal-border hover:border-amber-400 bg-canvas/60 hover:bg-amber-50 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  🏢
                </div>
                <div>
                  <div className="font-bold text-charcoal">CSR Sponsor</div>
                  <div className="text-[10px] text-charcoal-muted">Tata Steel</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
