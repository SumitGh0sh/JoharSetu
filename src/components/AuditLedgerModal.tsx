'use client';

import React from 'react';
import { X, ShieldCheck, Lock, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { AuditBlock } from '../lib/types';
import { formatDateTime } from '../lib/dateUtils';

interface AuditLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditChain: AuditBlock[];
}

export default function AuditLedgerModal({
  isOpen,
  onClose,
  auditChain,
}: AuditLedgerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-terracotta-200 shadow-floating overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-terracotta-50 via-canvas to-sand-50 border-b border-terracotta-100 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-terracotta text-white flex items-center justify-center shadow-soft shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-charcoal flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Public Verified Records</span>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  Verified & Safe
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-charcoal-muted line-clamp-1 sm:line-clamp-none">
                Every step, problem report, and student solution is saved permanently.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-canvas-subtle text-charcoal-muted hover:text-charcoal transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ledger Blocks List */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-canvas flex-1">
          {auditChain.map((block, idx) => (
            <div
              key={block.index}
              className="bg-surface rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all relative"
            >
              {/* Link Line between blocks */}
              {idx > 0 && (
                <div className="absolute -top-3 sm:-top-4 left-6 sm:left-9 w-0.5 h-3 sm:h-4 bg-terracotta/40" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-charcoal-border/30 mb-2.5 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-terracotta-50 text-terracotta font-mono font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">
                    #{block.index}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-charcoal truncate">
                      {block.action.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-charcoal-muted truncate">
                      Ticket ID: <span className="font-mono font-semibold text-terracotta">{block.ticket_id}</span> • <span suppressHydrationWarning>{formatDateTime(block.timestamp)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 sm:py-1 rounded-full self-start sm:self-auto shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Record</span>
                </div>
              </div>

              {/* Hashes */}
              <div className="space-y-1 sm:space-y-1.5 text-xs font-mono mb-2.5 sm:mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-charcoal-muted">
                  <span className="text-[10px] uppercase font-bold text-charcoal shrink-0 sm:w-24">Prev Hash:</span>
                  <span className="break-all sm:truncate text-[10px] sm:text-[11px] bg-canvas p-1 rounded w-full">{block.previous_hash}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-emerald-800">
                  <span className="text-[10px] uppercase font-bold text-charcoal shrink-0 sm:w-24">Block Hash:</span>
                  <span className="break-all sm:truncate text-[10px] sm:text-[11px] bg-emerald-50 text-emerald-900 p-1 rounded font-bold w-full">{block.hash}</span>
                </div>
              </div>

              {/* Block Payload Metadata */}
              <div className="bg-canvas-subtle p-2.5 sm:p-3 rounded-xl border border-charcoal-border/30 text-[11px]">
                <p className="font-bold text-charcoal-muted mb-1 font-sans text-[10px] sm:text-xs">Details Saved:</p>
                <pre className="text-charcoal font-mono whitespace-pre-wrap overflow-x-auto text-[9px] sm:text-[10px] max-h-36 sm:max-h-none">
                  {JSON.stringify(block.data, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-surface border-t border-charcoal-border/30 flex items-center justify-between text-xs text-charcoal-muted">
          <span className="text-[11px] sm:text-xs">Total Blocks: <strong className="text-charcoal">{auditChain.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-terracotta text-white font-bold hover:bg-terracotta-600 transition-colors shadow-soft text-xs cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
