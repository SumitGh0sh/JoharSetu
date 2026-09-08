'use client';

import React, { useState } from 'react';
import {
  Flame,
  Share2,
  MapPin,
  ChevronRight,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { ProblemTicket } from '../lib/types';
import { getTrendingBadge } from '../lib/rankingEngine';
import { CATEGORY_PRESET_IMAGES } from '../lib/issueImagePromptEngine';

interface SocialCivicCardProps {
  ticket: ProblemTicket;
  rankIndex?: number;
  userRole?: string;
  onUpvote?: (ticketId: string) => void;
  onAddComment?: (ticketId: string, commentText: string, authorName: string, authorRole: string) => void;
  onDonate?: (ticketId: string, amount: number, donorName: string, isCorporate: boolean, isAnonymous: boolean) => void;
  onSelectTicket?: (ticket: ProblemTicket) => void;
  onShare?: (ticket: ProblemTicket) => void;
  onInspect?: (ticket: ProblemTicket) => void;
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  WATER_MANAGEMENT: '💧',
  SANITATION_WASTE: '🧹',
  RURAL_ELECTRIFICATION_SOLAR: '⚡',
  SUSTAINABLE_AGRICULTURE: '🌾',
  HEALTHCARE_DELIVERY: '🏥',
  ROAD_INFRASTRUCTURE: '🛣️',
  PRIMARY_EDUCATION_DIGITAL: '📚',
  FORESTRY_ENVIRONMENT: '🌲'
};

export default function SocialCivicCard({
  ticket,
  rankIndex = 0,
  userRole = 'CITIZEN',
  onUpvote,
  onSelectTicket,
  onShare,
  onInspect,
}: SocialCivicCardProps) {
  const hasUpvoted = ticket.socialEngagement?.hasUpvoted || false;
  const upvoteCount = ticket.socialEngagement?.upvotes || 0;
  const sharesCount = ticket.socialEngagement?.shares || 0;
  const commentsCount = ticket.socialEngagement?.comments?.length ?? ticket.socialEngagement?.commentsCount ?? 0;
  const trendingBadge = ticket.socialEngagement?.trendingBadge || getTrendingBadge(ticket, rankIndex);

  const categoryIcon = CATEGORY_ICON_MAP[ticket.category] || '🌐';
  const categoryLabel = ticket.category.replace(/_/g, ' ');

  // Photo resolution: uploaded image -> category preset -> default fallback
  const defaultFallback = ticket.category ? CATEGORY_PRESET_IMAGES[ticket.category] || '/images/issues/handpump_broken.jpg' : '/images/issues/handpump_broken.jpg';
  const primaryImage = (ticket.imageUrls && ticket.imageUrls.length > 0) ? ticket.imageUrls[0] : defaultFallback;
  const [imgSrc, setImgSrc] = useState(primaryImage);

  const handleCardClick = () => {
    if (onInspect) {
      onInspect(ticket);
    } else if (onSelectTicket) {
      onSelectTicket(ticket);
    }
  };

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpvote) {
      onUpvote(ticket.id);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(ticket);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInspect) {
      onInspect(ticket);
    } else if (onSelectTicket) {
      onSelectTicket(ticket);
    }
  };

  return (
    <article
      id={ticket.ticketCode}
      onClick={handleCardClick}
      className="bg-surface rounded-2xl border border-charcoal-border/50 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden relative group"
    >
      {/* 1. Top Photo Container (Chrome Discover / Instagram Post Style) */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-charcoal-subtle border-b border-charcoal-border/20">
        <img
          src={imgSrc}
          alt={ticket.title}
          onError={() => setImgSrc(defaultFallback)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Ambient Dark Gradient Overlays for readable badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

        {/* Top Badges: Category Tag & Urgency Level */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-sm">
            <span>{categoryIcon}</span>
            <span className="truncate max-w-[130px]">{categoryLabel}</span>
          </span>

          <span
            className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm ${
              ticket.urgency === 'CRITICAL'
                ? 'bg-red-600/90 text-white border border-red-400 animate-pulse'
                : ticket.urgency === 'HIGH'
                ? 'bg-amber-600/90 text-white border border-amber-400'
                : ticket.urgency === 'MEDIUM'
                ? 'bg-yellow-600/90 text-white border border-yellow-300'
                : 'bg-emerald-600/90 text-white border border-emerald-300'
            }`}
          >
            {ticket.urgency}
          </span>
        </div>

        {/* Bottom Overlay on Image: Geo-Location & Capture Watermark */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none text-xs">
          <div className="flex items-center gap-1.5 font-bold tracking-tight drop-shadow-md truncate">
            <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <span className="truncate">{ticket.village || 'Panchayat'}, {ticket.district}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-sand-200 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10 font-mono shrink-0">
            <Smartphone className="w-2.5 h-2.5" />
            <span>Mobile Capture</span>
          </div>
        </div>
      </div>

      {/* 2. Card Body Content */}
      <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
        {/* Quick-Action Engagement Strip (Directly below photo) */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-charcoal-border/30 text-xs">
          <div className="flex items-center gap-2">
            {/* 1-Tap Upvote / Hype Button */}
            <button
              type="button"
              onClick={handleUpvoteClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer active:scale-95 text-xs ${
                hasUpvoted
                  ? 'bg-gradient-to-r from-terracotta to-amber-600 text-white shadow-xs'
                  : 'hover:bg-terracotta/10 text-charcoal hover:text-terracotta border border-charcoal-border/40 bg-surface'
              }`}
              title="Hype up this civic challenge"
            >
              <Flame className={`w-4 h-4 ${hasUpvoted ? 'fill-white text-white' : 'text-terracotta'}`} />
              <span>{upvoteCount}</span>
            </button>

            {/* Comment Count Trigger */}
            <button
              type="button"
              onClick={handleCommentClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-charcoal hover:text-terracotta hover:bg-sand-100 transition-all border border-charcoal-border/40 cursor-pointer text-xs bg-surface"
              title="View community discussions and comments"
            >
              <MessageSquare className="w-4 h-4 text-charcoal-muted" />
              <span>{commentsCount}</span>
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShareClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-charcoal hover:text-terracotta hover:bg-sand-100 transition-all border border-charcoal-border/40 cursor-pointer text-xs bg-surface"
              title="Share story on WhatsApp, Instagram, or X"
            >
              <Share2 className="w-4 h-4 text-sand-800" />
              <span className="hidden xs:inline">{sharesCount > 0 ? sharesCount : 'Share'}</span>
            </button>
          </div>

          {/* Right Ticket Code Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-mono text-[11px] font-bold text-terracotta bg-terracotta-50 px-2 py-0.5 rounded border border-terracotta-200">
              {ticket.ticketCode}
            </span>
          </div>
        </div>

        {/* Scannable Header: Title, Status, and 2-Line Truncated Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {trendingBadge && (
              <span className="text-[10px] font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 truncate">
                {trendingBadge}
              </span>
            )}
            {ticket.status === 'RESOLVED' && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Resolved</span>
              </span>
            )}
            {ticket.status === 'IN_PROGRESS' && (
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" />
                <span>In Progress</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-black text-charcoal leading-snug group-hover:text-terracotta transition-colors line-clamp-1">
            {ticket.title}
          </h3>

          <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-2">
            {ticket.description}
          </p>
        </div>

        {/* Footer Essentials: Assigned HEI & Deep Inspect Action */}
        <div className="pt-2.5 flex items-center justify-between gap-2 text-xs border-t border-charcoal-border/20 mt-auto">
          <div className="text-[11px] text-charcoal-muted truncate">
            {ticket.assignedHei?.name ? (
              <span className="font-medium">
                Assigned: <strong className="text-charcoal font-bold">{ticket.assignedHei.name}</strong>
              </span>
            ) : (
              <span className="text-sand-700 italic">Awaiting HEI Acceptance</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-terracotta group-hover:underline shrink-0">
            <span>Inspect</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
}
