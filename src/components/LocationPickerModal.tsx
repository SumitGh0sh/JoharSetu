'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Check,
  X,
  Crosshair,
  Navigation,
  Compass,
  AlertCircle
} from 'lucide-react';
import {
  JHARKHAND_DISTRICTS,
  JHARKHAND_DISTRICT_CENTERS,
  reverseGeocodeCoordinates,
  forwardGeocodeAddress,
  isWithinJharkhand,
  acquireBrowserPosition,
  fetchIpLocation
} from '../lib/locationUtils';
import { useLanguage } from '../context/LanguageContext';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat: number;
  initialLng: number;
  initialDistrict: string;
  initialVillage: string;
  onConfirm: (loc: {
    latitude: number;
    longitude: number;
    district: string;
    village: string;
  }) => void;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  initialDistrict,
  initialVillage,
  onConfirm,
}: LocationPickerModalProps) {
  const { t } = useLanguage();
  const [lat, setLat] = useState(initialLat || 23.3441);
  const [lng, setLng] = useState(initialLng || 85.3096);
  const [district, setDistrict] = useState(initialDistrict || 'Ranchi');
  const [village, setVillage] = useState(initialVillage || 'Ranchi Main Road');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ label: string; lat: number; lng: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isGpsLocating, setIsGpsLocating] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);

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

  // Initialize Leaflet map client-side
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    let mapInstance: any = null;

    const initMap = async () => {
      const L = await import('leaflet');

      // Fix default Leaflet marker icon issue in Webpack/Next.js
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      if (!mapContainerRef.current) return;

      // Clean up previous instance if any
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      mapInstance = L.map(mapContainerRef.current).setView([lat, lng], 13);

      const tileConfig = GOOGLE_TILE_CONFIG[mapType] || GOOGLE_TILE_CONFIG.roadmap;
      const tileLayer = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(mapInstance);
      currentTileLayerRef.current = tileLayer;

      const marker = L.marker([lat, lng], { draggable: true }).addTo(mapInstance);
      marker.bindPopup(`<b>Selected Position</b><br/>${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();

      marker.on('dragend', async () => {
        const position = marker.getLatLng();
        setLat(position.lat);
        setLng(position.lng);
        marker.setPopupContent(`<b>Selected Position</b><br/>${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`).openPopup();
        
        // Reverse geocode new position
        setIsResolvingAddress(true);
        const resolved = await reverseGeocodeCoordinates(position.lat, position.lng);
        if (resolved.district) setDistrict(resolved.district);
        if (resolved.village) setVillage(resolved.village);
        setIsResolvingAddress(false);
      });

      mapInstance.on('click', async (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        marker.setLatLng([clickLat, clickLng]);
        setLat(clickLat);
        setLng(clickLng);
        marker.setPopupContent(`<b>Selected Position</b><br/>${clickLat.toFixed(4)}, ${clickLng.toFixed(4)}`).openPopup();

        setIsResolvingAddress(true);
        const resolved = await reverseGeocodeCoordinates(clickLat, clickLng);
        if (resolved.district) setDistrict(resolved.district);
        if (resolved.village) setVillage(resolved.village);
        setIsResolvingAddress(false);
      });

      leafletMapRef.current = mapInstance;
      markerRef.current = marker;
    };

    const timer = setTimeout(initMap, 150);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isOpen]);

  // Update map view when coordinates change programmatically
  const updateMapMarker = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([newLat, newLng], 14);
      markerRef.current.setLatLng([newLat, newLng]);
      markerRef.current.setPopupContent(`<b>Selected Position</b><br/>${newLat.toFixed(4)}, ${newLng.toFixed(4)}`).openPopup();
    }
  };

  // Search Address handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await forwardGeocodeAddress(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectSearchResult = async (res: { label: string; lat: number; lng: number }) => {
    updateMapMarker(res.lat, res.lng);
    setSearchResults([]);
    setSearchQuery(res.label);

    setIsResolvingAddress(true);
    const resolved = await reverseGeocodeCoordinates(res.lat, res.lng);
    if (resolved.district) setDistrict(resolved.district);
    if (resolved.village) setVillage(resolved.village);
    setIsResolvingAddress(false);
  };

  const [gpsStatus, setGpsStatus] = useState<{
    type: 'info' | 'warning' | 'success';
    message: string;
  } | null>(null);

  const handleDistrictSelect = (newDistrict: string) => {
    setDistrict(newDistrict);
    const center = JHARKHAND_DISTRICT_CENTERS[newDistrict];
    if (center) {
      updateMapMarker(center.lat, center.lng);
      setVillage(`${newDistrict} Center / Ward`);
    }
  };

  // Use current GPS
  const handleUseCurrentGPS = async () => {
    setIsGpsLocating(true);
    setGpsStatus(null);

    try {
      // 1. Dual-tier browser acquisition
      const coords = await acquireBrowserPosition();
      updateMapMarker(coords.latitude, coords.longitude);

      setIsResolvingAddress(true);
      const resolved = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      if (resolved.district) setDistrict(resolved.district);
      if (resolved.village) setVillage(resolved.village);
      setIsResolvingAddress(false);

      if (coords.accuracy && coords.accuracy > 800) {
        setGpsStatus({
          type: 'warning',
          message: `Detected via Wi-Fi/ISP tower (~${Math.round(coords.accuracy / 1000)}km radius: ${resolved.village}, ${resolved.district}). Because PCs lack satellite GPS, tap your District or search your village below if this differs.`,
        });
      } else {
        setGpsStatus({
          type: 'success',
          message: `GPS Captured: ${resolved.village}, ${resolved.district}`,
        });
      }
    } catch (err: any) {
      console.warn('[Modal GPS] Browser GPS failed, trying IP fallback:', err);
      try {
        const ipLoc = await fetchIpLocation();
        updateMapMarker(ipLoc.latitude, ipLoc.longitude);
        if (ipLoc.district) setDistrict(ipLoc.district);
        if (ipLoc.village) setVillage(ipLoc.village);

        const isDenied = err && err.code === 1;
        setGpsStatus({
          type: 'warning',
          message: isDenied
            ? `Browser location access is blocked. Located via network (${ipLoc.village}, ${ipLoc.district}).`
            : `Hardware GPS timed out. Using network location (${ipLoc.village}, ${ipLoc.district}).`,
        });
      } catch {
        setGpsStatus({
          type: 'warning',
          message: 'Unable to acquire location automatically. You can click on the map to set your position.',
        });
      }
    } finally {
      setIsGpsLocating(false);
    }
  };

  const handleSave = () => {
    onConfirm({
      latitude: lat,
      longitude: lng,
      district,
      village,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-charcoal-border/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-canvas to-sand-50 border-b border-charcoal-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-charcoal">{t.locModalTitle}</h3>
              <p className="text-xs text-charcoal-muted">{t.locModalSub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface hover:bg-canvas text-charcoal-muted hover:text-charcoal flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Search bar & GPS button */}
          <div className="flex flex-col sm:flex-row gap-2">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.locSearchPlaceholder}
                className="w-full pl-9 pr-20 py-2 rounded-xl border border-charcoal-border text-xs sm:text-sm focus:border-terracotta outline-none"
              />
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-1.5 top-1 px-3 py-1 bg-terracotta text-white font-bold text-xs rounded-lg hover:bg-terracotta-600 transition-colors"
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </form>

            <button
              type="button"
              onClick={handleUseCurrentGPS}
              disabled={isGpsLocating}
              className="px-3.5 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-sand-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isGpsLocating ? 'animate-spin' : ''}`} />
              <span>{isGpsLocating ? 'Locating...' : t.locUseCurrentGps}</span>
            </button>
          </div>

          {/* Quick District Navigation Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-charcoal-muted font-bold text-[11px] shrink-0">Quick Jump:</span>
            {JHARKHAND_DISTRICTS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDistrictSelect(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  district === d
                    ? 'bg-terracotta text-white shadow-xs'
                    : 'bg-sand-100 hover:bg-sand-200 text-charcoal'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Search Suggestions Dropdown */}
          {searchResults.length > 0 && (
            <div className="bg-canvas border border-charcoal-border/50 rounded-xl p-2 space-y-1 max-h-36 overflow-y-auto">
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left p-2 rounded-lg hover:bg-white text-xs text-charcoal font-medium truncate flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span className="truncate">{res.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* GPS Status Banner */}
          {gpsStatus && (
            <div
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 animate-fade-in ${
                gpsStatus.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle
                  className={`w-4 h-4 shrink-0 ${
                    gpsStatus.type === 'success' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                />
                <span>{gpsStatus.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setGpsStatus(null)}
                className="text-charcoal-muted hover:text-charcoal p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Google Maps Layer Type Controls & Branding */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                <Compass className="w-3 h-3 text-blue-600" />
                <span>Google Maps GIS</span>
              </span>
              <span className="text-[11px] text-charcoal-muted">Interactive Satellite & Terrain</span>
            </div>

            <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl border border-sand-300 self-end xs:self-auto">
              <button
                type="button"
                onClick={() => switchMapLayer('roadmap')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mapType === 'roadmap' ? 'bg-terracotta text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                🗺️ Street
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

          {/* Interactive Map Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-charcoal-border shadow-inner">
            <div
              ref={mapContainerRef}
              className="w-full h-64 sm:h-80 z-0 bg-sand-50"
              style={{ minHeight: '260px' }}
            />
            {isResolvingAddress && (
              <div className="absolute top-2 left-2 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-terracotta shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-terracotta animate-ping" />
                Finding address...
              </div>
            )}
          </div>

          {/* Manual coordinate & District input grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-canvas-subtle p-3.5 rounded-2xl border border-charcoal-border/40 text-xs">
            <div>
              <label className="block font-bold text-charcoal uppercase tracking-wider mb-1">
                {t.jharkhandDistrict}
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictSelect(e.target.value)}
                className="w-full p-2 rounded-xl border border-charcoal-border bg-white text-xs font-medium"
              >
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-charcoal uppercase tracking-wider mb-1">
                {t.villageWard}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2 rounded-xl border border-charcoal-border bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal uppercase tracking-wider mb-1">
                {t.locManualLat}
              </label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => updateMapMarker(parseFloat(e.target.value) || 0, lng)}
                className="w-full p-2 rounded-xl border border-charcoal-border bg-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal uppercase tracking-wider mb-1">
                {t.locManualLng}
              </label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => updateMapMarker(lat, parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-xl border border-charcoal-border bg-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-canvas border-t border-charcoal-border/40 flex items-center justify-between gap-3">
          <div className="text-xs text-charcoal-muted truncate">
            Selected: <span className="font-bold text-charcoal">{village}, {district}</span> ({lat.toFixed(4)}°N, {lng.toFixed(4)}°E)
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal hover:bg-canvas-subtle transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.locConfirmBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
