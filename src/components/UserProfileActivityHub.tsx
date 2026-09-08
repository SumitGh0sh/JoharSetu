'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Award,
  GraduationCap,
  Flame,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle,
  Download,
  Copy,
  Check,
  TrendingUp,
  Zap,
  Heart,
  QrCode,
  SlidersHorizontal,
  Compass,
  Building2,
  Shield
} from 'lucide-react';
import { ProblemTicket, TicketComment } from '../lib/types';
import { formatDate } from '../lib/dateUtils';
import { CATEGORY_PRESET_IMAGES } from '../lib/issueImagePromptEngine';

interface UserProfileActivityHubProps {
  tickets: ProblemTicket[];
  onInspectTicket?: (ticket: ProblemTicket) => void;
  onUpvoteTicket?: (ticketId: string) => void;
  onShareTicket?: (ticket: ProblemTicket) => void;
}

type ProfileTab = 'SUBMISSIONS' | 'UPVOTED' | 'DISCUSSIONS' | 'ACHIEVEMENTS';

export default function UserProfileActivityHub({
  tickets,
  onInspectTicket,
  onUpvoteTicket,
  onShareTicket
}: UserProfileActivityHubProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('SUBMISSIONS');
  const [copiedLink, setCopiedLink] = useState(false);
  const [exportingCert, setExportingCert] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const [user, setUser] = useState<{
    id: string;
    fullName: string;
    role: string;
    phone: string;
    email?: string | null;
    district?: string | null;
  }>({
    id: 'user-mangal-soren',
    fullName: 'Mangal Soren',
    role: 'STUDENT',
    phone: '+91 94311 82910',
    email: 'mangal.soren@bitsindri.ac.in',
    district: 'Dhanbad'
  });

  // Check auth session
  useEffect(() => {
    try {
      const stored = localStorage.getItem('joharsetu_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.fullName) {
          setUser(parsed);
          return;
        }
      }
    } catch {}

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyProfileLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleExportTranscript = () => {
    setExportingCert(true);
    setTimeout(() => {
      setExportingCert(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1200);
  };

  // Filter My Submissions
  const mySubmissions = tickets.filter(
    (t) =>
      t.reporterPhone === user.phone ||
      t.reporterName?.toLowerCase().includes(user.fullName.toLowerCase()) ||
      t.village?.toLowerCase().includes('baghmara') ||
      t.ticketCode === 'JH-DHN-2026-001' ||
      t.ticketCode === 'JH-DHN-2026-004'
  );
  const displaySubmissions = mySubmissions.length > 0 ? mySubmissions : tickets.slice(0, 3);

  // Filter Upvoted Issues
  const upvotedIssues = tickets.filter(
    (t) => t.socialEngagement?.hasUpvoted || (t.socialEngagement?.upvotes || 0) > 15
  );

  // User comments history
  const userComments: Array<{
    ticket: ProblemTicket;
    comment: TicketComment;
  }> = [];

  tickets.forEach((t) => {
    if (t.socialEngagement?.comments) {
      t.socialEngagement.comments.forEach((c) => {
        if (
          c.authorName?.toLowerCase().includes('mangal') ||
          c.authorName?.toLowerCase().includes(user.fullName.toLowerCase()) ||
          c.authorRole === 'CITIZEN' ||
          c.authorRole === 'STUDENT_LEAD'
        ) {
          userComments.push({ ticket: t, comment: c });
        }
      });
    }
  });

  const displayComments =
    userComments.length > 0
      ? userComments
      : [
          {
            ticket: tickets[0] || ({} as ProblemTicket),
            comment: {
              id: 'c-1',
              authorName: user.fullName,
              authorRole: 'STUDENT_LEAD' as const,
              text: 'Ground survey completed with BDO Baghmara. Water fluoride reading measured at 3.8 ppm. We are designing an activated alumina filtration column as our 4th sem capstone.',
              createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
              isOfficial: true
            }
          },
          {
            ticket: tickets[1] || ({} as ProblemTicket),
            comment: {
              id: 'c-2',
              authorName: user.fullName,
              authorRole: 'STUDENT_LEAD' as const,
              text: 'Inverter capacitors were scorched during thunderstorm lightning. Replacing with 2.5kVA hybrid solar charge controller donated by Tata Steel CSR.',
              createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
              isOfficial: false
            }
          }
        ];

  const getLifecycleStep = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 1;
      case 'AI_VERIFIED':
      case 'AI_ROUTED':
        return 2;
      case 'ACCEPTED_BY_HEI':
        return 3;
      case 'IN_PROGRESS':
        return 4;
      case 'PROTOTYPE_DEPLOYED':
      case 'FIELD_TESTED':
      case 'RESOLVED':
        return 5;
      default:
        return 3;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. AWWWARDS-LEVEL HERO PROFILE COVER & GLASS CARD */}
      <div className="relative">
        {/* Animated Aurora Cover Gradient Banner - Authentic Jharkhand Earthen Sunset */}
        <div className="relative h-44 sm:h-56 rounded-3xl overflow-hidden shadow-card bg-gradient-to-r from-terracotta via-amber-700 to-jharkhand-tribal border border-sand-400/30">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-terracotta/40 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-amber-400/25 blur-3xl" />
          <div className="absolute -bottom-16 right-0 w-80 h-80 rounded-full bg-jharkhand-forest/20 blur-3xl" />

          {/* Micro Grid Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60" />

          {/* Top Banner Tag */}
          <div className="absolute top-4 left-5 sm:left-7 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-sand-100 border border-sand-400/30 text-[11px] font-black tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sand-300" />
              <span>SIH26043 Civic Innovator Profile</span>
            </span>
          </div>
        </div>

        {/* Floating Glassmorphic Profile Card */}
        <div className="relative -mt-16 sm:-mt-24 mx-2 sm:mx-6 p-5 sm:p-7 rounded-3xl bg-surface/95 backdrop-blur-2xl border border-sand-300/60 shadow-[0_20px_50px_rgba(30,30,30,0.08)] z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar + Primary User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Glowing Avatar Ring */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-terracotta via-amber-600 to-jharkhand-tribal flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-lg ring-4 ring-terracotta/30 shadow-[0_0_30px_rgba(216,122,83,0.35)]">
                {user.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-jharkhand-forest ring-4 ring-surface flex items-center justify-center shadow-xs" title="Online Telemetry Active">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </span>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-charcoal">
                  {user.fullName}
                </h1>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-terracotta to-amber-600 text-white text-xs font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <span>🌟</span>
                  <span>{user.role === 'STUDENT' ? 'Top Student Changemaker' : 'NSS Ground Lead'}</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-charcoal-muted flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>{user.district || 'Dhanbad'} District, Jharkhand</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-sand-700" />
                  <span>BIT Sindri (B.Tech Mech & Env)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-charcoal-muted">
                  <Phone className="w-3 h-3" />
                  <span>{user.phone}</span>
                </span>
              </div>

              {/* Verified Identity Tags */}
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-jharkhand-forest border border-emerald-300 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-jharkhand-forest" />
                  <span>Aadhaar Verified Citizen • DPDP Act 2023</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-sand-100 text-charcoal border border-sand-300 text-[11px] font-mono font-bold">
                  ABC ID: ABC-JH-2026-88912
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleCopyProfileLink}
              className="px-3.5 py-2 rounded-xl bg-canvas border border-charcoal-border hover:border-terracotta text-charcoal hover:text-terracotta text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportTranscript}
              disabled={exportingCert}
              className="px-3.5 py-2 rounded-xl bg-canvas border border-charcoal-border hover:border-terracotta text-charcoal hover:text-terracotta text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className={`w-3.5 h-3.5 ${exportingCert ? 'animate-bounce text-terracotta' : ''}`} />
              <span>{exportingCert ? 'Exporting...' : exportSuccess ? 'Exported!' : 'DigiLocker PDF'}</span>
            </button>

            <Link
              href="/portal/citizen"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta to-amber-600 hover:from-terracotta-600 hover:to-amber-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>➕ File Issue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. GAMIFIED BENTO-GRID STAT COUNTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Bento Item 1 (Feature Tile - 2 cols on md/lg): NEP 2020 Academic Credits with SVG Radial Meter */}
        <div className="md:col-span-2 bg-gradient-to-br from-surface via-sand-50/50 to-canvas-subtle text-charcoal rounded-3xl p-5 sm:p-6 shadow-card border border-sand-300/80 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-sand-300/20 blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 text-charcoal border border-sand-300 text-[11px] font-black uppercase">
              <GraduationCap className="w-3.5 h-3.5 text-terracotta" />
              <span>NEP 2020 Experiential Learning</span>
            </span>
            <span className="text-[11px] font-bold text-jharkhand-forest font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-jharkhand-forest" />
              <span>DigiLocker Verified</span>
            </span>
          </div>

          {/* Radial Progress Centerpiece */}
          <div className="my-4 flex items-center gap-5 sm:gap-7">
            {/* Custom SVG Radial Gauge */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#E9D8B1"
                  strokeWidth="8"
                />
                {/* Active Progress Circle (100% full: 2 * PI * 40 ≈ 251.2) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="url(#creditGradient)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="creditGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D87A53" />
                    <stop offset="50%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#2D6A4F" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-charcoal leading-none">4.0</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-charcoal-muted font-black mt-0.5">
                  Credits
                </span>
              </div>
            </div>

            {/* Credit Progress Details */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-charcoal">120 Verified Field Hours</span>
                <span className="text-jharkhand-forest font-bold">100% Target Met</span>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Eligible for semester degree credits under UGC & Higher Education Dept, Govt of Jharkhand.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-charcoal flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-surface border border-charcoal-border/40 font-medium">
                  CE-302 (Water): <b className="text-terracotta">2.0 Cr</b>
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-md bg-surface border border-charcoal-border/40 font-medium">
                  EE-304 (Solar): <b className="text-terracotta">2.0 Cr</b>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-charcoal-border/40 flex items-center justify-between text-[11px] text-charcoal-muted">
            <span>Faculty Lead: <strong className="text-charcoal">Dr. R.K. Verma</strong></span>
            <span className="text-terracotta font-bold">Academic Bank of Credits</span>
          </div>
        </div>

        {/* Bento Item 2: Community Impact Level & Level-Up Progress */}
        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-charcoal-border/50 shadow-soft flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-charcoal-muted tracking-wider">
              Gamified Status
            </span>
            <span className="text-[10px] font-bold text-terracotta bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
              Top 3%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-terracotta flex items-center justify-center text-white text-lg font-black shadow-md shrink-0">
              LV8
            </div>
            <div>
              <h3 className="text-sm font-black text-charcoal">Jharkhand Vikas Nayak</h3>
              <p className="text-[11px] text-charcoal-muted">Level 8 Ground Achiever</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-charcoal font-mono">2,450 XP</span>
              <span className="text-charcoal-muted">3,000 XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-sand-200 overflow-hidden">
              <div className="w-[82%] h-full rounded-full bg-gradient-to-r from-terracotta to-amber-500" />
            </div>
            <span className="text-[10px] text-charcoal-muted block text-right font-medium">
              550 XP to Level 9 State Fellow
            </span>
          </div>
        </div>

        {/* Bento Item 3: Upvote Velocity & Citizens Impacted */}
        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-charcoal-border/50 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-charcoal-muted tracking-wider">
              Societal Impact
            </span>
            <Flame className="w-4 h-4 text-terracotta animate-bounce" />
          </div>

          <div>
            <span className="text-3xl font-black text-charcoal tracking-tight block">14,200+</span>
            <span className="text-xs text-charcoal-muted font-bold block mt-0.5">Citizens Helped</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-canvas-subtle border border-charcoal-border/40 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-charcoal">
              <span className="flex items-center gap-1 text-terracotta">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Upvote Velocity</span>
              </span>
              <span>+48 / wk</span>
            </div>
            <p className="text-[10px] text-charcoal-muted">
              Fastest resolving changemaker team in Baghmara Block
            </p>
          </div>
        </div>

        {/* Bento Item 4: Full-Width Rapid Ground Telemetry Strip */}
        <div className="md:col-span-3 lg:col-span-4 bg-gradient-to-r from-canvas-subtle via-sand-50 to-canvas-subtle rounded-2xl p-3 sm:p-4 border border-charcoal-border/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2 bg-surface rounded-xl border border-charcoal-border/30">
            <span className="text-base font-black text-charcoal block">{displaySubmissions.length}</span>
            <span className="text-[10px] text-charcoal-muted uppercase font-bold">Dispatches Filed</span>
          </div>
          <div className="p-2 bg-surface rounded-xl border border-charcoal-border/30">
            <span className="text-base font-black text-emerald-700 block">96%</span>
            <span className="text-[10px] text-charcoal-muted uppercase font-bold">Resolution Velocity</span>
          </div>
          <div className="p-2 bg-surface rounded-xl border border-charcoal-border/30">
            <span className="text-base font-black text-amber-700 block">₹12.5 Lakhs</span>
            <span className="text-[10px] text-charcoal-muted uppercase font-bold">CSR Funding Matched</span>
          </div>
          <div className="p-2 bg-surface rounded-xl border border-charcoal-border/30">
            <span className="text-base font-black text-terracotta-700 block">4.9 / 5.0</span>
            <span className="text-[10px] text-charcoal-muted uppercase font-bold">Field Mentor Rating</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE TABBED ACTIVITY FEEDS (Instagram / Reddit Style Micro-interactions) */}
      <div className="space-y-5">
        {/* Floating Pill Switcher */}
        <div className="bg-surface rounded-2xl p-1.5 border border-charcoal-border/50 shadow-soft flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('SUBMISSIONS')}
            className={`flex-1 min-w-[145px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'SUBMISSIONS'
                ? 'bg-terracotta text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Submissions</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'SUBMISSIONS' ? 'bg-white/20 text-white' : 'bg-sand-200 text-charcoal'
              }`}
            >
              {displaySubmissions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('UPVOTED')}
            className={`flex-1 min-w-[145px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'UPVOTED'
                ? 'bg-terracotta text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Hyped / Upvoted</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'UPVOTED' ? 'bg-white/20 text-white' : 'bg-sand-200 text-charcoal'
              }`}
            >
              {upvotedIssues.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DISCUSSIONS')}
            className={`flex-1 min-w-[155px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'DISCUSSIONS'
                ? 'bg-terracotta text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussions & Activity</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'DISCUSSIONS' ? 'bg-white/20 text-white' : 'bg-sand-200 text-charcoal'
              }`}
            >
              {displayComments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACHIEVEMENTS')}
            className={`flex-1 min-w-[165px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ACHIEVEMENTS'
                ? 'bg-terracotta text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Badges & Trophies</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'ACHIEVEMENTS' ? 'bg-white/20 text-white' : 'bg-sand-200 text-charcoal'
              }`}
            >
              6 Unlocked
            </span>
          </button>
        </div>

        {/* TAB 1: MY SUBMISSIONS (VISUAL PHOTO CARDS & 5-STAGE STEPPER) */}
        {activeTab === 'SUBMISSIONS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-charcoal flex items-center gap-2">
                <span>Citizen Dispatches & Resolution Tracker</span>
                <span className="text-xs text-charcoal-muted font-normal hidden sm:inline">
                  (Real-time lifecycle sync with institutional project teams)
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {displaySubmissions.map((ticket) => {
                const currentStep = getLifecycleStep(ticket.status);
                const fallbackImage = ticket.category
                  ? CATEGORY_PRESET_IMAGES[ticket.category] || '/images/issues/handpump_broken.jpg'
                  : '/images/issues/handpump_broken.jpg';
                const displayImage = ticket.imageUrls && ticket.imageUrls.length > 0 ? ticket.imageUrls[0] : fallbackImage;

                return (
                  <div
                    key={ticket.id}
                    className="bg-surface rounded-3xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all space-y-4"
                  >
                    {/* Top Row: Thumbnail, Title, and Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={displayImage}
                          alt={ticket.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-charcoal-border/40 shadow-xs shrink-0"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] font-bold text-terracotta bg-terracotta-50 px-2 py-0.5 rounded border border-terracotta-200">
                              {ticket.ticketCode}
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-sand-100 text-charcoal border border-sand-300">
                              {ticket.category.replace(/_/g, ' ')}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                ticket.urgency === 'CRITICAL'
                                  ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {ticket.urgency}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-black text-charcoal line-clamp-1">
                            {ticket.title}
                          </h3>

                          <div className="text-xs text-charcoal-muted flex items-center gap-2">
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3 h-3 text-terracotta" />
                              <span>{ticket.village || 'Baghmara'}, {ticket.district}</span>
                            </span>
                            <span>•</span>
                            <span>{formatDate(ticket.reportedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => onInspectTicket && onInspectTicket(ticket)}
                          className="px-3.5 py-2 rounded-xl bg-canvas border border-charcoal-border hover:border-terracotta text-charcoal hover:text-terracotta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span>Deep Inspector</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 5-Step Resolution Lifecycle Stepper */}
                    <div className="pt-2 border-t border-charcoal-border/30">
                      <div className="text-[11px] font-bold text-charcoal mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-terracotta">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Resolution Timeline</span>
                        </span>
                        <span className="text-charcoal-muted font-mono">
                          Step {currentStep} of 5 ({ticket.status.replace(/_/g, ' ')})
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
                        {[
                          { step: 1, label: 'Filing Logged' },
                          { step: 2, label: 'AI Georouted' },
                          { step: 3, label: 'HEI Assigned' },
                          { step: 4, label: 'Engineering' },
                          { step: 5, label: 'Verified Solved' }
                        ].map((s) => {
                          const isDone = currentStep >= s.step;
                          const isCurrent = currentStep === s.step;
                          return (
                            <div key={s.step} className="space-y-1">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isDone
                                    ? 'bg-gradient-to-r from-terracotta to-amber-500'
                                    : 'bg-sand-200'
                                } ${isCurrent ? 'ring-2 ring-terracotta/40' : ''}`}
                              />
                              <span
                                className={`text-[9px] sm:text-[10px] block truncate ${
                                  isCurrent
                                    ? 'font-black text-terracotta'
                                    : isDone
                                    ? 'font-bold text-charcoal'
                                    : 'text-charcoal-muted'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Assigned HEI Box */}
                    <div className="bg-canvas-subtle p-3 rounded-2xl border border-charcoal-border/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <GraduationCap className="w-4 h-4 text-terracotta shrink-0" />
                        <span className="text-charcoal truncate">
                          Assigned University:{' '}
                          <strong>{ticket.assignedHei?.name || 'Birsa Institute of Technology (BIT) Sindri'}</strong>
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-jharkhand-forest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0 hidden xs:inline-block">
                        NEP Capstone Active
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: HYPED / UPVOTED ISSUES GRID */}
        {activeTab === 'UPVOTED' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-charcoal flex items-center gap-2">
                <span>Community Challenges Hyped by You</span>
                <span className="text-xs text-charcoal-muted font-normal hidden sm:inline">
                  (Your upvotes boost emergency dispatch priority)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upvotedIssues.map((ticket) => {
                const fallbackImage = ticket.category
                  ? CATEGORY_PRESET_IMAGES[ticket.category] || '/images/issues/handpump_broken.jpg'
                  : '/images/issues/handpump_broken.jpg';
                const displayImage = ticket.imageUrls && ticket.imageUrls.length > 0 ? ticket.imageUrls[0] : fallbackImage;

                return (
                  <div
                    key={ticket.id}
                    onClick={() => onInspectTicket && onInspectTicket(ticket)}
                    className="bg-surface rounded-2xl border border-charcoal-border/50 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-charcoal-subtle">
                      <img
                        src={displayImage}
                        alt={ticket.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          {ticket.category.replace(/_/g, ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-terracotta text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
                          <Flame className="w-3 h-3 fill-white" />
                          <span>{ticket.socialEngagement?.upvotes || 24} Hyped</span>
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                        <span className="truncate">{ticket.village || 'Panchayat'}, {ticket.district}</span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-terracotta bg-terracotta-50 px-1.5 py-0.2 rounded border border-terracotta-200">
                          {ticket.ticketCode}
                        </span>
                        <h4 className="text-sm font-bold text-charcoal mt-1 line-clamp-1 group-hover:text-terracotta transition-colors">
                          {ticket.title}
                        </h4>
                        <p className="text-xs text-charcoal-muted line-clamp-2 mt-0.5 leading-relaxed">
                          {ticket.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-charcoal-border/30 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onUpvoteTicket) onUpvoteTicket(ticket.id);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-terracotta text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                        >
                          <Flame className="w-3.5 h-3.5 fill-white" />
                          <span>Upvoted</span>
                        </button>

                        <span className="text-[11px] font-bold text-terracotta flex items-center gap-0.5 group-hover:underline">
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DISCUSSIONS & ACTIVITY */}
        {activeTab === 'DISCUSSIONS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-charcoal flex items-center gap-2">
                <span>Civic Discussions & Field Telemetry Logs</span>
              </h2>
            </div>

            <div className="space-y-3">
              {displayComments.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-surface rounded-3xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-terracotta bg-terracotta-50 px-2 py-0.5 rounded border border-terracotta-200">
                        {item.ticket.ticketCode || 'JH-DHN-2026-001'}
                      </span>
                      <span className="text-xs font-bold text-charcoal line-clamp-1">
                        {item.ticket.title || 'Baghmara Handpump Fluoride Contamination'}
                      </span>
                    </div>

                    <span className="text-[10px] text-charcoal-muted shrink-0 font-medium">
                      {formatDate(item.comment.createdAt)}
                    </span>
                  </div>

                  <div className="bg-canvas-subtle p-3.5 rounded-2xl border border-charcoal-border/40 text-xs text-charcoal leading-relaxed">
                    <p className="italic text-charcoal-800">
                      &ldquo;{item.comment.text}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal text-[10px] font-bold border border-sand-300">
                        {item.comment.authorRole || 'STUDENT_LEAD'}
                      </span>
                      {item.comment.isOfficial && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-jharkhand-forest text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-jharkhand-forest" />
                          <span>Verified Observation</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onInspectTicket && onInspectTicket(item.ticket)}
                      className="text-[11px] font-bold text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Thread</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BADGES, ACHIEVEMENTS & DIGILOCKER TRANSCRIPT */}
        {activeTab === 'ACHIEVEMENTS' && (
          <div className="space-y-6">
            {/* DigiLocker Verifiable Credential Card - Government of Jharkhand Parchment Credential */}
            <div className="bg-gradient-to-br from-surface via-sand-50 to-canvas-subtle text-charcoal rounded-3xl p-6 sm:p-8 shadow-card border-2 border-sand-300/90 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-sand-300/20 blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-xl border border-terracotta/25 shadow-xs">
                    <Shield className="w-6 h-6 text-terracotta" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-terracotta-700 uppercase font-black block">
                      DigiLocker Certified Verifiable Transcript
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-charcoal">
                      Department of Higher & Technical Education, Government of Jharkhand
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportTranscript}
                  disabled={exportingCert}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-terracotta to-amber-600 hover:from-terracotta-600 hover:to-amber-700 text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{exportingCert ? 'Generating...' : exportSuccess ? 'Transcript Saved!' : 'Download Official PDF'}</span>
                </button>
              </div>

              {/* Certificate Telemetry Grid */}
              <div className="p-4 rounded-2xl bg-canvas border border-charcoal-border/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-charcoal-muted font-bold block">Candidate</span>
                  <span className="font-black text-charcoal text-sm">{user.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-charcoal-muted font-bold block">ABC Identifier</span>
                  <span className="font-mono text-terracotta font-black text-sm">ABC-JH-2026-88912</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-charcoal-muted font-bold block">Credits Awarded</span>
                  <span className="font-black text-jharkhand-forest text-sm">4.0 / 4.0 NEP Credits</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-charcoal-muted font-bold block">Blockchain Hash</span>
                  <span className="font-mono text-[10px] text-charcoal-muted truncate block">0x9a7b...ef125432</span>
                </div>
              </div>
            </div>

            {/* 3D-Styled Metallic Milestone Trophies Gallery */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-charcoal flex items-center gap-2">
                  <Award className="w-5 h-5 text-terracotta" />
                  <span>Milestone Trophies & Civic Badges</span>
                </h3>
                <span className="text-xs font-bold text-terracotta bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-200">
                  6 of 6 Claimed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: '🥇',
                    title: 'State Champion Scholar',
                    desc: 'Ranked #1 student changemaker in Dhanbad district under NEP 2020 experiential learning.',
                    badgeColor: 'from-amber-400 via-amber-500 to-sand-600 text-amber-950',
                    trophyTier: 'Gold Tier',
                    date: 'Unlocked Aug 2026'
                  },
                  {
                    icon: '💧',
                    title: 'Jal Rakshak Sentinel',
                    desc: 'Engineered ground filtration solutions restoring clean water to over 1,200 villagers in Baghmara.',
                    badgeColor: 'from-sky-400 via-teal-500 to-jharkhand-forest text-white',
                    trophyTier: 'Diamond Tier',
                    date: 'Unlocked Jul 2026'
                  },
                  {
                    icon: '⚡',
                    title: 'Urja Mitra Pioneer',
                    desc: 'Maintained and restored solar streetlight microgrid charge controllers during monsoon outage.',
                    badgeColor: 'from-amber-400 via-amber-500 to-terracotta text-white',
                    trophyTier: 'Ruby Tier',
                    date: 'Unlocked Jun 2026'
                  },
                  {
                    icon: '🎓',
                    title: 'NEP 2020 Degree Fellow',
                    desc: 'Completed 120 verified field hours and claimed full 4.0 academic university capstone credits.',
                    badgeColor: 'from-emerald-500 via-teal-600 to-jharkhand-forest text-white',
                    trophyTier: 'Emerald Tier',
                    date: 'Unlocked May 2026'
                  },
                  {
                    icon: '💬',
                    title: 'Jan Samvad Lead',
                    desc: 'Authored 10+ constructive field observation reports and verified technical solutions on the forum.',
                    badgeColor: 'from-sand-300 via-sand-400 to-terracotta-400 text-charcoal',
                    trophyTier: 'Sapphire Tier',
                    date: 'Unlocked Apr 2026'
                  },
                  {
                    icon: '🛡️',
                    title: 'Panchayat Sentinel',
                    desc: 'First 5 ground issues verified with GPS timestamped photo evidence and BDO counter-signature.',
                    badgeColor: 'from-stone-200 via-stone-300 to-stone-400 text-stone-900',
                    trophyTier: 'Platinum Tier',
                    date: 'Unlocked Mar 2026'
                  }
                ].map((trophy, idx) => (
                  <div
                    key={idx}
                    className="bg-surface rounded-3xl p-5 border border-charcoal-border/50 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex items-start gap-4 group"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${trophy.badgeColor} flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span>{trophy.icon}</span>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black uppercase text-terracotta tracking-wide">
                          {trophy.trophyTier}
                        </span>
                        <span className="text-[9px] font-mono text-charcoal-muted">
                          {trophy.date}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-charcoal group-hover:text-terracotta transition-colors leading-snug">
                        {trophy.title}
                      </h4>
                      <p className="text-[11px] text-charcoal-muted leading-relaxed">
                        {trophy.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
