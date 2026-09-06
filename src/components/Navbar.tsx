'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LogOut,
  Globe,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../lib/types';
import { getTranslation, LanguageCode } from '../lib/translations';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentRole?: UserRole;
  setRole?: (role: UserRole) => void;
  onOpenLedger: () => void;
  language?: string;
  setLanguage?: (lang: any) => void;
  user?: {
    id: string;
    fullName: string;
    role: string;
    phone: string;
    email?: string | null;
    district?: string | null;
  } | null;
}

export default function Navbar({
  currentRole,
  setRole,
  onOpenLedger,
  language: propLanguage,
  setLanguage: propSetLanguage,
  user: initialUser,
}: NavbarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(initialUser || null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const langCtx = useLanguage();
  const language = propLanguage || langCtx.language;
  const setLanguage = (lang: string) => {
    if (propSetLanguage) {
      propSetLanguage(lang);
    }
    langCtx.setLanguage(lang as LanguageCode);
  };
  const t = langCtx.t;


  useEffect(() => {
    if (!initialUser) {
      // Fetch session from /api/auth/me
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : { authenticated: false }))
        .then((data) => {
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {});
    } else {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

  // Handle clicking outside to close profile dropdown & Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      setIsProfileOpen(false);
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'JS';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'CITIZEN':
      case 'PANCHAYAT_OFFICER':
        return { label: 'Citizen', color: 'bg-terracotta/10 text-terracotta border-terracotta/30' };
      case 'STUDENT':
      case 'FACULTY_MENTOR':
      case 'HEI_DIRECTOR':
        return { label: 'Academic HEI', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'INDUSTRY_CSR':
        return { label: 'CSR Sponsor', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'GOVT_OFFICER':
      case 'SUPER_ADMIN':
        return { label: 'Govt Admin', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      default:
        return { label: role, color: 'bg-sand-100 text-sand-800 border-sand-300' };
    }
  };

  const getPortalRouteForRole = (role: string) => {
    switch (role) {
      case 'CITIZEN':
      case 'PANCHAYAT_OFFICER':
        return '/portal/citizen';
      case 'STUDENT':
      case 'FACULTY_MENTOR':
      case 'DEPT_HEAD':
      case 'HEI_DIRECTOR':
        return '/portal/hei';
      case 'INDUSTRY_CSR':
        return '/portal/csr';
      case 'GOVT_OFFICER':
      case 'SUPER_ADMIN':
        return '/portal/admin';
      default:
        return '/portal/citizen';
    }
  };

  const portalRoute = currentUser ? getPortalRouteForRole(currentUser.role) : '/portal/citizen';

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-terracotta-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-terracotta to-sand flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform shrink-0">
              <span className="font-extrabold text-lg sm:text-2xl tracking-tighter">जो</span>
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold tracking-tight text-charcoal">
                Johar<span className="text-terracotta">Setu</span>
              </span>
              <p className="text-xs text-charcoal-muted font-medium hidden md:block truncate max-w-[260px] lg:max-w-none">
                {t.brandSub}
              </p>
            </div>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-canvas-subtle px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border border-charcoal-border/50 text-xs text-charcoal font-medium">
              <Globe className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Language Selector"
                className="bg-transparent border-none outline-none cursor-pointer text-xs font-semibold text-charcoal pr-0.5 sm:pr-1"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="sat">संथाली (Ol Chiki)</option>
                <option value="mun">मुंडारी (Mundari)</option>
              </select>
            </div>

            {/* User Profile & Auth Controls */}
            {currentUser ? (
              <div className="relative pl-1 sm:pl-2 border-l border-charcoal-border/60" ref={profileRef}>
                {/* Modern Avatar + Name Button */}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1.5 sm:pr-2.5 sm:py-1 rounded-full bg-white hover:bg-sand-50/80 border border-charcoal-border/70 hover:border-terracotta/40 transition-all shadow-xs group cursor-pointer"
                  aria-expanded={isProfileOpen}
                  aria-label="Toggle profile menu"
                >
                  {/* Avatar Circle with Initials & Status Dot */}
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-sand text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-terracotta/20 group-hover:scale-105 transition-transform shrink-0">
                    <span>{getInitials(currentUser.fullName)}</span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  {/* User Name */}
                  <span className="text-xs font-bold text-charcoal max-w-[100px] md:max-w-[130px] truncate hidden sm:inline-block">
                    {currentUser.fullName}
                  </span>

                  {/* Subtle Chevron indicator */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-charcoal-muted transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180 text-terracotta' : ''
                    }`}
                  />
                </button>

                {/* Floating Modern Profile Popover Card */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-[320px] sm:max-w-sm sm:w-80 rounded-2xl bg-white border border-charcoal-border/70 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header Banner with Terracotta/Sand Gradient */}
                    <div className="bg-gradient-to-r from-terracotta-50 via-sand-50 to-canvas p-3.5 sm:p-4 border-b border-terracotta-100 flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-terracotta to-sand text-white font-black text-sm sm:text-base flex items-center justify-center shadow-soft ring-2 ring-white shrink-0">
                        {getInitials(currentUser.fullName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-charcoal leading-tight truncate">
                          {currentUser.fullName}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                              getRoleBadge(currentUser.role).color
                            }`}
                          >
                            {getRoleBadge(currentUser.role).label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Information List */}
                    <div className="p-3.5 sm:p-4 space-y-2 text-xs text-charcoal">
                      <div className="flex items-center gap-2.5 text-charcoal-muted">
                        <Phone className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="text-charcoal font-medium">{currentUser.phone}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-charcoal-muted">
                        <Mail className="w-3.5 h-3.5 text-sand-700 shrink-0" />
                        <span className="text-charcoal font-medium truncate">
                          {currentUser.email ||
                            `${currentUser.fullName.toLowerCase().replace(/\s+/g, '.')}@jharkhand.gov.in`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 text-charcoal-muted">
                        <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="text-charcoal font-medium truncate">
                          {currentUser.district
                            ? `${currentUser.district} District, Jharkhand`
                            : 'Jharkhand State'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-emerald-700 text-[11px] font-semibold pt-1.5 border-t border-charcoal-border/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span>{t.onlineStatus}</span>
                      </div>
                    </div>

                    {/* Navigation Quick Links */}
                    <div className="px-3 pb-3 space-y-1">
                      <Link
                        href={portalRoute}
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-canvas-subtle hover:bg-sand-50 text-charcoal text-xs font-semibold transition-colors border border-charcoal-border/40 group"
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-terracotta" />
                          <span>{t.myPortal}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-charcoal-muted group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onOpenLedger();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-canvas-subtle hover:bg-sand-50 text-charcoal text-xs font-semibold transition-colors border border-charcoal-border/40 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
                          <span>{t.auditLedger}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-charcoal-muted" />
                      </button>
                    </div>

                    {/* Logout Footer Action */}
                    <div className="border-t border-charcoal-border/40 p-3 bg-canvas-subtle">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors border border-red-200 shadow-2xs cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-charcoal-border/60">
                <Link
                  href="/login"
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-xs transition-all whitespace-nowrap"
                >
                  {t.signIn}
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl border border-charcoal-border hover:border-terracotta bg-white text-charcoal hover:text-terracotta text-xs font-bold transition-all whitespace-nowrap"
                >
                  {t.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
