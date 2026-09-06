'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import PWAInstaller from './PWAInstaller';
import AuditLedgerModal from './AuditLedgerModal';
import NepCertificateModal from './NepCertificateModal';
import { ProblemTicket, AuditBlock } from '../lib/types';
import { INITIAL_TICKETS, INITIAL_LEDGER_BLOCKS } from '../lib/mockData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../lib/translations';
import SahayakChatbot from './SahayakChatbot';

interface PortalLayoutProps {
  children: (props: {
    tickets: ProblemTicket[];
    onNewTicket: (ticket: ProblemTicket) => void;
    onUpdateTicket: (ticket: ProblemTicket) => void;
    onUpvoteTicket: (ticketId: string) => void;
    onAddComment: (ticketId: string, commentText: string, authorName: string, authorRole: string) => void;
    onDonateCampaign: (ticketId: string, amount: number, donorName: string, isCorporate: boolean, isAnonymous: boolean) => void;
    onOpenCertificate: (ticket: ProblemTicket) => void;
    onRecordLedgerEvent: (ticketId: string, action: string, data: any) => void;
    auditChain: AuditBlock[];
    language: string;
  }) => React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { language, setLanguage } = useLanguage();

  const [tickets, setTickets] = useState<ProblemTicket[]>(INITIAL_TICKETS);
  const [auditChain, setAuditChain] = useState<AuditBlock[]>(INITIAL_LEDGER_BLOCKS);

  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [certificateTicket, setCertificateTicket] = useState<ProblemTicket | null>(null);

  const handleNewTicket = (ticket: ProblemTicket) => {
    setTickets((prev) => [ticket, ...prev]);

    const newBlock: AuditBlock = {
      index: auditChain.length,
      timestamp: Math.floor(Date.now() / 1000),
      previous_hash: auditChain[auditChain.length - 1].hash,
      ticket_id: ticket.ticketCode,
      action: 'TICKET_SUBMITTED_AND_AI_ROUTED',
      data: {
        title: ticket.title,
        district: ticket.district,
        assigned_hei: ticket.assignedHei?.name,
        category: ticket.category,
        urgency: ticket.urgency,
      },
      hash: '9a7b' + Math.random().toString(16).substring(2, 10) + 'ef12' + Math.random().toString(16).substring(2, 10) + '5432',
    };

    setAuditChain((prev) => [...prev, newBlock]);
  };

  const handleUpdateTicket = (updatedTicket: ProblemTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  const handleUpvoteTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const currentEng = t.socialEngagement || {
          upvotes: 0,
          shares: 0,
          commentsCount: 0,
          comments: [],
        };
        const nextHasUpvoted = !currentEng.hasUpvoted;
        const nextUpvotes = nextHasUpvoted
          ? currentEng.upvotes + 1
          : Math.max(0, currentEng.upvotes - 1);
        return {
          ...t,
          socialEngagement: {
            ...currentEng,
            hasUpvoted: nextHasUpvoted,
            upvotes: nextUpvotes,
            hypeScore: (currentEng.hypeScore || 100) + (nextHasUpvoted ? 15 : -15),
          },
        };
      })
    );
  };

  const handleAddComment = (
    ticketId: string,
    commentText: string,
    authorName: string,
    authorRole: string
  ) => {
    const newComment = {
      id: 'c-' + Date.now(),
      authorName,
      authorRole: authorRole as any,
      text: commentText,
      createdAt: new Date().toISOString(),
      isOfficial: authorRole !== 'CITIZEN',
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const currentEng = t.socialEngagement || {
          upvotes: 0,
          shares: 0,
          commentsCount: 0,
          comments: [],
        };
        return {
          ...t,
          socialEngagement: {
            ...currentEng,
            commentsCount: (currentEng.commentsCount || 0) + 1,
            comments: [newComment, ...(currentEng.comments || [])],
            hypeScore: (currentEng.hypeScore || 100) + 20,
          },
        };
      })
    );
  };

  const handleDonateCampaign = (
    ticketId: string,
    amount: number,
    donorName: string,
    isCorporate: boolean,
    isAnonymous: boolean
  ) => {
    const newDonation = {
      id: 'don-' + Date.now(),
      donorName,
      amount,
      isCorporate,
      isAnonymous,
      timestamp: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const currentCf = t.crowdfunding || {
          id: 'cf-' + Date.now(),
          targetAmount: 100000,
          raisedAmount: 0,
          backersCount: 0,
          is80GEligible: true,
          escrowStatus: 'OPEN' as const,
          donations: [],
        };
        return {
          ...t,
          crowdfunding: {
            ...currentCf,
            raisedAmount: currentCf.raisedAmount + amount,
            backersCount: currentCf.backersCount + 1,
            donations: [newDonation, ...(currentCf.donations || [])],
          },
        };
      })
    );

    handleRecordLedgerEvent(ticketId, 'CROWDFUND_ESCROW_PLEDGED', {
      donor: isAnonymous ? 'Anonymous' : donorName,
      amount_inr: amount,
      is_corporate: isCorporate,
      escrow_status: 'MILESTONE_LOCKED',
    });
  };

  const handleRecordLedgerEvent = (ticketId: string, action: string, data: any) => {
    const prevBlock = auditChain[auditChain.length - 1];
    const newBlock: AuditBlock = {
      index: auditChain.length,
      timestamp: Math.floor(Date.now() / 1000),
      previous_hash: prevBlock.hash,
      ticket_id: ticketId,
      action,
      data,
      hash: 'd4a8' + Math.random().toString(16).substring(2, 10) + 'bc78' + Math.random().toString(16).substring(2, 10) + '9812',
    };
    setAuditChain((prev) => [...prev, newBlock]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal">
      <Navbar
        onOpenLedger={() => setIsLedgerOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {children({
          tickets,
          onNewTicket: handleNewTicket,
          onUpdateTicket: handleUpdateTicket,
          onUpvoteTicket: handleUpvoteTicket,
          onAddComment: handleAddComment,
          onDonateCampaign: handleDonateCampaign,
          onOpenCertificate: (ticket) => setCertificateTicket(ticket),
          onRecordLedgerEvent: handleRecordLedgerEvent,
          auditChain,
          language,
        })}
      </main>

      <PWAInstaller />

      {isLedgerOpen && (
        <AuditLedgerModal
          isOpen={isLedgerOpen}
          onClose={() => setIsLedgerOpen(false)}
          auditChain={auditChain}
        />
      )}

      {certificateTicket && (
        <NepCertificateModal
          isOpen={!!certificateTicket}
          onClose={() => setCertificateTicket(null)}
          ticket={certificateTicket}
        />
      )}

      {/* 24/7 Sahayak AI Bilingual Chatbot (SIH26043 Groq + Upstash Redis) */}
      <SahayakChatbot onNewTicket={handleNewTicket} />
    </div>
  );
}
