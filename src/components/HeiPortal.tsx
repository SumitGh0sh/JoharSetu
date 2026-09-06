'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Users,
  Award,
  Upload,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  Plus,
  Compass,
  Layers,
  GraduationCap,
  FileText,
  Camera,
  Check,
  Flame,
  Building,
  HeartHandshake
} from 'lucide-react';
import { ProblemTicket, Milestone, NssWorkflow } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import CampaignBannerCarousel from './CampaignBannerCarousel';
import IssuePhotoThumbnail from './IssuePhotoThumbnail';
import AgencyMapView from './AgencyMapView';

interface HeiPortalProps {
  tickets: ProblemTicket[];
  onUpdateTicket: (ticket: ProblemTicket) => void;
  onOpenCertificate: (ticket: ProblemTicket) => void;
  onRecordLedgerEvent: (ticketId: string, action: string, data: any) => void;
}

export default function HeiPortal({
  tickets,
  onUpdateTicket,
  onOpenCertificate,
  onRecordLedgerEvent,
}: HeiPortalProps) {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'workspace' | 'nss' | 'map'>('workspace');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || 'tkt-001');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const [isSubmittingProof, setIsSubmittingProof] = useState<string | null>(null);
  const [proofSuccess, setProofSuccess] = useState<string | null>(null);

  // New team member state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentRole, setNewStudentRole] = useState('NSS Field Volunteer');

  // NSS Hours Logging State
  const [hoursToLog, setHoursToLog] = useState<number>(6);
  const [hoursTaskDesc, setHoursTaskDesc] = useState<string>('Diagnostic community survey & participatory prototyping');

  // NSS Resolution Conferral State
  const [afterPhotoPreset, setAfterPhotoPreset] = useState<string>('/images/issues/water_filter_installed.jpg');
  const [resolutionSummaryText, setResolutionSummaryText] = useState<string>(
    'Field engineered and deployed community-grade prototype with active NSS student labor and Gram Panchayat verification.'
  );
  const [facultyEndorsementText, setFacultyEndorsementText] = useState<string>(
    'Verified by Faculty Department Lead. Complies with NEP 2020 experiential capstone standards.'
  );

  const routedTickets = tickets.filter(
    (t) => t.status === 'AI_ROUTED' || t.status === 'ACCEPTED_BY_HEI' || t.status === 'IN_PROGRESS' || t.status === 'PROTOTYPE_DEPLOYED' || t.status === 'RESOLVED'
  );

  const handleAcceptTicket = (ticket: ProblemTicket) => {
    const updated: ProblemTicket = {
      ...ticket,
      status: 'IN_PROGRESS',
      nssWorkflow: ticket.nssWorkflow || {
        nssUnitId: `NSS-${ticket.assignedHei?.code || 'HEI'}-01`,
        coordinatorName: ticket.assignedHei?.facultyMentor || 'Prof. Dr. A. K. Sinha',
        loggedFieldHours: 12,
        targetFieldHours: 60,
        nepCreditsEligible: 4,
        status: 'ASSIGNED',
      },
      projectTeam: ticket.projectTeam || {
        id: 'team-' + Date.now(),
        teamName: 'Jharkhand Innovation Sprint Team',
        facultyLead: ticket.assignedHei?.facultyMentor || 'Prof. Dr. A. K. Sinha',
        students: [
          { name: 'Pooja Murmu', role: 'Lead Prototyper', rollNo: '22JE0451', creditsClaimed: false },
          { name: 'Rohan Sharma', role: 'Telemetry Engineer', rollNo: '22JE0512', creditsClaimed: false }
        ],
        nepCredits: 4,
        milestones: [
          {
            id: 'ms-1',
            sequence: 1,
            title: 'Diagnostic Sampling & Spectrophotometry Assay',
            targetDate: '2026-09-10',
            status: 'IN_PROGRESS',
          },
          {
            id: 'ms-2',
            sequence: 2,
            title: 'Indigenous Sorbent Column Fabrication',
            targetDate: '2026-09-24',
            status: 'PENDING',
          },
          {
            id: 'ms-3',
            sequence: 3,
            title: 'Field Node Pilot Deployment',
            targetDate: '2026-10-10',
            status: 'PENDING',
          },
          {
            id: 'ms-4',
            sequence: 4,
            title: 'Gram Panchayat Handover & Audit Signoff',
            targetDate: '2026-10-25',
            status: 'PENDING',
          }
        ],
        sponsors: [
          { company: 'Jharkhand State Higher Education Council', amount: 50000, status: 'COMMITTED' }
        ]
      }
    };

    onUpdateTicket(updated);
    setSelectedTicketId(updated.id);

    // Record to Audit Ledger
    onRecordLedgerEvent(ticket.id, 'HEI_ACCEPTED_PROBLEM_STATEMENT', {
      hei_name: ticket.assignedHei?.name,
      faculty_mentor: updated.projectTeam?.facultyLead,
      nep_credits: 4,
    });
  };

  const handleSimulateMilestoneSubmit = (milestoneId: string) => {
    setIsSubmittingProof(milestoneId);
    
    setTimeout(() => {
      if (!selectedTicket.projectTeam) return;

      // Simulated SHA-256 hash generated from proof payload
      const dummyHash = 'd7a8f' + Math.random().toString(16).substring(2, 10) + '9b01' + Math.random().toString(16).substring(2, 10) + 'c3e4';

      const updatedMilestones: Milestone[] = selectedTicket.projectTeam.milestones.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status: 'APPROVED',
            completedDate: new Date().toISOString().split('T')[0],
            proofUrl: 'https://joharsetu.gov.in/proofs/' + milestoneId + '_verified.pdf',
            sha256Hash: dummyHash
          };
        }
        return m;
      });

      const updatedTicket: ProblemTicket = {
        ...selectedTicket,
        status: updatedMilestones.every((m) => m.status === 'APPROVED')
          ? 'RESOLVED'
          : 'IN_PROGRESS',
        projectTeam: {
          ...selectedTicket.projectTeam,
          milestones: updatedMilestones,
        }
      };

      onUpdateTicket(updatedTicket);
      setIsSubmittingProof(null);
      setProofSuccess(`Milestone verified & anchored to SHA-256 block hash: ${dummyHash.substring(0, 16)}...`);

      // Record to Audit Ledger
      onRecordLedgerEvent(selectedTicket.id, 'MILESTONE_PROOF_VERIFIED', {
        milestone_id: milestoneId,
        proof_hash: dummyHash,
        verified_by: 'Faculty Head & Gram Panchayat Mukhiya',
        timestamp: Date.now()
      });

      setTimeout(() => setProofSuccess(null), 6000);
    }, 1200);
  };

  // NSS Handlers
  const handleLogNssHours = () => {
    if (!selectedTicket) return;
    const currentNss: NssWorkflow = selectedTicket.nssWorkflow || {
      nssUnitId: `NSS-${selectedTicket.assignedHei?.code || 'HEI'}-01`,
      coordinatorName: selectedTicket.assignedHei?.facultyMentor || 'Prof. Dr. A. K. Sinha',
      loggedFieldHours: 0,
      targetFieldHours: 60,
      nepCreditsEligible: 4,
      status: 'ASSIGNED',
    };

    const newHours = (currentNss.loggedFieldHours || 0) + hoursToLog;
    const isTargetMet = newHours >= currentNss.targetFieldHours;
    const newStatus = isTargetMet ? 'VERIFIED' : 'HOURS_LOGGED';

    const updatedTicket: ProblemTicket = {
      ...selectedTicket,
      nssWorkflow: {
        ...currentNss,
        loggedFieldHours: newHours,
        status: currentNss.status === 'CREDITS_AWARDED' ? 'CREDITS_AWARDED' : newStatus,
      },
    };

    onUpdateTicket(updatedTicket);
    onRecordLedgerEvent(selectedTicket.id, 'NSS_FIELD_HOURS_LOGGED', {
      hours_added: hoursToLog,
      total_logged: newHours,
      target_hours: currentNss.targetFieldHours,
      activity: hoursTaskDesc,
      coordinator: currentNss.coordinatorName,
    });

    setProofSuccess(`Logged ${hoursToLog} NSS field hours (${newHours}/${currentNss.targetFieldHours} hrs total). Anchored on Ledger.`);
    setTimeout(() => setProofSuccess(null), 6000);
  };

  const handleAddStudentVolunteer = () => {
    if (!newStudentName.trim() || !newStudentRoll.trim() || !selectedTicket) return;
    const currentStudents = selectedTicket.projectTeam?.students || [];

    const updatedTicket: ProblemTicket = {
      ...selectedTicket,
      projectTeam: {
        ...(selectedTicket.projectTeam || {
          id: 'team-' + Date.now(),
          teamName: 'NSS Student Capstone Cell',
          facultyLead: selectedTicket.assignedHei?.facultyMentor || 'Prof. Faculty Lead',
          nepCredits: 4,
          milestones: [],
          sponsors: [],
        }),
        students: [
          ...currentStudents,
          {
            name: newStudentName.trim(),
            rollNo: newStudentRoll.trim(),
            role: newStudentRole,
            creditsClaimed: false,
          },
        ],
      },
    };

    onUpdateTicket(updatedTicket);
    onRecordLedgerEvent(selectedTicket.id, 'STUDENT_VOLUNTEER_ASSIGNED', {
      student_name: newStudentName.trim(),
      roll_no: newStudentRoll.trim(),
      role: newStudentRole,
      hei: selectedTicket.assignedHei?.name,
    });

    setNewStudentName('');
    setNewStudentRoll('');
    setProofSuccess(`Added student volunteer ${newStudentName} to NSS Capstone Team!`);
    setTimeout(() => setProofSuccess(null), 5000);
  };

  const handleConferNepCredits = () => {
    if (!selectedTicket) return;
    const blockchainHash = '0x8f2d' + Math.random().toString(16).substring(2, 10) + 'e54b' + Math.random().toString(16).substring(2, 10) + '99c1';

    const updatedStudents = (selectedTicket.projectTeam?.students || []).map((s) => ({
      ...s,
      creditsClaimed: true,
    }));

    const updatedMilestones = (selectedTicket.projectTeam?.milestones || []).map((m) => ({
      ...m,
      status: 'APPROVED' as const,
      completedDate: m.completedDate || new Date().toISOString().split('T')[0],
      sha256Hash: m.sha256Hash || blockchainHash,
    }));

    const updatedTicket: ProblemTicket = {
      ...selectedTicket,
      status: 'RESOLVED',
      projectTeam: selectedTicket.projectTeam
        ? {
            ...selectedTicket.projectTeam,
            students: updatedStudents,
            milestones: updatedMilestones,
          }
        : undefined,
      nssWorkflow: {
        ...(selectedTicket.nssWorkflow || {
          nssUnitId: `NSS-${selectedTicket.assignedHei?.code || 'HEI'}-01`,
          coordinatorName: selectedTicket.assignedHei?.facultyMentor || 'Prof. Dr. A. K. Sinha',
          loggedFieldHours: 60,
          targetFieldHours: 60,
          nepCreditsEligible: 4,
          status: 'ASSIGNED',
        }),
        status: 'CREDITS_AWARDED',
        loggedFieldHours: Math.max(60, selectedTicket.nssWorkflow?.loggedFieldHours || 60),
        resolutionPortfolio: {
          beforePhotoUrl: selectedTicket.imageUrls?.[0] || '/images/issues/handpump_broken.jpg',
          afterPhotoUrl: afterPhotoPreset,
          fieldSummary: resolutionSummaryText,
          completionDate: new Date().toISOString().split('T')[0],
          facultyEndorsement: facultyEndorsementText,
          blockchainHash,
        },
      },
    };

    onUpdateTicket(updatedTicket);
    onRecordLedgerEvent(selectedTicket.id, 'NEP2020_CREDITS_CONFERRED', {
      credits_awarded: 4,
      students_count: updatedStudents.length,
      proof_hash: blockchainHash,
      faculty_lead: selectedTicket.assignedHei?.facultyMentor,
      hei: selectedTicket.assignedHei?.name,
      resolution_summary: resolutionSummaryText,
    });

    setProofSuccess(`🎉 Official 4 NEP 2020 Academic Credits Conferred! Resolution Portfolio anchored to Block: ${blockchainHash.substring(0, 16)}...`);
    setTimeout(() => setProofSuccess(null), 8000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Featured Student Engineering Innovation Drive Banner */}
      <CampaignBannerCarousel className="mb-2" />

      {/* HEI Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-sand-100/70 via-canvas to-terracotta-50 p-8 sm:p-10 border border-sand-300 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-sand-800 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.heiWorkspaceTitle}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              NEP 2020 Experiential Learning Capstone Workspace
            </h1>
            <p className="mt-3 text-sm text-charcoal-muted leading-relaxed">
              {t.heiWorkspaceSub}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-surface p-4 rounded-2xl border border-charcoal-border/50 shadow-soft text-center">
              <span className="text-2xl font-black text-terracotta">4 Credits</span>
              <p className="text-[11px] font-semibold text-charcoal-muted uppercase">NEP Capstone Worth</p>
            </div>
            <div className="bg-surface p-4 rounded-2xl border border-charcoal-border/50 shadow-soft text-center">
              <span className="text-2xl font-black text-emerald-700">100%</span>
              <p className="text-[11px] font-semibold text-charcoal-muted uppercase">Audit Verified</p>
            </div>
          </div>
        </div>
      </div>

      {proofSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between shadow-soft animate-fade-in">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{proofSuccess}</span>
          </div>
        </div>
      )}

      {/* Workspace vs NSS Credit Manager vs Regional GIS Map Tabs */}
      <div className="flex items-center gap-2 bg-sand-100 p-1.5 rounded-2xl border border-sand-300 w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setActiveView('workspace')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeView === 'workspace'
              ? 'bg-terracotta text-white shadow-xs'
              : 'text-charcoal hover:text-terracotta'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Capstone Workspace</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView('nss')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeView === 'nss'
              ? 'bg-terracotta text-white shadow-xs'
              : 'text-charcoal hover:text-terracotta'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>🎓 NSS & Academic Credit Manager</span>
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
          <span>🗺️ Regional GIS Map</span>
        </button>
      </div>

      {activeView === 'map' ? (
        <AgencyMapView
          tickets={tickets}
          onSelectTicket={(t) => {
            setSelectedTicketId(t.id);
            setActiveView('workspace');
          }}
          title="HEI Regional Problem Map"
          subtitle="Spatial distribution of community problems across Jharkhand districts assigned to engineering students and faculty mentors."
        />
      ) : activeView === 'nss' ? (
        /* NSS & NEP 2020 Experiential Credit Dashboard */
        <div className="space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-charcoal-border/50 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-terracotta-100 text-terracotta text-xs font-bold flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>NSS Directorate & UGC Experiential Framework</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    60 Field Hours = 4 NEP Credits
                  </span>
                </div>
                <h2 className="text-2xl font-black text-charcoal">
                  NSS Field Work & Experiential Credit Conferral Cell
                </h2>
                <p className="text-xs text-charcoal-muted mt-1 max-w-2xl">
                  Track field hours logged by student teams, manage volunteer roll rosters, verify Before/After engineering proof, and confer tamper-proof UGC/NEP 2020 academic credits anchored to the state ledger.
                </p>
              </div>

              {/* Active Ticket Quick Switcher */}
              <div className="bg-canvas-subtle p-3 rounded-2xl border border-charcoal-border/40 shrink-0">
                <label className="text-[11px] font-bold text-charcoal-muted uppercase block mb-1.5">
                  Select Active Issue
                </label>
                <select
                  value={selectedTicketId}
                  onChange={(e) => setSelectedTicketId(e.target.value)}
                  className="bg-surface text-charcoal text-xs font-semibold px-3 py-2 rounded-xl border border-charcoal-border focus:ring-2 focus:ring-terracotta focus:outline-hidden"
                >
                  {routedTickets.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.ticketCode} - {t.title.substring(0, 32)}... ({t.district})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Ticket Context Card */}
          <div className="bg-surface rounded-2xl p-6 border border-charcoal-border/50 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-border/30">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-terracotta px-2.5 py-0.5 rounded bg-terracotta-50">
                    {selectedTicket.ticketCode}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sand-100 text-sand-800">
                    {selectedTicket.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-canvas-subtle text-charcoal">
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-charcoal">{selectedTicket.title}</h3>
                <p className="text-xs text-charcoal-muted">
                  {selectedTicket.village}, {selectedTicket.district} • Assigned to {selectedTicket.assignedHei?.name}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold text-charcoal-muted">Faculty Coordinator</p>
                <p className="text-sm font-bold text-charcoal">{selectedTicket.assignedHei?.facultyMentor || 'Prof. Dr. A. K. Sinha'}</p>
                <p className="text-[11px] font-mono text-terracotta">{selectedTicket.assignedHei?.department}</p>
              </div>
            </div>

            {/* 3 Columns: 1. Hours Logger | 2. Student Roster | 3. Resolution & Credit Conferral */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              
              {/* Column 1: Field Hours Tracker (4 cols) */}
              <div className="lg:col-span-4 bg-canvas rounded-2xl p-5 border border-charcoal-border/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-terracotta" />
                      <span>Community Field Hours</span>
                    </h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {selectedTicket.nssWorkflow?.status || 'ASSIGNED'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {(() => {
                    const logged = selectedTicket.nssWorkflow?.loggedFieldHours || 0;
                    const target = selectedTicket.nssWorkflow?.targetFieldHours || 60;
                    const pct = Math.min(100, Math.round((logged / target) * 100));
                    return (
                      <div className="space-y-2 mb-5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-charcoal font-bold">{logged} / {target} hrs logged</span>
                          <span className="text-terracotta font-black">{pct}% of requirement</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-canvas-subtle overflow-hidden border border-charcoal-border/30">
                          <div
                            className={`h-full transition-all ${pct >= 100 ? 'bg-emerald-600' : 'bg-gradient-to-r from-sand to-terracotta'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-charcoal-muted">
                          {pct >= 100
                            ? '✅ Field criteria satisfied! Eligible for 4 NEP credits.'
                            : `⏳ Need ${Math.max(0, target - logged)} more hours for full NEP credit eligibility.`}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Log Hours Form */}
                  <div className="p-4 rounded-xl bg-surface border border-charcoal-border/40 space-y-3">
                    <h5 className="text-xs font-bold text-charcoal uppercase tracking-wider">Log New Field Session</h5>
                    
                    <div>
                      <label className="text-[11px] text-charcoal-muted block mb-1 font-semibold">Session Hours</label>
                      <div className="flex gap-2">
                        {[4, 6, 8, 12].map((hrs) => (
                          <button
                            key={hrs}
                            type="button"
                            onClick={() => setHoursToLog(hrs)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              hoursToLog === hrs
                                ? 'bg-terracotta text-white shadow-xs'
                                : 'bg-canvas text-charcoal border border-charcoal-border/40 hover:bg-sand-100'
                            }`}
                          >
                            +{hrs}h
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-charcoal-muted block mb-1 font-semibold">Activity Notes</label>
                      <input
                        type="text"
                        value={hoursTaskDesc}
                        onChange={(e) => setHoursTaskDesc(e.target.value)}
                        placeholder="e.g. Water testing with Gram Sabha"
                        className="w-full text-xs px-3 py-2 rounded-lg bg-canvas border border-charcoal-border focus:ring-1 focus:ring-terracotta focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleLogNssHours}
                      className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-soft transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log {hoursToLog} Field Hours to Ledger</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-charcoal-border/30 text-[11px] text-charcoal-muted">
                  <span>Unit ID: <strong className="font-mono text-charcoal">{selectedTicket.nssWorkflow?.nssUnitId || 'NSS-STATE-01'}</strong></span>
                </div>
              </div>

              {/* Column 2: Student Volunteer Roster (4 cols) */}
              <div className="lg:col-span-4 bg-canvas rounded-2xl p-5 border border-charcoal-border/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-terracotta" />
                      <span>Student Volunteer Team</span>
                    </h4>
                    <span className="text-xs font-semibold text-sand-800">
                      {(selectedTicket.projectTeam?.students || []).length} Enrolled
                    </span>
                  </div>

                  {/* Student List */}
                  <div className="space-y-2 mb-4 max-h-52 overflow-y-auto pr-1">
                    {(selectedTicket.projectTeam?.students || []).map((student, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-surface border border-charcoal-border/40 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-charcoal">{student.name}</p>
                          <p className="text-[11px] text-terracotta font-medium">{student.role}</p>
                          <p className="text-[10px] font-mono text-charcoal-muted">Roll: {student.rollNo}</p>
                        </div>
                        <div>
                          {student.creditsClaimed ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>4 Credits Awarded</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Eligible for 4 Credits
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {(selectedTicket.projectTeam?.students || []).length === 0 && (
                      <p className="text-xs text-charcoal-muted italic p-3 text-center">
                        No students enrolled yet. Add volunteers below.
                      </p>
                    )}
                  </div>

                  {/* Add Volunteer Form */}
                  <div className="p-3.5 rounded-xl bg-surface border border-charcoal-border/40 space-y-2.5">
                    <h5 className="text-xs font-bold text-charcoal uppercase tracking-wider">Add Student Volunteer</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-canvas border border-charcoal-border focus:ring-1 focus:ring-terracotta focus:outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="NSS / Roll No"
                        value={newStudentRoll}
                        onChange={(e) => setNewStudentRoll(e.target.value)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-canvas border border-charcoal-border focus:ring-1 focus:ring-terracotta focus:outline-hidden"
                      />
                    </div>
                    <select
                      value={newStudentRole}
                      onChange={(e) => setNewStudentRole(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-canvas border border-charcoal-border focus:ring-1 focus:ring-terracotta focus:outline-hidden"
                    >
                      <option value="NSS Field Volunteer">NSS Field Volunteer</option>
                      <option value="Lead Prototyper">Lead Prototyper</option>
                      <option value="Water Quality Analyst">Water Quality Analyst</option>
                      <option value="Renewable Energy Prototyper">Renewable Energy Prototyper</option>
                      <option value="Community Field Demonstrator">Community Field Demonstrator</option>
                      <option value="GIS & Catchment Modeler">GIS & Catchment Modeler</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddStudentVolunteer}
                      className="w-full py-2 rounded-lg bg-sand-700 hover:bg-sand-800 text-white font-bold text-xs transition-colors"
                    >
                      + Add Student to Roster
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 3: Resolution Portfolio & Credit Conferral (4 cols) */}
              <div className="lg:col-span-4 bg-canvas rounded-2xl p-5 border border-charcoal-border/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-terracotta" />
                      <span>Resolution & Credits</span>
                    </h4>
                    <span className="text-xs font-bold text-terracotta bg-terracotta-50 px-2 py-0.5 rounded">
                      NEP 2020 Capstone
                    </span>
                  </div>

                  {selectedTicket.status === 'RESOLVED' && selectedTicket.nssWorkflow?.resolutionPortfolio ? (
                    /* Already Resolved View */
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>4 NEP 2020 Academic Credits Awarded!</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {selectedTicket.nssWorkflow.resolutionPortfolio.fieldSummary}
                        </p>
                        <div className="font-mono text-[10px] text-emerald-800 bg-emerald-100/60 p-1.5 rounded truncate">
                          Hash: {selectedTicket.nssWorkflow.resolutionPortfolio.blockchainHash}
                        </div>
                      </div>

                      {/* Before / After Preview */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] font-bold text-charcoal-muted uppercase mb-1">Before</p>
                          <div className="aspect-[4/3] rounded-lg overflow-hidden border border-charcoal-border/40">
                            <img
                              src={selectedTicket.nssWorkflow.resolutionPortfolio.beforePhotoUrl}
                              alt="Before"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">After (Resolved)</p>
                          <div className="aspect-[4/3] rounded-lg overflow-hidden border border-emerald-300">
                            <img
                              src={selectedTicket.nssWorkflow.resolutionPortfolio.afterPhotoUrl}
                              alt="After"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenCertificate(selectedTicket)}
                        className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-soft transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-4 h-4" />
                        <span>View NEP 2020 Blockchain Certificate</span>
                      </button>
                    </div>
                  ) : (
                    /* Pending Resolution / Conferral Form */
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                        Complete physical prototype deployment, attach resolution evidence photo, and sign off to confer 4 NEP credits to all enrolled students.
                      </div>

                      <div>
                        <label className="text-[11px] text-charcoal-muted block mb-1 font-semibold">
                          After Resolution Evidence Photo Preset
                        </label>
                        <select
                          value={afterPhotoPreset}
                          onChange={(e) => setAfterPhotoPreset(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-surface border border-charcoal-border focus:ring-1 focus:ring-terracotta focus:outline-hidden"
                        >
                          <option value="/images/issues/water_filter_installed.jpg">Installed Community Arsenic Filter (Water)</option>
                          <option value="/images/issues/solar_restored.jpg">Replaced Solar Inverter & SPD Grid (Solar)</option>
                          <option value="/images/issues/road_culvert.jpg">Interlocking Pre-cast Culvert (Roads)</option>
                          <option value="/images/issues/crop_blight.jpg">Bio-Organic Microbial Remission (Agri)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-charcoal-muted block mb-1 font-semibold">
                          Field Resolution Summary
                        </label>
                        <textarea
                          rows={2}
                          value={resolutionSummaryText}
                          onChange={(e) => setResolutionSummaryText(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-surface border border-charcoal-border focus:ring-1 focus:ring-terracotta focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-charcoal-muted block mb-1 font-semibold">
                          Faculty Mentor Endorsement
                        </label>
                        <input
                          type="text"
                          value={facultyEndorsementText}
                          onChange={(e) => setFacultyEndorsementText(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-surface border border-charcoal-border focus:ring-1 focus:ring-terracotta focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleConferNepCredits}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-terracotta to-sand-800 text-white font-bold text-xs shadow-soft transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Confer 4 NEP Credits & Resolve</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-charcoal-border/30 text-[10px] text-charcoal-muted flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Statewide Experiential Credit Ledger Anchored</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Main 2-Column Academic Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Routed Tickets Queue */}
          <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
              <span>Routed Problem Statements</span>
              <span className="px-2 py-0.5 rounded-full bg-terracotta-100 text-terracotta text-xs font-bold">
                {routedTickets.length}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {routedTickets.map((t) => {
              const isSelected = selectedTicket.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-surface border-terracotta shadow-card ring-1 ring-terracotta/30'
                      : 'bg-surface/80 border-charcoal-border/50 hover:bg-surface hover:shadow-soft'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-terracotta">
                      {t.ticketCode}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-canvas-subtle text-charcoal-muted">
                      {t.assignedHei?.distanceKm} km
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-charcoal line-clamp-2 mb-1.5">
                    {t.title}
                  </h3>

                  <p className="text-xs text-charcoal-muted line-clamp-2 mb-3">
                    {t.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-charcoal-border/30 text-[11px]">
                    <span className="font-semibold text-sand-800">
                      {t.district}
                    </span>
                    <span className={`font-bold ${t.status === 'IN_PROGRESS' ? 'text-amber-700' : t.status === 'RESOLVED' ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Ticket Details, Team Roster & Milestone Tracker */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Card */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-charcoal-border/50 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-border/30 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-terracotta-50 text-terracotta font-mono text-xs font-bold">
                    {selectedTicket.ticketCode}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-sand-100 text-sand-800 text-xs font-semibold">
                    Category: {selectedTicket.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal">
                  {selectedTicket.title}
                </h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Location: {selectedTicket.village}, {selectedTicket.district} • Reported by: {selectedTicket.reporterName}
                </p>
              </div>

              {selectedTicket.status === 'AI_ROUTED' ? (
                <button
                  onClick={() => handleAcceptTicket(selectedTicket)}
                  className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-soft transition-transform hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Accept & Form Capstone Team</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenCertificate(selectedTicket)}
                  className="px-5 py-2.5 rounded-xl bg-sand hover:bg-sand-600 text-charcoal font-bold text-xs shadow-soft transition-transform hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Award className="w-4 h-4 text-charcoal" />
                  <span>Confer NEP 2020 Certificate</span>
                </button>
              )}
            </div>

            {/* Citizen Ground Reality Evidence Thumbnail */}
            <IssuePhotoThumbnail
              src={selectedTicket.imageUrls?.[0]}
              title={selectedTicket.title}
              category={selectedTicket.category}
              coordinates={{ lat: selectedTicket.latitude, lng: selectedTicket.longitude }}
              timestamp={selectedTicket.reportedAt}
              village={selectedTicket.village}
              district={selectedTicket.district}
              className="mb-6"
              aspectRatio="wide"
            />

            {/* AI Match Explanation */}
            <div className="bg-canvas-subtle p-4 rounded-xl border border-terracotta-100 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-terracotta mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous AI Routing Rationale</span>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                {selectedTicket.assignedHei?.routingReason || 'Assigned based on proximity and domain expertise.'}
              </p>
            </div>

            {/* Team Members Roster */}
            {selectedTicket.projectTeam ? (
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                    <Users className="w-4 h-4 text-terracotta" />
                    <span>Multidisciplinary Capstone Team: {selectedTicket.projectTeam.teamName}</span>
                  </h3>
                  <span className="text-xs text-charcoal-muted">
                    Faculty Mentor: <strong className="text-charcoal">{selectedTicket.projectTeam.facultyLead}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedTicket.projectTeam.students.map((st, i) => (
                    <div key={i} className="p-3 rounded-xl bg-canvas border border-charcoal-border/40 text-xs">
                      <p className="font-bold text-charcoal">{st.name}</p>
                      <p className="text-[11px] text-terracotta font-semibold">{st.role}</p>
                      <p className="text-[10px] text-charcoal-muted font-mono mt-1">Roll: {st.rollNo}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-canvas-subtle border border-dashed border-charcoal-border text-center text-xs text-charcoal-muted mb-8">
                <p>Team not yet formed. Click "Accept & Form Capstone Team" to configure faculty and students.</p>
              </div>
            )}

            {/* 4 NEP 2020 Milestones Tracker */}
            {selectedTicket.projectTeam && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                    <Award className="w-4 h-4 text-sand-700" />
                    <span>NEP 2020 4-Stage Experiential Learning Milestones</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-700">
                    {selectedTicket.projectTeam.milestones.filter((m) => m.status === 'APPROVED').length} / 4 Approved
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedTicket.projectTeam.milestones.map((ms) => {
                    const isApproved = ms.status === 'APPROVED';
                    const isInProgress = ms.status === 'IN_PROGRESS';
                    const isPending = ms.status === 'PENDING';

                    return (
                      <div
                        key={ms.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isApproved
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : isInProgress
                            ? 'bg-amber-50/40 border-amber-200'
                            : 'bg-canvas border-charcoal-border/30 opacity-75'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                isApproved
                                  ? 'bg-emerald-600 text-white'
                                  : isInProgress
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-charcoal-border text-charcoal-muted'
                              }`}
                            >
                              {ms.sequence}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-charcoal">
                                {ms.title}
                              </h4>
                              <p className="text-[11px] text-charcoal-muted mt-0.5">
                                Target Completion: {ms.targetDate}
                                {ms.completedDate && ` • Verified: ${ms.completedDate}`}
                              </p>
                              {ms.sha256Hash && (
                                <div className="flex items-center gap-1 mt-1 font-mono text-[10px] text-emerald-800">
                                  <Lock className="w-3 h-3 text-emerald-600" />
                                  <span>Audit Hash: {ms.sha256Hash.substring(0, 24)}...</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {isApproved ? (
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSimulateMilestoneSubmit(ms.id)}
                                disabled={isSubmittingProof === ms.id}
                                className="px-3 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white font-semibold text-xs shadow-soft flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                {isSubmittingProof === ms.id ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5 animate-spin" />
                                    <span>Hashing Proof...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Submit Proof & Hash</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    )}
  </div>
);
}
