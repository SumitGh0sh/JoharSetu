'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  X
} from 'lucide-react';

export interface CampaignSlide {
  id: string;
  badge: string;
  badgeType: 'csr' | 'college';
  title: string;
  subtitle: string;
  fundTarget: string;
  fundRaised: string;
  partnerCount: number;
  imageUrl: string;
  primaryAction: string;
  secondaryAction: string;
  highlights: string[];
}

const CAMPAIGN_SLIDES: CampaignSlide[] = [
  {
    id: 'slide-csr-fund',
    badge: 'Government & CSR Co-Financing Scheme',
    badgeType: 'csr',
    title: 'Jharkhand Rural Water & Village Infrastructure Fund',
    subtitle: 'Matching ₹1 for every ₹1 of Corporate CSR committed to solve rural handpump, road culvert, and irrigation challenges across 24 districts.',
    fundTarget: '₹5.00 Crore',
    fundRaised: '₹3.42 Crore (68%)',
    partnerCount: 14,
    imageUrl: '/images/banners/csr_campaign_banner.jpg',
    primaryAction: 'Sponsor Project',
    secondaryAction: 'View Scheme Details',
    highlights: ['100% Tax Exemption 80G', 'Direct HEI Escrow', 'Milestone Verified Releases']
  },
  {
    id: 'slide-college-drive',
    badge: 'University Engineering Crowdfunding Drive',
    badgeType: 'college',
    title: 'Student Engineering Innovation Drive in Jharkhand',
    subtitle: 'Backing undergraduate student engineering capstones at BIT Mesra, IIT (ISM) Dhanbad, and NIT Jamshedpur building real rural technologies.',
    fundTarget: '₹1.50 Crore',
    fundRaised: '₹98.50 Lakh (65%)',
    partnerCount: 28,
    imageUrl: '/images/banners/college_innovation_banner.jpg',
    primaryAction: 'Donate Equipment',
    secondaryAction: 'View Student Teams',
    highlights: ['NEP 2020 Capstone Credits', 'Hardware Lab Sponsoring', 'On-ground Village Deployments']
  }
];

interface CampaignBannerCarouselProps {
  onSponsorClick?: (campaignTitle: string) => void;
  className?: string;
}

export default function CampaignBannerCarousel({
  onSponsorClick,
  className = ''
}: CampaignBannerCarouselProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    title: string;
    type: 'sponsor' | 'donate' | 'details';
  } | null>(null);
  const [modalSuccessMsg, setModalSuccessMsg] = useState<string | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState('250000');
  const [orgName, setOrgName] = useState('Tata Steel Rural Foundation');

  const currentSlide = CAMPAIGN_SLIDES[currentSlideIndex];

  // Auto slide timer
  useEffect(() => {
    if (isPaused || activeModal?.isOpen) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, activeModal?.isOpen]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + CAMPAIGN_SLIDES.length) % CAMPAIGN_SLIDES.length);
  };

  const openActionModal = (actionType: 'sponsor' | 'donate' | 'details') => {
    setActiveModal({
      isOpen: true,
      title: currentSlide.title,
      type: actionType
    });
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSponsorClick) {
      onSponsorClick(currentSlide.title);
    }
    setModalSuccessMsg(`Thank you! Your pledge for "${currentSlide.title}" was submitted and anchored to the JoharSetu CSR ledger.`);
    setTimeout(() => {
      setModalSuccessMsg(null);
      setActiveModal(null);
    }, 2800);
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-sand-300 shadow-soft transition-all ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Netflix-style Gradient Overlays */}
      <div className="relative min-h-[440px] sm:min-h-[500px] w-full bg-charcoal overflow-hidden flex flex-col justify-end">
        <img
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
        />

        {/* Netflix-style smooth directional gradient scrims */}
        {/* Left-to-right horizontal dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 via-45% to-transparent pointer-events-none" />
        {/* Bottom-to-top vertical dark gradient */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        {/* Top-down soft vignette for top controls */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

        {/* Slide Indicator Dots (Top Right) */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
          {CAMPAIGN_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlideIndex ? 'w-6 bg-sand-300' : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Direct Content Area on Gradient (No opaque card box) */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 pb-8 sm:pb-10 max-w-3xl space-y-4">
          {/* Category Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-terracotta text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/20 shadow-md">
            {currentSlide.badgeType === 'csr' ? (
              <Building2 className="w-3.5 h-3.5 text-sand-200" />
            ) : (
              <GraduationCap className="w-3.5 h-3.5 text-sand-200" />
            )}
            <span>{currentSlide.badge}</span>
          </div>

          {/* Main Title - Pure High-Contrast White with Text Shadow */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {currentSlide.title}
          </h2>

          {/* Subtitle - Warm Sand / Light Text with Text Shadow */}
          <p className="text-xs sm:text-sm md:text-base text-sand-100 leading-relaxed font-normal max-w-2xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            {currentSlide.subtitle}
          </p>

          {/* Metrics Bar - Translucent Dark Chips */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs pt-1">
            <div className="bg-black/50 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/15 shadow-sm">
              <span className="text-[10px] text-sand-200 font-bold uppercase block">Target Pool</span>
              <span className="font-mono font-bold text-sm text-white">{currentSlide.fundTarget}</span>
            </div>
            <div className="bg-black/50 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/15 shadow-sm">
              <span className="text-[10px] text-emerald-300 font-bold uppercase block">Committed</span>
              <span className="font-mono font-bold text-sm text-emerald-300">{currentSlide.fundRaised}</span>
            </div>
            <div className="hidden xs:flex flex-col bg-black/50 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/15 shadow-sm">
              <span className="text-[10px] text-sand-200 font-bold uppercase block">Active Backers</span>
              <span className="font-mono font-bold text-sm text-white">{currentSlide.partnerCount} Organizations</span>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => openActionModal(currentSlide.badgeType === 'csr' ? 'sponsor' : 'donate')}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs sm:text-sm font-bold shadow-xl transition-all cursor-pointer transform hover:scale-105 active:scale-100"
            >
              <HeartHandshake className="w-4 h-4 text-sand-200" />
              <span>{currentSlide.primaryAction}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>

            <button
              onClick={() => openActionModal('details')}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold backdrop-blur-sm border border-white/30 transition-all cursor-pointer shadow-md"
            >
              <span>{currentSlide.secondaryAction}</span>
            </button>
          </div>

          {/* Highlights Ticker */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-sand-100">
            {currentSlide.highlights.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/15 text-white/90 font-medium drop-shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{h}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Arrows (Bottom Right) */}
        <div className="absolute right-4 sm:right-6 bottom-4 sm:bottom-6 z-20 flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/30 transition-all cursor-pointer shadow-md"
            aria-label="Previous Campaign Banner"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/30 transition-all cursor-pointer shadow-md"
            aria-label="Next Campaign Banner"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Action Modal */}
      {activeModal?.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-surface rounded-2xl p-6 sm:p-7 border border-sand-300 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta" />
                <h3 className="font-bold text-charcoal text-base">
                  {activeModal.type === 'sponsor' ? 'Sponsor CSR Challenge' : activeModal.type === 'donate' ? 'Donate Hardware / Labs' : 'Campaign Scheme Details'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-sand-100 text-charcoal-muted"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{modalSuccessMsg}</span>
              </div>
            ) : activeModal.type === 'details' ? (
              <div className="space-y-3 text-xs text-charcoal">
                <p className="leading-relaxed text-charcoal-muted">
                  {currentSlide.subtitle}
                </p>
                <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-charcoal-muted">Administering Agency:</span>
                    <span className="font-bold text-charcoal">Higher & Technical Education, GoJ</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-charcoal-muted">Disbursement Model:</span>
                    <span className="font-bold text-emerald-700">Cryptographic Milestone Escrow</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-charcoal-muted">Participating HEIs:</span>
                    <span className="font-bold text-terracotta">IIT (ISM), BIT Mesra, NIT Jamshedpur, BAU</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveModal({ isOpen: true, title: currentSlide.title, type: 'sponsor' })}
                    className="px-4 py-2 rounded-xl bg-terracotta text-white font-bold text-xs"
                  >
                    Proceed to Pledge Grant
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Corporate / Donor Organization</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 focus:border-terracotta outline-none bg-surface"
                    placeholder="e.g. Coal India CSR / Tata Motors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    {activeModal.type === 'sponsor' ? 'Grant Pledge Amount (₹ INR)' : 'Estimated Hardware Valuation (₹ INR)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 focus:border-terracotta outline-none bg-surface"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200 text-[11px] text-charcoal-muted space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-charcoal">
                    <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
                    <span>Cryptographic Multi-Sig Escrow</span>
                  </div>
                  <p>Funds are anchored to SHA-256 block ledger and disbursed only upon joint verification by College Mentor and Gram Panchayat.</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-3.5 py-2 rounded-xl border border-sand-300 text-charcoal font-semibold hover:bg-sand-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold shadow-soft"
                  >
                    Confirm & Anchor Pledge
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
