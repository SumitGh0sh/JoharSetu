'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Flame,
  Search,
  Filter,
  Volume2,
  Share2,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowRight,
  Image as ImageIcon,
  Map as MapIcon,
  Grid
} from 'lucide-react';
import { ProblemTicket, TicketCategory } from '../lib/types';
import SocialCivicCard from './SocialCivicCard';
import SocialShareModal from './SocialShareModal';
import ProblemInspectorModal from './ProblemInspectorModal';
import AgencyMapView from './AgencyMapView';

interface LiveCivicFeedProps {
  tickets: ProblemTicket[];
  userRole?: string;
  onUpvoteTicket?: (ticketId: string) => void;
  onAddComment?: (ticketId: string, text: string, author: string, role: string) => void;
  onDonateCampaign?: (ticketId: string, amount: number, donorName: string, isCorporate: boolean, isAnonymous: boolean) => void;
}

const DISTRICT_LIST = [
  'All Districts',
  'Ranchi',
  'Dhanbad',
  'East Singhbhum',
  'Bokaro',
  'Hazaribagh',
  'Dumka',
  'Deoghar',
  'Palamu',
  'Giridih',
  'West Singhbhum',
  'Ramgarh',
  'Khunti',
  'Gumla',
  'Lohardaga',
  'Simdega',
  'Latehar',
  'Garhwa',
  'Chatra',
  'Koderma',
  'Jamtara',
  'Godda',
  'Pakur',
  'Sahebganj',
  'Saraikela'
];

const CATEGORY_TABS: { label: string; value: string; icon: string }[] = [
  { label: 'All Categories', value: 'ALL', icon: '🌐' },
  { label: 'Water Management', value: 'WATER_MANAGEMENT', icon: '💧' },
  { label: 'Roads & Infra', value: 'ROADS_INFRASTRUCTURE', icon: '🛣️' },
  { label: 'Sanitation', value: 'SANITATION', icon: '🧹' },
  { label: 'Healthcare', value: 'HEALTHCARE', icon: '🏥' },
  { label: 'Education', value: 'EDUCATION', icon: '📚' },
  { label: 'Electricity', value: 'ELECTRICITY', icon: '⚡' },
  { label: 'Agriculture', value: 'AGRICULTURE', icon: '🌾' }
];

export default function LiveCivicFeed({
  tickets,
  userRole = 'CITIZEN',
  onUpvoteTicket,
  onAddComment,
  onDonateCampaign
}: LiveCivicFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams?.get('view');
  const [feedView, setFeedView] = useState<'GRID' | 'MAP'>(viewParam === 'map' ? 'MAP' : 'GRID');

  useEffect(() => {
    if (viewParam === 'map') {
      setFeedView('MAP');
    } else if (viewParam === 'feed') {
      setFeedView('GRID');
    }
  }, [viewParam]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'TRENDING' | 'URGENCY' | 'NEWEST' | 'RESOLVED'>('TRENDING');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal inspection & share states
  const [sharingTicket, setSharingTicket] = useState<ProblemTicket | null>(null);
  const [inspectingTicket, setInspectingTicket] = useState<ProblemTicket | null>(null);

  // Filter and Sort tickets
  const filteredTickets = useMemo(() => {
    let list = [...tickets];

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.ticketCode.toLowerCase().includes(q) ||
          t.village.toLowerCase().includes(q) ||
          t.district.toLowerCase().includes(q) ||
          (t.assignedHei?.name && t.assignedHei.name.toLowerCase().includes(q))
      );
    }

    // District filter
    if (selectedDistrict !== 'All Districts') {
      list = list.filter((t) => t.district.toLowerCase() === selectedDistrict.toLowerCase());
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    // Sort order
    if (sortBy === 'TRENDING') {
      list.sort((a, b) => {
        const scoreA = (a.socialEngagement?.upvotes || 0) * 3 + (a.socialEngagement?.commentsCount || 0) * 5;
        const scoreB = (b.socialEngagement?.upvotes || 0) * 3 + (b.socialEngagement?.commentsCount || 0) * 5;
        return scoreB - scoreA;
      });
    } else if (sortBy === 'URGENCY') {
      const urgencyRank = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
      list.sort((a, b) => (urgencyRank[b.urgency] || 0) - (urgencyRank[a.urgency] || 0));
    } else if (sortBy === 'NEWEST') {
      list.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
    } else if (sortBy === 'RESOLVED') {
      list = list.filter((t) => t.status === 'RESOLVED' || t.status === 'PROTOTYPE_DEPLOYED');
    }

    return list;
  }, [tickets, searchQuery, selectedDistrict, selectedCategory, sortBy]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Metrics calculations
  const totalUpvotes = tickets.reduce((acc, t) => acc + (t.socialEngagement?.upvotes || 0), 0);
  const activeCapstones = tickets.filter((t) => t.assignedHei && t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'PROTOTYPE_DEPLOYED').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Hero Banner: Live Civic Social Stream */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-charcoal via-[#2A2320] to-[#1E1A18] text-white p-6 sm:p-8 shadow-card border border-sand-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-terracotta/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-sand-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/20 text-sand-200 border border-terracotta/30 text-xs font-black tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-terracotta animate-ping" />
                Live Civic Stream
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
                Jharkhand Statewide Feed • DPDP Compliant
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Gram & Nagar Voice: <span className="text-sand-300">Live Problem Feed</span>
            </h1>
            <p className="text-sm sm:text-base text-sand-100/80 leading-relaxed">
              Explore citizen dispatches across 24 districts in Jharkhand. Upvote pressing challenges to elevate their priority, inspect AI vision tags, and witness HEI engineering teams deploy NEP 2020 solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link
              href="/portal/citizen"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-terracotta to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-black text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>📢 Report an Issue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all"
            >
              <span>🏆 View Impact Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black text-sand-300">{tickets.length}</span>
            <span className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
              Citizen Dispatches
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black text-terracotta-300">
              {totalUpvotes.toLocaleString()}
            </span>
            <span className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
              Community Hypes
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black text-emerald-300">{activeCapstones}</span>
            <span className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
              Active HEI Teams
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black text-teal-300">{resolvedCount}</span>
            <span className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
              Field Solutions Verified
            </span>
          </div>
        </div>
      </div>

      {/* View Mode Switcher: Photo Feed vs GIS Spatial Heatmap */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-2.5 sm:p-3 rounded-2xl border border-charcoal-border/50 shadow-soft">
        <div className="flex items-center gap-1.5 p-1 bg-canvas-subtle rounded-xl border border-charcoal-border/30">
          <button
            type="button"
            onClick={() => {
              setFeedView('GRID');
              router.push('/feed');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              feedView === 'GRID'
                ? 'bg-white text-terracotta shadow-xs border border-charcoal-border/40'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo Dispatches</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sand-200 text-charcoal font-semibold">
              {filteredTickets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFeedView('MAP');
              router.push('/feed?view=map');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              feedView === 'MAP'
                ? 'bg-white text-terracotta shadow-xs border border-charcoal-border/40'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>GIS Heatmap View</span>
          </button>
        </div>

        <div className="text-xs text-charcoal-muted font-medium px-2">
          {feedView === 'GRID' ? (
            <span>📸 <strong>Photo-Centric Cards</strong> • 1-tap Hype, Comment & Share</span>
          ) : (
            <span>🗺️ <strong>Spatial Cluster Layer</strong> • Heatmap & Geo-markers</span>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface rounded-3xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by issue title, village, ticket code, or HEI..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-muted hover:text-charcoal font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* District Select */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[170px]">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs font-bold text-charcoal focus:outline-none focus:border-terracotta transition-all cursor-pointer"
              >
                {DISTRICT_LIST.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-2xl border border-charcoal-border/50 text-charcoal hover:bg-canvas hover:text-terracotta transition-all ${
                isRefreshing ? 'animate-spin text-terracotta' : ''
              }`}
              title="Refresh live stream"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-terracotta text-white shadow-xs'
                    : 'bg-canvas text-charcoal hover:bg-sand-100 border border-charcoal-border/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-charcoal-border/20 text-xs">
          <div className="flex items-center gap-1.5 text-charcoal-muted font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort By:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSortBy('TRENDING')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                sortBy === 'TRENDING'
                  ? 'bg-terracotta/15 text-terracotta border border-terracotta/30'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending & Hyped</span>
            </button>

            <button
              onClick={() => setSortBy('URGENCY')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                sortBy === 'URGENCY'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Critical Urgency</span>
            </button>

            <button
              onClick={() => setSortBy('NEWEST')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                sortBy === 'NEWEST'
                  ? 'bg-sand-200 text-charcoal border border-sand-300'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Newest First</span>
            </button>

            <button
              onClick={() => setSortBy('RESOLVED')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                sortBy === 'RESOLVED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Solved</span>
            </button>
          </div>

          <div className="text-[11px] font-bold text-charcoal-muted ml-auto">
            Showing <span className="text-charcoal">{filteredTickets.length}</span> dispatches
          </div>
        </div>
      </div>

      {/* Main Stream Cards Grid or GIS Heatmap */}
      {feedView === 'MAP' ? (
        <div className="bg-surface rounded-3xl p-3 sm:p-5 border border-charcoal-border/50 shadow-soft">
          <AgencyMapView
            tickets={filteredTickets}
            onSelectTicket={(t) => setInspectingTicket(t)}
            title="Jharkhand Live Problem Spatial Heatmap"
            subtitle={`Displaying ${filteredTickets.length} active civic dispatches across ${selectedDistrict}`}
          />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-surface rounded-3xl p-12 text-center border border-charcoal-border/50 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sand-100 flex items-center justify-center text-2xl">
            🔍
          </div>
          <h3 className="text-base font-black text-charcoal">No Citizen Dispatches Found</h3>
          <p className="text-xs text-charcoal-muted max-w-md mx-auto">
            Try resetting your search query, choosing &ldquo;All Districts&rdquo;, or picking another problem category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDistrict('All Districts');
              setSelectedCategory('ALL');
              setSortBy('TRENDING');
            }}
            className="px-4 py-2 rounded-xl bg-terracotta text-white font-bold text-xs hover:bg-terracotta-600 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTickets.map((ticket, idx) => (
            <SocialCivicCard
              key={ticket.id}
              ticket={ticket}
              rankIndex={idx}
              userRole={userRole}
              onUpvote={onUpvoteTicket}
              onAddComment={onAddComment}
              onDonate={onDonateCampaign}
              onShare={(t) => setSharingTicket(t)}
              onInspect={(t) => setInspectingTicket(t)}
            />
          ))}
        </div>
      )}

      {/* Modal Viewers */}
      {sharingTicket && (
        <SocialShareModal
          isOpen={!!sharingTicket}
          onClose={() => setSharingTicket(null)}
          ticket={sharingTicket}
        />
      )}

      {inspectingTicket && (
        <ProblemInspectorModal
          isOpen={!!inspectingTicket}
          onClose={() => setInspectingTicket(null)}
          ticket={inspectingTicket}
          userRole={userRole}
        />
      )}
    </div>
  );
}
