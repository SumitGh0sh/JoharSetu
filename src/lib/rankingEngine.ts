import { ProblemTicket, UrgencyLevel } from './types';

/**
 * Calculates the dynamic Hype-Up trending score for a problem ticket.
 * Combines upvote velocity, urgency severity, regional HEI allocation,
 * and community discussion density (similar to Reddit / YouTube Hype algorithms).
 */
export function calculateHypeScore(ticket: ProblemTicket): number {
  const upvotes = ticket.socialEngagement?.upvotes || 0;
  const commentsCount = ticket.socialEngagement?.commentsCount || ticket.socialEngagement?.comments?.length || 0;
  const shares = ticket.socialEngagement?.shares || 0;

  // Calculate age in hours (minimum 1 hour to avoid division by zero)
  const reportedTime = new Date(ticket.reportedAt).getTime();
  const now = Date.now();
  const hoursSince = Math.max(1, (now - reportedTime) / (1000 * 60 * 60));

  // Upvote velocity: higher weight for recent upvotes (within 24-48 hours)
  const velocityMultiplier = hoursSince <= 24 ? 2.5 : hoursSince <= 48 ? 1.8 : 1.0;
  const velocityScore = (upvotes / Math.pow(hoursSince + 2, 0.6)) * 20 * velocityMultiplier;

  // Urgency severity bonus
  let urgencyBonus = 5;
  switch (ticket.urgency) {
    case 'CRITICAL':
      urgencyBonus = 60;
      break;
    case 'HIGH':
      urgencyBonus = 35;
      break;
    case 'MEDIUM':
      urgencyBonus = 15;
      break;
    case 'LOW':
    default:
      urgencyBonus = 5;
      break;
  }

  // Institutional allocation and CSR bonus
  const heiBonus = ticket.assignedHei ? 25 : 0;
  const csrBonus = ticket.crowdfunding?.raisedAmount ? 20 : 0;

  // Discussion and virality score
  const socialScore = upvotes * 3 + commentsCount * 6 + shares * 4;

  const totalHype = Math.round(velocityScore + urgencyBonus + heiBonus + csrBonus + socialScore);
  return totalHype;
}

/**
 * Returns dynamic trending status badges based on score and ticket attributes.
 */
export function getTrendingBadge(ticket: ProblemTicket, rankIndex: number): string | null {
  if (ticket.status === 'RESOLVED') {
    return '🏆 Resolved by Student Team';
  }
  if (ticket.status === 'PROTOTYPE_DEPLOYED') {
    return '✅ Prototype Field Deployed';
  }
  if (rankIndex === 0) {
    return `🔥 #1 Trending in ${ticket.district}`;
  }
  if (rankIndex <= 2) {
    return `⚡ Trending in ${ticket.district}`;
  }
  if (ticket.urgency === 'CRITICAL') {
    return '🚨 Immediate Hazard Priority';
  }
  if (ticket.crowdfunding && ticket.crowdfunding.raisedAmount > 0) {
    return `💼 ₹${(ticket.crowdfunding.raisedAmount / 1000).toFixed(0)}k Co-Funded`;
  }
  if (ticket.assignedHei) {
    return `🎓 Assigned: ${ticket.assignedHei.code || ticket.assignedHei.name.split(' ')[0]}`;
  }
  if ((ticket.socialEngagement?.upvotes || 0) > 50) {
    return `⚡ ${(ticket.socialEngagement?.upvotes || 0)} Hypes`;
  }
  return null;
}

/**
 * Citizen Privacy & Anonymity Protocol (DPDP Act Compliance).
 * Mask sensitive reporter details (full name, phone, exact address) for public views.
 * Reveals full details ONLY to authorized Government Officers and HEI Coordinators.
 */
export function getPublicReporterIdentity(
  ticket: ProblemTicket,
  userRole: string = 'CITIZEN'
): {
  displayName: string;
  displayPhone: string;
  isMasked: boolean;
  maskingReason: string;
} {
  const isPrivileged =
    userRole === 'GOVT_OFFICER' ||
    userRole === 'PANCHAYAT_OFFICER' ||
    userRole === 'FACULTY_MENTOR' ||
    userRole === 'admin' ||
    userRole === 'hei';

  if (isPrivileged) {
    return {
      displayName: ticket.reporterName || 'Citizen Reporter',
      displayPhone: ticket.reporterPhone || 'Not provided',
      isMasked: false,
      maskingReason: 'Privileged Official Access Granted (Audit Logged)',
    };
  }

  // Public Anonymized Representation
  const villageSnippet = (ticket.village || '').split(',')[0].trim();
  const districtName = ticket.district || 'Jharkhand';
  const customId = ticket.privacySettings?.publicReporterIdentifier;

  let publicName = customId;
  if (!publicName) {
    if (villageSnippet) {
      publicName = `Resident from ${villageSnippet}`;
    } else {
      publicName = `Citizen of ${districtName}`;
    }
  }

  // Mask Phone: +91 94311 *****
  let maskedPhone = '+91 ••••• •••••';
  if (ticket.reporterPhone && ticket.reporterPhone.length >= 8) {
    const clean = ticket.reporterPhone.trim();
    maskedPhone = clean.substring(0, 6) + ' •••••';
  }

  return {
    displayName: publicName,
    displayPhone: maskedPhone,
    isMasked: true,
    maskingReason: 'Identity Protected under Citizen Privacy Protocol (DPDP 2023)',
  };
}

/**
 * Sorts tickets dynamically according to the selected community feed view.
 */
export function sortTickets(
  tickets: ProblemTicket[],
  sortBy: 'TRENDING' | 'URGENT' | 'NEWEST' | 'HEI_ASSIGNED' | 'RESOLVED'
): ProblemTicket[] {
  const cloned = [...tickets];

  switch (sortBy) {
    case 'TRENDING':
      return cloned.sort((a, b) => {
        const scoreB = b.socialEngagement?.hypeScore ?? calculateHypeScore(b);
        const scoreA = a.socialEngagement?.hypeScore ?? calculateHypeScore(a);
        return scoreB - scoreA;
      });

    case 'URGENT':
      const urgencyWeights: Record<UrgencyLevel, number> = {
        CRITICAL: 4,
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
      };
      return cloned.sort((a, b) => {
        const diff = urgencyWeights[b.urgency] - urgencyWeights[a.urgency];
        if (diff !== 0) return diff;
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      });

    case 'NEWEST':
      return cloned.sort(
        (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
      );

    case 'HEI_ASSIGNED':
      return cloned.sort((a, b) => {
        const aHasHei = a.assignedHei ? 1 : 0;
        const bHasHei = b.assignedHei ? 1 : 0;
        if (bHasHei !== aHasHei) return bHasHei - aHasHei;
        return (b.socialEngagement?.upvotes || 0) - (a.socialEngagement?.upvotes || 0);
      });

    case 'RESOLVED':
      return cloned.sort((a, b) => {
        const aResolved = a.status === 'RESOLVED' || a.status === 'PROTOTYPE_DEPLOYED' ? 1 : 0;
        const bResolved = b.status === 'RESOLVED' || b.status === 'PROTOTYPE_DEPLOYED' ? 1 : 0;
        if (bResolved !== aResolved) return bResolved - aResolved;
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      });

    default:
      return cloned;
  }
}
