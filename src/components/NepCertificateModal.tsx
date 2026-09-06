'use client';

import React, { useEffect } from 'react';
import { X, Award, CheckCircle2, QrCode, Printer, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProblemTicket } from '../lib/types';

interface NepCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ProblemTicket | null;
}

export default function NepCertificateModal({
  isOpen,
  onClose,
  ticket,
}: NepCertificateModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Launch celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D87A53', '#D4A86A', '#2D6A4F'],
      });
    }
  }, [isOpen]);

  if (!isOpen || !ticket || !ticket.projectTeam) return null;

  const team = ticket.projectTeam;
  const leadStudent = team.students[0]?.name || 'Pooja Murmu';
  const rollNo = team.students[0]?.rollNo || '22JE0451';
  const heiName = ticket.assignedHei?.name || 'IIT (ISM) Dhanbad';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface w-full max-w-3xl rounded-3xl border-2 border-sand-400 shadow-floating overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* Modal Top Control Bar */}
        <div className="px-6 py-3 bg-canvas border-b border-charcoal-border/30 flex items-center justify-between text-xs text-charcoal-muted">
          <span className="font-semibold text-charcoal flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sand-700" />
            <span>Official NEP 2020 Experiential Learning Credential</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1 rounded-lg bg-surface border border-charcoal-border hover:bg-canvas text-charcoal flex items-center gap-1 font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-canvas-subtle text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Styled like an official Gov parchment) */}
        <div className="p-4 sm:p-8 md:p-12 overflow-y-auto bg-[#FAF7F2] text-center relative border-4 sm:border-[12px] border-double border-[#D4A86A]/40 m-2 sm:m-4 rounded-xl sm:rounded-2xl">
          
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <span className="text-6xl sm:text-9xl font-black text-charcoal">JOHAR</span>
          </div>

          {/* Header Seal */}
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-terracotta to-sand flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-card mb-2">
              जो
            </div>
            <h2 className="text-[10px] sm:text-xs font-bold tracking-widest text-[#8C482B] uppercase">
              Government of Jharkhand • Department of Higher & Technical Education
            </h2>
            <h3 className="text-xs sm:text-sm font-semibold text-charcoal-muted mt-0.5">
              Jharkhand State Higher Education Council (JSHEC)
            </h3>
          </div>

          <div className="my-3 sm:my-4">
            <h1 className="text-xl sm:text-3xl font-extrabold text-charcoal tracking-tight font-serif">
              Certificate of Experiential Learning
            </h1>
            <p className="text-[10px] sm:text-xs text-sand-800 font-bold uppercase tracking-widest mt-1">
              Aligned with National Education Policy (NEP 2020) Mandate
            </p>
          </div>

          <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto my-4 sm:my-6 leading-relaxed">
            This is to officially certify that the candidate <strong className="text-charcoal font-bold underline decoration-terracotta">{leadStudent}</strong> (Roll No: <strong className="font-mono text-charcoal">{rollNo}</strong>), representing <strong className="text-charcoal font-semibold">{heiName}</strong>, has successfully formulated, prototyped, and field-deployed a verifiable community engineering resolution for problem statement:
          </p>

          {/* Project Title Box */}
          <div className="bg-white/80 p-3.5 sm:p-4 rounded-xl border border-sand-300 max-w-lg mx-auto mb-4 sm:mb-6 shadow-soft">
            <p className="font-bold text-xs sm:text-sm text-charcoal">
              "{ticket.title}"
            </p>
            <p className="text-[11px] sm:text-xs text-terracotta font-semibold mt-1">
              Ticket Code: {ticket.ticketCode} • Panchayat: {ticket.village}, {ticket.district}
            </p>
          </div>

          {/* Credit Details */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-sand-100 border border-sand-300 text-charcoal text-[11px] sm:text-xs font-bold mb-6 sm:mb-8 shadow-soft">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sand-800 shrink-0" />
            <span>Academic Credits: 4 Credits (NEP Capstone)</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
          </div>

          {/* Signatures & QR Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 items-center sm:items-end pt-4 sm:pt-6 border-t border-[#D4A86A]/40 text-center sm:text-left text-xs max-w-xl mx-auto">
            <div className="flex flex-col items-center sm:items-start">
              <div className="w-24 h-0.5 bg-charcoal-muted mb-2" />
              <p className="font-bold text-charcoal">{team.facultyLead}</p>
              <p className="text-[10px] text-charcoal-muted">Faculty Mentor, {heiName}</p>
            </div>

            <div className="flex flex-col items-center text-center my-2 sm:my-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white p-1 rounded-lg border border-charcoal-border/50 shadow-soft flex items-center justify-center mb-1">
                <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-charcoal" />
              </div>
              <p className="text-[9px] font-mono text-charcoal-muted">Verified SHA-256</p>
            </div>

            <div className="flex flex-col items-center sm:items-end sm:text-right">
              <div className="w-24 h-0.5 bg-charcoal-muted mb-2" />
              <p className="font-bold text-charcoal">Principal Secretary</p>
              <p className="text-[10px] text-charcoal-muted">Govt of Jharkhand</p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Close */}
        <div className="p-4 bg-canvas border-t border-charcoal-border/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-terracotta text-white font-bold text-xs hover:bg-terracotta-600 transition-colors shadow-soft"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
