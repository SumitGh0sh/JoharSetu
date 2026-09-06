'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import PWAInstaller from '../components/PWAInstaller';
import AuditLedgerModal from '../components/AuditLedgerModal';
import SahayakChatbot from '../components/SahayakChatbot';
import { INITIAL_LEDGER_BLOCKS } from '../lib/mockData';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  BookOpen,
  Building2,
  Layers,
  Cpu,
  Award,
  CheckCircle2,
  Users,
  Compass,
  FileCheck2
} from 'lucide-react';

export default function LandingPage() {
  const { language, setLanguage, t } = useLanguage();
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal selection:bg-terracotta/20 selection:text-terracotta">
      {/* Navbar with Sign In / Register & Audit Ledger */}
      <Navbar
        onOpenLedger={() => setIsLedgerOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6 border border-terracotta/20">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.sihBadge}</span>
              </div>

              <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.15]">
                {t.landingHeroTitle1}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-sand-600">
                  {t.landingHeroTitleGradient}
                </span>
              </h1>

              <p className="mt-3.5 sm:mt-6 text-xs sm:text-base lg:text-lg text-charcoal-muted leading-relaxed font-normal max-w-2xl mx-auto">
                {t.landingHeroDesc}
              </p>

              {/* Primary Call to Actions */}
              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto">
                <Link
                  href="/portal/citizen"
                  className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-terracotta/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{t.btnReportProblem}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-white hover:bg-sand-50 text-charcoal border border-charcoal-border font-bold text-xs sm:text-sm shadow-soft hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.btnSignInPortal}</span>
                </Link>
              </div>

              {/* Live Metric Badges */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-charcoal-border/50 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center">
                <div className="p-2 sm:p-3 bg-surface/60 sm:bg-transparent rounded-xl border border-charcoal-border/30 sm:border-none">
                  <div className="text-xl sm:text-3xl font-black text-terracotta">{t.metricDistricts}</div>
                  <div className="text-[10px] sm:text-xs text-charcoal-muted mt-0.5">{t.metricDistrictsLabel}</div>
                </div>
                <div className="p-2 sm:p-3 bg-surface/60 sm:bg-transparent rounded-xl border border-charcoal-border/30 sm:border-none">
                  <div className="text-xl sm:text-3xl font-black text-charcoal">{t.metricHeis}</div>
                  <div className="text-[10px] sm:text-xs text-charcoal-muted mt-0.5">{t.metricHeisLabel}</div>
                </div>
                <div className="p-2 sm:p-3 bg-surface/60 sm:bg-transparent rounded-xl border border-charcoal-border/30 sm:border-none">
                  <div className="text-xl sm:text-3xl font-black text-emerald-600">{t.metricCsrPledged}</div>
                  <div className="text-[10px] sm:text-xs text-charcoal-muted mt-0.5">{t.metricCsrLabel}</div>
                </div>
                <div className="p-2 sm:p-3 bg-surface/60 sm:bg-transparent rounded-xl border border-charcoal-border/30 sm:border-none">
                  <div className="text-xl sm:text-3xl font-black text-sand-800">{t.metricResolved}</div>
                  <div className="text-[10px] sm:text-xs text-charcoal-muted mt-0.5">{t.metricResolvedLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* 4 Dedicated Institutional Portals */}
        <section className="py-16 bg-canvas-subtle border-y border-charcoal-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
                Portals for Everyone
              </h2>
              <p className="mt-2 text-sm text-charcoal-muted">
                Dedicated spaces for citizens, college teams, companies, and government officers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Citizen Card */}
              <div className="bg-white rounded-3xl p-6 border border-charcoal-border/70 shadow-soft hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta">Citizen Space</span>
                  <h3 className="text-lg font-bold text-charcoal mt-1">Citizen & Panchayat</h3>
                  <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                    Voice recording in your language, photo evidence, automatic location, and problem tracking.
                  </p>
                </div>
                <Link
                  href="/portal/citizen"
                  className="mt-6 w-full py-2.5 px-4 rounded-xl border border-terracotta text-terracotta hover:bg-terracotta hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Enter Citizen Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* HEI Card */}
              <div className="bg-white rounded-3xl p-6 border border-charcoal-border/70 shadow-soft hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">College Space</span>
                  <h3 className="text-lg font-bold text-charcoal mt-1">College & Students</h3>
                  <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                    Engineering teams build solutions for village challenges and earn course credits.
                  </p>
                </div>
                <Link
                  href="/portal/hei"
                  className="mt-6 w-full py-2.5 px-4 rounded-xl border border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Enter College Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* CSR Card */}
              <div className="bg-white rounded-3xl p-6 border border-charcoal-border/70 shadow-soft hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">Company Support</span>
                  <h3 className="text-lg font-bold text-charcoal mt-1">Industry & CSR</h3>
                  <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                    Companies like Tata Steel and Coal India sponsor student projects for villages.
                  </p>
                </div>
                <Link
                  href="/portal/csr"
                  className="mt-6 w-full py-2.5 px-4 rounded-xl border border-amber-600 text-amber-800 hover:bg-amber-600 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Enter Company Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Govt Admin Card */}
              <div className="bg-white rounded-3xl p-6 border border-charcoal-border/70 shadow-soft hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Government View</span>
                  <h3 className="text-lg font-bold text-charcoal mt-1">State Administration</h3>
                  <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                    Statewide interactive map across all 24 districts of Jharkhand with verified records.
                  </p>
                </div>
                <Link
                  href="/portal/admin"
                  className="mt-6 w-full py-2.5 px-4 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Enter Govt Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Simple 4 Steps</span>
            <h2 className="text-3xl font-extrabold text-charcoal mt-1">{t.howItWorksHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-3xl bg-white border border-charcoal-border/70 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h4 className="font-bold text-base text-charcoal">{t.step1Title}</h4>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-charcoal-border/70 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-sand-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h4 className="font-bold text-base text-charcoal">{t.step2Title}</h4>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-charcoal-border/70 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h4 className="font-bold text-base text-charcoal">{t.step3Title}</h4>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-charcoal-border/70 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h4 className="font-bold text-base text-charcoal">{t.step4Title}</h4>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                {t.step4Desc}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-charcoal-border py-8 text-center text-xs text-charcoal-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong>JoharSetu (जोहारसेतु)</strong> • {t.footerRights}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsLedgerOpen(true)} className="hover:text-terracotta">
              {t.auditLedger}
            </button>
            <span>•</span>
            <Link href="/login" className="hover:text-terracotta">
              {t.signIn}
            </Link>
            <span>•</span>
            <Link href="/register" className="hover:text-terracotta">
              {t.register}
            </Link>
          </div>
        </div>
      </footer>

      <PWAInstaller />

      {isLedgerOpen && (
        <AuditLedgerModal
          isOpen={isLedgerOpen}
          onClose={() => setIsLedgerOpen(false)}
          auditChain={INITIAL_LEDGER_BLOCKS}
        />
      )}

      {/* 24/7 Sahayak AI Assistant */}
      <SahayakChatbot />
    </div>
  );
}
