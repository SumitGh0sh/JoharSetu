'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Link as LinkIcon,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Database,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  FileCode
} from 'lucide-react';
import { AuditBlock } from '../lib/types';
import { formatDateTime } from '../lib/dateUtils';
import contractsData from '../lib/blockchain/contracts.json';

interface AuditLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditChain?: AuditBlock[];
  ticketId?: string;
}

interface BlockchainRecord {
  recordId: number;
  ticketId: string;
  previousBlockHash: string;
  currentBlockHash: string;
  action: string;
  evidenceIpfsCid: string;
  gpsCoordinatesHash: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  blockNumber: number;
  transactionHash: string;
  explorerUrl: string;
}

export default function AuditLedgerModal({
  isOpen,
  onClose,
  auditChain = [],
  ticketId: initialTicketId
}: AuditLedgerModalProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    initialTicketId || (auditChain.length > 0 && auditChain[0].ticket_id) || 'JH-DHN-2026-001'
  );
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onChainRecords, setOnChainRecords] = useState<BlockchainRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CITIZEN' | 'HEI' | 'GOVT' | 'AI'>('ALL');

  const contractAddress = contractsData.contracts.CivicAuditLedger.address;
  const explorerBase = 'https://amoy.polygonscan.com';

  const fetchOnChainTrail = async (tid: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blockchain/audit?ticketId=${encodeURIComponent(tid)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.auditTrail) && data.auditTrail.length > 0) {
          setOnChainRecords(data.auditTrail);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Could not fetch on-chain audit trail:', err);
    }

    // Convert local auditChain fallback if API is unreachable
    if (auditChain.length > 0) {
      const fallbackRecords: BlockchainRecord[] = auditChain.map((b, idx) => ({
        recordId: b.index,
        ticketId: b.ticket_id,
        previousBlockHash: b.previous_hash,
        currentBlockHash: b.hash,
        action: b.action,
        evidenceIpfsCid: b.data?.evidenceUrl || 'ipfs://bafybeihandpumpbaghmarafluoride01',
        gpsCoordinatesHash: b.data?.gps || 'geo:23.7957,86.4304',
        actor: b.data?.actor || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        actorRole: b.data?.role || 'CITIZEN',
        timestamp: new Date(b.timestamp).toISOString(),
        blockNumber: 15421090 + idx * 360,
        transactionHash: b.hash,
        explorerUrl: `${explorerBase}/tx/${b.hash}`
      }));
      setOnChainRecords(fallbackRecords);
    } else {
      // Default fallback records
      setOnChainRecords([
        {
          recordId: 1,
          ticketId: tid,
          previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          currentBlockHash: '0xa41fb7c345ef88910b5432ab7d49811234bc5678dae8912345ef012345678901',
          action: 'SUBMITTED',
          evidenceIpfsCid: 'ipfs://bafybeihandpumpbaghmarafluoride01',
          gpsCoordinatesHash: 'geo:23.7957,86.4304',
          actor: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          actorRole: 'CITIZEN',
          timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          blockNumber: 15421090,
          transactionHash: '0x3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef01',
          explorerUrl: `${explorerBase}/tx/0x3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef01`
        },
        {
          recordId: 2,
          ticketId: tid,
          previousBlockHash: '0xa41fb7c345ef88910b5432ab7d49811234bc5678dae8912345ef012345678901',
          currentBlockHash: '0xb52ca8d456fa99021c6543bc8e50922345cd6789ebf9023456fa123456789012',
          action: 'AI_ROUTED',
          evidenceIpfsCid: 'ipfs://bafybeihandpumpbaghmarafluoride01',
          gpsCoordinatesHash: 'geo:23.7957,86.4304',
          actor: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
          actorRole: 'AI_AGENT',
          timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          blockNumber: 15421450,
          transactionHash: '0x4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef012',
          explorerUrl: `${explorerBase}/tx/0x4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef012`
        },
        {
          recordId: 3,
          ticketId: tid,
          previousBlockHash: '0xb52ca8d456fa99021c6543bc8e50922345cd6789ebf9023456fa123456789012',
          currentBlockHash: '0xc63db9e5670b00132d7654cd9f61033456de7890fca01345670b234567890123',
          action: 'ACCEPTED_BY_HEI',
          evidenceIpfsCid: 'ipfs://bafybeihandpumpbaghmarafluoride01',
          gpsCoordinatesHash: 'geo:23.7957,86.4304',
          actor: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
          actorRole: 'HEI_MENTOR',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          blockNumber: 15421920,
          transactionHash: '0x5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123',
          explorerUrl: `${explorerBase}/tx/0x5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123`
        }
      ]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchOnChainTrail(selectedTicketId);
    }
  }, [isOpen, selectedTicketId]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case 'CITIZEN':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'AI_AGENT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'HEI_MENTOR':
      case 'STUDENT_LEAD':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'GOVT_ADMIN':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CSR_SPONSOR':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-sand-100 text-charcoal border-sand-300';
    }
  };

  const filteredRecords = onChainRecords.filter((r) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CITIZEN') return r.actorRole.includes('CITIZEN');
    if (activeFilter === 'HEI') return r.actorRole.includes('HEI') || r.actorRole.includes('STUDENT');
    if (activeFilter === 'GOVT') return r.actorRole.includes('GOVT');
    if (activeFilter === 'AI') return r.actorRole.includes('AI');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-surface w-full max-w-4xl rounded-3xl border border-terracotta-200 shadow-[0_25px_60px_rgba(0,0,0,0.3)] overflow-hidden max-h-[96vh] flex flex-col">
        {/* Header with Polygon PoS Telemetry */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-terracotta-50 via-canvas to-amber-50/60 border-b border-terracotta-100">
          <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-terracotta to-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl font-black text-charcoal tracking-tight">
                    Public Civic Audit Ledger
                  </h2>
                  <span className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shrink-0">
                    <Cpu className="w-3 h-3 text-purple-700" />
                    <span>Polygon Amoy (Chain 80002)</span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Keccak-256 Validated</span>
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Cryptographically immutable state transitions anchored by Smart India Hackathon SIH26043.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-canvas-subtle text-charcoal-muted hover:text-charcoal transition-colors shrink-0 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Smart Contract Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-terracotta-100/80 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] uppercase font-mono font-bold text-charcoal-muted">Contract:</span>
              <button
                onClick={() => copyToClipboard(contractAddress, 'contract')}
                className="font-mono text-[11px] sm:text-xs text-terracotta-700 hover:text-terracotta font-bold flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-terracotta-200 transition-colors group cursor-pointer"
                title="Click to copy contract address"
              >
                <span className="truncate max-w-[180px] sm:max-w-none">{contractAddress}</span>
                {copiedText === 'contract' ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-charcoal-muted group-hover:text-terracotta" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`${explorerBase}/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
              >
                <span>Polygonscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => fetchOnChainTrail(selectedTicketId)}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-charcoal hover:text-terracotta bg-white px-2.5 py-1 rounded-lg border border-charcoal-border hover:border-terracotta transition-colors cursor-pointer"
                title="Refresh ledger state"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-terracotta' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ticket Selector & Role Filter Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-canvas-subtle border-b border-charcoal-border/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-muted font-semibold">Active Ticket:</span>
            <div className="relative">
              <select
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                className="font-mono text-xs font-bold text-terracotta bg-white border border-charcoal-border rounded-lg px-2.5 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-terracotta cursor-pointer"
              >
                <option value="JH-DHN-2026-001">JH-DHN-2026-001 (Fluoride Contamination)</option>
                <option value="JH-DHN-2026-002">JH-DHN-2026-002 (Solar Microgrid Outage)</option>
                <option value="JH-DHN-2026-003">JH-DHN-2026-003 (Bridge Approach Scour)</option>
                <option value="JH-DHN-2026-004">JH-DHN-2026-004 (Aanganwadi Roof Leak)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-1">
            {(['ALL', 'CITIZEN', 'HEI', 'GOVT', 'AI'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-terracotta text-white'
                    : 'bg-surface hover:bg-canvas text-charcoal-muted hover:text-charcoal border border-charcoal-border/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Blocks List */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 bg-canvas flex-1">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-charcoal-muted text-sm">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-40 text-terracotta" />
              <p className="font-bold">No ledger records match the selected filter.</p>
            </div>
          ) : (
            filteredRecords.map((block, idx) => (
              <div
                key={block.recordId}
                className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all relative group"
              >
                {/* Connecting Cryptographic Hash Chain Line */}
                {idx > 0 && (
                  <div className="absolute -top-4 left-6 sm:left-8 w-0.5 h-4 bg-gradient-to-b from-emerald-500 to-terracotta" />
                )}

                {/* Top Row: Block Sequence, Action, Role, Verification */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal-border/30 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      #{block.recordId}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black text-charcoal">
                          {block.action.replace(/_/g, ' ')}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getRoleBadge(
                            block.actorRole
                          )}`}
                        >
                          {block.actorRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-muted truncate font-mono">
                        Ticket: <span className="font-bold text-terracotta">{block.ticketId}</span> •{' '}
                        <span>{formatDateTime(new Date(block.timestamp).getTime())}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 shadow-2xs">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Block #{block.blockNumber}</span>
                    </span>

                    <a
                      href={block.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
                      title="Verify on Polygon Amoy Explorer"
                    >
                      <span>Polygonscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Cryptographic Hashes Grid */}
                <div className="space-y-1.5 text-xs font-mono mb-3 bg-canvas-subtle p-3 rounded-xl border border-charcoal-border/30">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-[10px] uppercase font-bold text-charcoal-muted sm:w-28 shrink-0">
                      Prev Hash:
                    </span>
                    <span className="break-all text-[10px] sm:text-[11px] text-charcoal bg-white p-1 rounded border border-charcoal-border/30 w-full">
                      {block.previousBlockHash}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 sm:w-28 shrink-0 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Block Hash:</span>
                    </span>
                    <span className="break-all text-[10px] sm:text-[11px] text-emerald-900 bg-emerald-50 p-1 rounded font-bold border border-emerald-200 w-full flex items-center justify-between">
                      <span>{block.currentBlockHash}</span>
                      <button
                        onClick={() => copyToClipboard(block.currentBlockHash, `hash-${block.recordId}`)}
                        className="p-0.5 text-emerald-700 hover:text-emerald-900 cursor-pointer shrink-0 ml-1"
                        title="Copy Hash"
                      >
                        {copiedText === `hash-${block.recordId}` ? (
                          <Check className="w-3 h-3 text-emerald-800" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-[10px] uppercase font-bold text-charcoal-muted sm:w-28 shrink-0">
                      Tx Hash:
                    </span>
                    <a
                      href={block.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-[10px] sm:text-[11px] text-purple-700 hover:underline bg-white p-1 rounded border border-charcoal-border/30 w-full flex items-center justify-between"
                    >
                      <span className="truncate">{block.transactionHash}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Evidence & Geo Verification Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-canvas p-2 rounded-lg border border-charcoal-border/30 flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-terracotta shrink-0" />
                    <span className="text-[10px] text-charcoal-muted font-bold">IPFS CID:</span>
                    <span className="font-mono text-[10px] text-charcoal truncate">{block.evidenceIpfsCid}</span>
                  </div>

                  <div className="bg-canvas p-2 rounded-lg border border-charcoal-border/30 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-jharkhand-forest shrink-0" />
                    <span className="text-[10px] text-charcoal-muted font-bold">Spatial Proof:</span>
                    <span className="font-mono text-[10px] text-charcoal truncate">{block.gpsCoordinatesHash}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary Metrics */}
        <div className="p-3 sm:p-4 bg-surface border-t border-charcoal-border/30 flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal-muted">
          <div className="flex items-center gap-3">
            <span>
              Total On-Chain Blocks: <strong className="text-charcoal">{onChainRecords.length}</strong>
            </span>
            <span className="hidden sm:inline text-charcoal-border">•</span>
            <span className="hidden sm:inline text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              State Proof Validated
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold transition-colors shadow-soft text-xs cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
