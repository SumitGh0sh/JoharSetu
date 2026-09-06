'use client';

import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  Award,
  Activity,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DistrictMetric, AuditBlock, ProblemTicket } from '../lib/types';
import { JHARKHAND_DISTRICT_STATS } from '../lib/mockData';
import { formatTime } from '../lib/dateUtils';
import { useLanguage } from '../context/LanguageContext';
import AgencyMapView from './AgencyMapView';

interface GovtAdminPortalProps {
  auditChain: AuditBlock[];
  tickets: ProblemTicket[];
  onOpenLedgerModal: () => void;
}

export default function GovtAdminPortal({
  auditChain,
  tickets,
  onOpenLedgerModal,
}: GovtAdminPortalProps) {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictMetric>(JHARKHAND_DISTRICT_STATS[0]);

  // Statewide KPIs
  const totalReports = 1428;
  const resolvedCount = 942;
  const activeTeams = 486;
  const routingAccuracy = '98.4%';
  const totalCSR = '₹2.85 Cr';

  return (
    <div className="space-y-10 pb-16">
      
      {/* Govt Command Header */}
      <div className="rounded-3xl bg-gradient-to-r from-sand-100 via-canvas to-terracotta-50 p-8 sm:p-10 border border-sand-300 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-sand-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.govtCommandTitle}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Jharkhand Statewide Civic & HEI Resolution Directorate
            </h1>
            <p className="mt-3 text-sm text-charcoal-muted leading-relaxed">
              {t.govtCommandSub}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLedgerModal}
              className="px-5 py-3 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-card flex items-center gap-2 transition-transform hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Explore Cryptographic Ledger ({auditChain.length} Blocks)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statewide Macro KPI Dials */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: t.statTotalComplaints, val: totalReports.toLocaleString(), sub: '+124 this week', icon: AlertTriangle, color: 'text-terracotta' },
          { label: t.statResolvedProjects, val: resolvedCount.toLocaleString(), sub: '66% statewide rate', icon: CheckCircle2, color: 'text-emerald-700' },
          { label: t.statActiveTeams, val: activeTeams.toString(), sub: 'Across 28 Colleges', icon: Building, color: 'text-sand-700' },
          { label: t.statRoutingAccuracy, val: routingAccuracy, sub: 'Autonomous Triaged', icon: Sparkles, color: 'text-blue-700' },
          { label: t.statCsrCapital, val: totalCSR, sub: 'Direct Co-Financing', icon: TrendingUp, color: 'text-charcoal' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-surface rounded-2xl p-5 border border-charcoal-border/50 shadow-soft"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className={`text-2xl font-black ${kpi.color}`}>{kpi.val}</div>
              <p className="text-[11px] text-charcoal-muted font-medium mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Agency GIS Incident Map View */}
      <AgencyMapView
        tickets={tickets}
        onOpenLedgerModal={onOpenLedgerModal}
      />


      {/* Interactive GIS Heatmap & District Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: District Selector & Analytics Matrix */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-6 sm:p-8 border border-charcoal-border/50 shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-charcoal-border/30 mb-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
                <MapPin className="w-5 h-5 text-terracotta" />
                <span>Jharkhand 24-District Resolution Matrix</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-1">
                Select any district to inspect active civic tickets and mapped higher education institutions.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sand-100 text-sand-800">
              Selected: {selectedDistrict.name}
            </span>
          </div>

          {/* District Grid Selector */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6 max-h-64 overflow-y-auto pr-1">
            {JHARKHAND_DISTRICT_STATS.map((d) => {
              const isSelected = selectedDistrict.name === d.name;
              return (
                <button
                  key={d.name}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-2.5 rounded-xl text-left transition-all border text-xs ${
                    isSelected
                      ? 'bg-terracotta text-white border-terracotta shadow-sm font-bold'
                      : 'bg-canvas text-charcoal-muted hover:bg-canvas-subtle border-charcoal-border/40 font-medium'
                  }`}
                >
                  <p className="truncate">{d.name}</p>
                  <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-charcoal-muted'}`}>
                    {d.activeTickets} active
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected District Deep Dive */}
          <div className="p-5 rounded-2xl bg-canvas-subtle border border-terracotta-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-charcoal">{selectedDistrict.name} District</h3>
                <p className="text-xs text-charcoal-muted">Coordinates: {selectedDistrict.lat.toFixed(4)}° N, {selectedDistrict.lon.toFixed(4)}° E</p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  selectedDistrict.urgencyRate === 'Severe'
                    ? 'bg-red-100 text-red-800'
                    : selectedDistrict.urgencyRate === 'High'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                Urgency: {selectedDistrict.urgencyRate}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-surface border border-charcoal-border/30">
                <span className="text-[11px] font-semibold text-charcoal-muted">Active Tickets</span>
                <p className="text-lg font-bold text-terracotta">{selectedDistrict.activeTickets}</p>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-charcoal-border/30">
                <span className="text-[11px] font-semibold text-charcoal-muted">Resolved by HEIs</span>
                <p className="text-lg font-bold text-emerald-700">{selectedDistrict.resolved}</p>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-charcoal-border/30 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-charcoal-muted">Resolution Rate</span>
                <p className="text-lg font-bold text-charcoal">
                  {Math.round((selectedDistrict.resolved / (selectedDistrict.activeTickets + selectedDistrict.resolved)) * 100)}%
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-charcoal mb-2">Mapped Higher Education Hubs:</p>
              <div className="flex flex-wrap gap-2">
                {selectedDistrict.heis.map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-surface text-charcoal text-xs font-semibold border border-sand-300 flex items-center gap-1.5 shadow-soft"
                  >
                    <Building className="w-3 h-3 text-sand-700" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Cryptographic Audit Stream Snapshot */}
        <div className="lg:col-span-5 bg-surface rounded-2xl p-6 sm:p-8 border border-charcoal-border/50 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-border/30 mb-6">
              <div>
                <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Immutable Audit Ledger Stream</span>
                </h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  SHA-256 hash-chain guaranteeing zero tampering in fund dispersal and academic credits.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Ledger: Valid
              </span>
            </div>

            <div className="space-y-3">
              {auditChain.slice(-4).reverse().map((block) => (
                <div
                  key={block.index}
                  className="p-3.5 rounded-xl bg-canvas border border-charcoal-border/40 text-xs space-y-1.5 font-mono"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-charcoal font-sans">
                    <span className="text-terracotta">Block #{block.index}</span>
                    <span className="text-charcoal-muted" suppressHydrationWarning>{formatTime(block.timestamp)}</span>

                  </div>

                  <p className="text-[11px] font-sans font-bold text-charcoal truncate">
                    {block.action.replace(/_/g, ' ')}
                  </p>

                  <div className="text-[10px] text-charcoal-muted truncate">
                    <span>Ticket: {block.ticket_id}</span>
                  </div>

                  <div className="text-[9px] text-emerald-800 truncate bg-emerald-50 p-1 rounded">
                    <span>Hash: {block.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-charcoal-border/30">
            <button
              onClick={onOpenLedgerModal}
              className="w-full py-2.5 rounded-xl bg-canvas-subtle hover:bg-canvas text-charcoal font-bold text-xs border border-charcoal-border/60 transition-colors flex items-center justify-center gap-2"
            >
              <span>View Full Cryptographic Audit Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
