'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Building,
  Heart,
  MessageSquare,
  Share2,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Flame,
  Volume2,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Users,
  DollarSign,
  Send,
  Eye,
  Camera,
  Layers,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ProblemTicket, UrgencyLevel, TicketCategory } from '../lib/types';
import { formatDate } from '../lib/dateUtils';
import SocialShareModal from './SocialShareModal';

interface ProblemInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ProblemTicket | null;
  userRole?: string;
  onUpvote?: (ticketId: string) => void;
  onAddComment?: (ticketId: string, text: string, authorName: string, authorRole: string) => void;
}

export default function ProblemInspectorModal({
  isOpen,
  onClose,
  ticket,
  userRole = 'CITIZEN',
  onUpvote,
  onAddComment,
}: ProblemInspectorModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(ticket?.socialEngagement?.upvotes || 1);
  const [commentsList, setCommentsList] = useState<Array<{
    id: string;
    authorName: string;
    authorRole?: string;
    text: string;
    createdAt: string;
  }>>(ticket?.socialEngagement?.comments || [
    {
      id: 'c-init-1',
      authorName: 'Mukhiya R. Murmu',
      authorRole: 'PANCHAYAT_OFFICER',
      text: 'Inspected ground site during Gram Sabha. Community drinking water pump requires urgent sorbent replacement.',
      createdAt: 'Yesterday',
    },
    {
      id: 'c-init-2',
      authorName: 'Prof. Alok Sinha',
      authorRole: 'FACULTY_MENTOR',
      text: 'Assigned to B.Tech Capstone Project Team. Sampling kit dispatched.',
      createdAt: '4 hours ago',
    }
  ]);

  if (!isOpen || !ticket) return null;

  const photos = ticket.imageUrls && ticket.imageUrls.length > 0
    ? ticket.imageUrls
    : ['/images/issues/handpump_broken.jpg'];

  const handleToggleUpvote = () => {
    if (hasLiked) {
      setUpvotesCount((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    } else {
      setUpvotesCount((prev) => prev + 1);
      setHasLiked(true);
    }
    if (onUpvote) {
      onUpvote(ticket.id);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newC = {
      id: 'c-' + Date.now(),
      authorName: 'You (Citizen / Evaluator)',
      authorRole: 'CITIZEN',
      text: commentText.trim(),
      createdAt: 'Just now',
    };

    setCommentsList((prev) => [newC, ...prev]);
    if (onAddComment) {
      onAddComment(ticket.id, commentText.trim(), 'Citizen / Evaluator', 'CITIZEN');
    }
    setCommentText('');
  };

  const milestones = ticket.projectTeam?.milestones || [
    { id: 'ms-1', sequence: 1, title: 'Ground Diagnostic Sampling & Chemical Analysis', status: 'APPROVED', targetDate: '2026-09-15', sha256Hash: '9a7bc48f120e' },
    { id: 'ms-2', sequence: 2, title: 'Indigenous Sorbent Column Fabrication', status: 'IN_PROGRESS', targetDate: '2026-09-28' },
    { id: 'ms-3', sequence: 3, title: 'Community Field Pilot Deployment', status: 'PENDING', targetDate: '2026-10-10' },
    { id: 'ms-4', sequence: 4, title: 'Gram Panchayat Handover & NEP Credits Conferral', status: 'PENDING', targetDate: '2026-10-25' },
  ];

  const totalFunded = ticket.projectTeam?.sponsors?.reduce((acc, s) => acc + s.amount, 0) || (ticket.crowdfunding?.raisedAmount || 45000);
  const targetBudget = 150000;
  const fundedPct = Math.min(100, Math.round((totalFunded / targetBudget) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-4xl rounded-3xl border border-charcoal-border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-sand-100/70 via-canvas to-terracotta-50 border-b border-charcoal-border/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-sand-200 text-sand-950 border border-sand-400/50 shadow-xs shrink-0">
              {ticket.ticketCode}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-terracotta text-white uppercase tracking-wider shrink-0">
              {ticket.category.replace(/_/g, ' ')}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                ticket.urgency === 'CRITICAL'
                  ? 'bg-red-100 text-red-800'
                  : ticket.urgency === 'HIGH'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {ticket.urgency}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 rounded-xl bg-surface hover:bg-sand-100 text-charcoal border border-charcoal-border text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-terracotta" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-sand-100 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
          
          {/* Main Title & Ground Details */}
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-charcoal tracking-tight">
              {ticket.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-charcoal-muted text-[11px]">
              <span className="flex items-center gap-1 font-medium text-charcoal">
                <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                <span>{ticket.village || 'Village'}, {ticket.district}</span>
              </span>
              <span>•</span>
              <span className="font-mono" suppressHydrationWarning>Reported: {formatDate(ticket.reportedAt)}</span>
              <span>•</span>
              <span>Reported by: <strong>{ticket.reporterName}</strong></span>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-charcoal leading-relaxed bg-canvas p-3.5 rounded-2xl border border-charcoal-border/40">
              {ticket.description}
            </p>
          </div>

          {/* Media Reel & Vision AI Forensic Analysis (2-Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left 7-cols: High-Res Photo Reel */}
            <div className="lg:col-span-7 space-y-2">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-charcoal-border/50 bg-black/10 group shadow-soft">
                <img
                  src={photos[activePhotoIdx]}
                  alt="Ground Evidence"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Photo Counter */}
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                  Photo {activePhotoIdx + 1} of {photos.length}
                </span>

                {/* Arrow navigation if multiple */}
                {photos.length > 1 && (
                  <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                      className="pointer-events-auto p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                      className="pointer-events-auto p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                        activePhotoIdx === idx ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-charcoal-border'
                      }`}
                    >
                      <img src={p} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right 5-cols: Vision AI & Forensic Tags */}
            <div className="lg:col-span-5 bg-surface rounded-2xl p-4 border border-charcoal-border/50 shadow-soft flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-charcoal-border/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal">
                    <Sparkles className="w-4 h-4 text-terracotta" />
                    <span>YOLOv8 Vision AI Forensic Check</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    94.8% Conf.
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase">Detected Defect Signatures</span>
                  {[
                    { label: 'Ground Infrastructure Anomaly', score: '96.2%' },
                    { label: 'Severe Structural Corrosion & Wear', score: '94.8%' },
                    { label: 'Aquifer Sediment / Contamination Staining', score: '89.4%' },
                    { label: 'Verified Physical Coordinate Geometry', score: '98.0%' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-canvas border border-charcoal-border/30 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-charcoal">{item.label}</span>
                      <span className="font-mono font-bold text-emerald-800">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GIS Pin Coordinates Preview */}
              <div className="p-3 rounded-xl bg-sand-50 border border-sand-300/80 text-[11px] space-y-1">
                <span className="font-bold text-sand-950 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>GPS Anchor: {ticket.latitude.toFixed(4)}° N, {ticket.longitude.toFixed(4)}° E</span>
                </span>
                <p className="text-[10px] text-charcoal-muted">
                  Spatial radius mapped to nearest institutional engineering hub ({ticket.assignedHei?.name || 'Local HEI'}).
                </p>
              </div>
            </div>

          </div>

          {/* Institutional & Financial Audit Trail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. Academic & Student Team Assignment */}
            <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-charcoal-border/30">
                <h3 className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-terracotta" />
                  <span>Assigned HEI & Student Capstone Team</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sand-100 text-sand-900 border border-sand-300">
                  4 NEP Credits
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-charcoal text-sm">{ticket.assignedHei?.name || 'Birla Institute of Technology (BIT) Mesra'}</p>
                <p className="text-charcoal-muted">{ticket.assignedHei?.department || 'Department of Technology Solutions'}</p>
                <p className="text-[11px] text-terracotta font-semibold">
                  Mentor: {ticket.assignedHei?.facultyMentor || 'Prof. Dr. A. K. Sinha'}
                </p>
              </div>

              {/* Student Volunteers Roster */}
              <div className="pt-2 border-t border-charcoal-border/20 space-y-1.5">
                <span className="text-[10px] font-bold text-charcoal-muted uppercase">Student Field Lead Engineers</span>
                <div className="flex flex-wrap gap-2">
                  {(ticket.projectTeam?.students || [
                    { name: 'Rahul Verma', role: 'Lead Prototyper', rollNo: '22JE0451' },
                    { name: 'Pooja Murmu', role: 'Field Volunteer', rollNo: '22JE0512' }
                  ]).map((st, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-canvas text-charcoal border border-charcoal-border/50 text-[11px] font-medium flex items-center gap-1">
                      <Users className="w-3 h-3 text-sand-700" />
                      <span>{st.name} ({st.rollNo})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones Progress */}
              <div className="pt-2 border-t border-charcoal-border/20 space-y-2">
                <span className="text-[10px] font-bold text-charcoal-muted uppercase">Experiential Milestone Pipeline</span>
                <div className="space-y-1.5">
                  {milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-canvas border border-charcoal-border/30">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                          m.status === 'APPROVED' ? 'bg-emerald-600 text-white' : m.status === 'IN_PROGRESS' ? 'bg-amber-600 text-white' : 'bg-charcoal-border text-charcoal-muted'
                        }`}>
                          {m.sequence}
                        </span>
                        <span className="truncate text-charcoal font-medium">{m.title}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : m.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-sand-100 text-sand-800'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. CSR Financial Match & Co-Financing */}
            <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-charcoal-border/30">
                  <h3 className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    <span>CSR Co-Financing & 80G Escrow</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Sec 135 Compliant
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-charcoal-muted">Funded: <strong>₹{totalFunded.toLocaleString('en-IN')}</strong></span>
                    <span className="font-bold text-terracotta">Target: ₹{targetBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-sand-100 overflow-hidden border border-sand-300">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${fundedPct}%` }} />
                  </div>
                  <p className="text-[10px] text-charcoal-muted">
                    {fundedPct}% funded. Milestone disbursements released upon faculty & Gram Panchayat physical sign-off.
                  </p>
                </div>

                {/* Sponsoring Partners */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase">Committed CSR Sponsors</span>
                  <div className="p-3 rounded-xl bg-canvas border border-charcoal-border/40 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-charcoal">Tata Steel Rural Development Society</strong>
                      <span className="font-mono font-bold text-emerald-800">₹45,000</span>
                    </div>
                    <p className="text-[10px] text-charcoal-muted">80G Certificate: 80G-JHR-2026-0091 (Anchored to Block #4)</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-charcoal-border/20 flex items-center justify-between">
                <span className="text-[11px] text-charcoal-muted">Need to co-finance remaining hardware?</span>
                <button
                  type="button"
                  onClick={() => {
                    alert('Grant match committed! Redirecting to CSR Marketplace.');
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  + Pledge CSR Grant
                </button>
              </div>
            </div>

          </div>

          {/* Social Stats & Real-Time Comment Thread */}
          <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30">
              <div className="flex items-center gap-4">
                {/* Upvote button */}
                <button
                  type="button"
                  onClick={handleToggleUpvote}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-rose-50 text-rose-600 border border-rose-300 scale-105'
                      : 'bg-canvas hover:bg-sand-100 text-charcoal border border-charcoal-border'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'text-charcoal-muted'}`} />
                  <span>{upvotesCount} Upvotes</span>
                </button>

                {/* Hype Score */}
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>{ticket.socialEngagement?.hypeScore || 180} Hype Velocity</span>
                </span>
              </div>

              <span className="text-xs text-charcoal-muted font-bold">
                {commentsList.length} Community Notes
              </span>
            </div>

            {/* Comment List */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {commentsList.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-canvas border border-charcoal-border/30 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal">{c.authorName}</span>
                    <span className="text-[10px] text-charcoal-muted">{c.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-charcoal leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add verified field observation or official note..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <SocialShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          ticket={ticket}
        />
      )}
    </div>
  );
}
