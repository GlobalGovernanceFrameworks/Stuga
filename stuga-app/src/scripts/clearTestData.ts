import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Admin SDK
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../../service-account-key.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteCollection(collectionName: string) {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();
  
  if (snapshot.empty) {
    console.log(`  ℹ️  ${collectionName}: already empty`);
    return 0;
  }

  const batchSize = 500;
  let deletedCount = 0;

  for (let i = 0; i < snapshot.docs.length; i += batchSize) {
    const batch = db.batch();
    const batchDocs = snapshot.docs.slice(i, i + batchSize);
    
    batchDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    deletedCount += batchDocs.length;
  }

  console.log(`  ✅ ${collectionName}: deleted ${deletedCount} documents`);
  return deletedCount;
}

async function clearTestData() {
  console.log('🗑️  WARNING: Clearing ALL test data in 3 seconds...');
  console.log('   Press Ctrl+C to cancel\n');
  
  // Simple 3-second delay instead of prompt
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('🗑️  Starting deletion...\n');
  
  const collections = [
    'users',
    'resources',
    'hearts_transactions',
    'contact_requests',
    'mesh_nodes'  // If you have any
  ];

  let totalDeleted = 0;
  
  for (const collection of collections) {
    const count = await deleteCollection(collection);
    totalDeleted += count;
  }

  console.log(`\n🎉 Cleared ${totalDeleted} total documents`);
  console.log('✅ Database ready for fresh seed data\n');
  
  process.exit(0);
}

clearTestData().catch((error) => {
  console.error('❌ Error clearing data:', error);
  process.exit(1);
});
