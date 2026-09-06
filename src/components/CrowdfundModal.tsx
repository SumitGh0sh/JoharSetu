'use client';

import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Building2,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Receipt,
  Users
} from 'lucide-react';
import { ProblemTicket } from '../lib/types';

interface CrowdfundModalProps {
  ticket: ProblemTicket;
  isOpen: boolean;
  onClose: () => void;
  onDonate: (ticketId: string, amount: number, donorName: string, isCorporate: boolean, isAnonymous: boolean) => void;
}

export default function CrowdfundModal({
  ticket,
  isOpen,
  onClose,
  onDonate,
}: CrowdfundModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [isCorporate, setIsCorporate] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const campaign = ticket.crowdfunding || {
    id: 'cf-new',
    targetAmount: 100000,
    raisedAmount: 25000,
    backersCount: 18,
    is80GEligible: true,
    escrowStatus: 'OPEN' as const,
    corporateMatch: { company: 'Tata Steel CSR Matching Fund', ratio: '1:1 Match', active: true },
    donations: [],
  };

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const progressPercent = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onDonate(
        ticket.id,
        finalAmount,
        donorName.trim() || (isAnonymous ? 'Anonymous Philanthropist' : 'Citizen Donor'),
        isCorporate,
        isAnonymous
      );
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-lg rounded-3xl border border-charcoal-border/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-terracotta-50 to-sand-50 border-b border-charcoal-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Heart className="w-5 h-5 fill-terracotta/30" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                  Crowdfunding & CSR Matching
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  🏛️ 80G Tax Deductible
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-charcoal">
                Co-Fund Community Resolution
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Issue Summary */}
          <div className="p-3 rounded-2xl bg-canvas-subtle border border-charcoal-border/30 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-charcoal-muted">
              <span className="font-mono text-terracotta font-bold">{ticket.ticketCode}</span>
              <span>📍 {ticket.village}, {ticket.district}</span>
            </div>
            <p className="text-xs font-bold text-charcoal line-clamp-1">{ticket.title}</p>
            {ticket.assignedHei && (
              <p className="text-[11px] text-charcoal-muted flex items-center gap-1">
                <Building2 className="w-3 h-3 text-terracotta shrink-0" />
                <span>Mentored by: <b>{ticket.assignedHei.name}</b> (4 Capstone Credits)</span>
              </p>
            )}
          </div>

          {/* Funding Progress Meter */}
          <div className="p-3.5 rounded-2xl bg-sand-50/80 border border-sand-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-charcoal">
                ₹{campaign.raisedAmount.toLocaleString('en-IN')}{' '}
                <span className="text-charcoal-muted font-normal text-[11px]">
                  of ₹{campaign.targetAmount.toLocaleString('en-IN')} goal
                </span>
              </span>
              <span className="font-bold text-terracotta font-mono">{progressPercent}% Funded</span>
            </div>

            <div className="w-full bg-sand-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-terracotta to-sand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-charcoal-muted">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-sand-700" />
                <b>{campaign.backersCount}</b> community & corporate backers
              </span>
              <span className="flex items-center gap-1 text-emerald-800 font-bold">
                <Lock className="w-3 h-3" />
                Milestone-Locked Escrow
              </span>
            </div>
          </div>

          {/* Corporate Matching Banner */}
          {campaign.corporateMatch?.active && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Corporate CSR Multiplier
                </span>
                <p className="text-[11px] font-bold text-blue-950">
                  {campaign.corporateMatch.company} is providing a {campaign.corporateMatch.ratio}!
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-black text-xs shrink-0 shadow-xs">
                2X IMPACT
              </span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-extrabold text-emerald-950">
                Pledge Successfully Anchored!
              </h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                Thank you for contributing <strong>₹{finalAmount.toLocaleString('en-IN')}</strong> towards resolving {ticket.ticketCode}. A digital 80G tax receipt and cryptographic ledger transaction has been anchored to this ticket.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Done & Return to Feed
              </button>
            </div>
          ) : (
            <form onSubmit={handlePledgeSubmit} className="space-y-4">
              {/* Preset Contribution Chips */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-2">
                  Select Contribution Amount (INR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 5000, 25000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-terracotta text-white border-terracotta shadow-xs'
                          : 'bg-white hover:bg-sand-50 text-charcoal border-charcoal-border'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mt-2">
                  <input
                    type="number"
                    min="100"
                    placeholder="Or enter custom amount (e.g. 2500)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-charcoal-border bg-white text-xs outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              {/* Donor Details */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal mb-1">
                    Your Name or Organization (for 80G Certificate)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Chandra / Bokaro Rotary Club"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    disabled={isAnonymous}
                    className="w-full p-2.5 rounded-xl border border-charcoal-border bg-white text-xs outline-none focus:border-terracotta disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-terracotta focus:ring-terracotta"
                    />
                    <span className="text-charcoal-muted font-medium text-[11px]">
                      Donate anonymously on public feed
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCorporate}
                      onChange={(e) => setIsCorporate(e.target.checked)}
                      className="rounded text-terracotta focus:ring-terracotta"
                    />
                    <span className="text-charcoal-muted font-medium text-[11px]">
                      Corporate CSR Grant Account
                    </span>
                  </label>
                </div>
              </div>

              {/* Escrow Guarantee Notice */}
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30 text-[10px] text-charcoal-muted leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Escrow Guarantee:</strong> 100% of community contributions are held in a transparent state university escrow. Funds are disbursed strictly in tranches upon verified milestone completion by the assigned student team and faculty mentor.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || finalAmount <= 0}
                className="w-full py-3 rounded-2xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-50 text-white font-bold text-xs shadow-soft hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white/20" />
                <span>Confirm Pledge of ₹{finalAmount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
