'use client';

import React, { useEffect, useState } from 'react';
import { Download, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
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

      {/* Install App Floating Button */}
      {isInstallable && (
        <div className="fixed bottom-20 right-6 z-50">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-terracotta hover:bg-terracotta-600 text-white font-medium px-4 py-2.5 rounded-full shadow-floating transition-transform hover:scale-105 cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="text-sm font-bold">Add App to Phone</span>
          </button>
        </div>
      )}
    </>
  );
}
