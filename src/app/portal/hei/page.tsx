'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import HeiPortal from '@/components/HeiPortal';

export default function HeiPortalPage() {
  return (
    <PortalLayout>
      {({ tickets, onUpdateTicket, onOpenCertificate, onRecordLedgerEvent }) => (
        <HeiPortal
          tickets={tickets}
          onUpdateTicket={onUpdateTicket}
          onOpenCertificate={onOpenCertificate}
          onRecordLedgerEvent={onRecordLedgerEvent}
        />
      )}
    </PortalLayout>
  );
}
