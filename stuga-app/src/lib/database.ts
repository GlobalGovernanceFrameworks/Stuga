import * as SQLite from 'expo-sqlite';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

const db = SQLite.openDatabaseSync('stuga.db');

// Initialize tables
export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pending_transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      synced INTEGER DEFAULT 0
    );
  `);
  
  console.log('✅ Database initialized');
}

// Queue offline Hearts transaction
export function queueHeartsTransaction(data: any): string {
  const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  db.runSync(
    'INSERT INTO pending_transactions (id, type, data, created_at) VALUES (?, ?, ?, ?)',
    [id, 'hearts_transaction', JSON.stringify(data), Date.now()]
  );
  
  console.log('💾 Queued Hearts transaction:', id);
  return id;
}

// Get all pending transactions
export function getPendingTransactions(): Array<{
  id: string;
  type: string;
  data: string;
  created_at: number;
  synced: number;
}> {
  const result = db.getAllSync(
    'SELECT * FROM pending_transactions WHERE synced = 0 ORDER BY created_at ASC'
  );
  
  return result as any[];
}

// Mark transaction as synced
export function markTransactionSynced(id: string) {
  db.runSync(
    'UPDATE pending_transactions SET synced = 1 WHERE id = ?',
    [id]
  );
  console.log('✅ Marked as synced:', id);
}

// Delete old synced transactions (cleanup)
export function cleanupSyncedTransactions() {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  db.runSync(
    'DELETE FROM pending_transactions WHERE synced = 1 AND created_at < ?',
    [oneWeekAgo]
  );
}

// Sync pending transactions to Firestore
export async function syncPendingTransactions(firestore: any): Promise<number> {
  const pending = getPendingTransactions();
  
  if (pending.length === 0) {
    console.log('ℹ️ No pending transactions to sync');
    return 0;
  }

  console.log(`🔄 Syncing ${pending.length} pending transactions...`);
  let synced = 0;

  for (const item of pending) {
    try {
      const data = JSON.parse(item.data);
      
      if (item.type === 'hearts_transaction') {
        await addDoc(collection(firestore, 'hearts_transactions'), data);
        markTransactionSynced(item.id);
        synced++;
        console.log('✅ Synced transaction:', item.id);
      }
    } catch (error) {
      console.error('❌ Failed to sync transaction:', item.id, error);
      // Don't mark as synced if failed - will retry later
    }
  }

  console.log(`🎉 Synced ${synced}/${pending.length} transactions`);
  return synced;
}

// Get count of pending transactions
export function getPendingCount(): number {
  const result = db.getFirstSync(
    'SELECT COUNT(*) as count FROM pending_transactions WHERE synced = 0'
  ) as any;
  return result?.count || 0;
}
