import { useEffect, useState } from 'react';
import { useNetworkState } from './useNetworkState';
import { syncPendingTransactions, getPendingCount } from '../lib/database';
import { db } from '../config/firebase';

export function useOfflineSync() {
  const { isConnected } = useNetworkState();
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Update pending count on mount and after sync
  useEffect(() => {
    updatePendingCount();
  }, []);

  // Auto-sync when connection restored
  useEffect(() => {
    if (isConnected && !syncing) {
      const count = getPendingCount();
      if (count > 0) {
        performSync();
      }
    }
  }, [isConnected]);

  async function performSync() {
    if (syncing) return;
    
    setSyncing(true);
    try {
      const synced = await syncPendingTransactions(db);
      if (synced > 0) {
        console.log(`✅ Synced ${synced} queued transactions`);
      }
      updatePendingCount();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  }

  function updatePendingCount() {
    const count = getPendingCount();
    setPendingCount(count);
  }

  return {
    syncing,
    pendingCount,
    performSync,
    updatePendingCount
  };
}
