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
  ExternalLink,
  BarChart3,
  PieChart,
  FileCheck,
  FileText,
  Download,
  Search,
  SlidersHorizontal,
  Printer,
  X
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
  const [activeView, setActiveView] = useState<'projects' | 'campaigns' | 'analytics' | 'map'>('projects');
  const [fundingSuccess, setFundingSuccess] = useState<string | null>(null);

  // CSR Analytics States
  const [selectedCert, setSelectedCert] = useState<{
    certId: string;
    donor: string;
    pan: string;
    amount: number;
    project: string;
    hei: string;
    date: string;
    hash: string;
  } | null>(null);
  const [unfundedSearch, setUnfundedSearch] = useState('');

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
          onClick={() => setActiveView('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeView === 'analytics'
              ? 'bg-terracotta text-white shadow-xs'
              : 'text-charcoal hover:text-terracotta'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>📊 CSR Financial & 80G Tax Analytics</span>
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
      ) : activeView === 'analytics' ? (
        /* CSR Financial & 80G Tax Analytics Dashboard */
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Corporate RBAC & Section 135 Compliance Banner */}
          <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-sand-200 text-sand-800 text-xs font-bold uppercase flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Authorized CSR Partner Desk (Tata Steel / Coal India / NTPC)</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    Section 135 & 80G Compliant
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-charcoal">
                  CSR Capital Allocation & Verified Tax Exemption Portfolio
                </h2>
                <p className="text-xs text-charcoal-muted mt-1 max-w-3xl">
                  Real-time financial audit trail of corporate social responsibility co-financing for higher education capstones across rural and urban Jharkhand.
                </p>
              </div>

              {/* RBAC Notice */}
              <div className="p-3.5 rounded-2xl bg-canvas border border-charcoal-border/40 text-xs max-w-xs shrink-0">
                <div className="flex items-center gap-1.5 font-bold text-charcoal mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Role: CSR Corporate Sponsor</span>
                </div>
                <p className="text-[10px] text-charcoal-muted">
                  Strict RBAC: Write access for milestone grants & 80G certificate downloads; no civic ticket deletion or academic grade modification permitted.
                </p>
              </div>
            </div>
          </div>

          {/* Financial Metrics Dials */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase">Pledged CSR Pool</span>
              <p className="text-2xl font-black text-terracotta mt-1">₹2.85 Cr</p>
              <p className="text-[10px] text-charcoal-muted mt-0.5">Total Corporate Allocation</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase">Disbursed to HEIs</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">₹1.92 Cr</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">67.5% Utilized</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase">Committed Escrow</span>
              <p className="text-2xl font-black text-sand-700 mt-1">₹92.60 L</p>
              <p className="text-[10px] text-charcoal-muted mt-0.5">Milestone Release Pending</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase">Co-Financed Projects</span>
              <p className="text-2xl font-black text-charcoal mt-1">14 Projects</p>
              <p className="text-[10px] text-charcoal-muted mt-0.5">Across 8 Districts</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase">80G Certificates</span>
              <p className="text-2xl font-black text-blue-700 mt-1">8 Issued</p>
              <p className="text-[10px] text-charcoal-muted mt-0.5">100% Audit Verified</p>
            </div>
          </div>

          {/* Budget Utilization & Thematic Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Capital Progress */}
            <div className="bg-surface rounded-2xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30">
                <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Statewide CSR Capital Deployment</span>
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  67.5% Disbursed
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-charcoal-muted">Disbursed (₹1.92 Cr)</span>
                  <span className="text-terracotta font-mono font-bold">Total Pool (₹2.85 Cr)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-sand-100 overflow-hidden border border-sand-300">
                  <div
                    className="h-full bg-gradient-to-r from-sand-600 via-terracotta to-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: '67.5%' }}
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-3">
                <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider block">
                  Thematic CSR Allocations
                </span>
                {[
                  { theme: 'Water Filtration & Shallow Aquifer Remediation', amount: '₹85,00,000', pct: 44, color: 'bg-emerald-600' },
                  { theme: 'Rural Solar Microgrids & Village Streetlights', amount: '₹48,00,000', pct: 25, color: 'bg-amber-500' },
                  { theme: 'Erosion Control & Culvert Infrastructure', amount: '₹35,00,000', pct: 18, color: 'bg-terracotta' },
                  { theme: 'Indigenous Sorbent & Sanitation Prototyping', amount: '₹24,40,000', pct: 13, color: 'bg-sand-700' },
                ].map((item) => (
                  <div key={item.theme} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium text-charcoal">
                      <span className="truncate pr-2">{item.theme}</span>
                      <span className="font-mono font-bold shrink-0">{item.amount} ({item.pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-canvas-subtle overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 80G Tax Exemption Certificates Registry */}
            <div className="bg-surface rounded-2xl p-6 border border-charcoal-border/50 shadow-soft flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30 mb-3">
                  <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-terracotta" />
                    <span>80G Tax Exemption Certificates (Section 135)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    IT Act 1961
                  </span>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {[
                    { certId: '80G-JHR-2026-0091', donor: 'Tata Steel Rural Development Society', pan: 'AAACT2819K', amount: 500000, project: 'Arsenic-Safe Gravity Sand Filter Node', hei: 'BIT Mesra', date: '2026-02-14', hash: '8f92a17cb44180e0' },
                    { certId: '80G-JHR-2026-0084', donor: 'Coal India Limited (CSR Green Cell)', pan: 'AAACC1194E', amount: 750000, project: 'Monsoon Culvert Bypass & Scour Defense', hei: 'IIT (ISM) Dhanbad', date: '2026-01-28', hash: '7c81d392e104192b' },
                    { certId: '80G-JHR-2026-0062', donor: 'NTPC Eastern Region CSR Trust', pan: 'AAACN9921B', amount: 350000, project: 'Solar Microgrid Battery Telemetry System', hei: 'NIT Jamshedpur', date: '2026-01-15', hash: '9b28f018e774109c' },
                    { certId: '80G-JHR-2026-0045', donor: 'Jharkhand State Innovation Council', pan: 'AAAEJ8291M', amount: 250000, project: 'Dhanbad Arsenic Filtration Column Prototype', hei: 'IIT (ISM) Dhanbad', date: '2025-12-10', hash: '5e41a902b114881d' },
                  ].map((cert) => (
                    <div key={cert.certId} className="p-3 rounded-xl bg-canvas border border-charcoal-border/30 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-terracotta">{cert.certId}</span>
                        <span className="font-mono font-bold text-emerald-800">₹{cert.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="font-bold text-charcoal text-[11px] truncate">{cert.donor}</p>
                      <div className="flex items-center justify-between text-[10px] text-charcoal-muted">
                        <span>Beneficiary: {cert.hei}</span>
                        <span>Date: {cert.date}</span>
                      </div>
                      <div className="pt-1.5 flex items-center justify-between border-t border-charcoal-border/20">
                        <span className="font-mono text-[9px] text-charcoal-muted">PAN: {cert.pan}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedCert(cert)}
                          className="px-2.5 py-1 rounded-lg bg-surface hover:bg-sand-100 text-charcoal border border-charcoal-border font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download className="w-3 h-3 text-terracotta" />
                          <span>Download Certificate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-charcoal-muted pt-2 border-t border-charcoal-border/20">
                Certificates are cryptographically verified by the Department of Planning & Finance, Government of Jharkhand under Section 80G(5)(vi) of the Income Tax Act.
              </p>
            </div>

          </div>

          {/* Unfunded & Partially Funded Projects Roster */}
          <div className="bg-surface rounded-2xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-border/30">
              <div>
                <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-terracotta" />
                  <span>Unfunded & Partially Funded Capstones (Immediate Impact)</span>
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Spotlight on verified student capstone teams in urgent need of corporate sponsorship to unlock hardware fabrication.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-muted" />
                <input
                  type="text"
                  value={unfundedSearch}
                  onChange={(e) => setUnfundedSearch(e.target.value)}
                  placeholder="Filter by title, village..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eligibleProjects
                .filter((t) => {
                  const q = unfundedSearch.toLowerCase().trim();
                  return !q || t.title.toLowerCase().includes(q) || t.district.toLowerCase().includes(q) || (t.village || '').toLowerCase().includes(q);
                })
                .slice(0, 6)
                .map((ticket) => {
                  const team = ticket.projectTeam!;
                  const totalDisbursed = team.sponsors?.reduce((acc, s) => acc + s.amount, 0) || 0;
                  const targetCost = 150000;
                  const remaining = Math.max(0, targetCost - totalDisbursed);
                  return (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-2xl bg-canvas border border-charcoal-border/40 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold text-sand-800 bg-sand-200/80 px-2 py-0.5 rounded">
                            {ticket.ticketCode}
                          </span>
                          <span className="text-[10px] font-bold text-terracotta">
                            {ticket.district}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-charcoal line-clamp-1">{ticket.title}</h4>
                        <p className="text-[11px] text-charcoal-muted mt-0.5">
                          Assigned: <strong>{ticket.assignedHei?.name || 'HEI Team'}</strong>
                        </p>
                        <p className="text-[11px] text-charcoal-muted mt-0.5">
                          Team: {team.teamName} ({team.facultyLead})
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-charcoal-border/20">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-charcoal-muted">Funded: ₹{totalDisbursed.toLocaleString('en-IN')}</span>
                          <span className="font-bold text-terracotta">Needed: ₹{remaining.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-sand-100 overflow-hidden">
                          <div
                            className="h-full bg-terracotta rounded-full"
                            style={{ width: `${Math.min(100, Math.round((totalDisbursed / targetCost) * 100))}%` }}
                          />
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handlePledgeGrant(ticket, 25000, 'Tata Steel Foundation')}
                            className="flex-1 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            + Disburse ₹25,000
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePledgeGrant(ticket, remaining || 50000, 'Coal India Ltd')}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            Fund Full Balance
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 80G Certificate Modal */}
          {selectedCert && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-surface w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-charcoal-border shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-base font-bold text-charcoal">Official 80G Tax Exemption Certificate</h3>
                  </div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-1 rounded-lg hover:bg-sand-100 text-charcoal-muted hover:text-charcoal cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Printable Certificate Body */}
                <div className="p-6 rounded-2xl bg-canvas border border-sand-300 space-y-4 font-sans text-xs">
                  <div className="text-center pb-3 border-b border-sand-300">
                    <p className="text-[10px] font-bold text-sand-800 uppercase tracking-widest">Government of Jharkhand</p>
                    <p className="text-sm font-black text-charcoal mt-0.5">Department of Higher & Technical Education</p>
                    <p className="text-[10px] text-charcoal-muted mt-0.5">In accordance with Section 80G(5)(vi) of the Income Tax Act, 1961</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-charcoal-muted block">Certificate Number:</span>
                      <strong className="font-mono text-terracotta">{selectedCert.certId}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-muted block">Date of Issuance:</span>
                      <strong className="text-charcoal">{selectedCert.date}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-muted block">Donor / Entity:</span>
                      <strong className="text-charcoal">{selectedCert.donor}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-muted block">Donor PAN:</span>
                      <strong className="font-mono text-charcoal">{selectedCert.pan}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-muted block">Eligible Contribution Amount:</span>
                      <strong className="text-base font-black text-emerald-800 font-mono">
                        ₹{selectedCert.amount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-charcoal-muted block">Beneficiary Institution:</span>
                      <strong className="text-charcoal">{selectedCert.hei}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface border border-charcoal-border/30 text-[11px]">
                    <span className="text-charcoal-muted block text-[10px]">Supported Project & Capstone:</span>
                    <strong className="text-charcoal">{selectedCert.project}</strong>
                  </div>

                  <div className="font-mono text-[9px] text-emerald-900 bg-emerald-50 p-2 rounded border border-emerald-200 truncate">
                    Ledger Immutable Hash: {selectedCert.hash}98a4421bce8201fe...
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    className="px-4 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal hover:bg-canvas cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="px-5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Official Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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
