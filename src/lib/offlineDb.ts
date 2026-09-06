import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface JoharSetuDB extends DBSchema {
  offline_reports: {
    key: string;
    value: {
      id: string;
      title: string;
      description: string;
      category: string;
      urgency: string;
      latitude: number;
      longitude: number;
      district: string;
      village: string;
      reporterName: string;
      reporterPhone: string;
      timestamp: number;
      imageDataUrl?: string;
      audioDataUrl?: string;
      synced: boolean;
    };
  };
}

const DB_NAME = 'JoharSetu_OfflineStore';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<JoharSetuDB>> | null = null;

export function getOfflineDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<JoharSetuDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('offline_reports')) {
          db.createObjectStore('offline_reports', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveOfflineReport(report: {
  title: string;
  description: string;
  category: string;
  urgency: string;
  latitude: number;
  longitude: number;
  district: string;
  village: string;
  reporterName: string;
  reporterPhone: string;
  imageDataUrl?: string;
  audioDataUrl?: string;
}) {
  const db = await getOfflineDB();
  if (!db) return null;

  const item = {
    ...report,
    id: 'offline-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
    synced: false,
  };

  await db.put('offline_reports', item);

  // Request Service Worker Background Sync if supported
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      // @ts-ignore
      await reg.sync.register('sync-pending-reports');
    } catch (e) {
      console.warn('Background sync registration failed:', e);
    }
  }

  return item;
}

export async function getPendingOfflineReports() {
  const db = await getOfflineDB();
  if (!db) return [];
  return await db.getAll('offline_reports');
}

export async function clearOfflineReport(id: string) {
  const db = await getOfflineDB();
  if (!db) return;
  await db.delete('offline_reports', id);
}
