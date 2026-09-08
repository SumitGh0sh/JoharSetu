'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  MessageCircle,
  Twitter,
  Facebook,
  Instagram,
  MapPin,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { ProblemTicket } from '../lib/types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ProblemTicket;
}

export default function SocialShareModal({
  isOpen,
  onClose,
  ticket,
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://joharsetu.jharkhand.gov.in';
  const shareUrl = `${origin}/feed?ticket=${ticket.ticketCode}`;
  const shareText = `🚨 Civic Alert in ${ticket.village}, ${ticket.district}! "${ticket.title}". Ground issue reported on JoharSetu and mapped to ${ticket.assignedHei?.name || 'Local HEI'}. Support resolution: ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=JoharSetu,JharkhandCivic,NEP2020`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleInstagramStory = () => {
    setIsGeneratingStory(true);
    // Copy link and show instructions for Instagram Stories sticker
    navigator.clipboard.writeText(shareUrl);
    setTimeout(() => {
      setIsGeneratingStory(false);
      alert(
        'Story Link Copied to Clipboard!\n\nOpen Instagram Stories, paste this link via the "LINK" sticker, and tag @JoharSetuJharkhand to boost viral awareness.'
      );
    }, 600);
  };

  const photo = ticket.imageUrls?.[0] || '/images/issues/handpump_broken.jpg';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-3xl p-5 sm:p-6 border border-charcoal-border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-charcoal">Share & Raise Public Awareness</h3>
              <p className="text-[10px] sm:text-[11px] text-charcoal-muted">1-Tap Direct Sharing for Viral Civic Engagement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sand-100 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Card Visual Preview */}
        <div className="rounded-2xl overflow-hidden border border-charcoal-border/50 bg-canvas space-y-3 relative group">
          <div className="relative h-44 w-full overflow-hidden bg-black/5">
            <img src={photo} alt={ticket.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Badges overlay */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-terracotta text-white font-mono text-[9px] font-bold shadow-xs">
                {ticket.ticketCode}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs text-[9px] font-bold">
                {ticket.category.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="absolute top-2.5 right-2.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center gap-1 shadow-xs">
                <Flame className="w-3 h-3" />
                <span>{ticket.socialEngagement?.hypeScore || 120} Hype</span>
              </span>
            </div>

            {/* Bottom Title & Village */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
              <h4 className="text-xs sm:text-sm font-extrabold leading-tight line-clamp-1">{ticket.title}</h4>
              <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-terracotta-200 shrink-0" />
                <span className="truncate">{ticket.village || 'Village'}, {ticket.district}</span>
              </p>
            </div>
          </div>

          <div className="p-3 pt-0 flex items-center justify-between text-[10px] text-charcoal-muted">
            <span>Routed to: <strong>{ticket.assignedHei?.name || 'Assigned HEI'}</strong></span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Report</span>
            </span>
          </div>
        </div>

        {/* 1-Tap Share Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>WhatsApp</span>
          </button>

          {/* Instagram Story */}
          <button
            type="button"
            onClick={handleInstagramStory}
            disabled={isGeneratingStory}
            className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 text-purple-900 border border-pink-300 font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-xs"
          >
            <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
            <span>Instagram Story</span>
          </button>

          {/* X (Twitter) */}
          <button
            type="button"
            onClick={handleTwitterShare}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-xs"
          >
            <Twitter className="w-4 h-4 text-slate-800 shrink-0" />
            <span>Post to X</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={handleFacebookShare}
            className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-xs"
          >
            <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Facebook</span>
          </button>
        </div>

        {/* Copy Direct Link */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent border-none outline-none text-charcoal font-mono text-[11px] flex-1 truncate px-1"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-terracotta hover:bg-terracotta-600 text-white shadow-xs'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
