'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Compass,
  Flame,
  Plus,
  MapPin,
  Trophy,
  User,
  Layers,
  Sparkles
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view');

  const isFeedActive = (pathname === '/feed' && currentView !== 'map') || pathname === '/';
  const isReportActive = pathname.startsWith('/portal/citizen');
  const isMapActive = pathname === '/map' || (pathname === '/feed' && currentView === 'map');
  const isLeaderboardActive = pathname === '/leaderboard';
  const isProfileActive = pathname === '/profile' || pathname === '/activity';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-charcoal-border/50 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden transition-all pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto px-3 flex items-center justify-between h-16 relative">
        {/* 1. Feed Item */}
        <Link
          href="/feed"
          prefetch={true}
          className={`flex-1 flex flex-col items-center justify-center py-1 group transition-all ${
            isFeedActive ? 'text-terracotta' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <Flame
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isFeedActive ? 'fill-terracotta text-terracotta scale-110' : ''
              }`}
            />
            {isFeedActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isFeedActive ? 'font-black' : 'font-medium'}`}>
            Feed
          </span>
        </Link>

        {/* 2. Map View Item */}
        <Link
          href="/feed?view=map"
          prefetch={true}
          className={`flex-1 flex flex-col items-center justify-center py-1 group transition-all ${
            isMapActive ? 'text-terracotta' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <MapPin
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isMapActive ? 'fill-terracotta text-terracotta scale-110' : ''
              }`}
            />
            {isMapActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isMapActive ? 'font-black' : 'font-medium'}`}>
            Map View
          </span>
        </Link>

        {/* 3. Center Elevated Report Action Button (Instagram / Reddit Action Pill) */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-5 relative z-10">
          <Link
            href="/portal/citizen"
            prefetch={true}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 group ${
              isReportActive
                ? 'bg-terracotta-700 text-white ring-4 ring-terracotta/30 shadow-terracotta/40 scale-105'
                : 'bg-gradient-to-tr from-terracotta via-terracotta to-amber-500 text-white ring-4 ring-surface shadow-terracotta/30 hover:scale-105'
            }`}
            title="Report a Civic Issue (AI & Manual)"
          >
            <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
          </Link>
          <span className={`text-[10px] tracking-tight mt-1 ${isReportActive ? 'font-black text-terracotta' : 'font-semibold text-charcoal'}`}>
            Report
          </span>
        </div>

        {/* 4. Leaderboard Item */}
        <Link
          href="/leaderboard"
          prefetch={true}
          className={`flex-1 flex flex-col items-center justify-center py-1 group transition-all ${
            isLeaderboardActive ? 'text-terracotta' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <Trophy
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isLeaderboardActive ? 'fill-terracotta text-terracotta scale-110' : ''
              }`}
            />
            {isLeaderboardActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isLeaderboardActive ? 'font-black' : 'font-medium'}`}>
            Leaderboard
          </span>
        </Link>

        {/* 5. User Profile & Activity Hub Item */}
        <Link
          href="/profile"
          prefetch={true}
          className={`flex-1 flex flex-col items-center justify-center py-1 group transition-all ${
            isProfileActive ? 'text-terracotta' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <User
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isProfileActive ? 'fill-terracotta text-terracotta scale-110' : ''
              }`}
            />
            {isProfileActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isProfileActive ? 'font-black' : 'font-medium'}`}>
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
