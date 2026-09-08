'use client';

import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  UserCheck,
  FilePlus2,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  Mic,
  Send,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  ThumbsUp,
  FileSignature,
  Building,
  Award
} from 'lucide-react';
import { ProblemTicket, TicketCategory, UrgencyLevel } from '../lib/types';
import ProblemInspectorModal from './ProblemInspectorModal';

interface PanchayatPortalProps {
  tickets: ProblemTicket[];
  onNewTicket: (ticket: ProblemTicket) => void;
  onUpdateTicket: (ticket: ProblemTicket) => void;
  onRecordLedgerEvent?: (ticketId: string, action: string, data: any) => void;
}

export default function PanchayatPortal({
  tickets,
  onNewTicket,
  onUpdateTicket,
  onRecordLedgerEvent
}: PanchayatPortalProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROXY_FILE' | 'SIGNOFF_QUEUE' | 'LEDGER'>('OVERVIEW');
  const [inspectingTicket, setInspectingTicket] = useState<ProblemTicket | null>(null);

  // Proxy Filing Form State
  const [residentName, setResidentName] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [residentPhone, setResidentPhone] = useState('');
  const [hamletTola, setHamletTola] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('WATER_MANAGEMENT');
  const [urgency, setUrgency] = useState<UrgencyLevel>('HIGH');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Sign-off Modal State
  const [endorsingTicket, setEndorsingTicket] = useState<ProblemTicket | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [satisfactionScore, setSatisfactionScore] = useState(5);
  const [isSignoffSubmitting, setIsSignoffSubmitting] = useState(false);

  // Filter Panchayat tickets (Baghmara / Dhanbad or jurisdiction)
  const panchayatTickets = tickets.filter(
    (t) =>
      t.village.toLowerCase().includes('baghmara') ||
      t.district.toLowerCase() === 'dhanbad' ||
      t.reporterName.toLowerCase().includes('soren') ||
      t.reporterName.toLowerCase().includes('mukhiya')
  );

  const pendingSignoffTickets = panchayatTickets.filter(
    (t) => t.status === 'PROTOTYPE_DEPLOYED' || t.status === 'IN_PROGRESS'
  );

  const handleProxySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName || !title || !description) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `JS-PR-2026-${randomSuffix}`;

    const newTicketObj: ProblemTicket = {
      id: `tkt-pr-${Date.now()}`,
      ticketCode: newCode,
      title: `[Panchayat Assisted] ${title}`,
      description: `${description}\n\n[Resident Declaration: Assisted filing on behalf of ${residentName} (Aadhaar: XXXX-XXXX-${aadhaarLast4 || '0000'}), Hamlet: ${hamletTola || 'Baghmara Center'}. Verified by Mukhiya B. K. Mahto]`,
      category,
      urgency,
      status: 'SUBMITTED',
      latitude: 23.8214,
      longitude: 86.2052,
      district: 'Dhanbad',
      village: `Baghmara Panchayat (${hamletTola || 'Main Ward'})`,
      reporterName: `${residentName} (Assisted by Mukhiya)`,
      reporterPhone: residentPhone || '+91 94311 00000',
      reportedAt: new Date().toISOString(),
      imageUrls: ['/images/issues/handpump_broken.jpg'],
      aiVerification: {
        confidence: 0.95,
        detectedObjects: [
          { label: 'Rural civic infrastructure', confidence: 0.94 },
          { label: 'Verified Panchayat jurisdiction', confidence: 0.98 }
        ],
        severityScore: urgency === 'CRITICAL' ? 0.92 : 0.78
      },
      assignedHei: {
        id: 'hei-ism',
        name: 'IIT (ISM) Dhanbad',
        code: 'IITISM',
        department: 'Department of Environmental Engineering',
        facultyMentor: 'Prof. Alok Kumar Sinha (Head of Water Tech)',
        distanceKm: 24.3,
        utilityScore: 0.95,
        routingReason: 'Assigned to jurisdictional college IIT (ISM) Dhanbad via Panchayat Assisted Priority Routing.'
      },
      socialEngagement: {
        upvotes: 12,
        hasUpvoted: true,
        shares: 2,
        commentsCount: 1,
        hypeScore: 60,
        trendingBadge: '🏛️ Official Panchayat Filing',
        comments: [
          {
            id: `c-${Date.now()}`,
            authorName: 'B. K. Mahto (Mukhiya)',
            authorRole: 'GOVT_OFFICER',
            authorAffiliation: 'Baghmara Gram Panchayat',
            text: `Registered at Baghmara Gram Panchayat Bhavan for resident ${residentName}. Forwarded to IIT (ISM) Dhanbad for capstone action.`,
            createdAt: new Date().toISOString(),
            isOfficial: true
          }
        ]
      }
    };

    setTimeout(() => {
      onNewTicket(newTicketObj);
      if (onRecordLedgerEvent) {
        onRecordLedgerEvent(newTicketObj.ticketCode, 'PANCHAYAT_PROXY_REGISTRATION', {
          mukhiya: 'B. K. Mahto',
          resident: residentName,
          aadhaarLast4: aadhaarLast4 || '0000',
          panchayat: 'Baghmara'
        });
      }
      setIsSubmitting(false);
      setSubmitSuccess(newCode);

      // Reset form
      setResidentName('');
      setAadhaarLast4('');
      setResidentPhone('');
      setHamletTola('');
      setTitle('');
      setDescription('');
      setAudioRecorded(false);
    }, 700);
  };

  const handleCompleteSignoff = () => {
    if (!endorsingTicket) return;
    setIsSignoffSubmitting(true);

    const updated: ProblemTicket = {
      ...endorsingTicket,
      status: 'RESOLVED',
      nssWorkflow: {
        nssUnitId: 'NSS-IITISM-U01',
        coordinatorName: 'Prof. Alok Kumar Sinha',
        loggedFieldHours: 140,
        targetFieldHours: 120,
        nepCreditsEligible: 4,
        status: 'CREDITS_AWARDED',
        resolutionPortfolio: {
          beforePhotoUrl: endorsingTicket.imageUrls[0] || '/images/issues/handpump_broken.jpg',
          afterPhotoUrl: '/images/issues/handpump_broken.jpg',
          fieldSummary: officerRemarks || 'Inspected on-site by Gram Panchayat Mukhiya. Filtration efficiency verified, clean drinking water restored for 450 villagers.',
          completionDate: new Date().toISOString().split('T')[0],
          facultyEndorsement: `${endorsingTicket.assignedHei?.facultyMentor || 'Prof. Alok Kumar Sinha'} & Mukhiya B. K. Mahto`,
          blockchainHash: 'a8f5c381d624ef81b37c0f16d7a5b3a62883ef4b14d237b6c7f893e3d9319e2c'
        }
      }
    };

    setTimeout(() => {
      onUpdateTicket(updated);
      if (onRecordLedgerEvent) {
        onRecordLedgerEvent(endorsingTicket.ticketCode, 'PANCHAYAT_PHYSICAL_RESOLUTION_SIGNOFF', {
          signoffOfficer: 'B. K. Mahto (Mukhiya)',
          panchayat: 'Baghmara Gram Panchayat',
          satisfactionScore,
          remarks: officerRemarks,
          nepCreditsFinalized: 4
        });
      }
      setIsSignoffSubmitting(false);
      setEndorsingTicket(null);
      setOfficerRemarks('');
    }, 700);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Official Panchayat Seal Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C2A24] via-[#14201B] to-[#0D1512] text-white p-6 sm:p-8 shadow-card border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-sand-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-3xl shrink-0 shadow-md border border-emerald-300/40">
              🏛️
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider">
                  Government of Jharkhand • Panchayati Raj
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[11px] font-semibold">
                  Official Gram Panchayat Desk
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
                Baghmara Gram Panchayat Administration
              </h1>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl">
                Officer In-Charge: <b>B. K. Mahto (Mukhiya)</b> • Panchayat Code: <code>JH-DHN-BGM-04</code> • Block: Baghmara, District: Dhanbad.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('PROXY_FILE')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Assisted Resident Filing</span>
            </button>
          </div>
        </div>

        {/* Panchayat Quick Stats */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black text-emerald-300">
              {panchayatTickets.length}
            </span>
            <span className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
              Village Issues
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black text-amber-300">
              {pendingSignoffTickets.length}
            </span>
            <span className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
              HEI Field Actions
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black text-sand-300">1</span>
            <span className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
              Assigned HEI Lead (IIT ISM)
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black text-teal-300">
              {panchayatTickets.filter((t) => t.status === 'RESOLVED').length}
            </span>
            <span className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
              Endorsed & Solved
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex items-center gap-2 border-b border-white/10 pb-0">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'OVERVIEW'
                ? 'bg-white/15 text-emerald-200 border-emerald-400'
                : 'text-white/70 hover:text-white border-transparent hover:bg-white/5'
            }`}
          >
            Panchayat Overview
          </button>
          <button
            onClick={() => setActiveTab('PROXY_FILE')}
            className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'PROXY_FILE'
                ? 'bg-white/15 text-emerald-200 border-emerald-400'
                : 'text-white/70 hover:text-white border-transparent hover:bg-white/5'
            }`}
          >
            Assisted Resident Proxy Filing
          </button>
          <button
            onClick={() => setActiveTab('SIGNOFF_QUEUE')}
            className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'SIGNOFF_QUEUE'
                ? 'bg-white/15 text-emerald-200 border-emerald-400'
                : 'text-white/70 hover:text-white border-transparent hover:bg-white/5'
            }`}
          >
            Field Sign-Off Queue ({pendingSignoffTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'LEDGER'
                ? 'bg-white/15 text-emerald-200 border-emerald-400'
                : 'text-white/70 hover:text-white border-transparent hover:bg-white/5'
            }`}
          >
            Jurisdiction Problem Ledger
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quick Proxy Filing Action Card */}
            <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg">
                  ✍️
                </div>
                <div>
                  <h3 className="font-black text-charcoal text-base">Resident Proxy Submission Desk</h3>
                  <p className="text-xs text-charcoal-muted">File challenges for elderly, tribal, or non-smartphone villagers</p>
                </div>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Villagers visiting the Baghmara Panchayat Bhavan can have their grievances officially filed by Mukhiya B. K. Mahto with vernacular voice dictation and direct priority routing to IIT (ISM) Dhanbad.
              </p>
              <button
                onClick={() => setActiveTab('PROXY_FILE')}
                className="w-full py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition-all flex items-center justify-center gap-2"
              >
                <FilePlus2 className="w-4 h-4" />
                <span>Open Proxy Registration Form</span>
              </button>
            </div>

            {/* Field Resolution Sign-Off Action Card */}
            <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sand-100 text-sand-900 flex items-center justify-center text-lg">
                  🔍
                </div>
                <div>
                  <h3 className="font-black text-charcoal text-base">Physical Field Resolution Sign-Off</h3>
                  <p className="text-xs text-charcoal-muted">Certify student capstones before granting NEP academic credits</p>
                </div>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Inspect physical engineering installations completed in Baghmara. Once the Mukhiya digitally stamps the work, students receive 4 NEP credits transferred directly to their DigiLocker ABC ledger.
              </p>
              <button
                onClick={() => setActiveTab('SIGNOFF_QUEUE')}
                className="w-full py-2.5 rounded-2xl bg-sand-600 hover:bg-sand-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2"
              >
                <FileSignature className="w-4 h-4" />
                <span>Review Pending Solutions ({pendingSignoffTickets.length})</span>
              </button>
            </div>
          </div>

          {/* Active Problems Under Panchayat Jurisdiction */}
          <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
            <h3 className="font-black text-charcoal text-base">
              Active Village Problems in Baghmara ({panchayatTickets.length})
            </h3>
            <div className="space-y-3">
              {panchayatTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-canvas border border-charcoal-border/40 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-terracotta px-2 py-0.5 rounded bg-terracotta-50 border border-terracotta-200">
                        {t.ticketCode}
                      </span>
                      <span className="text-xs font-black text-charcoal">{t.title}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted truncate">{t.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-charcoal-muted">
                      <span>Reporter: <b>{t.reporterName}</b></span>
                      <span>•</span>
                      <span>Assigned HEI: <b>{t.assignedHei?.name || 'Pending Routing'}</b></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setInspectingTicket(t)}
                      className="px-3 py-1.5 rounded-xl border border-charcoal-border/50 text-xs font-bold text-charcoal hover:bg-black/5 flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Inspect</span>
                    </button>
                    {t.status !== 'RESOLVED' && (
                      <button
                        onClick={() => {
                          setEndorsingTicket(t);
                          setActiveTab('SIGNOFF_QUEUE');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sign-Off</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROXY FILING DESK */}
      {activeTab === 'PROXY_FILE' && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-charcoal-border/50 shadow-soft max-w-3xl mx-auto space-y-6">
          <div className="border-b border-charcoal-border/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <FilePlus2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-charcoal text-lg">Assisted Citizen Proxy Registration</h3>
                <p className="text-xs text-charcoal-muted">
                  Official filing by Mukhiya B. K. Mahto on behalf of Baghmara residents
                </p>
              </div>
            </div>
          </div>

          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1">
              <div className="flex items-center gap-2 font-black text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ticket Registered Successfully: {submitSuccess}</span>
              </div>
              <p className="text-xs">
                The problem has been broadcast to the statewide live feed and auto-routed to IIT (ISM) Dhanbad.
              </p>
            </div>
          )}

          <form onSubmit={handleProxySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal">Resident Full Name *</label>
                <input
                  type="text"
                  required
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  placeholder="e.g., Budhram Soren"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal">Aadhaar (Last 4 Digits)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={aadhaarLast4}
                  onChange={(e) => setAadhaarLast4(e.target.value)}
                  placeholder="e.g., 7892"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal">Resident Contact Number</label>
                <input
                  type="tel"
                  value={residentPhone}
                  onChange={(e) => setResidentPhone(e.target.value)}
                  placeholder="+91 94311 00000"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal">Hamlet / Tola / Ward</label>
                <input
                  type="text"
                  value={hamletTola}
                  onChange={(e) => setHamletTola(e.target.value)}
                  placeholder="e.g., Tola 4 (Near Primary School)"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Problem Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal font-bold focus:outline-none focus:border-emerald-600"
              >
                <option value="WATER_MANAGEMENT">💧 Drinking Water & Borewell Contamination</option>
                <option value="ROADS_INFRASTRUCTURE">🛣️ Culvert / Village Road Breach</option>
                <option value="SANITATION">🧹 Solid Waste / Restroom Sanitation</option>
                <option value="HEALTHCARE">🏥 Health Sub-Center Medicine Access</option>
                <option value="EDUCATION">📚 Primary School Power / Solar Failure</option>
                <option value="ELECTRICITY">⚡ Off-Grid Micro-Grid Transformer Failure</option>
                <option value="AGRICULTURE">🌾 Irrigation Canal & Lift Pump Breach</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Issue Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short summary of the civic problem"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal focus:outline-none focus:border-emerald-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Detailed Description (Local Language / Dictation) *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem in detail (e.g. handpump water smells foul, 40 families affected, skin problems in children...)"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Audio Voice Dictation Simulator */}
            <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-terracotta" />
                <div>
                  <span className="text-xs font-bold text-charcoal block">Vernacular Voice Dispatch</span>
                  <span className="text-[10px] text-charcoal-muted">
                    {audioRecorded ? '✅ Voice note recorded (Santhali/Nagpuri audio attached)' : 'Record audio statement in resident dialect'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRecordingAudio(!isRecordingAudio);
                  if (!audioRecorded) setAudioRecorded(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isRecordingAudio
                    ? 'bg-red-600 text-white animate-pulse'
                    : audioRecorded
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-terracotta text-white'
                }`}
              >
                {isRecordingAudio ? 'Stop Recording' : audioRecorded ? 'Re-record' : 'Record Audio'}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering on Blockchain...' : 'File Official Assisted Ticket'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: FIELD SIGNOFF QUEUE */}
      {activeTab === 'SIGNOFF_QUEUE' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
            <h3 className="font-black text-charcoal text-base">
              HEI Solutions Awaiting Panchayat Endorsement ({pendingSignoffTickets.length})
            </h3>
            <p className="text-xs text-charcoal-muted">
              Higher education engineering teams submit their physical resolution evidence here. The Mukhiya conducts a site visit and digitally signs off to authorize NEP 2020 student credits.
            </p>

            <div className="space-y-4">
              {pendingSignoffTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-5 rounded-2xl bg-canvas border border-charcoal-border/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-terracotta px-2.5 py-0.5 rounded bg-terracotta-50 border border-terracotta-200">
                          {ticket.ticketCode}
                        </span>
                        <h4 className="font-black text-charcoal text-base">{ticket.title}</h4>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-1">{ticket.description}</p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-sand-100 text-sand-900 text-xs font-black border border-sand-300 self-start sm:self-center shrink-0">
                      Assigned: {ticket.assignedHei?.name}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900">Student Team: {ticket.projectTeam?.teamName || 'JalShuddhi Innovators'}</span>
                      <span className="font-mono text-xs text-emerald-700">Eligible: 4 NEP Credits</span>
                    </div>
                    <p className="text-xs text-charcoal-muted">
                      Milestone: Filter column deployed, backwash telemetry active, lab tests confirm potable standards (TDS &lt; 150 mg/L).
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setInspectingTicket(ticket)}
                      className="px-3.5 py-2 rounded-xl border border-charcoal-border/50 text-xs font-bold text-charcoal hover:bg-black/5 flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Inspect Telemetry</span>
                    </button>

                    <button
                      onClick={() => setEndorsingTicket(ticket)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Conduct Physical Sign-Off</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JURISDICTION PROBLEM LEDGER */}
      {activeTab === 'LEDGER' && (
        <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
          <h3 className="font-black text-charcoal text-base">Complete Baghmara Panchayat Civic Ledger</h3>
          <div className="divide-y divide-charcoal-border/30">
            {panchayatTickets.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-terracotta">{t.ticketCode}</span>
                    <span className="font-black text-charcoal text-sm">{t.title}</span>
                  </div>
                  <p className="text-xs text-charcoal-muted">
                    Reported by {t.reporterName} • {new Date(t.reportedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setInspectingTicket(t)}
                  className="px-3 py-1 rounded-lg border border-charcoal-border/50 text-xs font-bold text-charcoal hover:bg-black/5"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign-off Modal */}
      {endorsingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-charcoal-border/50 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-charcoal-border/30 pb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-charcoal text-base sm:text-lg">
                  Mukhiya Physical Field Sign-Off
                </h3>
              </div>
              <button
                onClick={() => setEndorsingTicket(null)}
                className="w-7 h-7 rounded-full bg-canvas flex items-center justify-center text-charcoal-muted hover:text-charcoal text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/40 text-xs space-y-1">
              <span className="font-mono text-terracotta font-bold">{endorsingTicket.ticketCode}</span>
              <h4 className="font-black text-charcoal">{endorsingTicket.title}</h4>
              <p className="text-charcoal-muted">Institution: {endorsingTicket.assignedHei?.name}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Resident Satisfaction Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSatisfactionScore(star)}
                    className={`w-9 h-9 rounded-xl text-sm font-black transition-all ${
                      satisfactionScore >= star
                        ? 'bg-amber-400 text-charcoal'
                        : 'bg-canvas text-charcoal-muted border border-charcoal-border/50'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs text-charcoal-muted font-bold ml-2">
                  {satisfactionScore === 5 ? 'Exceptional Resolution' : `${satisfactionScore} / 5 Stars`}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Inspection Notes & Signature Remarks *</label>
              <textarea
                rows={3}
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                placeholder="e.g. Conducted field inspection with ward members. Water is clear, filtration unit functioning perfectly. Village handpump restored."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cryptographic NEP Blockchain Endorsement</span>
              </p>
              <p>
                Signing this ticket will mark the civic challenge as RESOLVED and issue 4 NEP 2020 Academic Credits to the student roster on their DigiLocker ABC record.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEndorsingTicket(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-canvas"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSignoffSubmitting}
                onClick={handleCompleteSignoff}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSignoffSubmitting ? 'Endorsing...' : 'Endorse & Award Credits'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deep Problem Inspector */}
      {inspectingTicket && (
        <ProblemInspectorModal
          isOpen={!!inspectingTicket}
          onClose={() => setInspectingTicket(null)}
          ticket={inspectingTicket}
          userRole="PANCHAYAT_OFFICER"
        />
      )}
    </div>
  );
}
