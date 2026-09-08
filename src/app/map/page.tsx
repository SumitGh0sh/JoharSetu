'use client';

import React from 'react';
import PortalLayout from '@/components/PortalLayout';
import AgencyMapView from '@/components/AgencyMapView';

export default function MapViewPage() {
  return (
    <PortalLayout>
      {({ tickets, onInspectTicket }) => (
        <div className="space-y-6 pb-12">
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-charcoal via-[#26201D] to-[#1E1A18] text-white p-6 sm:p-8 shadow-card border border-sand-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/20 text-sand-200 border border-terracotta/30 text-xs font-black uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-terracotta animate-ping" />
                Statewide GIS Spatial Layer
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Jharkhand Civic Problem <span className="text-sand-300">GIS Heatmap</span>
              </h1>
              <p className="text-xs sm:text-sm text-sand-200/80 mt-1 max-w-2xl">
                Explore real-time spatial clustering, problem severity markers, and HEI institutional catchment areas across all 24 districts of Jharkhand.
              </p>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="bg-surface rounded-3xl p-3 sm:p-5 border border-charcoal-border/50 shadow-soft">
            <AgencyMapView
              tickets={tickets}
              onSelectTicket={onInspectTicket}
              title="Interactive GIS Heatmap & GPS Dispatches"
              subtitle="Hover over markers to view problem urgency, category, and assigned university team"
            />
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
