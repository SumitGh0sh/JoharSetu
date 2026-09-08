'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import GamifiedLeaderboard from '@/components/GamifiedLeaderboard';

export default function LeaderboardPage() {
  return (
    <PortalLayout>
      {() => <GamifiedLeaderboard />}
    </PortalLayout>
  );
}
