'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  HeartHandshake,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Sparkles,
  Compass,
  Heart,
  Flame,
  Users,
  Lock,
  ExternalLink
} from 'lucide-react';
import { ProblemTicket } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import CampaignBannerCarousel from './CampaignBannerCarousel';
import IssuePhotoThumbnail from './IssuePhotoThumbnail';
import AgencyMapView from './AgencyMapView';

interface CsrPortalProps {
  tickets: ProblemTicket[];
  onRecordLedgerEvent: (ticketId: string, action: string, data: any) => void;
  onUpdateTicket: (ticket: ProblemTicket) => void;
  onDonateCampaign?: (
    ticketId: string,
    amount: number,
    donorName: string,
    isCorporate: boolean,
    isAnonymous: boolean
  ) => void;
}

export default function CsrPortal({
  tickets,
  onRecordLedgerEvent,
  onUpdateTicket,
  onDonateCampaign,
}: CsrPortalProps) {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'projects' | 'campaigns' | 'map'>('projects');
  const [fundingSuccess, setFundingSuccess] = useState<string | null>(null);

  const eligibleProjects = tickets.filter((t) => t.projectTeam);
  const crowdfundTickets = tickets.filter((t) => t.crowdfunding);

  const handlePledgeGrant = (ticket: ProblemTicket, amount: number, sponsorName: string) => {
    if (!ticket.projectTeam) return;

    const newSponsorship = {
      company: sponsorName,
      amount,
      status: 'DISBURSED',
    };

    const updatedTicket: ProblemTicket = {
      ...ticket,
      projectTeam: {
        ...ticket.projectTeam,
        sponsors: [...(ticket.projectTeam.sponsors || []), newSponsorship],
      },
    };

    onUpdateTicket(updatedTicket);

    // Record grant disbursement directly into the Cryptographic Ledger
    onRecordLedgerEvent(ticket.id, 'CSR_GRANT_DISBURSED', {
      corporate_sponsor: sponsorName,
      amount_inr: amount,
      project_title: ticket.title,
      hei_recipient: ticket.assignedHei?.name,
      transaction_state: 'CRYPTOGRAPHICALLY_ANCHORED',
    });

    setFundingSuccess(
      `Successfully disbursed grant of ₹${amount.toLocaleString('en-IN')} from ${sponsorName} to ${ticket.projectTeam.teamName} (${ticket.assignedHei?.name})!`
    );

    setTimeout(() => setFundingSuccess(null), 6000);
  };

  const handlePledgeCorporateMatch = (
    ticket: ProblemTicket,
    matchAmount: number,
    corporateDonor: string
  ) => {
    if (!ticket.crowdfunding) return;

    if (onDonateCampaign) {
      onDonateCampaign(ticket.id, matchAmount, corporateDonor, true, false);
    } else {
      const currentCf = ticket.crowdfunding;
      const updatedTicket: ProblemTicket = {
        ...ticket,
        crowdfunding: {
          ...currentCf,
          raisedAmount: currentCf.raisedAmount + matchAmount,
          backersCount: currentCf.backersCount + 1,
          donations: [
            {
              id: 'don-' + Date.now(),
              donorName: corporateDonor,
              amount: matchAmount,
              isCorporate: true,
              timestamp: new Date().toISOString(),
            },
            ...(currentCf.donations || []),
          ],
        },
      };
      onUpdateTicket(updatedTicket);
    }

    onRecordLedgerEvent(ticket.id, 'CSR_MATCH_ESCROW_PLEDGED', {
      sponsor: corporateDonor,
      amount_inr: matchAmount,
      escrow_mode: '1:1_COMMUNITY_MATCH',
      campaign_id: ticket.crowdfunding.id,
    });

    setFundingSuccess(
      `🎉 Pledged ₹${matchAmount.toLocaleString('en-IN')} 1:1 Corporate Match from ${corporateDonor}! Funds held in milestone-escrow.`
    );
    setTimeout(() => setFundingSuccess(null), 6000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Featured Campaign Banner Carousel for CSR & University Drives */}
      <CampaignBannerCarousel className="mb-2" />

      {/* CSR Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-terracotta-50 via-sand-50 to-canvas p-8 sm:p-10 border border-terracotta-200 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.csrMarketTitle}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Direct University Civic Co-Financing Marketplace
            </h1>
            <p className="mt-3 text-sm text-charcoal-muted leading-relaxed">
              {t.csrMarketSub}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface p-4 rounded-2xl border border-charcoal-border/50 shadow-soft text-center">
              <span className="text-2xl font-black text-terracotta">₹2.85 Cr</span>
              <p className="text-[11px] font-semibold text-charcoal-muted uppercase">Pledged CSR Pool</p>
            </div>
            <div className="bg-surface p-4 rounded-2xl border border-charcoal-border/50 shadow-soft text-center">
              <span className="text-2xl font-black text-emerald-700">100%</span>
              <p className="text-[11px] font-semibold text-charcoal-muted uppercase">Milestone Verified</p>
            </div>
          </div>
        </div>
      </div>

      {fundingSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-3 shadow-soft animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{fundingSuccess}</span>
        </div>
      )}

      {/* Corporate Partners Roster */}
      <div className="bg-surface rounded-2xl p-6 border border-charcoal-border/50 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-terracotta" />
            <span>Active Corporate & PSU CSR Partners in Jharkhand</span>
          </h2>
          <span className="text-xs font-semibold text-sand-800">5 Major Donors Connected</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Tata Steel Rural Development Society', focus: 'Water & Rural Roads', pool: '₹95,00,000' },
            { name: 'Coal India Limited (CSR Green Cell)', focus: 'Mine Drainage & Solar', pool: '₹80,00,000' },
            { name: 'NTPC Eastern Region', focus: 'Tribal Solar Microgrids', pool: '₹65,00,000' },
            { name: 'Jharkhand State Innovation Council', focus: 'Student Capstones', pool: '₹45,00,000' }
          ].map((partner, i) => (
            <div key={i} className="p-4 rounded-xl bg-canvas border border-charcoal-border/30 text-xs">
              <p className="font-bold text-charcoal">{partner.name}</p>
              <p className="text-[11px] text-terracotta font-semibold mt-1">Focus: {partner.focus}</p>
              <p className="text-xs font-black text-emerald-700 mt-2">Active Pool: {partner.pool}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workspace vs Crowdfunds vs Regional Impact Map Tabs */}
      <div className="flex items-center gap-2 bg-sand-100 p-1.5 rounded-2xl border border-sand-300 w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setActiveView('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeView === 'projects'
              ? 'bg-terracotta text-white shadow-xs'
              : 'text-charcoal hover:text-terracotta'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Capstone Grants & Projects</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView('campaigns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeView === 'campaigns'
              ? 'bg-terracotta text-white shadow-xs'
              : 'text-charcoal hover:text-terracotta'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>💖 Trending Community Campaigns</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView('map')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeView === 'map'
              ? 'bg-terracotta text-white shadow-xs'
              : 'text-charcoal hover:text-terracotta'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>🗺️ Regional CSR Impact Map</span>
        </button>
      </div>

      {activeView === 'map' ? (
        <AgencyMapView
          tickets={tickets}
          title="CSR Regional Problem & Impact Map"
          subtitle="Explore community problems across Jharkhand to direct corporate CSR funding, co-finance student solutions, and track physical milestone verification."
        />
      ) : activeView === 'campaigns' ? (
        /* Trending Community Crowdfund Campaigns Dashboard */
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-charcoal">Trending Community Crowdfund Campaigns</h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Direct corporate CSR matching funds to high-velocity civic challenges. All community donations are 80G tax-exempt and locked in milestone escrow released only upon faculty sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crowdfundTickets.map((ticket) => {
              const cf = ticket.crowdfunding!;
              const target = cf.targetAmount;
              const raised = cf.raisedAmount;
              const percentage = Math.min(100, Math.round((raised / target) * 100));
              const remaining = Math.max(0, target - raised);

              return (
                <div
                  key={ticket.id}
                  className="bg-surface rounded-2xl p-6 border border-charcoal-border/50 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-terracotta px-2.5 py-0.5 rounded bg-terracotta-50">
                        {ticket.ticketCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          80G Tax Deductible
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sand-100 text-sand-800">
                          {ticket.district}
                        </span>
                      </div>
                    </div>

                    <IssuePhotoThumbnail
                      src={ticket.imageUrls?.[0]}
                      title={ticket.title}
                      category={ticket.category}
                      coordinates={{ lat: ticket.latitude, lng: ticket.longitude }}
                      timestamp={ticket.reportedAt}
                      village={ticket.village}
                      district={ticket.district}
                      className="mb-3.5"
                      aspectRatio="wide"
                    />

                    <h3 className="text-lg font-bold text-charcoal mb-1">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-charcoal-muted line-clamp-2 mb-4 leading-relaxed">
                      {ticket.description}
                    </p>

                    {/* Escrow Progress Bar */}
                    <div className="space-y-2 mb-4 p-3.5 rounded-xl bg-canvas border border-charcoal-border/40">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-emerald-700 font-bold">
                          ₹{raised.toLocaleString('en-IN')} Raised
                        </span>
                        <span className="text-charcoal-muted">
                          Goal: ₹{target.toLocaleString('en-IN')} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-canvas-subtle overflow-hidden border border-charcoal-border/30">
                        <div
                          className="h-full bg-gradient-to-r from-sand to-emerald-600 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-charcoal-muted">
                        <span>{cf.backersCount} Community Backers</span>
                        <span className="font-semibold text-terracotta">
                          ₹{remaining.toLocaleString('en-IN')} needed
                        </span>
                      </div>
                    </div>

                    {/* Corporate Match Indicator */}
                    {cf.corporateMatch && (
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs mb-4 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-amber-950 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                            <span>{cf.corporateMatch.company}</span>
                          </p>
                          <p className="text-[11px] text-amber-900">
                            Active {cf.corporateMatch.ratio} Co-Financing Commitment
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                          Active
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CSR Corporate Match Actions */}
                  <div className="pt-4 border-t border-charcoal-border/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-charcoal-muted mb-1">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Milestone-Locked Escrow</span>
                      </span>
                      <span>Assigned: {ticket.assignedHei?.name || 'HEI Lead'}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handlePledgeCorporateMatch(ticket, 25000, 'Tata Steel Foundation')}
                        className="flex-1 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-soft transition-transform hover:scale-[1.02] cursor-pointer"
                      >
                        Pledge ₹25,000 (Tata)
                      </button>
                      {remaining > 0 && (
                        <button
                          type="button"
                          onClick={() => handlePledgeCorporateMatch(ticket, remaining, 'Coal India Green Cell')}
                          className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-soft transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          Match 100% (₹{remaining.toLocaleString('en-IN')})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Co-Financing Opportunities List */
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-charcoal">Verified Capstone Grants Seeking Sponsorship</h2>
              <p className="text-xs text-charcoal-muted mt-1">
                Select an ongoing university project with verified diagnostic sampling to sponsor hardware and field deployment costs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eligibleProjects.map((ticket) => {
              const team = ticket.projectTeam!;
              const totalDisbursed = team.sponsors?.reduce((acc, s) => acc + s.amount, 0) || 0;
              const targetBudget = 250000;
              const percentage = Math.min(100, Math.round((totalDisbursed / targetBudget) * 100));

              return (
                <div
                  key={ticket.id}
                  className="bg-surface rounded-2xl p-6 border border-charcoal-border/50 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-terracotta px-2.5 py-0.5 rounded bg-terracotta-50">
                        {ticket.ticketCode}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sand-100 text-sand-800">
                        {ticket.assignedHei?.name}
                      </span>
                    </div>

                    {/* Citizen Ground Reality Evidence Thumbnail */}
                    <IssuePhotoThumbnail
                      src={ticket.imageUrls?.[0]}
                      title={ticket.title}
                      category={ticket.category}
                      coordinates={{ lat: ticket.latitude, lng: ticket.longitude }}
                      timestamp={ticket.reportedAt}
                      village={ticket.village}
                      district={ticket.district}
                      className="mb-3.5"
                      aspectRatio="wide"
                    />

                    <h3 className="text-lg font-bold text-charcoal mb-2">
                      {ticket.title}
                    </h3>

                    <p className="text-xs text-charcoal-muted line-clamp-3 mb-4 leading-relaxed">
                      {ticket.description}
                    </p>

                    {/* Progress towards budget */}
                    <div className="mb-5 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-charcoal-muted">Funded: ₹{totalDisbursed.toLocaleString('en-IN')}</span>
                        <span className="text-terracotta">Goal: ₹{targetBudget.toLocaleString('en-IN')} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-canvas-subtle overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sand to-terracotta transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Team Details */}
                    <div className="p-3 rounded-xl bg-canvas border border-charcoal-border/30 text-xs mb-4 space-y-1">
                      <p className="font-semibold text-charcoal">
                        Student Team: <strong className="text-terracotta">{team.teamName}</strong>
                      </p>
                      <p className="text-[11px] text-charcoal-muted">
                        Faculty Guide: {team.facultyLead} • NEP Credits: {team.nepCredits}
                      </p>
                    </div>
                  </div>

                  {/* Sponsor Action Buttons */}
                  <div className="pt-4 border-t border-charcoal-border/30 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Audit Anchored</span>
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePledgeGrant(ticket, 75000, 'Tata Steel Foundation')}
                        className="px-3 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-soft transition-transform hover:scale-105 cursor-pointer"
                      >
                        Pledge ₹75,000 (Tata Steel)
                      </button>
                      <button
                        onClick={() => handlePledgeGrant(ticket, 100000, 'Coal India Green Cell')}
                        className="px-3 py-1.5 rounded-lg bg-sand hover:bg-sand-600 text-charcoal font-bold text-xs shadow-soft transition-transform hover:scale-105 cursor-pointer"
                      >
                        Pledge ₹1,00,000 (Coal India)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
