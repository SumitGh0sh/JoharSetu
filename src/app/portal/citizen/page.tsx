'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import CitizenPortal from '@/components/CitizenPortal';

export default function CitizenPortalPage() {
  return (
    <PortalLayout>
      {({ tickets, onNewTicket, onUpdateTicket, onUpvoteTicket, onAddComment, onDonateCampaign, language }) => (
        <CitizenPortal
          tickets={tickets}
          onNewTicket={onNewTicket}
          onUpdateTicket={onUpdateTicket}
          onUpvoteTicket={onUpvoteTicket}
          onAddComment={onAddComment}
          onDonateCampaign={onDonateCampaign}
          language={language}
          userRole="CITIZEN"
        />
      )}
    </PortalLayout>
  );
}
