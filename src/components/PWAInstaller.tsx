'use client';

import React, { useEffect, useState } from 'react';
import { Download, Wifi, WifiOff, CheckCircle2, X } from 'lucide-react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('JoharSetu Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('SW registration error:', err);
        });
    }

    // Network status listeners
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 5000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Capture install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline / Online Status Banner */}
      {!isOnline && (
        <div className="bg-jharkhand-crimson text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          <span>No internet connection. Your report is saved and will be sent automatically once you are back online.</span>
        </div>
      )}

      {showSyncSuccess && (
        <div className="bg-jharkhand-forest text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Internet is back! Sending your saved reports now.</span>
        </div>
      )}

      {/* Install App Floating Button - Repositioned to bottom-left to prevent overlap with Sahayak AI */}
      {isInstallable && !isDismissed && (
        <div className="fixed bottom-20 md:bottom-6 left-3 sm:left-6 z-40 animate-fade-in">
          <div className="flex items-center gap-2 bg-charcoal/95 backdrop-blur-md text-white pl-3.5 pr-2 py-2 rounded-full shadow-floating border border-sand-400/30">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold hover:text-sand-200 transition-colors cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full bg-terracotta flex items-center justify-center text-white shrink-0 shadow-xs">
                <Download className="w-3.5 h-3.5 animate-bounce" />
              </span>
              <span>Install JoharSetu App</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-full text-sand-300/70 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
