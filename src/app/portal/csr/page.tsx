'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import CsrPortal from '@/components/CsrPortal';

export default function CsrPortalPage() {
  return (
    <PortalLayout>
      {({ tickets, onRecordLedgerEvent, onUpdateTicket, onDonateCampaign }) => (
        <CsrPortal
          tickets={tickets}
          onRecordLedgerEvent={onRecordLedgerEvent}
          onUpdateTicket={onUpdateTicket}
          onDonateCampaign={onDonateCampaign}
        />
      )}
    </PortalLayout>
  );
}
