'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import LiveCivicFeed from '@/components/LiveCivicFeed';

export default function LiveFeedPage() {
  return (
    <PortalLayout>
      {({ tickets, onUpvoteTicket, onAddComment, onDonateCampaign }) => (
        <LiveCivicFeed
          tickets={tickets}
          userRole="CITIZEN"
          onUpvoteTicket={onUpvoteTicket}
          onAddComment={onAddComment}
          onDonateCampaign={onDonateCampaign}
        />
      )}
    </PortalLayout>
  );
}
