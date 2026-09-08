'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Medal,
  Star,
  Building2,
  GraduationCap,
  Briefcase,
  Search,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  FileCheck2,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import {
  MOCK_HEI_DIRECTORY,
  MOCK_CRC_DIRECTORY,
  MOCK_STUDENT_LEADERBOARD
} from '../lib/mockData';
import { HeiDirectoryEntry, CrcDirectoryEntry, StudentLeaderboardEntry } from '../lib/types';

type LeaderboardTab = 'HEIS' | 'STUDENTS' | 'CSR';
type Timeframe = 'ALL_TIME' | 'CURRENT_ACADEMIC_YEAR' | 'LAST_30_DAYS';

export default function GamifiedLeaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('HEIS');
  const [timeframe, setTimeframe] = useState<Timeframe>('CURRENT_ACADEMIC_YEAR');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSmartFilters, setShowSmartFilters] = useState(false);

  // HEI Smart Filters
  const [heiStateFilter, setHeiStateFilter] = useState('ALL');
  const [heiDistrictFilter, setHeiDistrictFilter] = useState('ALL');
  const [heiMinResolved, setHeiMinResolved] = useState<number>(0);
  const [heiMinCsrReceived, setHeiMinCsrReceived] = useState<number>(0);

  // Student Smart Filters
  const [studentHeiFilter, setStudentHeiFilter] = useState('ALL');
  const [studentDeptFilter, setStudentDeptFilter] = useState('ALL');
  const [studentMinHours, setStudentMinHours] = useState<number>(0);
  const [studentMinCredits, setStudentMinCredits] = useState<number>(0);

  // CSR Smart Filters
  const [csrMinDeployed, setCsrMinDeployed] = useState<number>(0);
  const [csrRegionFilter, setCsrRegionFilter] = useState('ALL');

  // Mobile Expandable Secondary Metadata States
  const [expandedHeiId, setExpandedHeiId] = useState<string | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [expandedCsrId, setExpandedCsrId] = useState<string | null>(null);

  // Dynamic distinct filter option lists
  const heiDistricts = useMemo(() => Array.from(new Set(MOCK_HEI_DIRECTORY.map((h) => h.district))).sort(), []);
  const heiStates = useMemo(() => Array.from(new Set(MOCK_HEI_DIRECTORY.map((h) => h.state || 'Jharkhand'))).sort(), []);
  const studentHeis = useMemo(() => Array.from(new Set(MOCK_STUDENT_LEADERBOARD.map((s) => s.heiName))).sort(), []);
  const studentDepts = useMemo(() => Array.from(new Set(MOCK_STUDENT_LEADERBOARD.map((s) => s.department || 'General Engineering'))).sort(), []);
  const csrRegions = useMemo(() => Array.from(new Set(MOCK_CRC_DIRECTORY.flatMap((c) => c.regionalFocus))).sort(), []);

  // Filtered HEIs
  const filteredHeis = useMemo(() => {
    let list = [...MOCK_HEI_DIRECTORY];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.code.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q) ||
          h.facultyLead.toLowerCase().includes(q)
      );
    }
    if (heiStateFilter !== 'ALL') {
      list = list.filter((h) => (h.state || 'Jharkhand') === heiStateFilter);
    }
    if (heiDistrictFilter !== 'ALL') {
      list = list.filter((h) => h.district === heiDistrictFilter);
    }
    if (heiMinResolved > 0) {
      list = list.filter((h) => h.resolvedProblems >= heiMinResolved);
    }
    if (heiMinCsrReceived > 0) {
      list = list.filter((h) => (h.totalCsrDonationsINR || 0) >= heiMinCsrReceived);
    }
    return list.sort((a, b) => b.societalImpactScore - a.societalImpactScore);
  }, [searchQuery, heiStateFilter, heiDistrictFilter, heiMinResolved, heiMinCsrReceived]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    let list = [...MOCK_STUDENT_LEADERBOARD];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.heiName.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.specialization.toLowerCase().includes(q)
      );
    }
    if (studentHeiFilter !== 'ALL') {
      list = list.filter((s) => s.heiName === studentHeiFilter);
    }
    if (studentDeptFilter !== 'ALL') {
      list = list.filter((s) => (s.department || 'General Engineering') === studentDeptFilter);
    }
    if (studentMinHours > 0) {
      list = list.filter((s) => s.fieldHoursLogged >= studentMinHours);
    }
    if (studentMinCredits > 0) {
      list = list.filter((s) => s.nepCreditsEarned >= studentMinCredits);
    }
    return list.sort((a, b) => b.fieldHoursLogged - a.fieldHoursLogged);
  }, [searchQuery, studentHeiFilter, studentDeptFilter, studentMinHours, studentMinCredits]);

  // Filtered CSR Sponsors
  const filteredCsr = useMemo(() => {
    let list = [...MOCK_CRC_DIRECTORY];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.brandTag.toLowerCase().includes(q) ||
          c.csrDirector.toLowerCase().includes(q) ||
          c.regionalFocus.some((r) => r.toLowerCase().includes(q))
      );
    }
    if (csrRegionFilter !== 'ALL') {
      list = list.filter((c) => c.regionalFocus.includes(csrRegionFilter));
    }
    if (csrMinDeployed > 0) {
      list = list.filter((c) => c.totalDisbursedINR >= csrMinDeployed);
    }
    return list.sort((a, b) => b.totalDisbursedINR - a.totalDisbursedINR);
  }, [searchQuery, csrRegionFilter, csrMinDeployed]);

  // Active filters count for current tab
  const activeFiltersCount = useMemo(() => {
    if (activeTab === 'HEIS') {
      return (
        (heiStateFilter !== 'ALL' ? 1 : 0) +
        (heiDistrictFilter !== 'ALL' ? 1 : 0) +
        (heiMinResolved > 0 ? 1 : 0) +
        (heiMinCsrReceived > 0 ? 1 : 0)
      );
    } else if (activeTab === 'STUDENTS') {
      return (
        (studentHeiFilter !== 'ALL' ? 1 : 0) +
        (studentDeptFilter !== 'ALL' ? 1 : 0) +
        (studentMinHours > 0 ? 1 : 0) +
        (studentMinCredits > 0 ? 1 : 0)
      );
    } else {
      return (
        (csrRegionFilter !== 'ALL' ? 1 : 0) +
        (csrMinDeployed > 0 ? 1 : 0)
      );
    }
  }, [
    activeTab,
    heiStateFilter,
    heiDistrictFilter,
    heiMinResolved,
    heiMinCsrReceived,
    studentHeiFilter,
    studentDeptFilter,
    studentMinHours,
    studentMinCredits,
    csrRegionFilter,
    csrMinDeployed
  ]);

  const resetCurrentTabFilters = () => {
    if (activeTab === 'HEIS') {
      setHeiStateFilter('ALL');
      setHeiDistrictFilter('ALL');
      setHeiMinResolved(0);
      setHeiMinCsrReceived(0);
    } else if (activeTab === 'STUDENTS') {
      setStudentHeiFilter('ALL');
      setStudentDeptFilter('ALL');
      setStudentMinHours(0);
      setStudentMinCredits(0);
    } else {
      setCsRegionFilter('ALL');
      setCsrMinDeployed(0);
    }
  };

  const setCsRegionFilter = (val: string) => setCsrRegionFilter(val);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-charcoal via-[#231A18] to-[#171210] text-white p-6 sm:p-8 shadow-card border border-sand-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-64 h-64 rounded-full bg-terracotta/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-400/20 text-sand-200 border border-sand-400/30 text-xs font-black tracking-wide uppercase">
                <Trophy className="w-3.5 h-3.5 text-sand-300" />
                NEP 2020 Experiential Leaderboards
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
                Statewide Higher Education Hall of Fame
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Jharkhand Civic Champions: <span className="text-sand-300">Societal Impact</span>
            </h1>
            <p className="text-sm sm:text-base text-sand-100/80 leading-relaxed">
              Celebrating universities, engineering capstone volunteers, and CSR foundations driving on-ground transformation in rural Jharkhand.
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="bg-white/10 p-1.5 rounded-2xl border border-white/15 flex items-center gap-1 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setTimeframe('CURRENT_ACADEMIC_YEAR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === 'CURRENT_ACADEMIC_YEAR'
                  ? 'bg-sand-400 text-charcoal shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Academic Year 2025-26
            </button>
            <button
              onClick={() => setTimeframe('ALL_TIME')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === 'ALL_TIME'
                  ? 'bg-sand-400 text-charcoal shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeframe('LAST_30_DAYS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === 'LAST_30_DAYS'
                  ? 'bg-sand-400 text-charcoal shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-0">
          <button
            onClick={() => {
              setActiveTab('HEIS');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'HEIS'
                ? 'bg-white/15 text-sand-200 border-sand-400 shadow-xs'
                : 'text-white/70 hover:text-white border-transparent hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Colleges & Universities ({filteredHeis.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('STUDENTS');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'STUDENTS'
                ? 'bg-white/15 text-sand-200 border-sand-400 shadow-xs'
                : 'text-white/70 hover:text-white border-transparent hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Changemakers ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('CSR');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'CSR'
                ? 'bg-white/15 text-sand-200 border-sand-400 shadow-xs'
                : 'text-white/70 hover:text-white border-transparent hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>CSR & Industry Patrons ({filteredCsr.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="space-y-3">
        <div className="bg-surface rounded-2xl p-3 sm:p-4 border border-charcoal-border/50 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'HEIS'
                  ? 'Search colleges, institutes, or districts...'
                  : activeTab === 'STUDENTS'
                  ? 'Search students, roll numbers, or specializations...'
                  : 'Search corporate sponsors, grant themes, or regions...'
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSmartFilters(!showSmartFilters)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                showSmartFilters || activeFiltersCount > 0
                  ? 'bg-sand-400 text-charcoal border-sand-500 shadow-xs'
                  : 'bg-canvas text-charcoal-muted hover:text-charcoal border-charcoal-border/50 hover:bg-canvas-subtle'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Smart Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-terracotta text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              {showSmartFilters ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-charcoal-muted font-bold pl-2 border-l border-charcoal-border/30">
              <Sparkles className="w-3.5 h-3.5 text-sand-600" />
              <span>NEP Verified</span>
            </div>
          </div>
        </div>

        {/* Expandable Smart Filter Drawer */}
        {showSmartFilters && (
          <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-sand-400/40 shadow-soft space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-charcoal-border/20 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-terracotta" />
                <h4 className="text-xs font-black uppercase tracking-wider text-charcoal">
                  {activeTab === 'HEIS'
                    ? 'Filter Higher Education Institutions'
                    : activeTab === 'STUDENTS'
                    ? 'Filter Student Changemakers'
                    : 'Filter CSR Sponsors & Grants'}
                </h4>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-black">
                    {activeFiltersCount} Active
                  </span>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetCurrentTabFilters}
                  className="flex items-center gap-1 text-xs font-bold text-terracotta hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Tab Filters</span>
                </button>
              )}
            </div>

            {/* TAB-SPECIFIC FILTER INPUTS */}
            {activeTab === 'HEIS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* State */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    State
                  </label>
                  <select
                    value={heiStateFilter}
                    onChange={(e) => setHeiStateFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value="ALL">All States</option>
                    {heiStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    District
                  </label>
                  <select
                    value={heiDistrictFilter}
                    onChange={(e) => setHeiDistrictFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value="ALL">All Districts ({heiDistricts.length})</option>
                    {heiDistricts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Problems Resolved */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    Min Problems Resolved
                  </label>
                  <select
                    value={heiMinResolved}
                    onChange={(e) => setHeiMinResolved(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value={0}>Any Resolution Count</option>
                    <option value={15}>15+ Problems Solved</option>
                    <option value={25}>25+ Problems Solved</option>
                    <option value={35}>35+ Problems Solved</option>
                  </select>
                </div>

                {/* Min CSR Funding Received */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    Min CSR Grants Received
                  </label>
                  <select
                    value={heiMinCsrReceived}
                    onChange={(e) => setHeiMinCsrReceived(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value={0}>Any CSR Grant Volume</option>
                    <option value={2000000}>₹20 Lakhs+ Received</option>
                    <option value={3500000}>₹35 Lakhs+ Received</option>
                    <option value={5000000}>₹50 Lakhs+ Received</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'STUDENTS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* College Affiliation */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    College / HEI Affiliation
                  </label>
                  <select
                    value={studentHeiFilter}
                    onChange={(e) => setStudentHeiFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value="ALL">All Colleges / Universities</option>
                    {studentHeis.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Department */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    Academic Department
                  </label>
                  <select
                    value={studentDeptFilter}
                    onChange={(e) => setStudentDeptFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value="ALL">All Departments</option>
                    {studentDepts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Field Hours Logged */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    Min Field Hours Logged
                  </label>
                  <select
                    value={studentMinHours}
                    onChange={(e) => setStudentMinHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value={0}>Any Hours Logged</option>
                    <option value={50}>50+ Field Hours</option>
                    <option value={90}>90+ Field Hours</option>
                    <option value={120}>120+ Field Hours</option>
                  </select>
                </div>

                {/* Min NEP Credits */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    NEP 2020 Credits Earned
                  </label>
                  <select
                    value={studentMinCredits}
                    onChange={(e) => setStudentMinCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value={0}>All Credits</option>
                    <option value={2}>2+ NEP Credits</option>
                    <option value={3}>3+ NEP Credits</option>
                    <option value={4}>4 Credits (Max Capstone)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'CSR' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Regional Coverage */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    Regional Focus District
                  </label>
                  <select
                    value={csrRegionFilter}
                    onChange={(e) => setCsrRegionFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value="ALL">All Regional Focuses</option>
                    {csrRegions.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Funding Deployed */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                    Min Funding Deployed
                  </label>
                  <select
                    value={csrMinDeployed}
                    onChange={(e) => setCsrMinDeployed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
                  >
                    <option value={0}>Any Funding Volume</option>
                    <option value={2500000}>₹25 Lakhs+ Deployed</option>
                    <option value={3500000}>₹35 Lakhs+ Deployed</option>
                    <option value={5000000}>₹50 Lakhs+ Deployed</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-charcoal-muted font-bold">Active Filters:</span>
            {activeTab === 'HEIS' && (
              <>
                {heiStateFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    State: {heiStateFilter}
                    <button onClick={() => setHeiStateFilter('ALL')} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {heiDistrictFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    District: {heiDistrictFilter}
                    <button onClick={() => setHeiDistrictFilter('ALL')} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {heiMinResolved > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    Min Solved: {heiMinResolved}+
                    <button onClick={() => setHeiMinResolved(0)} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {heiMinCsrReceived > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    CSR Min: ₹{heiMinCsrReceived / 100000}L+
                    <button onClick={() => setHeiMinCsrReceived(0)} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </>
            )}

            {activeTab === 'STUDENTS' && (
              <>
                {studentHeiFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    College: {studentHeiFilter}
                    <button onClick={() => setStudentHeiFilter('ALL')} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {studentDeptFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    Dept: {studentDeptFilter}
                    <button onClick={() => setStudentDeptFilter('ALL')} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {studentMinHours > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    Hours: {studentMinHours}+
                    <button onClick={() => setStudentMinHours(0)} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {studentMinCredits > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    Credits: {studentMinCredits}+
                    <button onClick={() => setStudentMinCredits(0)} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </>
            )}

            {activeTab === 'CSR' && (
              <>
                {csrRegionFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    Region: {csrRegionFilter}
                    <button onClick={() => setCsrRegionFilter('ALL')} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {csrMinDeployed > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 text-charcoal font-bold text-[11px]">
                    Deployed: ₹{csrMinDeployed / 100000}L+
                    <button onClick={() => setCsrMinDeployed(0)} className="hover:text-terracotta">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </>
            )}

            <button
              onClick={resetCurrentTabFilters}
              className="text-[11px] font-bold text-terracotta underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: COLLEGES & UNIVERSITIES (HEIs) */}
      {activeTab === 'HEIS' && (
        <div className="space-y-6">
          {/* Top 3 Podium: compact 3-column micro-podium on mobile & full cards on desktop */}
          {filteredHeis.length >= 3 && !searchQuery && activeFiltersCount === 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 sm:pt-4 items-end">
              {/* 2nd Place (Silver) */}
              <div className="order-1 bg-surface rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border-2 border-slate-300 shadow-soft flex flex-col justify-between text-center relative">
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 sm:w-8 sm:h-8 rounded-full bg-slate-200 text-slate-800 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md">
                  #2
                </div>
                <div className="space-y-1 sm:space-y-2 mt-1 sm:mt-2">
                  <span className="text-xl sm:text-2xl">🥈</span>
                  <h3 className="font-black text-charcoal text-xs sm:text-base leading-tight line-clamp-1">
                    {filteredHeis[1].name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-charcoal-muted line-clamp-1">{filteredHeis[1].district}</p>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-black">
                    {filteredHeis[1].societalImpactScore} pts
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-charcoal-border/30 grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] hidden xs:grid">
                  <div>
                    <span className="font-black text-charcoal block">{filteredHeis[1].resolvedProblems}</span>
                    <span className="text-charcoal-muted text-[9px]">Solved</span>
                  </div>
                  <div>
                    <span className="font-black text-charcoal block">{filteredHeis[1].nepCreditsAwarded}</span>
                    <span className="text-charcoal-muted text-[9px]">Credits</span>
                  </div>
                </div>
              </div>

              {/* 1st Place (Gold Champion) */}
              <div className="order-2 bg-gradient-to-b from-amber-50 to-surface rounded-2xl sm:rounded-3xl p-3 sm:p-6 border-2 border-amber-400 shadow-card flex flex-col justify-between text-center relative -translate-y-1 sm:-translate-y-2">
                <div className="absolute -top-3.5 sm:-top-5 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-charcoal font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-md whitespace-nowrap">
                  <span>👑</span>
                  <span className="hidden xs:inline">#1 Champion</span>
                  <span className="xs:hidden">#1</span>
                </div>
                <div className="space-y-1 sm:space-y-2 mt-1 sm:mt-3">
                  <span className="text-2xl sm:text-4xl">🥇</span>
                  <h3 className="font-black text-charcoal text-xs sm:text-lg leading-tight line-clamp-1">
                    {filteredHeis[0].name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-charcoal-muted line-clamp-1">{filteredHeis[0].district}</p>
                  <div className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-black border border-amber-300">
                    {filteredHeis[0].societalImpactScore} pts
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-amber-200/80 grid grid-cols-2 gap-1 text-[10px] sm:text-xs hidden xs:grid">
                  <div>
                    <span className="font-black text-charcoal block">{filteredHeis[0].resolvedProblems}</span>
                    <span className="text-charcoal-muted text-[9px]">Solved</span>
                  </div>
                  <div>
                    <span className="font-black text-charcoal block">{filteredHeis[0].nepCreditsAwarded}</span>
                    <span className="text-charcoal-muted text-[9px]">Credits</span>
                  </div>
                </div>
              </div>

              {/* 3rd Place (Bronze) */}
              <div className="order-3 bg-surface rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border-2 border-amber-700/30 shadow-soft flex flex-col justify-between text-center relative">
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 sm:w-8 sm:h-8 rounded-full bg-amber-700/20 text-amber-900 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md">
                  #3
                </div>
                <div className="space-y-1 sm:space-y-2 mt-1 sm:mt-2">
                  <span className="text-xl sm:text-2xl">🥉</span>
                  <h3 className="font-black text-charcoal text-xs sm:text-base leading-tight line-clamp-1">
                    {filteredHeis[2].name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-charcoal-muted line-clamp-1">{filteredHeis[2].district}</p>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] sm:text-xs font-black">
                    {filteredHeis[2].societalImpactScore} pts
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-charcoal-border/30 grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] hidden xs:grid">
                  <div>
                    <span className="font-black text-charcoal block">{filteredHeis[2].resolvedProblems}</span>
                    <span className="text-charcoal-muted text-[9px]">Solved</span>
                  </div>
                  <div>
                    <span className="font-black text-charcoal block">{filteredHeis[2].nepCreditsAwarded}</span>
                    <span className="text-charcoal-muted text-[9px]">Credits</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full HEI Table / Cards */}
          <div className="bg-surface rounded-3xl border border-charcoal-border/50 shadow-soft overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-charcoal-border/30 flex items-center justify-between">
              <div>
                <h3 className="font-black text-charcoal text-sm sm:text-base">
                  State Institutional Rankings ({filteredHeis.length})
                </h3>
                <span className="text-xs text-charcoal-muted">
                  Ranked by Societal Impact, Problems Resolved, and NEP 2020 Credits Awarded
                </span>
              </div>
            </div>

            {filteredHeis.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-sand-100 text-terracotta flex items-center justify-center mx-auto text-xl font-bold">
                  🔍
                </div>
                <h4 className="text-base font-black text-charcoal">No Institutions Match Your Criteria</h4>
                <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                  Try broadening your district, solved problems threshold, or CSR funding filters.
                </p>
                <button
                  onClick={resetCurrentTabFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-charcoal/90 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-charcoal-border/30">
                {filteredHeis.map((hei, idx) => (
                  <div
                    key={hei.id}
                    className="p-2.5 sm:p-4 hover:bg-canvas-subtle transition-colors"
                  >
                    {/* Main Compact Row */}
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      {/* Left: Rank + Avatar/Logo + Name */}
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <span
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            idx === 0
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : idx === 1
                              ? 'bg-slate-100 text-slate-800 border border-slate-300'
                              : idx === 2
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-canvas border border-charcoal-border/60 text-charcoal'
                          }`}
                        >
                          #{idx + 1}
                        </span>

                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sand-100 to-terracotta/10 border border-charcoal-border/40 flex items-center justify-center font-black text-[10px] sm:text-xs text-charcoal shrink-0">
                          {hei.code ? hei.code.slice(0, 3) : hei.name.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-black text-xs sm:text-sm text-charcoal truncate">
                              {hei.name}
                            </h4>
                            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-sand-100 text-sand-900 text-[10px] font-bold border border-sand-300">
                              {hei.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-charcoal-muted truncate">
                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-terracotta shrink-0" />
                            <span className="truncate">{hei.district}</span>
                            <span className="hidden sm:inline">• NIRF #{hei.nirfRank || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Metrics + Chevron Expand Button */}
                      <div className="flex items-center gap-2 sm:gap-5 shrink-0">
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-black text-terracotta block leading-tight">
                            {hei.societalImpactScore} <span className="text-[10px] font-normal text-charcoal-muted hidden xs:inline">pts</span>
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-charcoal-muted uppercase font-bold hidden sm:block">
                            Impact Score
                          </span>
                        </div>

                        <div className="text-right hidden xs:block">
                          <span className="text-xs sm:text-sm font-black text-charcoal block leading-tight">
                            {hei.resolvedProblems}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-charcoal-muted uppercase font-bold hidden sm:block">
                            Solved
                          </span>
                        </div>

                        <div className="text-right hidden sm:block">
                          <span className="text-xs sm:text-sm font-black text-emerald-700 block leading-tight">
                            {hei.nepCreditsAwarded}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-charcoal-muted uppercase font-bold">
                            Credits
                          </span>
                        </div>

                        {/* Expand/Collapse Dropdown Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedHeiId(expandedHeiId === hei.id ? null : hei.id)}
                          className="p-1.5 rounded-lg hover:bg-sand-100 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
                          aria-label="Toggle details"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedHeiId === hei.id ? 'rotate-180 text-terracotta' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Secondary Metadata */}
                    {expandedHeiId === hei.id && (
                      <div className="mt-2.5 pt-2.5 border-t border-charcoal-border/20 text-xs text-charcoal-muted grid grid-cols-2 sm:grid-cols-4 gap-2 bg-canvas-subtle p-2.5 rounded-xl animate-in fade-in duration-150">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Faculty Lead</span>
                          <span className="font-semibold text-charcoal text-xs">{hei.facultyLead}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-charcoal-muted block">CSR Grants</span>
                          <span className="font-semibold text-amber-800 text-xs">
                            ₹{((hei.totalCsrDonationsINR || 0) / 100000).toFixed(1)} Lakhs
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Avg Resolution</span>
                          <span className="font-semibold text-charcoal text-xs">{hei.avgResolutionDays} Days</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Active Capstones</span>
                          <span className="font-semibold text-emerald-800 text-xs">{hei.activeCapstones} Projects</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT CHANGEMAKERS */}
      {activeTab === 'STUDENTS' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sand-100 to-terracotta-50 p-4 sm:p-5 rounded-3xl border border-sand-300 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-terracotta" />
                <span className="text-xs font-black text-charcoal uppercase tracking-wider">
                  NEP 2020 Experiential Capstone Framework
                </span>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed max-w-2xl">
                Students earn 1 Academic Credit per 30 hours of verified field deployment. Achieving 4 NEP Credits unlocks government-endorsed DigiLocker graduation transcripts.
              </p>
            </div>
            <div className="shrink-0 hidden md:block">
              <span className="px-3 py-1.5 rounded-full bg-white text-terracotta font-black text-xs shadow-2xs border border-terracotta/20">
                ⭐ 100% On-Chain Verified
              </span>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="bg-surface rounded-3xl p-10 border border-charcoal-border/50 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sand-100 text-terracotta flex items-center justify-center mx-auto text-xl font-bold">
                🎓
              </div>
              <h4 className="text-base font-black text-charcoal">No Student Volunteers Found</h4>
              <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                No student changemakers matched the active filters ({studentHeiFilter !== 'ALL' ? `College: ${studentHeiFilter}` : ''} {studentDeptFilter !== 'ALL' ? `Dept: ${studentDeptFilter}` : ''} {studentMinHours > 0 ? `Min ${studentMinHours} hrs` : ''}).
              </p>
              <button
                onClick={resetCurrentTabFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-charcoal/90 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Student Filters</span>
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Compact Horizontal Rank List (<= 640px) */}
              <div className="sm:hidden flex flex-col divide-y divide-charcoal-border/30 bg-surface rounded-2xl border border-charcoal-border/50 overflow-hidden shadow-soft">
                {filteredStudents.map((stud) => (
                  <div key={stud.id} className="p-2.5 hover:bg-canvas-subtle transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      {/* Left: Rank + Medal + Avatar + Name */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-sand-100 flex items-center justify-center font-black text-[11px] text-charcoal shrink-0">
                          #{stud.rank}
                        </span>

                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sand-200 to-terracotta/20 flex items-center justify-center text-xs shrink-0">
                          {stud.badge === 'GOLD' ? '🥇' : stud.badge === 'SILVER' ? '🥈' : stud.badge === 'BRONZE' ? '🥉' : '⭐'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-xs text-charcoal truncate">{stud.name}</h4>
                          <p className="text-[10px] text-charcoal-muted truncate">{stud.heiName}</p>
                        </div>
                      </div>

                      {/* Right: Key Stats + Chevron Toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-700 block leading-tight">
                            {stud.nepCreditsEarned}/4 Cr
                          </span>
                          <span className="text-[9px] text-charcoal-muted font-semibold">
                            {stud.fieldHoursLogged} hrs
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedStudentId(expandedStudentId === stud.id ? null : stud.id)}
                          className="p-1 rounded-lg hover:bg-sand-100 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
                          aria-label="Toggle details"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedStudentId === stud.id ? 'rotate-180 text-terracotta' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Student Metadata */}
                    {expandedStudentId === stud.id && (
                      <div className="mt-2 pt-2 border-t border-charcoal-border/20 text-[11px] text-charcoal-muted space-y-1.5 bg-canvas-subtle p-2 rounded-xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span>Roll No: <strong className="font-mono text-charcoal">{stud.rollNo}</strong></span>
                          <span>Dept: <strong className="text-charcoal">{stud.department || 'N/A'}</strong></span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Tasks Solved: <strong className="text-charcoal">{stud.resolvedTasksCount}</strong></span>
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>DigiLocker Endorsed</span>
                          </span>
                        </div>
                        <p className="text-[10px] italic text-charcoal-800">{stud.specialization}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop / Tablet Cards Grid (>= 640px) */}
              <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStudents.map((stud) => (
                  <div
                    key={stud.id}
                    className="bg-surface rounded-3xl p-5 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sand-200 to-terracotta-100 flex items-center justify-center text-charcoal font-black text-sm shadow-2xs">
                          {stud.badge === 'GOLD' ? '🥇' : stud.badge === 'SILVER' ? '🥈' : stud.badge === 'BRONZE' ? '🥉' : '⭐'}
                        </div>
                        <div>
                          <h4 className="font-black text-charcoal text-base">{stud.name}</h4>
                          <p className="text-xs text-charcoal-muted font-mono">{stud.rollNo}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-sand-100 text-charcoal font-black text-xs border border-sand-300">
                        Rank #{stud.rank}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-charcoal-muted">
                      <p className="font-bold text-charcoal">{stud.heiName}</p>
                      {stud.department && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-sand-100/70 text-charcoal text-[11px] font-semibold border border-sand-200">
                          {stud.department}
                        </span>
                      )}
                      <p className="text-[11px] leading-snug">{stud.specialization}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="font-black text-charcoal text-sm block">{stud.fieldHoursLogged}</span>
                        <span className="text-[10px] text-charcoal-muted uppercase">Field Hrs</span>
                      </div>
                      <div>
                        <span className="font-black text-charcoal text-sm block">{stud.resolvedTasksCount}</span>
                        <span className="text-[10px] text-charcoal-muted uppercase">Tasks</span>
                      </div>
                      <div>
                        <span className="font-black text-emerald-700 text-sm block">{stud.nepCreditsEarned} / 4</span>
                        <span className="text-[10px] text-charcoal-muted uppercase">Credits</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-charcoal-border/20 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>DigiLocker Endorsed</span>
                      </span>
                      <span className="text-[11px] text-charcoal-muted">{stud.district}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 3: CSR & INDUSTRY SPONSORS */}
      {activeTab === 'CSR' && (
        <div className="space-y-6">
          {filteredCsr.length === 0 ? (
            <div className="bg-surface rounded-3xl p-10 border border-charcoal-border/50 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sand-100 text-terracotta flex items-center justify-center mx-auto text-xl font-bold">
                💼
              </div>
              <h4 className="text-base font-black text-charcoal">No CSR Sponsors Match Your Criteria</h4>
              <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                No corporate partners matched the regional focus or funding deployed filters.
              </p>
              <button
                onClick={resetCurrentTabFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-charcoal/90 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset CSR Filters</span>
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Compact Horizontal Rank List (<= 640px) */}
              <div className="sm:hidden flex flex-col divide-y divide-charcoal-border/30 bg-surface rounded-2xl border border-charcoal-border/50 overflow-hidden shadow-soft">
                {filteredCsr.map((csr, idx) => (
                  <div key={csr.id} className="p-2.5 hover:bg-canvas-subtle transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      {/* Left: Rank + Avatar + Name */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black text-[11px] shrink-0 border border-amber-300">
                          #{idx + 1}
                        </span>

                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sand-100 to-amber-100 border border-charcoal-border/40 flex items-center justify-center font-black text-[10px] text-charcoal shrink-0">
                          {csr.companyName.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-xs text-charcoal truncate">{csr.companyName}</h4>
                          <p className="text-[10px] text-charcoal-muted truncate">
                            {csr.regionalFocus[0] ? `${csr.regionalFocus[0]} Focus` : csr.brandTag}
                          </p>
                        </div>
                      </div>

                      {/* Right: Disbursed Amount + Chevron Toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-700 block leading-tight">
                            ₹{(csr.totalDisbursedINR / 100000).toFixed(1)}L
                          </span>
                          <span className="text-[9px] text-charcoal-muted font-bold">
                            Disbursed
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedCsrId(expandedCsrId === csr.id ? null : csr.id)}
                          className="p-1 rounded-lg hover:bg-sand-100 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
                          aria-label="Toggle details"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedCsrId === csr.id ? 'rotate-180 text-terracotta' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded CSR Metadata */}
                    {expandedCsrId === csr.id && (
                      <div className="mt-2 pt-2 border-t border-charcoal-border/20 text-[11px] text-charcoal-muted space-y-1.5 bg-canvas-subtle p-2 rounded-xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span>Director: <strong className="text-charcoal">{csr.csrDirector}</strong></span>
                          <span>Impacted: <strong className="text-emerald-800">{csr.communitiesImpactedCount} Hamlets</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-charcoal">Districts:</span>
                          {csr.regionalFocus.map((rf, rIdx) => (
                            <span key={rIdx} className="px-1.5 py-0.2 rounded-full bg-sand-200 text-charcoal text-[9px] font-semibold">
                              {rf}
                            </span>
                          ))}
                        </div>
                        {csr.activeSchemes[0] && (
                          <div className="pt-1 text-[10px] border-t border-charcoal-border/20">
                            <span className="font-bold text-charcoal">{csr.activeSchemes[0].title}</span>
                            <span className="text-terracotta ml-1">(₹{(csr.activeSchemes[0].grantPerProjectINR / 1000).toFixed(0)}k/project)</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop / Tablet Cards Grid (>= 640px) */}
              <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredCsr.map((csr, idx) => (
                  <div
                    key={csr.id}
                    className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-terracotta uppercase tracking-wider">
                          CSR Partner #{idx + 1}
                        </span>
                        <h4 className="text-lg font-black text-charcoal mt-0.5">{csr.companyName}</h4>
                        <p className="text-xs text-charcoal-muted">{csr.brandTag}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-700 block">
                          ₹{(csr.totalDisbursedINR / 100000).toFixed(1)} Lakhs
                        </span>
                        <span className="text-[10px] text-charcoal-muted uppercase font-bold">
                          Disbursed
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-charcoal">Regional Focus:</span>
                        {csr.regionalFocus.map((rf, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2 py-0.5 rounded-full bg-sand-100 text-sand-900 text-[10px] font-bold border border-sand-300"
                          >
                            {rf}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-charcoal block">Active Schemes:</span>
                      <div className="space-y-2">
                        {csr.activeSchemes.map((scheme, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-charcoal">{scheme.title}</span>
                              <span className="text-[10px] font-bold text-terracotta">
                                ₹{(scheme.grantPerProjectINR / 1000).toFixed(0)}k / project
                              </span>
                            </div>
                            <p className="text-[11px] text-charcoal-muted leading-relaxed">
                              {scheme.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-charcoal-border/30 flex items-center justify-between text-xs text-charcoal-muted">
                      <span>Director: <b>{csr.csrDirector}</b></span>
                      <span>Impacted: <b>{csr.communitiesImpactedCount} Hamlets</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
