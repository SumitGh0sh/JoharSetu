'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import UserProfileActivityHub from '@/components/UserProfileActivityHub';

export default function ProfilePage() {
  return (
    <PortalLayout>
      {({ tickets, onInspectTicket, onUpvoteTicket, onShareTicket }) => (
        <UserProfileActivityHub
          tickets={tickets}
          onInspectTicket={onInspectTicket}
          onUpvoteTicket={onUpvoteTicket}
          onShareTicket={onShareTicket}
        />
      )}
    </PortalLayout>
  );
}
