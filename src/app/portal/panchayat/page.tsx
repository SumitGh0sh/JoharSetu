'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import PanchayatPortal from '@/components/PanchayatPortal';

export default function PanchayatPortalPage() {
  return (
    <PortalLayout>
      {({ tickets, onNewTicket, onUpdateTicket, onRecordLedgerEvent }) => (
        <PanchayatPortal
          tickets={tickets}
          onNewTicket={onNewTicket}
          onUpdateTicket={onUpdateTicket}
          onRecordLedgerEvent={onRecordLedgerEvent}
        />
      )}
    </PortalLayout>
  );
}
