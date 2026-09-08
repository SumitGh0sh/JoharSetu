'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import GovtAdminPortal from '@/components/GovtAdminPortal';

export default function GovtAdminPortalPage() {
  return (
    <PortalLayout>
      {({ tickets, auditChain, onUpdateTicket, onDeleteTicket }) => (
        <GovtAdminPortal
          tickets={tickets}
          auditChain={auditChain}
          onUpdateTicket={onUpdateTicket}
          onDeleteTicket={onDeleteTicket}
          onOpenLedgerModal={() => {}}
        />
      )}
    </PortalLayout>
  );
}
