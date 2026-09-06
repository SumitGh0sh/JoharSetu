'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Filter,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Compass,
  Flame,
  Globe2,
  Eye,
  GraduationCap
} from 'lucide-react';
import { ProblemTicket, TicketCategory, UrgencyLevel, TicketStatus } from '../lib/types';
import { JHARKHAND_DISTRICTS } from '../lib/locationUtils';
import { JHARKHAND_HEIS_44 } from '../lib/heiRegistry';
import { useLanguage } from '../context/LanguageContext';

export interface AgencyMapViewProps {
  tickets: ProblemTicket[];
  onSelectTicket?: (ticket: ProblemTicket) => void;
  onOpenLedgerModal?: () => void;
  title?: string;
  subtitle?: string;
}

const CATEGORY_MAP_META: Record<string, { color: string; label: string; icon: string }> = {
  WATER_MANAGEMENT: { color: '#2563EB', label: 'Water Management', icon: '💧' },
  ROAD_INFRASTRUCTURE: { color: '#EA580C', label: 'Road Infrastructure', icon: '🛣️' },
  RURAL_ELECTRIFICATION_SOLAR: { color: '#D97706', label: 'Solar & Energy', icon: '⚡' },
  SUSTAINABLE_AGRICULTURE: { color: '#16A34A', label: 'Agriculture', icon: '🌾' },
  HEALTHCARE_DELIVERY: { color: '#DC2626', label: 'Healthcare Delivery', icon: '🏥' },
  SANITATION_WASTE: { color: '#0891B2', label: 'Sanitation & Waste', icon: '♻️' },
  PRIMARY_EDUCATION_DIGITAL: { color: '#7C3AED', label: 'Primary Education', icon: '🎓' },
  FORESTRY_ENVIRONMENT: { color: '#059669', label: 'Forestry & Mining', icon: '🌲' },
};

const GOOGLE_TILE_CONFIG = {
  roadmap: {
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps • JoharSetu GIS',
  },
  satellite: {
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Satellite Imagery • JoharSetu GIS',
  },
  terrain: {
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain • JoharSetu GIS',
  },
};

export default function AgencyMapView({
  tickets,
  onSelectTicket,
  onOpenLedgerModal,
  title,
  subtitle,
}: AgencyMapViewProps) {
  const { t } = useLanguage();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map settings
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [isHeatmapActive, setIsHeatmapActive] = useState(false);
  const [showHeis, setShowHeis] = useState(true);

  const [activeTicket, setActiveTicket] = useState<ProblemTicket | null>(tickets[0] || null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const heatmapGroupRef = useRef<any>(null);
  const heisGroupRef = useRef<any>(null);

  // Filtered tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (selectedCategory !== 'ALL' && ticket.category !== selectedCategory) return false;
    if (selectedUrgency !== 'ALL' && ticket.urgency !== selectedUrgency) return false;
    if (selectedDistrict !== 'ALL' && ticket.district !== selectedDistrict) return false;
    if (selectedStatus !== 'ALL' && ticket.status !== selectedStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = ticket.title.toLowerCase().includes(q);
      const matchCode = ticket.ticketCode.toLowerCase().includes(q);
      const matchVillage = (ticket.village || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchVillage) return false;
    }
    return true;
  });

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'CRITICAL':
        return '#DC2626';
      case 'HIGH':
        return '#EA580C';
      case 'MEDIUM':
        return '#D97706';
      case 'LOW':
        return '#16A34A';
      default:
        return '#D87A53';
    }
  };

  const getCategoryMeta = (cat: string) => {
    return CATEGORY_MAP_META[cat] || { color: '#2563EB', label: cat, icon: '📍' };
  };

  // Switch map layer dynamically
  const switchMapLayer = async (type: 'roadmap' | 'satellite' | 'terrain') => {
    setMapType(type);
    if (!leafletMapRef.current || typeof window === 'undefined') return;
    const L = await import('leaflet');
    if (currentTileLayerRef.current) {
      leafletMapRef.current.removeLayer(currentTileLayerRef.current);
    }
    const config = GOOGLE_TILE_CONFIG[type];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(leafletMapRef.current);
    currentTileLayerRef.current = newLayer;
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const renderMap = async () => {
      const L = await import('leaflet');

      if (!mapContainerRef.current || !isMounted) return;

      if (!leafletMapRef.current) {
        const map = L.map(mapContainerRef.current).setView([23.6102, 85.2799], 8);

        const config = GOOGLE_TILE_CONFIG[mapType];
        const tileLayer = L.tileLayer(config.url, {
          attribution: config.attribution,
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }).addTo(map);
        currentTileLayerRef.current = tileLayer;

        const heatmapGroup = L.layerGroup().addTo(map);
        const markersGroup = L.layerGroup().addTo(map);
        const heisGroup = L.layerGroup().addTo(map);

        leafletMapRef.current = map;
        markersGroupRef.current = markersGroup;
        heatmapGroupRef.current = heatmapGroup;
        heisGroupRef.current = heisGroup;
      }

      const map = leafletMapRef.current;
      const markersGroup = markersGroupRef.current;
      const heatmapGroup = heatmapGroupRef.current;
      const heisGroup = heisGroupRef.current;

      if (!map || !markersGroup || !heatmapGroup || !heisGroup) return;

      markersGroup.clearLayers();
      heatmapGroup.clearLayers();
      heisGroup.clearLayers();

      // Render Cluster Heatmap Density Halos if active
      if (isHeatmapActive) {
        filteredTickets.forEach((ticket) => {
          const urgencyMultiplier =
            ticket.urgency === 'CRITICAL' ? 3000 : ticket.urgency === 'HIGH' ? 2200 : 1500;

          // Outer glowing halo
          L.circle([ticket.latitude, ticket.longitude], {
            radius: urgencyMultiplier * 3.5,
            fillColor: ticket.urgency === 'CRITICAL' ? '#DC2626' : '#EA580C',
            fillOpacity: 0.16,
            color: 'transparent',
            weight: 0,
          }).addTo(heatmapGroup);

          // Inner core density
          L.circle([ticket.latitude, ticket.longitude], {
            radius: urgencyMultiplier,
            fillColor: '#FFD700',
            fillOpacity: 0.35,
            color: 'transparent',
            weight: 0,
          }).addTo(heatmapGroup);
        });
      }

      // Plot 44 HEI Campuses across Jharkhand
      if (showHeis) {
        JHARKHAND_HEIS_44.forEach((hei) => {
          // If district filter is active, only show HEIs in that district
          if (selectedDistrict !== 'ALL') {
            const dNorm = selectedDistrict.toLowerCase().replace(/-/g, ' ');
            const heiDistNorm = hei.district.toLowerCase().replace(/-/g, ' ');
            if (!heiDistNorm.includes(dNorm) && !dNorm.includes(heiDistNorm)) {
              return;
            }
          }

          const badgeColor =
            hei.type.includes('Central') ? '#7C3AED' :
            hei.type.includes('State') ? '#2563EB' :
            hei.type.includes('PPP') ? '#0891B2' :
            hei.type.includes('Deemed') ? '#D97706' : '#059669';

          const customHeiIcon = L.divIcon({
            className: 'custom-hei-marker',
            html: `
              <div style="
                background: linear-gradient(135deg, ${badgeColor}, #1F2937);
                width: 32px;
                height: 32px;
                border-radius: 10px;
                border: 2px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.2s;
              ">
                <span style="font-size: 16px; line-height: 1;">🎓</span>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -18],
          });

          const heiMarker = L.marker([hei.lat, hei.lon], { icon: customHeiIcon }).addTo(heisGroup);

          const deptList = hei.departments.map(d => `<li style="margin-bottom: 2px;"><b>${d.name}</b> (${d.activeCapacity} slots)</li>`).join('');
          const specBadges = hei.specializations.map(s => `<span style="display: inline-block; background: #F3F4F6; color: #374151; font-size: 9px; padding: 2px 6px; border-radius: 4px; margin: 1px;">${s.replace(/_/g, ' ')}</span>`).join(' ');

          const popupHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 250px; max-width: 290px; font-size: 12px; color: #1E1E1E;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="background: ${badgeColor}15; color: ${badgeColor}; padding: 2px 7px; border-radius: 999px; font-size: 10px; font-weight: 800; border: 1px solid ${badgeColor}40;">${hei.type}</span>
                ${hei.nirfRank ? `<span style="font-size: 10px; font-weight: 700; color: #B45309;">🏆 NIRF #${hei.nirfRank}</span>` : ''}
              </div>

              <div style="font-weight: 800; font-size: 13px; margin-bottom: 2px; color: #111;">${hei.name}</div>
              <div style="color: #666; font-size: 10px; margin-bottom: 6px;">📍 ${hei.address}</div>

              <div style="margin-bottom: 6px;">
                <div style="font-size: 10px; font-weight: 700; color: #4B5563; margin-bottom: 2px;">Active Specializations:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 2px;">${specBadges}</div>
              </div>

              <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 6px; margin-bottom: 6px;">
                <div style="font-size: 10px; font-weight: 700; color: #1F2937; margin-bottom: 3px;">Faculty Capstone Capacity:</div>
                <ul style="margin: 0; padding-left: 14px; font-size: 10px; color: #4B5563;">
                  ${deptList}
                </ul>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px; border-top: 1px solid #E5E7EB; font-size: 10px;">
                <span style="color: #6B7280;">Est. ${hei.establishedYear || 'N/A'}</span>
                ${hei.website ? `<a href="${hei.website}" target="_blank" rel="noreferrer" style="color: #2563EB; font-weight: 700; text-decoration: none;">Official Portal ↗</a>` : ''}
              </div>
            </div>
          `;

          heiMarker.bindPopup(popupHtml);
        });
      }

      // Plot filtered tickets as category-coded SVG markers
      filteredTickets.forEach((ticket) => {
        const catMeta = getCategoryMeta(ticket.category);
        const urgColor = getUrgencyColor(ticket.urgency);
        const imgUrl = ticket.imageUrls?.[0] || (ticket as any).rawImages?.[0] || '';

        const customIcon = L.divIcon({
          className: 'custom-ticket-marker',
          html: `
            <div style="
              background-color: ${catMeta.color};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: transform 0.2s ease-in-out;
              position: relative;
            ">
              <span style="font-size: 14px; line-height: 1;">${catMeta.icon}</span>
              <div style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: ${urgColor};
                border: 2px solid white;
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([ticket.latitude, ticket.longitude], { icon: customIcon }).addTo(
          markersGroup
        );

        const popupHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 240px; max-width: 280px; font-size: 12px; color: #1E1E1E;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 800; color: ${catMeta.color}; font-size: 11px;">${catMeta.icon} ${ticket.ticketCode}</span>
              <span style="background: ${urgColor}15; color: ${urgColor}; padding: 2px 7px; border-radius: 999px; font-size: 10px; font-weight: 800; border: 1px solid ${urgColor}40;">${ticket.urgency}</span>
            </div>

            ${
              imgUrl
                ? `<div style="width: 100%; height: 110px; border-radius: 10px; overflow: hidden; margin-bottom: 8px; border: 1px solid #E5E7EB; position: relative;">
                    <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="Evidence" />
                  </div>`
                : ''
            }

            <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; line-height: 1.25; color: #111;">${ticket.title}</div>
            <div style="color: #666; font-size: 11px; margin-bottom: 6px;">📍 ${ticket.village || 'Panchayat'}, <b>${ticket.district}</b></div>

            <div style="font-size: 11px; color: #444; margin-bottom: 8px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${ticket.description}
            </div>

            ${
              ticket.assignedHei
                ? `<div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 5px 8px; border-radius: 8px; font-size: 10px; color: #1E40AF; font-weight: 600; margin-bottom: 6px;">
                    🎓 Assigned: <b>${ticket.assignedHei.name}</b> (4 Credits)
                   </div>`
                : ''
            }

            <div style="display: flex; align-items: center; justify-content: space-between; pt: 4px; border-top: 1px solid #E5E7EB; font-size: 10px; color: #777;">
              <span>Status: <b style="color: #059669;">${ticket.status.replace(/_/g, ' ')}</b></span>
              <span style="color: #2563EB; font-weight: 700;">Click to inspect ↗</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);

        marker.on('click', () => {
          setActiveTicket(ticket);
          if (onSelectTicket) onSelectTicket(ticket);
        });
      });
    };

    const timer = setTimeout(renderMap, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [filteredTickets, isHeatmapActive, showHeis, selectedDistrict]);

  // Quick zoom to a district
  const handleQuickZoom = (lat: number, lng: number, distName: string) => {
    setSelectedDistrict(distName);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([lat, lng], 12, { duration: 1.2 });
    }
  };

  return (
    <div className="bg-surface rounded-3xl p-4 sm:p-7 border border-charcoal-border/60 shadow-card space-y-5">
      {/* Header with Title & Live Counters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-charcoal-border/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Google Maps GIS Platform</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal">
            {title || 'Jharkhand Statewide Problem Map & Heatmap'}
          </h2>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl">
            {subtitle || 'Interactive geospatial visualizer displaying category-coded civic challenges, high-density cluster heatmaps, and university project allocations across Jharkhand.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-sand-100 text-sand-800 text-xs font-bold border border-sand-200">
            Showing {filteredTickets.length} of {tickets.length} Incidents
          </span>
          {onOpenLedgerModal && (
            <button
              type="button"
              onClick={onOpenLedgerModal}
              className="px-3 py-1.5 rounded-full bg-terracotta/10 hover:bg-terracotta text-terracotta hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Audit Ledger
            </button>
          )}
        </div>
      </div>

      {/* Map Layer Toolbar & Heatmap Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-canvas-subtle p-3 rounded-2xl border border-charcoal-border/40">
        <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal">
          <Globe2 className="w-4 h-4 text-terracotta" />
          <span>Google Maps Layer:</span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-charcoal-border/50 ml-1">
            <button
              type="button"
              onClick={() => switchMapLayer('roadmap')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapType === 'roadmap' ? 'bg-terracotta text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              🗺️ Roadmap
            </button>
            <button
              type="button"
              onClick={() => switchMapLayer('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapType === 'satellite' ? 'bg-terracotta text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              type="button"
              onClick={() => switchMapLayer('terrain')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapType === 'terrain' ? 'bg-terracotta text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              ⛰️ Terrain
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 44 HEI Campuses toggle */}
          <button
            type="button"
            onClick={() => setShowHeis((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              showHeis
                ? 'bg-amber-700 text-white shadow-md ring-2 ring-amber-200'
                : 'bg-white hover:bg-sand-50 text-charcoal border border-charcoal-border'
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${showHeis ? 'text-amber-200' : 'text-amber-600'}`} />
            <span>{showHeis ? '🎓 44 HEI Campuses (Active)' : 'Show 44 HEI Campuses'}</span>
          </button>

          {/* Heatmap density toggle */}
          <button
            type="button"
            onClick={() => setIsHeatmapActive((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isHeatmapActive
                ? 'bg-jharkhand-crimson text-white shadow-md ring-2 ring-red-200'
                : 'bg-white hover:bg-sand-50 text-charcoal border border-charcoal-border'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${isHeatmapActive ? 'text-amber-300 animate-bounce' : 'text-jharkhand-crimson'}`} />
            <span>{isHeatmapActive ? '🔥 Heatmap Active (Priority Halos)' : 'Show Cluster Heatmap'}</span>
          </button>
        </div>
      </div>

      {/* Multi-parameter Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 bg-canvas-subtle p-3 sm:p-4 rounded-2xl border border-charcoal-border/40 text-xs">
        {/* Category */}
        <div>
          <label className="block font-bold text-charcoal mb-1 uppercase tracking-wider text-[10px]">
            {t.filterCategory}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 rounded-xl border border-charcoal-border bg-white text-xs font-medium outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="WATER_MANAGEMENT">💧 Water Management</option>
            <option value="RURAL_ELECTRIFICATION_SOLAR">⚡ Solar & Energy</option>
            <option value="ROAD_INFRASTRUCTURE">🛣️ Roads & Bridges</option>
            <option value="SUSTAINABLE_AGRICULTURE">🌾 Agriculture</option>
            <option value="HEALTHCARE_DELIVERY">🏥 Healthcare</option>
            <option value="SANITATION_WASTE">♻️ Sanitation & Waste</option>
            <option value="PRIMARY_EDUCATION_DIGITAL">🎓 Primary Education</option>
          </select>
        </div>

        {/* Urgency */}
        <div>
          <label className="block font-bold text-charcoal mb-1 uppercase tracking-wider text-[10px]">
            {t.filterUrgency}
          </label>
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full p-2 rounded-xl border border-charcoal-border bg-white text-xs font-medium outline-none"
          >
            <option value="ALL">All Urgencies</option>
            <option value="CRITICAL">🔴 Critical Hazard</option>
            <option value="HIGH">🟠 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
            <option value="LOW">🟢 Standard / Low</option>
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block font-bold text-charcoal mb-1 uppercase tracking-wider text-[10px]">
            {t.filterDistrict}
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full p-2 rounded-xl border border-charcoal-border bg-white text-xs font-medium outline-none"
          >
            <option value="ALL">All 24 Districts</option>
            {JHARKHAND_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-bold text-charcoal mb-1 uppercase tracking-wider text-[10px]">
            {t.filterStatus}
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 rounded-xl border border-charcoal-border bg-white text-xs font-medium outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="AI_VERIFIED">AI Verified</option>
            <option value="AI_ROUTED">Assigned to HEI</option>
            <option value="IN_PROGRESS">In Prototyping</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Search */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1">
          <label className="block font-bold text-charcoal mb-1 uppercase tracking-wider text-[10px]">
            Search Incident
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ticket or village..."
              className="w-full pl-8 pr-2 py-2 rounded-xl border border-charcoal-border bg-white text-xs outline-none"
            />
            <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Quick Jump District Focus Toolbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-charcoal-muted font-bold text-[11px] shrink-0 mr-1">Quick District Focus:</span>
        {[
          { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
          { name: 'Dhanbad', lat: 23.8145, lng: 86.4412 },
          { name: 'East Singhbhum', lat: 22.8046, lng: 86.2029 },
          { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
          { name: 'Dumka', lat: 24.2676, lng: 87.2486 },
          { name: 'Hazaribagh', lat: 23.9925, lng: 85.3637 },
          { name: 'Khunti', lat: 23.0735, lng: 85.2774 },
        ].map((dist) => (
          <button
            key={dist.name}
            type="button"
            onClick={() => handleQuickZoom(dist.lat, dist.lng, dist.name)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              selectedDistrict === dist.name
                ? 'bg-terracotta text-white border-terracotta shadow-xs'
                : 'bg-canvas hover:bg-canvas-subtle border-charcoal-border/50 text-charcoal'
            }`}
          >
            {dist.name}
          </button>
        ))}
        {selectedDistrict !== 'ALL' && (
          <button
            type="button"
            onClick={() => {
              setSelectedDistrict('ALL');
              if (leafletMapRef.current) leafletMapRef.current.setView([23.6102, 85.2799], 8);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-terracotta hover:underline cursor-pointer whitespace-nowrap"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Main Map + Selected Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-charcoal-border/70 shadow-inner">
          <div
            ref={mapContainerRef}
            className="w-full h-[450px] sm:h-[520px] bg-sand-50"
          />

          {/* Map Legend Floating Chip */}
          <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-charcoal-border/60 shadow-lg flex flex-wrap items-center gap-3 text-[11px] font-semibold text-charcoal">
            <span className="text-[10px] text-charcoal-muted uppercase font-bold">Categories:</span>
            <span className="flex items-center gap-1">💧 Water</span>
            <span className="flex items-center gap-1">🛣️ Road</span>
            <span className="flex items-center gap-1">⚡ Energy</span>
            <span className="flex items-center gap-1">🌾 Agri</span>
            <span className="flex items-center gap-1">🏥 Health</span>
            <span className="text-charcoal-border">|</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> High
            </span>
          </div>
        </div>

        {/* Selected Incident Inspector Panel */}
        <div className="lg:col-span-4 bg-canvas-subtle p-4 sm:p-5 rounded-2xl border border-charcoal-border/50 flex flex-col justify-between space-y-4">
          {activeTicket ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-terracotta">
                  {activeTicket.ticketCode}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: getUrgencyColor(activeTicket.urgency) }}
                >
                  {activeTicket.urgency}
                </span>
              </div>

              <h4 className="font-bold text-sm text-charcoal leading-snug">
                {activeTicket.title}
              </h4>

              <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                {activeTicket.description}
              </p>

              {/* Photo Evidence thumbnail */}
              {(activeTicket.imageUrls?.[0] || (activeTicket as any).rawImages?.[0]) && (
                <div className="relative rounded-xl overflow-hidden border border-charcoal-border/40 h-36 w-full group">
                  <img
                    src={activeTicket.imageUrls?.[0] || (activeTicket as any).rawImages?.[0]}
                    alt="Ticket Evidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-charcoal/80 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    Evidence Photo
                  </span>
                </div>
              )}

              {/* Location stats */}
              <div className="p-2.5 rounded-xl bg-surface border border-charcoal-border/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-charcoal-muted">
                  <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span className="font-medium text-charcoal">
                    {activeTicket.village || 'Panchayat'}, {activeTicket.district}
                  </span>
                </div>
                <div className="text-[10px] text-charcoal-muted font-mono pl-5">
                  GPS: {activeTicket.latitude.toFixed(4)}°N, {activeTicket.longitude.toFixed(4)}°E
                </div>
              </div>

              {/* Assigned University */}
              {activeTicket.assignedHei && (
                <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sand-900">
                    <Building className="w-3.5 h-3.5 text-sand-700 shrink-0" />
                    <span>{activeTicket.assignedHei.name}</span>
                  </div>
                  <p className="text-[11px] text-sand-800">
                    {activeTicket.assignedHei.department || 'Engineering Faculty'}
                  </p>
                  <p className="text-[10px] text-sand-700">
                    Routing Utility: <b>94.2% match</b> • {activeTicket.assignedHei.distanceKm || 22} km from site
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-charcoal-muted text-xs">
              <MapPin className="w-8 h-8 mx-auto text-charcoal-muted/40 mb-2" />
              Click any pin on the map to inspect incident details.
            </div>
          )}

          <div className="pt-2 border-t border-charcoal-border/30 flex items-center justify-between text-[11px] text-charcoal-muted">
            <span>Google Maps Spatial Directorate</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live GIS Stream
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
