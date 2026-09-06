'use client';

import React, { useState } from 'react';
import {
  Flame,
  MessageSquare,
  Share2,
  Heart,
  ShieldCheck,
  Building,
  Award,
  MapPin,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  Volume2,
  Play,
  Pause,
  Send,
  Sparkles,
  Lock,
  Users,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { ProblemTicket, TicketComment } from '../lib/types';
import { getPublicReporterIdentity, getTrendingBadge } from '../lib/rankingEngine';
import { formatDate } from '../lib/dateUtils';
import IssuePhotoThumbnail from './IssuePhotoThumbnail';
import CrowdfundModal from './CrowdfundModal';

interface SocialCivicCardProps {
  ticket: ProblemTicket;
  rankIndex?: number;
  userRole?: string;
  onUpvote?: (ticketId: string) => void;
  onAddComment?: (ticketId: string, commentText: string, authorName: string, authorRole: string) => void;
  onDonate?: (ticketId: string, amount: number, donorName: string, isCorporate: boolean, isAnonymous: boolean) => void;
  onSelectTicket?: (ticket: ProblemTicket) => void;
}

export default function SocialCivicCard({
  ticket,
  rankIndex = 0,
  userRole = 'CITIZEN',
  onUpvote,
  onAddComment,
  onDonate,
  onSelectTicket,
}: SocialCivicCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commenterRole, setCommenterRole] = useState<'CITIZEN' | 'STUDENT_LEAD' | 'FACULTY_MENTOR'>('CITIZEN');
  const [commenterName, setCommenterName] = useState('');

  const [isCrowdfundOpen, setIsCrowdfundOpen] = useState(false);
  const [isPrivilegeRevealed, setIsPrivilegeRevealed] = useState(false);

  // Audio voice note simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Share feedback
  const [shareToast, setShareToast] = useState(false);

  const privacyInfo = getPublicReporterIdentity(ticket, isPrivilegeRevealed ? 'GOVT_OFFICER' : userRole);
  const trendingBadge = ticket.socialEngagement?.trendingBadge || getTrendingBadge(ticket, rankIndex);

  const hasUpvoted = ticket.socialEngagement?.hasUpvoted || false;
  const upvoteCount = ticket.socialEngagement?.upvotes || 0;
  const comments = ticket.socialEngagement?.comments || [];
  const sharesCount = ticket.socialEngagement?.shares || 0;

  const campaign = ticket.crowdfunding;
  const nss = ticket.nssWorkflow;
  const portfolio = nss?.resolutionPortfolio;

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpvote) {
      onUpvote(ticket.id);
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `${ticket.title} - JoharSetu Civic Alert`,
      text: `Support this community issue in ${ticket.village}, ${ticket.district} on JoharSetu!`,
      url: typeof window !== 'undefined' ? `${window.location.origin}/portal/citizen#${ticket.ticketCode}` : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to clipboard
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url || `https://joharsetu.jharkhand.gov.in/issue/${ticket.ticketCode}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (onAddComment) {
      onAddComment(
        ticket.id,
        commentInput.trim(),
        commenterName.trim() || (commenterRole === 'CITIZEN' ? 'Community Member' : 'Engineering Student'),
        commenterRole
      );
    }
    setCommentInput('');
  };

  return (
    <article
      id={ticket.ticketCode}
      className="bg-surface rounded-3xl p-4 sm:p-6 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4 relative group"
    >
      {/* Top Header: Reporter Identity + Privacy Status + Dynamic Trending Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-charcoal-border/30">
        {/* Left: Anonymized Citizen / Privilege Revealed */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sand-200 to-terracotta-100 flex items-center justify-center text-charcoal font-black text-xs shrink-0 shadow-2xs">
            {privacyInfo.isMasked ? '🛡️' : '👤'}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-charcoal truncate">
                {privacyInfo.displayName}
              </span>

              {privacyInfo.isMasked ? (
                <span className="px-2 py-0.5 rounded-full bg-sand-100 text-sand-900 text-[9px] font-bold border border-sand-300 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5 text-sand-700" />
                  <span>DPDP Protected</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  <span>Official Privileged Access</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-charcoal-muted">
              <span className="font-mono">{privacyInfo.displayPhone}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span suppressHydrationWarning>{formatDate(ticket.reportedAt)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Trending Badges & Privileged Reveal Button */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {trendingBadge && (
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold shadow-2xs whitespace-nowrap">
              {trendingBadge}
            </span>
          )}

          {/* Privilege Toggle for Admins/Faculty */}
          <button
            type="button"
            onClick={() => setIsPrivilegeRevealed(!isPrivilegeRevealed)}
            className="p-1.5 rounded-xl border border-charcoal-border/50 text-charcoal-muted hover:text-charcoal hover:bg-black/5 transition-colors text-[10px] flex items-center gap-1"
            title="Toggle Government/HEI Privileged Contact View"
          >
            {isPrivilegeRevealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden xs:inline">Mask</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden xs:inline">Reveal Contact</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content: Title, Description, Watermarked Photo, and Voice Note */}
      <div className="space-y-3">
        {/* Ticket Code, Category & Urgency Pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-terracotta px-2.5 py-0.5 rounded-lg bg-terracotta-50 border border-terracotta-200">
              {ticket.ticketCode}
            </span>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider">
              {ticket.category.replace(/_/g, ' ')}
            </span>
          </div>

          <span
            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              ticket.urgency === 'CRITICAL'
                ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                : ticket.urgency === 'HIGH'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {ticket.urgency}
          </span>
        </div>

        {/* Issue Title */}
        <h3
          onClick={() => onSelectTicket && onSelectTicket(ticket)}
          className="text-base sm:text-lg font-black text-charcoal leading-snug hover:text-terracotta transition-colors cursor-pointer"
        >
          {ticket.title}
        </h3>

        {/* Issue Description */}
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed line-clamp-3">
          {ticket.description}
        </p>

        {/* Vernacular Voice Note Audio Bar (if reported with audio) */}
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-sand-50 to-canvas-subtle border border-sand-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-8 h-8 rounded-xl bg-terracotta text-white flex items-center justify-center shrink-0 shadow-xs hover:scale-105 transition-all cursor-pointer"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="min-w-0">
              <span className="text-[11px] font-extrabold text-charcoal block truncate">
                Vernacular Audio Dispatch
              </span>
              <span className="text-[10px] text-charcoal-muted">
                {isPlayingAudio ? '🔊 Playing Citizen Recording (0:24)' : '🎙️ Recorded in Local Dialect • Tap to Listen'}
              </span>
            </div>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-0.5 h-5 shrink-0">
            {[40, 70, 95, 30, 85, 60, 100, 45, 80, 50, 75, 35].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlayingAudio ? 'bg-terracotta animate-pulse' : 'bg-sand-300'
                }`}
                style={{ height: isPlayingAudio ? `${h}%` : `${h * 0.4}%` }}
              />
            ))}
          </div>
        </div>

        {/* Evidence Photo with GPS & Timestamp Watermark */}
        {ticket.imageUrls?.[0] && (
          <IssuePhotoThumbnail
            src={ticket.imageUrls[0]}
            title={ticket.title}
            category={ticket.category}
            coordinates={{ lat: ticket.latitude, lng: ticket.longitude }}
            timestamp={ticket.reportedAt}
            village={ticket.village}
            district={ticket.district}
            className="rounded-2xl overflow-hidden shadow-xs"
          />
        )}

        {/* Assigned HEI Box */}
        {ticket.assignedHei && (
          <div className="p-3 rounded-2xl bg-canvas-subtle border border-charcoal-border/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-charcoal block truncate">
                  {ticket.assignedHei.name}
                </span>
                <span className="text-[11px] text-charcoal-muted truncate block">
                  {ticket.assignedHei.department}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200 block">
                4 NEP Credits
              </span>
              <span className="text-[10px] font-bold text-terracotta">
                {ticket.assignedHei.distanceKm} km away
              </span>
            </div>
          </div>
        )}

        {/* Crowdfunding Campaign Hub (Progress Bar on Card) */}
        {campaign && (
          <div className="p-3.5 rounded-2xl bg-sand-50/90 border border-sand-300 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-extrabold text-charcoal">
                <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
                <span>Crowdfund Co-Financing</span>
                <span className="px-1.5 py-0.2 rounded bg-sand-200 text-[9px] font-bold text-sand-900">80G</span>
              </div>
              <span className="text-terracotta font-mono font-bold">
                ₹{campaign.raisedAmount.toLocaleString('en-IN')}{' '}
                <span className="text-charcoal-muted font-normal text-[10px]">/ ₹{campaign.targetAmount.toLocaleString('en-IN')}</span>
              </span>
            </div>

            <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-terracotta to-sand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-charcoal-muted">
                {campaign.backersCount} Backers • {campaign.corporateMatch?.company ? `${campaign.corporateMatch.company} 1:1 Match` : 'Milestone Escrow'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCrowdfundOpen(true);
                }}
                className="text-terracotta hover:text-terracotta-600 font-extrabold underline underline-offset-2 cursor-pointer"
              >
                Sponsor / Donate ↗
              </button>
            </div>
          </div>
        )}

        {/* Public Resolution Portfolio (Shown if RESOLVED or PROTOTYPE_DEPLOYED) */}
        {portfolio && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Verified Student Resolution Portfolio</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                NEP 2020 Certified
              </span>
            </div>

            {/* Before vs After Photos */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-xl overflow-hidden border border-charcoal-border/40 aspect-4/3 bg-black">
                <img src={portfolio.beforePhotoUrl} alt="Before" className="w-full h-full object-cover" />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 text-white text-[9px] font-bold">
                  ⚠️ Before Intervention
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-emerald-400 aspect-4/3 bg-black">
                <img src={portfolio.afterPhotoUrl} alt="After" className="w-full h-full object-cover" />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-bold">
                  ✨ Deployed Solution
                </span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-900 leading-relaxed">
              {portfolio.fieldSummary}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-emerald-200/80 text-[10px] text-emerald-800 font-medium">
              <span>Endorsed by: <b>{portfolio.facultyEndorsement}</b></span>
              <span className="font-mono text-[9px]">Hash: {portfolio.blockchainHash.substring(0, 10)}...</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Engagement Bar (Twitter/Reddit Action Row) */}
      <div className="pt-3 border-t border-charcoal-border/30 flex items-center justify-between gap-1 text-xs">
        {/* Upvote / Hype Button */}
        <button
          type="button"
          onClick={handleUpvoteClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer active:scale-95 ${
            hasUpvoted
              ? 'bg-terracotta text-white shadow-xs'
              : 'hover:bg-terracotta/10 text-charcoal hover:text-terracotta border border-transparent hover:border-terracotta/20'
          }`}
          title="Hype Up this issue to rank higher on the civic feed"
        >
          <Flame className={`w-4 h-4 ${hasUpvoted ? 'fill-white animate-bounce' : 'text-terracotta'}`} />
          <span>{upvoteCount}</span>
          <span className="hidden xs:inline">{hasUpvoted ? 'Hyped!' : 'Hype'}</span>
        </button>

        {/* Comments Expander Button */}
        <button
          type="button"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            isCommentsOpen
              ? 'bg-charcoal text-white'
              : 'hover:bg-sand-100 text-charcoal border border-transparent'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-sand-800" />
          <span>{comments.length}</span>
          <span className="hidden xs:inline">Comments</span>
        </button>

        {/* Crowdfund Action Button */}
        <button
          type="button"
          onClick={() => setIsCrowdfundOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-charcoal hover:text-terracotta hover:bg-terracotta/10 transition-all cursor-pointer"
        >
          <Heart className="w-4 h-4 text-terracotta fill-terracotta/30" />
          <span className="hidden sm:inline">Co-Fund</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShareClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-charcoal hover:bg-sand-100 transition-all cursor-pointer relative"
        >
          <Share2 className="w-4 h-4 text-sand-800" />
          <span className="hidden xs:inline">{sharesCount > 0 ? sharesCount : 'Share'}</span>

          {shareToast && (
            <span className="absolute -top-7 right-0 px-2 py-0.5 rounded bg-charcoal text-white text-[10px] font-bold shadow animate-fade-in whitespace-nowrap">
              Link Copied!
            </span>
          )}
        </button>
      </div>

      {/* Expandable Community Discussion Thread (Reddit/Twitter Style) */}
      {isCommentsOpen && (
        <div className="pt-3 border-t border-charcoal-border/30 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal">
            <span>Community & Academic Discourse ({comments.length})</span>
            <span className="text-[10px] text-charcoal-muted font-normal">Civic moderation active</span>
          </div>

          {/* Existing Comments List */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-charcoal-muted italic p-2 text-center bg-canvas-subtle rounded-xl">
                No comments yet. Start the conversation below!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-2.5 rounded-2xl bg-canvas-subtle border border-charcoal-border/30 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-charcoal">{comment.authorName}</span>
                      {comment.authorRole === 'FACULTY_MENTOR' ? (
                        <span className="px-2 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[9px] font-bold">
                          🎓 Faculty Mentor
                        </span>
                      ) : comment.authorRole === 'STUDENT_LEAD' ? (
                        <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[9px] font-bold">
                          🔬 Student Lead
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full bg-sand-100 text-sand-800 text-[9px] font-bold">
                          👤 Citizen
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-charcoal-muted" suppressHydrationWarning>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-charcoal text-[11px] leading-relaxed pl-1">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* New Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-2 pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Share an update, suggestion, or question..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-charcoal-border bg-white text-xs outline-none focus:border-terracotta"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-40 text-white font-bold text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Post</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-charcoal-muted px-1">
              <div className="flex items-center gap-2">
                <span>Post as:</span>
                <select
                  value={commenterRole}
                  onChange={(e) => setCommenterRole(e.target.value as any)}
                  className="p-1 rounded-lg border border-charcoal-border bg-white text-[11px] font-semibold text-charcoal outline-none"
                >
                  <option value="CITIZEN">👤 Citizen / Resident</option>
                  <option value="STUDENT_LEAD">🔬 Engineering Student</option>
                  <option value="FACULTY_MENTOR">🎓 Faculty Mentor</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Your name (optional)"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                className="w-36 p-1 rounded-lg border border-charcoal-border bg-white text-[11px] outline-none"
              />
            </div>
          </form>
        </div>
      )}

      {/* Crowdfund Modal */}
      {isCrowdfundOpen && (
        <CrowdfundModal
          ticket={ticket}
          isOpen={isCrowdfundOpen}
          onClose={() => setIsCrowdfundOpen(false)}
          onDonate={(tId, amt, donor, corp, anon) => {
            if (onDonate) onDonate(tId, amt, donor, corp, anon);
            setIsCrowdfundOpen(false);
          }}
        />
      )}
    </article>
  );
}
