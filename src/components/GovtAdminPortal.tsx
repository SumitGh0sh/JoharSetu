'use client';

import React, { useState, useMemo } from 'react';
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
  ExternalLink,
  Download,
  FileSpreadsheet,
  FileText,
  Trash2,
  Edit3,
  Filter,
  Search,
  Users,
  Map,
  PieChart,
  BarChart3,
  RefreshCw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Phone,
  Mail,
  UserCheck,
  SlidersHorizontal,
  ChevronDown,
  UserPlus,
  Trophy,
  ShieldAlert,
  Key,
  Lock,
  Unlock,
  UserX,
  Eye
} from 'lucide-react';
import { 
  DistrictMetric, 
  AuditBlock, 
  ProblemTicket, 
  TicketCategory, 
  UrgencyLevel, 
  TicketStatus,
  HeiDirectoryEntry,
  CrcDirectoryEntry,
  PublicSentimentMetric,
  ManagedUser,
  UserRole
} from '../lib/types';
import { 
  JHARKHAND_DISTRICT_STATS,
  MOCK_HEI_DIRECTORY,
  MOCK_CRC_DIRECTORY,
  MOCK_PUBLIC_SENTIMENT,
  MOCK_MANAGED_USERS
} from '../lib/mockData';
import { formatDate, formatTime } from '../lib/dateUtils';
import { useLanguage } from '../context/LanguageContext';
import AgencyMapView from './AgencyMapView';
import ProblemInspectorModal from './ProblemInspectorModal';
import GamifiedLeaderboard from './GamifiedLeaderboard';
import { JHARKHAND_DISTRICTS } from '../lib/locationUtils';
import { JHARKHAND_HEIS_44, HeiData } from '../lib/heiRegistry';

interface GovtAdminPortalProps {
  auditChain: AuditBlock[];
  tickets: ProblemTicket[];
  onOpenLedgerModal: () => void;
  onUpdateTicket?: (ticket: ProblemTicket) => void;
  onDeleteTicket?: (ticketId: string) => void;
}

type AdminTab =
  | 'OVERVIEW_ANALYTICS'
  | 'MASTER_TABLE'
  | 'GIS_MAP'
  | 'USER_MANAGEMENT'
  | 'LEADERBOARD'
  | 'HEI_DIRECTORY'
  | 'CRC_DIRECTORY'
  | 'SOCIAL_SENTIMENT'
  | 'PERSONNEL'
  | 'AUDIT_LEDGER';

interface PersonnelMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  district: string;
  phone: string;
  email: string;
  activeSupervised: number;
  status: 'ACTIVE_DUTY' | 'ON_FIELD_INSPECTION' | 'AVAILABLE';
}

const STATE_PERSONNEL: PersonnelMember[] = [
  {
    id: 'per-01',
    name: 'Dr. Rajesh Kumar Verma, IAS',
    designation: 'State Nodal Officer & Director',
    department: 'Department of Higher & Technical Education',
    district: 'Ranchi',
    phone: '+91 94311 02841',
    email: 'dir.higheredu@jharkhand.gov.in',
    activeSupervised: 28,
    status: 'ACTIVE_DUTY',
  },
  {
    id: 'per-02',
    name: 'Er. Manoj Kumar Singh',
    designation: 'Superintending Engineer',
    department: 'Drinking Water & Sanitation Department (DWSD)',
    district: 'Dhanbad',
    phone: '+91 94313 18920',
    email: 'se.dhanbad@dwsd.jharkhand.gov.in',
    activeSupervised: 19,
    status: 'ON_FIELD_INSPECTION',
  },
  {
    id: 'per-03',
    name: 'Er. Priya Kumari',
    designation: 'Executive Engineer',
    department: 'Jharkhand Bijli Vitran Nigam Ltd (JBVNL)',
    district: 'Bokaro',
    phone: '+91 94317 29104',
    email: 'ee.bokaro@jbvnl.co.in',
    activeSupervised: 12,
    status: 'ACTIVE_DUTY',
  },
  {
    id: 'per-04',
    name: 'Prof. Dr. A. K. Sinha',
    designation: 'Dean of Experiential Projects & Faculty Lead',
    department: 'Birla Institute of Technology (BIT) Mesra',
    district: 'Ranchi',
    phone: '+91 94311 88320',
    email: 'dean.projects@bitmesra.ac.in',
    activeSupervised: 34,
    status: 'ACTIVE_DUTY',
  },
  {
    id: 'per-05',
    name: 'Prof. S. K. Mahato',
    designation: 'Chairperson, Environmental Engineering',
    department: 'Indian Institute of Technology (ISM) Dhanbad',
    district: 'Dhanbad',
    phone: '+91 94315 44219',
    email: 'env.head@iitism.ac.in',
    activeSupervised: 26,
    status: 'AVAILABLE',
  },
  {
    id: 'per-06',
    name: 'Dr. R. K. Soren',
    designation: 'Regional Joint Director of Technical Education',
    department: 'Kolhan Division Technical Cell',
    district: 'East Singhbhum',
    phone: '+91 94311 91024',
    email: 'jd.kolhan@jharkhand.gov.in',
    activeSupervised: 15,
    status: 'ACTIVE_DUTY',
  },
  {
    id: 'per-07',
    name: 'Er. B. N. Murmu',
    designation: 'Executive Engineer (Bridges & Roads)',
    department: 'Road Construction Department (RCD)',
    district: 'Dumka',
    phone: '+91 94319 83710',
    email: 'ee.dumka@rcd.jharkhand.gov.in',
    activeSupervised: 14,
    status: 'ON_FIELD_INSPECTION',
  },
  {
    id: 'per-08',
    name: 'Prof. Sunita Hansda',
    designation: 'NEP 2020 Capstone Coordinator',
    department: 'Vinoba Bhave University (VBU)',
    district: 'Hazaribagh',
    phone: '+91 94314 62891',
    email: 'nep.coord@vbu.ac.in',
    activeSupervised: 21,
    status: 'ACTIVE_DUTY',
  },
  {
    id: 'per-09',
    name: 'Er. Deepak Tirkey',
    designation: 'Assistant Engineer (Minor Irrigation)',
    department: 'Water Resources Department (WRD)',
    district: 'Gumla',
    phone: '+91 94316 71923',
    email: 'ae.gumla@wrd.jharkhand.gov.in',
    activeSupervised: 8,
    status: 'AVAILABLE',
  },
  {
    id: 'per-10',
    name: 'Dr. Alok Kumar Jha',
    designation: 'Nodal Officer for CSR Co-Financing',
    department: 'Department of Planning & Finance',
    district: 'Ranchi',
    phone: '+91 94311 33812',
    email: 'csr.nodal@jharkhand.gov.in',
    activeSupervised: 18,
    status: 'ACTIVE_DUTY',
  }
];

export default function GovtAdminPortal({
  auditChain,
  tickets: propTickets,
  onOpenLedgerModal,
  onUpdateTicket,
  onDeleteTicket,
}: GovtAdminPortalProps) {
  const { t } = useLanguage();

  // Local ticket state to allow instant optimistic updates & soft deletes
  const [localTickets, setLocalTickets] = useState<ProblemTicket[]>(propTickets);
  React.useEffect(() => {
    setLocalTickets(propTickets);
  }, [propTickets]);

  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW_ANALYTICS');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictMetric>(JHARKHAND_DISTRICT_STATS[0]);

  // Global Filter Bar State
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Personnel search
  const [personnelSearch, setPersonnelSearch] = useState('');

  // Stakeholder directories & inspection states
  const [inspectingTicket, setInspectingTicket] = useState<ProblemTicket | null>(null);
  const [heiSearch, setHeiSearch] = useState('');
  const [crcSearch, setCrcSearch] = useState('');
  const [assignedJurisdictionModalHei, setAssignedJurisdictionModalHei] = useState<HeiDirectoryEntry | null>(null);
  const [newBlockInput, setNewBlockInput] = useState('');
  const [heiList, setHeiList] = useState<HeiDirectoryEntry[]>(MOCK_HEI_DIRECTORY);

  // Master User Management State
  const [usersList, setUsersList] = useState<ManagedUser[]>(MOCK_MANAGED_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userDistrictFilter, setUserDistrictFilter] = useState<string>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('ALL');

  const [inspectingUser, setInspectingUser] = useState<ManagedUser | null>(null);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);

  // Add User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('STUDENT');
  const [newUserDistrict, setNewUserDistrict] = useState('Ranchi');
  const [newUserBlock, setNewUserBlock] = useState('');
  const [newUserPanchayat, setNewUserPanchayat] = useState('');
  const [newUserOrg, setNewUserOrg] = useState('');
  const [newUserDept, setNewUserDept] = useState('');
  const [newUserDesignation, setNewUserDesignation] = useState('');

  // Edit User Form State
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('CITIZEN');
  const [editUserDistrict, setEditUserDistrict] = useState('Ranchi');
  const [editUserBlock, setEditUserBlock] = useState('');
  const [editUserPanchayat, setEditUserPanchayat] = useState('');
  const [editUserOrg, setEditUserOrg] = useState('');
  const [editUserDept, setEditUserDept] = useState('');
  const [editUserDesignation, setEditUserDesignation] = useState('');
  const [editUserStatus, setEditUserStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'UNDER_REVIEW'>('ACTIVE');

  // Sync users from API
  React.useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsersList(data.users);
        }
      } catch {}
    };
    loadUsers();
  }, []);

  const handleOpenEditUser = (user: ManagedUser) => {
    setEditingUser(user);
    setEditUserName(user.fullName);
    setEditUserEmail(user.email);
    setEditUserPhone(user.phone);
    setEditUserRole(user.role);
    setEditUserDistrict(user.district);
    setEditUserBlock(user.block || '');
    setEditUserPanchayat(user.panchayat || '');
    setEditUserOrg(user.organization || '');
    setEditUserDept(user.department || '');
    setEditUserDesignation(user.designation || '');
    setEditUserStatus(user.status);
  };

  const handleToggleUserStatus = async (user: ManagedUser) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updatedUser: ManagedUser = { ...user, status: nextStatus };
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    showToast(
      nextStatus === 'ACTIVE'
        ? `Account for ${user.fullName} (${user.registrationId}) reinstated to ACTIVE.`
        : `Account for ${user.fullName} (${user.registrationId}) SUSPENDED. Access revoked.`,
      nextStatus === 'ACTIVE' ? 'success' : 'info'
    );
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
    } catch {}
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const updated: ManagedUser = {
      ...editingUser,
      fullName: editUserName,
      email: editUserEmail,
      phone: editUserPhone,
      role: editUserRole,
      district: editUserDistrict,
      block: editUserBlock || undefined,
      panchayat: editUserPanchayat || undefined,
      organization: editUserOrg || undefined,
      department: editUserDept || undefined,
      designation: editUserDesignation || undefined,
      status: editUserStatus,
    };
    setUsersList((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
    setEditingUser(null);
    showToast(`User profile for ${updated.fullName} updated successfully.`);
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserDistrict) {
      showToast('Please provide full name and district.', 'error');
      return;
    }
    const newId = `usr-${Date.now().toString(36)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regId = `JH-REG-2026-${randomSuffix}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const created: ManagedUser = {
      id: newId,
      registrationId: regId,
      fullName: newUserName.trim(),
      email: newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '.')}@joharsetu.gov.in`,
      phone: newUserPhone.trim() || '+91 94311 00000',
      role: newUserRole,
      district: newUserDistrict,
      block: newUserBlock.trim() || undefined,
      panchayat: newUserPanchayat.trim() || undefined,
      organization: newUserOrg.trim() || undefined,
      department: newUserDept.trim() || undefined,
      designation: newUserDesignation.trim() || undefined,
      status: 'ACTIVE',
      joinedDate: now.split(' ')[0],
      lastActive: now,
      verifiedAadhaar: true,
      activityMetric: {
        ticketsReported: newUserRole === 'CITIZEN' ? 1 : undefined,
        tasksResolved: newUserRole === 'STUDENT' || newUserRole === 'FACULTY_MENTOR' ? 0 : undefined,
      },
    };
    setUsersList((prev) => [created, ...prev]);
    setIsAddUserModalOpen(false);
    showToast(`New user account provisioned: ${created.fullName} (${created.registrationId})`);
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      });
    } catch {}
    // Reset form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserRole('STUDENT');
    setNewUserDistrict('Ranchi');
    setNewUserBlock('');
    setNewUserPanchayat('');
    setNewUserOrg('');
    setNewUserDept('');
    setNewUserDesignation('');
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    const userToDelete = deletingUser;
    setUsersList((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setDeletingUser(null);
    showToast(`User ${userToDelete.fullName} (${userToDelete.registrationId}) removed from master registry.`);
    try {
      await fetch(`/api/admin/users?id=${userToDelete.id}`, { method: 'DELETE' });
    } catch {}
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const q = userSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.registrationId.toLowerCase().includes(q) ||
        (u.organization && u.organization.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.designation && u.designation.toLowerCase().includes(q));

      const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      const matchesDistrict = userDistrictFilter === 'ALL' || u.district === userDistrictFilter;
      const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;

      return matchesSearch && matchesRole && matchesDistrict && matchesStatus;
    });
  }, [usersList, userSearch, userRoleFilter, userDistrictFilter, userStatusFilter]);

  const handleExportUsersCSV = () => {
    const headers = ['Reg ID', 'Full Name', 'Role', 'Email', 'Phone', 'District', 'Block', 'Panchayat', 'Organization', 'Designation', 'Status', 'Joined Date'];
    const rows = filteredUsers.map((u) => [
      u.registrationId,
      `"${(u.fullName || '').replace(/"/g, '""')}"`,
      u.role,
      u.email,
      u.phone,
      u.district,
      `"${(u.block || '').replace(/"/g, '""')}"`,
      `"${(u.panchayat || '').replace(/"/g, '""')}"`,
      `"${(u.organization || '').replace(/"/g, '""')}"`,
      `"${(u.designation || '').replace(/"/g, '""')}"`,
      u.status,
      u.joinedDate,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `joharsetu_master_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredUsers.length} users to CSV.`);
  };

  // Pagination for Master Data Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reassignment Modal State
  const [reassigningTicket, setReassigningTicket] = useState<ProblemTicket | null>(null);
  const [selectedNewHeiId, setSelectedNewHeiId] = useState<string>('');
  const [selectedDeptName, setSelectedDeptName] = useState<string>('');
  const [reassignFeedback, setReassignFeedback] = useState<string | null>(null);

  // Status update toast
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setActionToast({ message, type });
    setTimeout(() => setActionToast(null), 4000);
  };

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return localTickets.filter((ticket) => {
      const q = filterSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ticket.ticketCode.toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.district.toLowerCase().includes(q) ||
        (ticket.village || '').toLowerCase().includes(q) ||
        (ticket.assignedHei?.name || '').toLowerCase().includes(q);

      const matchesDistrict = filterDistrict === 'ALL' || ticket.district.toLowerCase() === filterDistrict.toLowerCase();
      const matchesCategory = filterCategory === 'ALL' || ticket.category === filterCategory;
      const matchesUrgency = filterUrgency === 'ALL' || ticket.urgency === filterUrgency;
      const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;

      return matchesSearch && matchesDistrict && matchesCategory && matchesUrgency && matchesStatus;
    });
  }, [localTickets, filterSearch, filterDistrict, filterCategory, filterUrgency, filterStatus]);

  // Paginated Tickets
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage));

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterSearch, filterDistrict, filterCategory, filterUrgency, filterStatus]);

  // Analytics Aggregations
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    localTickets.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [localTickets]);

  const urgencyCounts = useMemo(() => {
    const counts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    localTickets.forEach((t) => {
      counts[t.urgency] = (counts[t.urgency] || 0) + 1;
    });
    return counts;
  }, [localTickets]);

  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    localTickets.forEach((t) => {
      counts[t.district] = (counts[t.district] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [localTickets]);

  // Statewide KPIs
  const totalReports = localTickets.length;
  const resolvedCount = localTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'FIELD_TESTED').length;
  const activeTeams = localTickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ACCEPTED_BY_HEI' || t.status === 'AI_ROUTED').length;
  const criticalCount = localTickets.filter((t) => t.urgency === 'CRITICAL').length;
  const totalCSR = '₹2.85 Cr';

  // Master Table CRUD: Status Update
  const handleUpdateStatus = async (ticket: ProblemTicket, newStatus: TicketStatus) => {
    const updated: ProblemTicket = { ...ticket, status: newStatus };
    setLocalTickets((prev) => prev.map((t) => (t.id === ticket.id ? updated : t)));

    if (onUpdateTicket) {
      onUpdateTicket(updated);
    }

    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticket.id,
          ticketCode: ticket.ticketCode,
          status: newStatus,
        }),
      });
      if (res.ok) {
        showToast(`Ticket ${ticket.ticketCode} status updated to ${newStatus.replace(/_/g, ' ')}`);
      }
    } catch {
      showToast(`Updated ${ticket.ticketCode} status locally.`);
    }
  };

  // Master Table CRUD: Open Reassignment Modal
  const handleOpenReassignModal = (ticket: ProblemTicket) => {
    setReassigningTicket(ticket);
    setSelectedNewHeiId(ticket.assignedHei?.id || JHARKHAND_HEIS_44[0].id);
    setSelectedDeptName(ticket.assignedHei?.department || JHARKHAND_HEIS_44[0].departments[0]?.name || '');
    setReassignFeedback(null);
  };

  // Master Table CRUD: Submit Reassignment
  const handleConfirmReassign = async () => {
    if (!reassigningTicket) return;
    const targetHei = JHARKHAND_HEIS_44.find((h) => h.id === selectedNewHeiId) || JHARKHAND_HEIS_44[0];
    const dept = selectedDeptName || targetHei.departments[0]?.name || 'Department of Technology Solutions';

    const updatedHei = {
      id: targetHei.id,
      name: targetHei.name,
      code: targetHei.code,
      department: dept,
      facultyMentor: `Prof. ${targetHei.name.split(' ')[0]} (Project Guide)`,
      distanceKm: Math.round(Math.random() * 25 + 5),
      utilityScore: targetHei.nirfScore || 0.94,
      routingReason: `Administratively reassigned by Directorate to ${targetHei.name} (${dept}) for accelerated resolution.`,
    };

    const updatedTicket: ProblemTicket = {
      ...reassigningTicket,
      assignedHei: updatedHei,
      status: 'ACCEPTED_BY_HEI',
    };

    setLocalTickets((prev) => prev.map((t) => (t.id === reassigningTicket.id ? updatedTicket : t)));
    if (onUpdateTicket) {
      onUpdateTicket(updatedTicket);
    }

    try {
      await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reassigningTicket.id,
          ticketCode: reassigningTicket.ticketCode,
          assignedHei: updatedHei,
          status: 'ACCEPTED_BY_HEI',
        }),
      });
    } catch {}

    showToast(`Reassigned ${reassigningTicket.ticketCode} to ${targetHei.name}`);
    setReassigningTicket(null);
  };

  // Master Table CRUD: Soft-Delete Ticket
  const handleDeleteTicket = async (ticket: ProblemTicket) => {
    const confirmed = window.confirm(
      `Confirm Deletion / Archival:\n\nAre you sure you want to soft-delete and archive ticket ${ticket.ticketCode} ("${ticket.title}")?`
    );
    if (!confirmed) return;

    setLocalTickets((prev) => prev.filter((t) => t.id !== ticket.id && t.ticketCode !== ticket.ticketCode));

    if (onDeleteTicket) {
      onDeleteTicket(ticket.id);
    }

    try {
      await fetch(`/api/tickets?id=${ticket.id}&ticketCode=${ticket.ticketCode}`, {
        method: 'DELETE',
      });
      showToast(`Ticket ${ticket.ticketCode} deleted from active registry.`);
    } catch {
      showToast(`Ticket ${ticket.ticketCode} removed locally.`);
    }
  };

  // 1-Click Multi-Format Report Export
  const handleExportCSV = () => {
    const headers = ['Ticket Code', 'Title', 'Category', 'Urgency', 'Status', 'District', 'Village', 'Reported At', 'Assigned HEI', 'Assigned Department'];
    const rows = filteredTickets.map((t) => [
      t.ticketCode,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.category,
      t.urgency,
      t.status,
      t.district,
      `"${(t.village || '').replace(/"/g, '""')}"`,
      t.reportedAt,
      `"${(t.assignedHei?.name || 'Unassigned').replace(/"/g, '""')}"`,
      `"${(t.assignedHei?.department || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `joharsetu_statewide_civic_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredTickets.length} tickets to CSV.`);
  };

  const handleExportExcel = () => {
    const xml = `<?xml version="1.0"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
      <Worksheet ss:Name="JoharSetu Civic Registry">
        <Table>
          <Row>
            <Cell><Data ss:Type="String">Ticket Code</Data></Cell>
            <Cell><Data ss:Type="String">Title</Data></Cell>
            <Cell><Data ss:Type="String">Category</Data></Cell>
            <Cell><Data ss:Type="String">Urgency</Data></Cell>
            <Cell><Data ss:Type="String">Status</Data></Cell>
            <Cell><Data ss:Type="String">District</Data></Cell>
            <Cell><Data ss:Type="String">Village</Data></Cell>
            <Cell><Data ss:Type="String">Assigned HEI</Data></Cell>
            <Cell><Data ss:Type="String">Department</Data></Cell>
            <Cell><Data ss:Type="String">Reported Date</Data></Cell>
          </Row>
          ${filteredTickets
            .map(
              (t) => `
          <Row>
            <Cell><Data ss:Type="String">${t.ticketCode}</Data></Cell>
            <Cell><Data ss:Type="String">${(t.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>
            <Cell><Data ss:Type="String">${t.category}</Data></Cell>
            <Cell><Data ss:Type="String">${t.urgency}</Data></Cell>
            <Cell><Data ss:Type="String">${t.status}</Data></Cell>
            <Cell><Data ss:Type="String">${t.district}</Data></Cell>
            <Cell><Data ss:Type="String">${(t.village || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>
            <Cell><Data ss:Type="String">${(t.assignedHei?.name || 'Unassigned').replace(/&/g, '&amp;')}</Data></Cell>
            <Cell><Data ss:Type="String">${(t.assignedHei?.department || '').replace(/&/g, '&amp;')}</Data></Cell>
            <Cell><Data ss:Type="String">${t.reportedAt}</Data></Cell>
          </Row>`
            )
            .join('')}
        </Table>
      </Worksheet>
    </Workbook>`;
    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joharsetu_statewide_governance_report_${Date.now()}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredTickets.length} tickets to Excel.`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  // SVG Chart Colors & Constants
  const categoryPalette: Record<string, string> = {
    WATER_MANAGEMENT: '#2D6A4F',
    ROAD_INFRASTRUCTURE: '#D87A53',
    RURAL_ELECTRIFICATION_SOLAR: '#D4A86A',
    SUSTAINABLE_AGRICULTURE: '#52796F',
    HEALTHCARE_DELIVERY: '#9B2226',
    SANITATION_WASTE: '#A37081',
    PRIMARY_EDUCATION_DIGITAL: '#2B2D42',
    FORESTRY_ENVIRONMENT: '#40916C',
  };

  // Donut chart calculations
  const totalCatSum = Math.max(1, Object.values(categoryCounts).reduce((a, b) => a + b, 0));
  const donutRadius = 55;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedAngle = 0;

  // Filtered personnel
  const filteredPersonnel = useMemo(() => {
    const q = personnelSearch.toLowerCase().trim();
    if (!q) return STATE_PERSONNEL;
    return STATE_PERSONNEL.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.designation.toLowerCase().includes(q)
    );
  }, [personnelSearch]);

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-charcoal text-white shadow-2xl border border-sand-400/30 flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionToast.message}</span>
          </div>
        </div>
      )}

      {/* Govt Command Header */}
      <div className="rounded-3xl bg-gradient-to-r from-sand-100 via-canvas to-terracotta-50 p-6 sm:p-8 md:p-10 border border-sand-300 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-sand-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.govtCommandTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight">
              Jharkhand Statewide Civic & HEI Resolution Directorate
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Real-time executive command center connecting citizen-reported infrastructure defects with 44 Higher Education Institutions and field nodal officers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenLedgerModal}
              className="px-4 py-2.5 rounded-xl bg-surface hover:bg-sand-50 text-charcoal font-bold text-xs border border-charcoal-border shadow-xs flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Audit Ledger ({auditChain.length} Blocks)</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-card flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-sand-300/80">
          {[
            { id: 'OVERVIEW_ANALYTICS', label: 'Overview & Visual Metrics', icon: PieChart },
            { id: 'MASTER_TABLE', label: `Master Ticket Table (${filteredTickets.length})`, icon: SlidersHorizontal },
            { id: 'GIS_MAP', label: 'GIS Command Operations Map', icon: Map },
            { id: 'USER_MANAGEMENT', label: `Master User Directory (${usersList.length})`, icon: Users },
            { id: 'LEADERBOARD', label: 'Impact Leaderboards & Ranking', icon: Trophy },
            { id: 'HEI_DIRECTORY', label: 'HEI Institutional Directory (44)', icon: Building },
            { id: 'CRC_DIRECTORY', label: 'CRC & CSR Sponsors', icon: Award },
            { id: 'SOCIAL_SENTIMENT', label: 'Civic Social Sentiment', icon: TrendingUp },
            { id: 'PERSONNEL', label: `Personnel Directory (${STATE_PERSONNEL.length})`, icon: UserCheck },
            { id: 'AUDIT_LEDGER', label: 'Cryptographic Audit Stream', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-charcoal text-white shadow-sm'
                    : 'bg-surface/80 hover:bg-surface text-charcoal-muted hover:text-charcoal border border-charcoal-border/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-terracotta-200' : 'text-sand-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statewide Macro KPI Dials */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: t.statTotalComplaints, val: totalReports.toLocaleString(), sub: 'Logged in Registry', icon: AlertTriangle, color: 'text-terracotta' },
          { label: t.statResolvedProjects, val: resolvedCount.toString(), sub: `${Math.round((resolvedCount / Math.max(1, totalReports)) * 100)}% resolution rate`, icon: CheckCircle2, color: 'text-emerald-700' },
          { label: 'Active Problem Teams', val: activeTeams.toString(), sub: 'Across 44 HEIs', icon: Building, color: 'text-sand-700' },
          { label: 'Critical Anomalies', val: criticalCount.toString(), sub: 'Urgent Intervention', icon: AlertOctagon, color: 'text-red-600' },
          { label: t.statCsrCapital, val: totalCSR, sub: 'Direct Co-Financing', icon: TrendingUp, color: 'text-charcoal' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className={`text-xl sm:text-2xl font-black ${kpi.color}`}>{kpi.val}</div>
              <p className="text-[10px] sm:text-[11px] text-charcoal-muted font-medium mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & VISUAL METRICS */}
      {activeTab === 'OVERVIEW_ANALYTICS' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Visual SVG Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Category Breakdown Donut */}
            <div className="bg-surface rounded-2xl p-5 border border-charcoal-border/50 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30 mb-3">
                  <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-terracotta" />
                    <span>Thematic Category Donut</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-charcoal-muted">{localTickets.length} items</span>
                </div>

                <div className="flex items-center justify-center my-2">
                  <svg width="150" height="150" viewBox="0 0 150 150" className="transform -rotate-90">
                    {Object.entries(categoryCounts).map(([cat, count], idx) => {
                      const strokeDash = (count / totalCatSum) * donutCircumference;
                      const strokeOffset = -accumulatedAngle;
                      accumulatedAngle += strokeDash;
                      const color = categoryPalette[cat] || '#888888';
                      return (
                        <circle
                          key={cat}
                          cx="75"
                          cy="75"
                          r={donutRadius}
                          fill="transparent"
                          stroke={color}
                          strokeWidth="18"
                          strokeDasharray={`${strokeDash} ${donutCircumference}`}
                          strokeDashoffset={strokeOffset}
                          className="transition-all duration-500 hover:opacity-80"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-1 mt-2 max-h-36 overflow-y-auto pr-1">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const color = categoryPalette[cat] || '#888888';
                    const pct = Math.round((count / totalCatSum) * 100);
                    return (
                      <div key={cat} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 truncate pr-1">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <span className="truncate text-charcoal font-medium">{cat.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="font-mono font-bold text-charcoal shrink-0">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Top District Distribution Bar Chart */}
            <div className="bg-surface rounded-2xl p-5 border border-charcoal-border/50 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30 mb-3">
                  <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-sand-700" />
                    <span>Top Districts Volume</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-charcoal-muted">Top 8</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {districtCounts.map(([dist, count]) => {
                    const maxCount = districtCounts[0]?.[1] || 1;
                    const pct = Math.min(100, Math.round((count / maxCount) * 100));
                    return (
                      <div key={dist} className="space-y-0.5">
                        <div className="flex justify-between text-[11px] font-semibold text-charcoal">
                          <span className="truncate">{dist}</span>
                          <span className="font-mono text-terracotta">{count}</span>
                        </div>
                        <div className="w-full bg-sand-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-sand-500 to-terracotta h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Urgency Severity Distribution */}
            <div className="bg-surface rounded-2xl p-5 border border-charcoal-border/50 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30 mb-3">
                  <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-red-600" />
                    <span>Urgency Classification</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-charcoal-muted">Triage</span>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { label: 'CRITICAL', count: urgencyCounts.CRITICAL || 0, color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
                    { label: 'HIGH', count: urgencyCounts.HIGH || 0, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
                    { label: 'MEDIUM', count: urgencyCounts.MEDIUM || 0, color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' },
                    { label: 'LOW', count: urgencyCounts.LOW || 0, color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
                  ].map((urg) => {
                    const pct = Math.round((urg.count / Math.max(1, localTickets.length)) * 100);
                    return (
                      <div key={urg.label} className={`p-2.5 rounded-xl border border-charcoal-border/20 ${urg.bg} flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${urg.color}`} />
                          <span className={`text-xs font-bold ${urg.text}`}>{urg.label}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-xs font-bold text-charcoal">{urg.count}</span>
                          <span className="text-[10px] text-charcoal-muted ml-1.5">({pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Resolution Timeline Trend */}
            <div className="bg-surface rounded-2xl p-5 border border-charcoal-border/50 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30 mb-3">
                  <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>Resolution Velocity</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700">+18% MoM</span>
                </div>

                <p className="text-[11px] text-charcoal-muted mb-3">
                  Monthly progression of incoming reports vs. HEI student verified resolutions:
                </p>

                {/* SVG Trend Line */}
                <div className="pt-2">
                  <svg viewBox="0 0 240 100" className="w-full h-24 overflow-visible">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="25" x2="240" y2="25" stroke="#E5E7EB" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="240" y2="50" stroke="#E5E7EB" strokeDasharray="3 3" />
                    <line x1="0" y1="75" x2="240" y2="75" stroke="#E5E7EB" strokeDasharray="3 3" />
                    {/* Area */}
                    <path
                      d="M 10 70 L 50 65 L 90 50 L 130 55 L 170 35 L 210 20 L 230 15 L 230 90 L 10 90 Z"
                      fill="url(#areaGrad)"
                    />
                    {/* Resolution Line */}
                    <path
                      d="M 10 70 L 50 65 L 90 50 L 130 55 L 170 35 L 210 20 L 230 15"
                      fill="none"
                      stroke="#2D6A4F"
                      strokeWidth="2.5"
                    />
                    {/* Points */}
                    {[[10, 70], [50, 65], [90, 50], [130, 55], [170, 35], [210, 20], [230, 15]].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="3" fill="#FAF8F5" stroke="#2D6A4F" strokeWidth="2" />
                    ))}
                  </svg>
                  <div className="flex justify-between text-[9px] font-mono text-charcoal-muted mt-1 px-1">
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive 24-District Resolution Matrix Drilldown */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-charcoal-border/50 shadow-card">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6 max-h-56 overflow-y-auto pr-1">
              {JHARKHAND_DISTRICT_STATS.map((d) => {
                const isSelected = selectedDistrict.name === d.name;
                return (
                  <button
                    key={d.name}
                    onClick={() => setSelectedDistrict(d)}
                    className={`p-2.5 rounded-xl text-left transition-all border text-xs cursor-pointer ${
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
        </div>
      )}

      {/* TAB 2: MASTER TICKET TABLE (CRUD GOVERNANCE) */}
      {activeTab === 'MASTER_TABLE' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Global Multi-Parameter Filter Bar */}
          <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-charcoal-border/50 shadow-soft space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search by ticket code, village, title, district, or assigned HEI..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal-border text-xs sm:text-sm bg-canvas focus:border-terracotta outline-none"
                />
              </div>

              {/* Action Buttons: 1-Click Export Suite */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl bg-surface hover:bg-sand-50 text-charcoal border border-charcoal-border text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Export filtered records to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-terracotta" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-3.5 py-2 rounded-xl bg-surface hover:bg-sand-50 text-charcoal border border-charcoal-border text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Export to Microsoft Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-3.5 py-2 rounded-xl bg-surface hover:bg-sand-50 text-charcoal border border-charcoal-border text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Print official executive report / Save as PDF"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>PDF / Print</span>
                </button>
              </div>
            </div>

            {/* Dropdown Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-charcoal-border/30">
              {/* District Filter */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">District</label>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta font-medium"
                >
                  <option value="ALL">All 24 Districts</option>
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta font-medium"
                >
                  <option value="ALL">All Categories</option>
                  <option value="WATER_MANAGEMENT">Water Management</option>
                  <option value="ROAD_INFRASTRUCTURE">Road & Infrastructure</option>
                  <option value="RURAL_ELECTRIFICATION_SOLAR">Solar & Electrification</option>
                  <option value="SUSTAINABLE_AGRICULTURE">Sustainable Agriculture</option>
                  <option value="HEALTHCARE_DELIVERY">Healthcare Delivery</option>
                  <option value="SANITATION_WASTE">Sanitation & Waste</option>
                  <option value="PRIMARY_EDUCATION_DIGITAL">Digital Education</option>
                </select>
              </div>

              {/* Urgency Filter */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">Urgency</label>
                <select
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta font-medium"
                >
                  <option value="ALL">All Urgencies</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta font-medium"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="AI_ROUTED">AI Routed</option>
                  <option value="ACCEPTED_BY_HEI">Accepted by HEI</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="FIELD_TESTED">Field Tested</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            {/* Filter status line */}
            <div className="flex items-center justify-between text-[11px] text-charcoal-muted pt-1">
              <span>
                Showing <strong className="text-charcoal">{filteredTickets.length}</strong> of {localTickets.length} total tickets
              </span>
              {(filterSearch || filterDistrict !== 'ALL' || filterCategory !== 'ALL' || filterUrgency !== 'ALL' || filterStatus !== 'ALL') && (
                <button
                  onClick={() => {
                    setFilterSearch('');
                    setFilterDistrict('ALL');
                    setFilterCategory('ALL');
                    setFilterUrgency('ALL');
                    setFilterStatus('ALL');
                  }}
                  className="text-terracotta hover:underline font-bold cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-surface rounded-2xl border border-charcoal-border/50 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas border-b border-charcoal-border/50 text-charcoal-muted uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Ticket Code</th>
                    <th className="px-4 py-3.5">Title & Location</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Urgency</th>
                    <th className="px-4 py-3.5">Assigned HEI / Dept</th>
                    <th className="px-4 py-3.5">Resolution Status</th>
                    <th className="px-4 py-3.5 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-border/30">
                  {paginatedTickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-charcoal-muted">
                        No tickets match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-canvas/50 transition-colors">
                        {/* Code */}
                        <td className="px-4 py-3.5 font-mono font-bold text-charcoal whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-sand-100 text-sand-900 border border-sand-300 text-[11px]">
                            {t.ticketCode}
                          </span>
                          <div className="text-[10px] text-charcoal-muted mt-1 font-sans" suppressHydrationWarning>
                            {formatDate(t.reportedAt)}
                          </div>
                        </td>

                        {/* Title & Location */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <p 
                            onClick={() => setInspectingTicket(t)}
                            className="font-bold text-charcoal line-clamp-1 hover:text-terracotta cursor-pointer transition-colors"
                            title="Click to deep inspect ticket"
                          >
                            {t.title}
                          </p>
                          <p className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                            <span className="truncate">{t.village || 'Gram Panchayat'}, {t.district}</span>
                          </p>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sand-100 text-charcoal">
                            {t.category.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* Urgency */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.urgency === 'CRITICAL'
                                ? 'bg-red-100 text-red-800'
                                : t.urgency === 'HIGH'
                                ? 'bg-amber-100 text-amber-800'
                                : t.urgency === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {t.urgency}
                          </span>
                        </td>

                        {/* Assigned HEI */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="font-bold text-charcoal text-[11px] truncate">
                            {t.assignedHei?.name || 'Unassigned'}
                          </p>
                          <p className="text-[10px] text-charcoal-muted truncate">
                            {t.assignedHei?.department || 'Engineering Solutions'}
                          </p>
                        </td>

                        {/* Status (Inline Select) */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <select
                            value={t.status}
                            onChange={(e) => handleUpdateStatus(t, e.target.value as TicketStatus)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                              t.status === 'RESOLVED' || t.status === 'FIELD_TESTED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : t.status === 'IN_PROGRESS' || t.status === 'ACCEPTED_BY_HEI'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-sand-50 text-sand-800 border-sand-300'
                            }`}
                          >
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="AI_ROUTED">AI_ROUTED</option>
                            <option value="ACCEPTED_BY_HEI">ACCEPTED_BY_HEI</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="FIELD_TESTED">FIELD_TESTED</option>
                            <option value="RESOLVED">RESOLVED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setInspectingTicket(t)}
                              className="p-1.5 rounded-lg bg-surface hover:bg-emerald-50 text-emerald-700 border border-charcoal-border transition-colors cursor-pointer"
                              title="Deep Problem Inspector (Vision AI tags, GPS, HEI Roster, Audit Trail)"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenReassignModal(t)}
                              className="p-1.5 rounded-lg bg-surface hover:bg-sand-100 text-charcoal border border-charcoal-border transition-colors cursor-pointer"
                              title="Reassign HEI / Department"
                            >
                              <Building className="w-3.5 h-3.5 text-sand-700" />
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(t)}
                              className="p-1.5 rounded-lg bg-surface hover:bg-red-50 text-red-600 border border-charcoal-border transition-colors cursor-pointer"
                              title="Soft Delete / Archive Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-canvas border-t border-charcoal-border/50 text-xs">
              <span className="text-charcoal-muted">
                Page <strong className="text-charcoal">{currentPage}</strong> of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-charcoal-border font-bold text-xs disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-charcoal-border font-bold text-xs disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: GIS COMMAND MAP */}
      {activeTab === 'GIS_MAP' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <AgencyMapView
            tickets={filteredTickets}
            onOpenLedgerModal={onOpenLedgerModal}
          />
        </div>
      )}

      {/* TAB: MASTER USER DIRECTORY & STAKEHOLDER MANAGEMENT */}
      {activeTab === 'USER_MANAGEMENT' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Command Bar */}
          <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-sand-200 text-charcoal font-black text-xs uppercase tracking-wider">
                  Statewide Access Governance
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Aadhaar Authenticated
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight mt-2 flex items-center gap-2">
                <Users className="w-6 h-6 text-terracotta" />
                <span>Master User Directory & Role Administration</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-1 max-w-2xl">
                Comprehensive directory of citizens, college students, faculty mentors, gram mukhiyas, CSR foundations, and government administrators participating in JoharSetu.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-stretch sm:self-auto">
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-card flex items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Provision New User</span>
              </button>
              <button
                onClick={handleExportUsersCSV}
                className="px-4 py-2.5 rounded-xl bg-canvas hover:bg-canvas-subtle text-charcoal font-bold text-xs border border-charcoal-border shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-charcoal-muted" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* User Metrics Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              {
                label: 'Total Platform Users',
                val: usersList.length,
                sub: 'Registered Accounts',
                color: 'text-charcoal',
                border: 'border-charcoal-border/50'
              },
              {
                label: 'Active Accounts',
                val: usersList.filter((u) => u.status === 'ACTIVE').length,
                sub: 'Operational & Verified',
                color: 'text-emerald-700',
                border: 'border-emerald-200'
              },
              {
                label: 'Suspended Accounts',
                val: usersList.filter((u) => u.status === 'SUSPENDED').length,
                sub: 'Access Revoked',
                color: 'text-red-600',
                border: 'border-red-200'
              },
              {
                label: 'Students & Faculty',
                val: usersList.filter((u) => u.role === 'STUDENT' || u.role === 'FACULTY_MENTOR').length,
                sub: 'HEI Capstone Corps',
                color: 'text-blue-700',
                border: 'border-blue-200'
              },
              {
                label: 'Panchayat & Citizens',
                val: usersList.filter((u) => u.role === 'CITIZEN' || u.role === 'PANCHAYAT_OFFICER').length,
                sub: 'Local Civic Units',
                color: 'text-amber-700',
                border: 'border-amber-200'
              },
              {
                label: 'CSR & Directorate',
                val: usersList.filter((u) => u.role === 'INDUSTRY_CSR' || u.role === 'GOVT_OFFICER').length,
                sub: 'Sponsors & Nodal Leads',
                color: 'text-purple-700',
                border: 'border-purple-200'
              }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-surface rounded-2xl p-4 border ${stat.border} shadow-2xs space-y-1`}
              >
                <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className={`text-2xl font-black ${stat.color} block`}>
                  {stat.val}
                </span>
                <span className="text-[10px] text-charcoal-muted font-medium block">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Search and Filters Toolbar */}
          <div className="bg-surface rounded-2xl p-4 border border-charcoal-border/50 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by full name, email, phone, Reg ID, institution..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Role filter */}
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-bold text-charcoal focus:outline-none focus:border-terracotta"
              >
                <option value="ALL">All Roles</option>
                <option value="CITIZEN">Citizens</option>
                <option value="STUDENT">Students</option>
                <option value="FACULTY_MENTOR">Faculty Mentors</option>
                <option value="PANCHAYAT_OFFICER">Panchayat Officers</option>
                <option value="INDUSTRY_CSR">CSR Sponsors</option>
                <option value="GOVT_OFFICER">Govt Directorate</option>
              </select>

              {/* District filter */}
              <select
                value={userDistrictFilter}
                onChange={(e) => setUserDistrictFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-bold text-charcoal focus:outline-none focus:border-terracotta"
              >
                <option value="ALL">All Districts ({JHARKHAND_DISTRICTS.length})</option>
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-bold text-charcoal focus:outline-none focus:border-terracotta"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="UNDER_REVIEW">Under Review</option>
              </select>

              {(userSearch || userRoleFilter !== 'ALL' || userDistrictFilter !== 'ALL' || userStatusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setUserSearch('');
                    setUserRoleFilter('ALL');
                    setUserDistrictFilter('ALL');
                    setUserStatusFilter('ALL');
                  }}
                  className="px-3 py-2 rounded-xl bg-sand-200 text-charcoal font-bold text-xs hover:bg-sand-300 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Master User Table */}
          <div className="bg-surface rounded-3xl border border-charcoal-border/50 shadow-soft overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-charcoal-border/30 flex items-center justify-between">
              <div>
                <h3 className="font-black text-charcoal text-sm sm:text-base">
                  Master User Registry ({filteredUsers.length} Users)
                </h3>
                <span className="text-xs text-charcoal-muted">
                  Full CRUD administration: Inspect profile telemetry, reassign roles/districts, suspend, or deregister.
                </span>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-sand-100 text-terracotta flex items-center justify-center mx-auto text-xl font-bold">
                  👥
                </div>
                <h4 className="text-base font-black text-charcoal">No Users Matched Search & Filter Criteria</h4>
                <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                  Try clearing your search query or selecting "All Roles" / "All Districts".
                </p>
                <button
                  onClick={() => {
                    setUserSearch('');
                    setUserRoleFilter('ALL');
                    setUserDistrictFilter('ALL');
                    setUserStatusFilter('ALL');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
                >
                  <span>Reset All User Filters</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-canvas border-b border-charcoal-border/40 text-[11px] font-black uppercase tracking-wider text-charcoal-muted">
                      <th className="py-3.5 px-4">Stakeholder</th>
                      <th className="py-3.5 px-3">Role</th>
                      <th className="py-3.5 px-3">Jurisdiction</th>
                      <th className="py-3.5 px-3">Organization / Affiliation</th>
                      <th className="py-3.5 px-3">Activity Telemetry</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-border/20 font-medium">
                    {filteredUsers.map((u) => {
                      const roleBadgeStyles: Record<string, string> = {
                        CITIZEN: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                        STUDENT: 'bg-blue-100 text-blue-800 border-blue-300',
                        FACULTY_MENTOR: 'bg-indigo-100 text-indigo-800 border-indigo-300',
                        PANCHAYAT_OFFICER: 'bg-amber-100 text-amber-800 border-amber-300',
                        INDUSTRY_CSR: 'bg-purple-100 text-purple-800 border-purple-300',
                        GOVT_OFFICER: 'bg-red-100 text-red-800 border-red-300'
                      };

                      const roleLabels: Record<string, string> = {
                        CITIZEN: 'Citizen',
                        STUDENT: 'Student Volunteer',
                        FACULTY_MENTOR: 'Faculty Lead',
                        PANCHAYAT_OFFICER: 'Panchayat Officer',
                        INDUSTRY_CSR: 'CSR Sponsor',
                        GOVT_OFFICER: 'Govt Directorate'
                      };

                      return (
                        <tr key={u.id} className="hover:bg-canvas-subtle/80 transition-colors">
                          {/* Stakeholder details */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-200 to-terracotta-100 text-charcoal font-black text-xs flex items-center justify-center shrink-0 border border-sand-300">
                                {u.fullName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-charcoal text-sm truncate">
                                    {u.fullName}
                                  </span>
                                  {u.verifiedAadhaar && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      <span>Aadhaar</span>
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-charcoal-muted flex items-center gap-2 mt-0.5">
                                  <span className="font-mono text-terracotta font-semibold">
                                    {u.registrationId}
                                  </span>
                                  <span>•</span>
                                  <span className="truncate">{u.phone}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-3">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                roleBadgeStyles[u.role] || 'bg-sand-100 text-charcoal border-sand-300'
                              }`}
                            >
                              {roleLabels[u.role] || u.role}
                            </span>
                          </td>

                          {/* Jurisdiction */}
                          <td className="py-3.5 px-3 text-xs">
                            <div className="font-bold text-charcoal flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-terracotta" />
                              <span>{u.district}</span>
                            </div>
                            {(u.block || u.panchayat) && (
                              <p className="text-[11px] text-charcoal-muted truncate">
                                {u.panchayat || u.block}
                              </p>
                            )}
                          </td>

                          {/* Organization / Affiliation */}
                          <td className="py-3.5 px-3 text-xs">
                            <p className="font-bold text-charcoal truncate max-w-xs">
                              {u.organization || 'General Resident'}
                            </p>
                            <p className="text-[11px] text-charcoal-muted truncate max-w-xs">
                              {u.designation || u.department || 'Independent'}
                            </p>
                          </td>

                          {/* Activity Telemetry */}
                          <td className="py-3.5 px-3 text-xs">
                            {u.role === 'STUDENT' && (
                              <div>
                                <span className="font-black text-charcoal">
                                  {u.activityMetric?.hoursLogged || 0} hrs
                                </span>{' '}
                                <span className="text-charcoal-muted text-[11px]">logged</span>
                                <span className="block text-[10px] text-emerald-700 font-bold">
                                  {u.activityMetric?.tasksResolved || 0} tasks resolved
                                </span>
                              </div>
                            )}
                            {u.role === 'CITIZEN' && (
                              <div>
                                <span className="font-black text-charcoal">
                                  {u.activityMetric?.ticketsReported || 1}
                                </span>{' '}
                                <span className="text-charcoal-muted text-[11px]">complaints</span>
                                <span className="block text-[10px] text-emerald-700 font-bold">
                                  {u.activityMetric?.tasksResolved || 0} verified resolved
                                </span>
                              </div>
                            )}
                            {u.role === 'FACULTY_MENTOR' && (
                              <div>
                                <span className="font-black text-charcoal">
                                  {u.activityMetric?.tasksResolved || 0}
                                </span>{' '}
                                <span className="text-charcoal-muted text-[11px]">guided capstones</span>
                              </div>
                            )}
                            {u.role === 'PANCHAYAT_OFFICER' && (
                              <div>
                                <span className="font-black text-charcoal">
                                  {u.activityMetric?.ticketsReported || 0}
                                </span>{' '}
                                <span className="text-charcoal-muted text-[11px]">field sign-offs</span>
                              </div>
                            )}
                            {u.role === 'INDUSTRY_CSR' && (
                              <div>
                                <span className="font-black text-emerald-700">
                                  ₹{(((u.activityMetric?.fundsPledgedINR || 0)) / 100000).toFixed(1)}L
                                </span>{' '}
                                <span className="text-charcoal-muted text-[11px]">grant pool</span>
                              </div>
                            )}
                            {u.role === 'GOVT_OFFICER' && (
                              <div>
                                <span className="font-black text-charcoal">Statewide</span>{' '}
                                <span className="text-charcoal-muted text-[11px]">Administrative Lead</span>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-3 text-xs">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                u.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : u.status === 'SUSPENDED'
                                  ? 'bg-red-50 text-red-700 border-red-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              {u.status}
                            </span>
                            <span className="block text-[10px] text-charcoal-muted mt-0.5">
                              {u.lastActive}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Inspect */}
                              <button
                                onClick={() => setInspectingUser(u)}
                                title="Inspect User Details"
                                className="p-1.5 rounded-lg hover:bg-sand-200 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditUser(u)}
                                title="Edit Role / Jurisdiction"
                                className="p-1.5 rounded-lg hover:bg-sand-200 text-charcoal-muted hover:text-terracotta transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Suspend / Reinstate Toggle */}
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                title={u.status === 'ACTIVE' ? 'Suspend Account' : 'Reinstate Account'}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  u.status === 'ACTIVE'
                                    ? 'hover:bg-amber-100 text-charcoal-muted hover:text-amber-700'
                                    : 'hover:bg-emerald-100 text-charcoal-muted hover:text-emerald-700'
                                }`}
                              >
                                {u.status === 'ACTIVE' ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <Unlock className="w-4 h-4" />
                                )}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeletingUser(u)}
                                title="Remove User Account"
                                className="p-1.5 rounded-lg hover:bg-red-100 text-charcoal-muted hover:text-red-700 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: GAMIFIED LEADERBOARDS & RANKINGS */}
      {activeTab === 'LEADERBOARD' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <GamifiedLeaderboard />
        </div>
      )}

      {/* TAB 4: SEARCHABLE PERSONNEL DIRECTORY */}
      {activeTab === 'PERSONNEL' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Personnel Search & Filter */}
          <div className="bg-surface rounded-2xl p-5 border border-charcoal-border/50 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
                <Users className="w-5 h-5 text-terracotta" />
                <span>Nodal Governance & Engineering Field Directory</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Authorized state department coordinators, executive engineers, and HEI capstone guides across Jharkhand.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
              <input
                type="text"
                value={personnelSearch}
                onChange={(e) => setPersonnelSearch(e.target.value)}
                placeholder="Search by name, district, or department..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta"
              />
            </div>
          </div>

          {/* Personnel Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersonnel.map((officer) => (
              <div
                key={officer.id}
                className="bg-surface rounded-2xl p-5 border border-charcoal-border/50 shadow-soft space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-charcoal">{officer.name}</h3>
                      <p className="text-[11px] font-semibold text-terracotta">{officer.designation}</p>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        officer.status === 'ACTIVE_DUTY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : officer.status === 'ON_FIELD_INSPECTION'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {officer.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-[11px] text-charcoal-muted mt-1.5 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-sand-700 shrink-0" />
                    <span className="truncate">{officer.department}</span>
                  </p>

                  <p className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                    <span>Jurisdiction: <strong>{officer.district} District</strong></span>
                  </p>
                </div>

                <div className="pt-3 border-t border-charcoal-border/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-charcoal-muted">Active Supervised Incidents:</span>
                    <span className="font-mono font-bold text-charcoal">{officer.activeSupervised} Tickets</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${officer.phone}`}
                      className="flex-1 py-1.5 rounded-lg bg-canvas-subtle hover:bg-sand-100 text-charcoal border border-charcoal-border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-emerald-700" />
                      <span>{officer.phone}</span>
                    </a>
                    <a
                      href={`mailto:${officer.email}`}
                      className="p-1.5 rounded-lg bg-canvas-subtle hover:bg-sand-100 text-charcoal border border-charcoal-border text-[11px] font-bold flex items-center justify-center transition-colors"
                      title="Send Official Notice / Order"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-700" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB: HEI INSTITUTIONAL DIRECTORY */}
      {activeTab === 'HEI_DIRECTORY' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header & Stats Banner */}
          <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-charcoal-border/50 shadow-soft space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-charcoal flex items-center gap-2">
                  <Building className="w-5 h-5 text-terracotta" />
                  <span>HEI Stakeholder Directory (44 Institutions)</span>
                </h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Manage registered universities, technical institutes, faculty nodal leads, NEP student credits, and regional block jurisdictions.
                </p>
              </div>

              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={heiSearch}
                  onChange={(e) => setHeiSearch(e.target.value)}
                  placeholder="Search college, code, or faculty lead..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>

            {/* Quick Macro Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-charcoal-border/20 text-center">
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30">
                <span className="text-lg font-black text-charcoal">44</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Registered HEIs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30">
                <span className="text-lg font-black text-terracotta">1,240+</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Student Volunteers</span>
              </div>
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30">
                <span className="text-lg font-black text-emerald-700">342</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Problems Solved</span>
              </div>
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30">
                <span className="text-lg font-black text-sand-800">1,480</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold">NEP Credits Issued</span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {heiList
              .filter((hei) => {
                const q = heiSearch.toLowerCase().trim();
                if (!q) return true;
                return (
                  hei.name.toLowerCase().includes(q) ||
                  hei.code.toLowerCase().includes(q) ||
                  hei.district.toLowerCase().includes(q) ||
                  hei.facultyLead.toLowerCase().includes(q)
                );
              })
              .map((hei) => (
                <div
                  key={hei.id}
                  className="bg-surface rounded-3xl p-5 sm:p-6 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-terracotta px-2.5 py-0.5 rounded bg-terracotta-50 border border-terracotta-200">
                            {hei.code}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-sand-100 text-sand-900 text-[10px] font-bold border border-sand-300">
                            {hei.type}
                          </span>
                          {hei.nirfRank && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
                              NIRF #{hei.nirfRank}
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-charcoal text-base mt-1.5 leading-snug">
                          {hei.name}
                        </h3>
                        <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                          <span>{hei.address}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-emerald-700 block">
                          {hei.societalImpactScore} pts
                        </span>
                        <span className="text-[10px] text-charcoal-muted font-bold uppercase">
                          Impact Score
                        </span>
                      </div>
                    </div>

                    {/* Faculty Mentor Details */}
                    <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal-muted font-bold">Faculty Lead:</span>
                        <span className="font-black text-charcoal">{hei.facultyLead}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-charcoal-muted">Email:</span>
                        <a href={`mailto:${hei.facultyEmail}`} className="text-terracotta font-mono hover:underline">
                          {hei.facultyEmail}
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-charcoal-muted">Phone:</span>
                        <span className="font-mono text-charcoal">{hei.facultyPhone}</span>
                      </div>
                    </div>

                    {/* Metric Pills */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-canvas-subtle border border-charcoal-border/30">
                        <span className="font-black text-charcoal block">{hei.activeStudentVolunteers}</span>
                        <span className="text-[10px] text-charcoal-muted uppercase">Volunteers</span>
                      </div>
                      <div className="p-2 rounded-xl bg-canvas-subtle border border-charcoal-border/30">
                        <span className="font-black text-charcoal block">{hei.resolvedProblems}</span>
                        <span className="text-[10px] text-charcoal-muted uppercase">Resolved</span>
                      </div>
                      <div className="p-2 rounded-xl bg-canvas-subtle border border-charcoal-border/30">
                        <span className="font-black text-emerald-700 block">{hei.nepCreditsAwarded}</span>
                        <span className="text-[10px] text-charcoal-muted uppercase">NEP Credits</span>
                      </div>
                    </div>

                    {/* Jurisdictions */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-charcoal">Assigned Regional Blocks:</span>
                        <button
                          onClick={() => {
                            setAssignedJurisdictionModalHei(hei);
                            setNewBlockInput('');
                          }}
                          className="text-terracotta text-[11px] font-bold hover:underline cursor-pointer"
                        >
                          + Edit Jurisdiction
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {hei.assignedJurisdiction.map((block, bIdx) => (
                          <span
                            key={bIdx}
                            className="px-2.5 py-0.5 rounded-lg bg-surface border border-charcoal-border/40 text-[11px] font-medium text-charcoal"
                          >
                            {block}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CRC Connections */}
                    {hei.crcConnections && hei.crcConnections.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-charcoal-border/20">
                        <span className="text-[11px] text-charcoal-muted font-bold block">
                          Connected CSR Patrons:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {hei.crcConnections.map((crc, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2 py-0.5 rounded-md bg-sand-100 text-sand-900 text-[10px] font-bold"
                            >
                              🤝 {crc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-charcoal-border/30 flex items-center justify-between">
                    <span className="text-[11px] text-charcoal-muted">
                      Avg. Resolution: <b>{hei.avgResolutionDays} days</b>
                    </span>
                    <a
                      href={hei.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB: CRC & CSR SPONSORS */}
      {activeTab === 'CRC_DIRECTORY' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-charcoal-border/50 shadow-soft space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-charcoal flex items-center gap-2">
                  <Award className="w-5 h-5 text-terracotta" />
                  <span>Corporate Social Responsibility (CSR) & Industry Patrons</span>
                </h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Manage corporate co-financing partners, matching grant escrow allocations, and Section 80G tax benefit ledgers.
                </p>
              </div>

              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={crcSearch}
                  onChange={(e) => setCrcSearch(e.target.value)}
                  placeholder="Search corporate sponsor or grant theme..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>

            {/* Quick Macro Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-charcoal-border/20 text-center">
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30">
                <span className="text-lg font-black text-charcoal">₹1.95 Cr</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Total Capital Pledged</span>
              </div>
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30">
                <span className="text-lg font-black text-emerald-700">₹1.62 Cr</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Disbursed to Escrow</span>
              </div>
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30">
                <span className="text-lg font-black text-terracotta">70</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Sponsored Projects</span>
              </div>
              <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-border/30">
                <span className="text-lg font-black text-sand-800">145</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Villages Impacted</span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {MOCK_CRC_DIRECTORY
              .filter((c) => {
                const q = crcSearch.toLowerCase().trim();
                if (!q) return true;
                return (
                  c.companyName.toLowerCase().includes(q) ||
                  c.brandTag.toLowerCase().includes(q) ||
                  c.csrDirector.toLowerCase().includes(q)
                );
              })
              .map((crc) => (
                <div
                  key={crc.id}
                  className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-terracotta uppercase tracking-wider">
                          Corporate Social Responsibility Partner
                        </span>
                        <h3 className="text-lg font-black text-charcoal mt-0.5">{crc.companyName}</h3>
                        <p className="text-xs text-charcoal-muted">{crc.brandTag}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-emerald-700 block">
                          ₹{(crc.totalDisbursedINR / 100000).toFixed(1)}L
                        </span>
                        <span className="text-[10px] text-charcoal-muted font-bold uppercase">
                          Disbursed of ₹{(crc.totalPledgedINR / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-sand-200 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{
                            width: `${Math.min(100, (crc.totalDisbursedINR / crc.totalPledgedINR) * 100)}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-charcoal-muted">
                        <span>Disbursed: {Math.round((crc.totalDisbursedINR / crc.totalPledgedINR) * 100)}%</span>
                        <span>80G Tax Certificates: {crc.taxCertificates80GCount}</span>
                      </div>
                    </div>

                    {/* CSR Director Contact */}
                    <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal-muted font-bold">CSR Director:</span>
                        <span className="font-black text-charcoal">{crc.csrDirector}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-charcoal-muted">Email:</span>
                        <a href={`mailto:${crc.contactEmail}`} className="text-terracotta font-mono hover:underline">
                          {crc.contactEmail}
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-charcoal-muted">Phone:</span>
                        <span className="font-mono text-charcoal">{crc.contactPhone}</span>
                      </div>
                    </div>

                    {/* Active Schemes */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-charcoal block">Active Matching Schemes:</span>
                      <div className="space-y-1.5">
                        {crc.activeSchemes.map((scheme, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-2xl bg-canvas-subtle border border-charcoal-border/30 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-charcoal">{scheme.title}</span>
                              <span className="text-[10px] font-black text-terracotta">
                                ₹{(scheme.grantPerProjectINR / 1000).toFixed(0)}k Grant
                              </span>
                            </div>
                            <p className="text-[11px] text-charcoal-muted leading-relaxed">
                              {scheme.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Regional Focus */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                      <span className="text-charcoal-muted font-bold">Focus Districts:</span>
                      {crc.regionalFocus.map((dist, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2 py-0.5 rounded-md bg-sand-100 text-charcoal text-[10px] font-bold"
                        >
                          {dist}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-charcoal-border/30 flex items-center justify-between text-xs">
                    <span className="text-charcoal-muted">
                      Impacted: <b>{crc.communitiesImpactedCount} Hamlets</b>
                    </span>
                    <button
                      onClick={() => showToast(`Generated 80G Tax Exemption Certificate for ${crc.companyName}`)}
                      className="px-3 py-1.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-charcoal font-bold text-xs transition-colors cursor-pointer"
                    >
                      Export 80G Certificate
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB: CIVIC SOCIAL SENTIMENT & VIRALITY */}
      {activeTab === 'SOCIAL_SENTIMENT' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-charcoal-border/50 shadow-soft space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-charcoal flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-terracotta" />
                <span>Statewide Public Civic Sentiment & Social Virality Center</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-1">
                Real-time sentiment monitoring of citizen feedback, grievance amplification, and cross-platform story sharing.
              </p>
            </div>

            {/* Metric Summary Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-charcoal-border/20 text-center">
              <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30">
                <span className="text-xl font-black text-emerald-700">SATISFIED</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold mt-0.5">
                  Overall Sentiment
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30">
                <span className="text-xl font-black text-terracotta">2.8x</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold mt-0.5">
                  Viral Virality Multiplier
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30">
                <span className="text-xl font-black text-charcoal">14,890</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold mt-0.5">
                  Total Social Shares
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30">
                <span className="text-xl font-black text-sand-800">3 Resolved</span>
                <span className="block text-[10px] text-charcoal-muted uppercase font-bold mt-0.5">
                  DPDP Moderation Flags
                </span>
              </div>
            </div>
          </div>

          {/* Sentiment Gauge & Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sentiment Breakdown */}
            <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
              <h3 className="font-black text-charcoal text-base">Civic Grievance Sentiment Distribution</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-emerald-800">Positive Praise & Resolution Feedback</span>
                    <span className="text-emerald-800">48%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-sand-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[48%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-charcoal-muted">Neutral / Informational Status Inquiries</span>
                    <span className="text-charcoal">34%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-sand-200 overflow-hidden">
                    <div className="h-full bg-sand-500 rounded-full w-[34%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-red-700">Urgent Distressed Complaints</span>
                    <span className="text-red-700">18%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-sand-200 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full w-[18%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Share Channel Breakdown */}
            <div className="bg-surface rounded-3xl p-6 border border-charcoal-border/50 shadow-soft space-y-4">
              <h3 className="font-black text-charcoal text-base">Social Channel Amplification</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">💬</span>
                    <div>
                      <span className="font-bold text-charcoal text-xs block">WhatsApp Direct Community Broadcasts</span>
                      <span className="text-[10px] text-charcoal-muted">Village Ward & Panchayat groups</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-700 text-sm">8,420 (56.5%)</span>
                </div>

                <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📸</span>
                    <div>
                      <span className="font-bold text-charcoal text-xs block">Instagram Stories & Reels</span>
                      <span className="text-[10px] text-charcoal-muted">Youth and college volunteers</span>
                    </div>
                  </div>
                  <span className="font-black text-terracotta text-sm">4,110 (27.6%)</span>
                </div>

                <div className="p-3 rounded-2xl bg-canvas border border-charcoal-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🐦</span>
                    <div>
                      <span className="font-bold text-charcoal text-xs block">X (Twitter) Civic Escalations</span>
                      <span className="text-[10px] text-charcoal-muted">Tagging @JharkhandGovt & DC Offices</span>
                    </div>
                  </div>
                  <span className="font-black text-charcoal text-sm">2,360 (15.9%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Hashtags */}
          <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-charcoal-border/50 shadow-soft space-y-3">
            <h3 className="font-black text-charcoal text-sm uppercase tracking-wider">
              Trending Statewide Civic Hashtags
            </h3>
            <div className="flex flex-wrap gap-2">
              {MOCK_PUBLIC_SENTIMENT.trendingHashtags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-3 py-1.5 rounded-xl bg-canvas border border-charcoal-border/50 text-xs font-black text-terracotta hover:bg-sand-100 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CRYPTOGRAPHIC AUDIT STREAM */}
      {activeTab === 'AUDIT_LEDGER' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-charcoal-border/50 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-border/30 mb-6">
              <div>
                <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>Real-Time Cryptographic Audit Ledger ({auditChain.length} Blocks)</span>
                </h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Tamper-evident SHA-256 blockchain tracking every ticket state change, HEI acceptance, and NEP 2020 credit issuance.
                </p>
              </div>
              <button
                onClick={onOpenLedgerModal}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Full Block Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auditChain.slice(-6).reverse().map((block) => (
                <div
                  key={block.index}
                  className="p-4 rounded-xl bg-canvas border border-charcoal-border/40 text-xs space-y-2 font-mono"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-charcoal font-sans">
                    <span className="text-terracotta">Block #{block.index}</span>
                    <span className="text-charcoal-muted" suppressHydrationWarning>{formatTime(block.timestamp)}</span>
                  </div>

                  <p className="text-[12px] font-sans font-bold text-charcoal">
                    {block.action.replace(/_/g, ' ')}
                  </p>

                  <div className="text-[11px] text-charcoal-muted">
                    <span>Ticket Ref: </span>
                    <strong className="text-charcoal">{block.ticket_id}</strong>
                  </div>

                  <div className="text-[10px] text-emerald-800 break-all bg-emerald-50 p-1.5 rounded border border-emerald-200">
                    <span>Hash: {block.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REASSIGNMENT MODAL */}
      {reassigningTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-3xl p-6 border border-charcoal-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-terracotta" />
                <h3 className="text-base font-bold text-charcoal">Reassign HEI & Department</h3>
              </div>
              <button
                onClick={() => setReassigningTicket(null)}
                className="p-1 rounded-lg hover:bg-sand-100 text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-canvas text-xs space-y-1">
              <p className="font-bold text-charcoal">Ticket: {reassigningTicket.ticketCode}</p>
              <p className="text-charcoal-muted truncate">{reassigningTicket.title}</p>
              <p className="text-[11px] text-terracotta font-semibold">
                Location: {reassigningTicket.village}, {reassigningTicket.district}
              </p>
            </div>

            {/* HEI Selector */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5">
                Select Higher Education Institution (44 Registered)
              </label>
              <select
                value={selectedNewHeiId}
                onChange={(e) => {
                  setSelectedNewHeiId(e.target.value);
                  const hei = JHARKHAND_HEIS_44.find((h) => h.id === e.target.value);
                  if (hei && hei.departments[0]) {
                    setSelectedDeptName(hei.departments[0].name);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta font-medium"
              >
                {JHARKHAND_HEIS_44.map((hei) => (
                  <option key={hei.id} value={hei.id}>
                    {hei.name} ({hei.district})
                  </option>
                ))}
              </select>
            </div>

            {/* Department Selector */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5">
                Select Engineering / Applied Science Department
              </label>
              <select
                value={selectedDeptName}
                onChange={(e) => setSelectedDeptName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-charcoal-border text-xs bg-canvas outline-none focus:border-terracotta font-medium"
              >
                {(() => {
                  const currHei = JHARKHAND_HEIS_44.find((h) => h.id === selectedNewHeiId) || JHARKHAND_HEIS_44[0];
                  return currHei.departments.map((dept) => (
                    <option key={dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ));
                })()}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-charcoal-border/30">
              <button
                type="button"
                onClick={() => setReassigningTicket(null)}
                className="px-4 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReassign}
                className="px-5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JURISDICTION MANAGEMENT MODAL */}
      {assignedJurisdictionModalHei && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-3xl p-6 border border-charcoal-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/30">
              <div>
                <h3 className="text-base font-black text-charcoal">Manage Regional Jurisdiction</h3>
                <p className="text-xs text-charcoal-muted">{assignedJurisdictionModalHei.name}</p>
              </div>
              <button
                onClick={() => setAssignedJurisdictionModalHei(null)}
                className="p-1.5 rounded-lg hover:bg-sand-100 text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal block">Current Assigned Blocks:</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {assignedJurisdictionModalHei.assignedJurisdiction.map((block, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-canvas border border-charcoal-border/40 text-xs font-medium text-charcoal flex items-center gap-1.5"
                  >
                    <span>{block}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = assignedJurisdictionModalHei.assignedJurisdiction.filter((_, i) => i !== idx);
                        const updatedHei = { ...assignedJurisdictionModalHei, assignedJurisdiction: updated };
                        setAssignedJurisdictionModalHei(updatedHei);
                        setHeiList((prev) => prev.map((h) => (h.id === updatedHei.id ? updatedHei : h)));
                      }}
                      className="text-charcoal-muted hover:text-red-600 font-bold text-[10px]"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-charcoal-border/20">
              <label className="text-xs font-bold text-charcoal block">Add New Block / Panchayat Jurisdiction:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newBlockInput}
                  onChange={(e) => setNewBlockInput(e.target.value)}
                  placeholder="e.g., Topchanchi Block"
                  className="flex-1 px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-xs text-charcoal focus:outline-none focus:border-terracotta"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newBlockInput.trim()) return;
                    const updated = [...assignedJurisdictionModalHei.assignedJurisdiction, newBlockInput.trim()];
                    const updatedHei = { ...assignedJurisdictionModalHei, assignedJurisdiction: updated };
                    setAssignedJurisdictionModalHei(updatedHei);
                    setHeiList((prev) => prev.map((h) => (h.id === updatedHei.id ? updatedHei : h)));
                    setNewBlockInput('');
                    showToast(`Added ${newBlockInput.trim()} to ${assignedJurisdictionModalHei.name}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-charcoal-border/30">
              <button
                type="button"
                onClick={() => setAssignedJurisdictionModalHei(null)}
                className="px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEEP PROBLEM INSPECTOR MODAL */}
      {inspectingTicket && (
        <ProblemInspectorModal
          isOpen={!!inspectingTicket}
          onClose={() => setInspectingTicket(null)}
          ticket={inspectingTicket}
          userRole="GOVT_ADMIN"
        />
      )}

      {/* 1. INSPECT USER MODAL */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-charcoal-border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-charcoal-border/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sand-200 to-terracotta-100 text-charcoal font-black text-base flex items-center justify-center border border-sand-300 shadow-xs">
                  {inspectingUser.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-black text-charcoal">{inspectingUser.fullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-terracotta font-bold text-xs">
                      {inspectingUser.registrationId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand-100 text-charcoal font-bold">
                      {inspectingUser.role.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectingUser(null)}
                className="p-1.5 rounded-xl hover:bg-canvas text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Status & Account Health */}
            <div className="p-4 rounded-2xl bg-canvas border border-charcoal-border/30 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Aadhaar Status</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {inspectingUser.verifiedAadhaar ? 'Biometrically Verified' : 'Pending Verification'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Account Status</span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black mt-0.5 ${
                    inspectingUser.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : inspectingUser.status === 'SUSPENDED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {inspectingUser.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Joined Date</span>
                <span className="font-semibold text-charcoal mt-0.5 block">{inspectingUser.joinedDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Last Active</span>
                <span className="font-semibold text-charcoal mt-0.5 block">{inspectingUser.lastActive}</span>
              </div>
            </div>

            {/* Contact & Jurisdiction */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">Contact & Jurisdiction</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal">
                <div className="p-3 rounded-xl bg-canvas border border-charcoal-border/20">
                  <span className="text-[10px] text-charcoal-muted block">Email Address</span>
                  <span className="font-bold break-all">{inspectingUser.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-canvas border border-charcoal-border/20">
                  <span className="text-[10px] text-charcoal-muted block">Phone Number</span>
                  <span className="font-bold">{inspectingUser.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-canvas border border-charcoal-border/20">
                  <span className="text-[10px] text-charcoal-muted block">District</span>
                  <span className="font-bold">{inspectingUser.district}, Jharkhand</span>
                </div>
                <div className="p-3 rounded-xl bg-canvas border border-charcoal-border/20">
                  <span className="text-[10px] text-charcoal-muted block">Block & Panchayat</span>
                  <span className="font-bold">{inspectingUser.block || 'None'} / {inspectingUser.panchayat || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Institutional Information */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">Affiliation & Capacity</h4>
              <div className="p-3.5 rounded-xl bg-canvas border border-charcoal-border/20 space-y-1">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Organization / Institution:</span>
                  <span className="font-black text-charcoal">{inspectingUser.organization || 'Individual Citizen'}</span>
                </div>
                {inspectingUser.department && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Academic Dept:</span>
                    <span className="font-bold text-charcoal">{inspectingUser.department}</span>
                  </div>
                )}
                {inspectingUser.designation && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Designation / Role:</span>
                    <span className="font-bold text-charcoal">{inspectingUser.designation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Telemetry Metrics */}
            {inspectingUser.activityMetric && (
              <div className="p-3.5 rounded-2xl bg-sand-100/60 border border-sand-300 space-y-2 text-xs">
                <h4 className="font-black text-charcoal text-[11px] uppercase tracking-wider">Historical Civic Telemetry</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {inspectingUser.activityMetric.hoursLogged !== undefined && (
                    <div className="p-2 rounded-xl bg-white shadow-2xs">
                      <span className="text-base font-black text-charcoal block">{inspectingUser.activityMetric.hoursLogged}</span>
                      <span className="text-[10px] text-charcoal-muted uppercase">Field Hours</span>
                    </div>
                  )}
                  {inspectingUser.activityMetric.tasksResolved !== undefined && (
                    <div className="p-2 rounded-xl bg-white shadow-2xs">
                      <span className="text-base font-black text-emerald-700 block">{inspectingUser.activityMetric.tasksResolved}</span>
                      <span className="text-[10px] text-charcoal-muted uppercase">Tasks Solved</span>
                    </div>
                  )}
                  {inspectingUser.activityMetric.ticketsReported !== undefined && (
                    <div className="p-2 rounded-xl bg-white shadow-2xs">
                      <span className="text-base font-black text-terracotta block">{inspectingUser.activityMetric.ticketsReported}</span>
                      <span className="text-[10px] text-charcoal-muted uppercase">Reported</span>
                    </div>
                  )}
                  {inspectingUser.activityMetric.fundsPledgedINR !== undefined && (
                    <div className="p-2 rounded-xl bg-white shadow-2xs col-span-3">
                      <span className="text-base font-black text-purple-800 block">₹{(inspectingUser.activityMetric.fundsPledgedINR / 100000).toFixed(1)} Lakhs</span>
                      <span className="text-[10px] text-charcoal-muted uppercase">Direct CSR Grants Deployed</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-charcoal-border/30">
              <button
                type="button"
                onClick={() => {
                  handleToggleUserStatus(inspectingUser);
                  setInspectingUser(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  inspectingUser.status === 'ACTIVE'
                    ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {inspectingUser.status === 'ACTIVE' ? 'Suspend Access' : 'Reinstate Access'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditUser(inspectingUser);
                    setInspectingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-sand-200 hover:bg-sand-300 text-charcoal text-xs font-bold transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingUser(null)}
                  className="px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg rounded-3xl p-6 border border-charcoal-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal-border/30 pb-3">
              <div>
                <h3 className="text-base font-black text-charcoal">Edit Stakeholder Profile</h3>
                <p className="text-xs text-charcoal-muted">
                  Update role, jurisdiction, or institutional assignment for {editingUser.fullName}
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg hover:bg-canvas text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-charcoal mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editUserPhone}
                    onChange={(e) => setEditUserPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Platform Role</label>
                  <select
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal font-medium focus:outline-none focus:border-terracotta"
                  >
                    <option value="CITIZEN">Citizen</option>
                    <option value="STUDENT">Student Volunteer</option>
                    <option value="FACULTY_MENTOR">Faculty Mentor</option>
                    <option value="PANCHAYAT_OFFICER">Panchayat Officer</option>
                    <option value="INDUSTRY_CSR">CSR Partner</option>
                    <option value="GOVT_OFFICER">Govt Directorate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Assigned District</label>
                  <select
                    value={editUserDistrict}
                    onChange={(e) => setEditUserDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal font-medium focus:outline-none focus:border-terracotta"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Block (Optional)</label>
                  <input
                    type="text"
                    value={editUserBlock}
                    onChange={(e) => setEditUserBlock(e.target.value)}
                    placeholder="e.g., Kanke Block"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Gram Panchayat (Optional)</label>
                  <input
                    type="text"
                    value={editUserPanchayat}
                    onChange={(e) => setEditUserPanchayat(e.target.value)}
                    placeholder="e.g., Arsande Panchayat"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Affiliated Organization / HEI</label>
                <input
                  type="text"
                  value={editUserOrg}
                  onChange={(e) => setEditUserOrg(e.target.value)}
                  placeholder="e.g., IIT (ISM) Dhanbad / Tata Steel / Panchayat Samiti"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Department</label>
                  <input
                    type="text"
                    value={editUserDept}
                    onChange={(e) => setEditUserDept(e.target.value)}
                    placeholder="e.g., Environmental Engineering"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Designation</label>
                  <input
                    type="text"
                    value={editUserDesignation}
                    onChange={(e) => setEditUserDesignation(e.target.value)}
                    placeholder="e.g., Dean / Lead Student / Mukhiya"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Account Status</label>
                <select
                  value={editUserStatus}
                  onChange={(e) => setEditUserStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal font-medium focus:outline-none focus:border-terracotta"
                >
                  <option value="ACTIVE">ACTIVE (Authorized Access)</option>
                  <option value="SUSPENDED">SUSPENDED (Access Revoked)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Pending Verification)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-charcoal-border/30">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal hover:bg-canvas cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. PROVISION USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg rounded-3xl p-6 border border-charcoal-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal-border/30 pb-3">
              <div>
                <h3 className="text-base font-black text-charcoal">Provision New User Account</h3>
                <p className="text-xs text-charcoal-muted">
                  Create a new authenticated account with district jurisdiction and institutional credentials.
                </p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-canvas text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-charcoal mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g., Dr. Ramesh Soren"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="name@jharkhand.gov.in"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+91 94311 ..."
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Role Type *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal font-medium focus:outline-none focus:border-terracotta"
                  >
                    <option value="STUDENT">Student Volunteer</option>
                    <option value="FACULTY_MENTOR">Faculty Mentor</option>
                    <option value="PANCHAYAT_OFFICER">Gram Panchayat Officer</option>
                    <option value="CITIZEN">Citizen</option>
                    <option value="INDUSTRY_CSR">CSR Partner</option>
                    <option value="GOVT_OFFICER">Govt Directorate Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Jurisdiction District *</label>
                  <select
                    value={newUserDistrict}
                    onChange={(e) => setNewUserDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal font-medium focus:outline-none focus:border-terracotta"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Block (Optional)</label>
                  <input
                    type="text"
                    value={newUserBlock}
                    onChange={(e) => setNewUserBlock(e.target.value)}
                    placeholder="e.g., Namkum Block"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Gram Panchayat (Optional)</label>
                  <input
                    type="text"
                    value={newUserPanchayat}
                    onChange={(e) => setNewUserPanchayat(e.target.value)}
                    placeholder="e.g., Rampur Gram Panchayat"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Affiliated Organization / Institution</label>
                <input
                  type="text"
                  value={newUserOrg}
                  onChange={(e) => setNewUserOrg(e.target.value)}
                  placeholder="e.g., Birla Institute of Technology, Mesra"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Department</label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    placeholder="e.g., Civil Engineering"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Designation</label>
                  <input
                    type="text"
                    value={newUserDesignation}
                    onChange={(e) => setNewUserDesignation(e.target.value)}
                    placeholder="e.g., Capstone Lead / Nodal Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-charcoal-border/60 text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-charcoal-border/30">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal hover:bg-canvas cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. DELETE USER CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-3xl p-6 border border-charcoal-border shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto text-xl font-bold">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-charcoal">Confirm User Account Deletion</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Are you sure you want to remove <b className="text-charcoal">{deletingUser.fullName}</b> ({deletingUser.registrationId}) from the statewide master user registry?
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Administrative Notice</span>
              </p>
              <p className="text-[11px] leading-snug">
                This will revoke active credentials and role permissions across all Jharkhand civic portals.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-charcoal-border/30">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Deregistration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
