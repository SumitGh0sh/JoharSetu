'use client';

import React, { useState } from 'react';
import { Camera, MapPin, Maximize2, X, Clock, ShieldCheck, Smartphone } from 'lucide-react';
import { formatDate } from '../lib/dateUtils';
import { TicketCategory } from '../lib/types';
import { CATEGORY_PRESET_IMAGES } from '../lib/issueImagePromptEngine';

interface IssuePhotoThumbnailProps {
  src?: string;
  title: string;
  category?: TicketCategory;
  coordinates?: { lat: number; lng: number };
  timestamp?: string;
  village?: string;
  district?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
}

export default function IssuePhotoThumbnail({
  src,
  title,
  category,
  coordinates,
  timestamp,
  village,
  district,
  className = '',
  aspectRatio = 'video'
}: IssuePhotoThumbnailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Fallback to category preset or default handpump photo
  const defaultFallback = category ? CATEGORY_PRESET_IMAGES[category] : '/images/issues/handpump_broken.jpg';
  const displaySrc = (!src || imgError) ? defaultFallback : src;

  const lat = coordinates?.lat ?? 23.814;
  const lng = coordinates?.lng ?? 86.441;
  const dateStr = timestamp ? formatDate(timestamp) : 'Recent Mobile Capture';
  const watermarkLocation = village && district ? `${village}, ${district}` : `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;

  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'wide' ? 'aspect-[16/9]' : 'aspect-[4/3]';

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`group relative overflow-hidden rounded-xl bg-charcoal-subtle border border-sand-300/80 cursor-pointer shadow-soft hover:shadow-card transition-all ${className}`}
      >
        <div className={`w-full ${aspectClass} overflow-hidden bg-sand-100 relative`}>
          <img
            src={displaySrc}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Dark gradient overlay for watermark readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top badge: Mobile Capture tag */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-medium text-white/90 border border-white/10">
            <Smartphone className="w-3 h-3 text-sand-300" />
            <span>Mobile Capture</span>
          </div>

          {/* Top-right expand icon */}
          <div className="absolute top-2 right-2 p-1 rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>

          {/* Bottom Watermark Overlay */}
          <div className="absolute bottom-2 left-2 right-2 text-white pointer-events-none">
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-tight text-white drop-shadow-md truncate">
              <MapPin className="w-3 h-3 text-terracotta shrink-0" />
              <span className="truncate">{watermarkLocation}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-sand-200 mt-0.5 font-mono drop-shadow-sm">
              <span>{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
              <span>{dateStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Lightbox Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-surface rounded-2xl overflow-hidden shadow-2xl border border-sand-300 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-sand-50 border-b border-sand-200 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Camera className="w-4 h-4 text-terracotta shrink-0" />
                <h3 className="text-sm font-bold text-charcoal truncate">{title}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-sand-200 text-charcoal transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Image with Authentic Raw Preview */}
            <div className="relative bg-black flex items-center justify-center overflow-hidden flex-1 min-h-[260px] max-h-[58vh]">
              <img
                src={displaySrc}
                alt={title}
                className="max-h-[58vh] w-auto object-contain mx-auto"
              />
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-white text-xs space-y-0.5">
                <div className="flex items-center gap-1.5 font-semibold text-sand-200">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>{watermarkLocation} ({lat.toFixed(4)}°N, {lng.toFixed(4)}°E)</span>
                </div>
                <div className="text-[10px] text-sand-300 font-mono">
                  Ground Truth Citizen Report Evidence • {dateStr}
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="p-3 sm:p-4 bg-surface border-t border-sand-200 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2 rounded-lg bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Camera Simulated</span>
                <span className="font-semibold text-charcoal flex items-center gap-1 mt-0.5">
                  <Smartphone className="w-3 h-3 text-terracotta" /> 12MP Mobile Camera
                </span>
              </div>
              <div className="p-2 rounded-lg bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Aesthetic Profile</span>
                <span className="font-semibold text-charcoal mt-0.5 block">Anti-Studio Raw Reality</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Verification Status</span>
                <span className="font-semibold text-emerald-900 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> GPS & Hash Anchored
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
