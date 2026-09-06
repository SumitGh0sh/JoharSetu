'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import GovtAdminPortal from '@/components/GovtAdminPortal';

export default function GovtAdminPortalPage() {
  return (
    <PortalLayout>
      {({ tickets, auditChain }) => (
        <GovtAdminPortal
          tickets={tickets}
          auditChain={auditChain}
          onOpenLedgerModal={() => {}}
        />
      )}
    </PortalLayout>
  );
}
