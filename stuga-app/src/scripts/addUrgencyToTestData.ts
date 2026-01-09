import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Admin SDK
const serviceAccount = JSON.parse(
  readFileSync('./service-account-key.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

// Helper to calculate expiry timestamp
function hoursFromNow(hours: number): number {
  return Date.now() + (hours * 60 * 60 * 1000);
}

async function addUrgencyToResources() {
  console.log('⏰ Adding urgency/expiry to test resources...\n');

  // Get all resources
  const snapshot = await db.collection('resources').get();
  
  console.log(`Found ${snapshot.size} resources\n`);

  // Define urgency strategy for each resource type
  const urgencyUpdates = [
    // URGENT scenarios (< 24h) - Red 🔴
    {
      titlePattern: 'Torrvaror och konserver',
      expires_at: hoursFromNow(6),
      reason: 'Urgent food need - family of 4'
    },
    {
      titlePattern: 'Första hjälpen-utbildning',
      expires_at: hoursFromNow(12),
      reason: 'Medical expertise available today only'
    },
    
    // SOON expiring (< 7 days) - Orange 🟡
    {
      titlePattern: 'Campingkök och gasolflaskor',
      expires_at: hoursFromNow(48), // 2 days
      reason: 'Warm food preparation - limited fuel'
    },
    {
      titlePattern: 'Vedspis och plats att värma sig',
      expires_at: hoursFromNow(72), // 3 days
      reason: 'Shelter capacity for cold weather'
    },
    
    // AVAILABLE (> 7 days) - Green 🟢
    {
      titlePattern: 'Generator',
      expires_at: hoursFromNow(168), // 1 week
      reason: 'Generator available through week'
    },
    {
      titlePattern: 'Fyrhjulsdrift',
      expires_at: hoursFromNow(336), // 2 weeks
      reason: 'Transport available extended period'
    }
    
    // Keep some without expiry (Batteriradio, Elverktyg) - to show contrast
  ];

  for (const doc of snapshot.docs) {
    const resource = doc.data();
    
    // Find matching urgency update
    const update = urgencyUpdates.find(u => 
      resource.title.includes(u.titlePattern)
    );
    
    if (update) {
      await doc.ref.update({
        expires_at: update.expires_at,
        updated_at: Date.now()
      });
      
      console.log(`✅ Updated: ${resource.title}`);
      console.log(`   → Expires: ${new Date(update.expires_at).toLocaleString('sv-SE')}`);
      console.log(`   → Reason: ${update.reason}\n`);
    } else {
      console.log(`ℹ️  No expiry: ${resource.title} (permanent availability)\n`);
    }
  }

  console.log('🎉 Urgency updates complete!\n');
  console.log('Demo scenarios ready:');
  console.log('  🔴 URGENT (< 24h): Food needs, medical help');
  console.log('  🟡 SOON (2-3 days): Cooking fuel, shelter');
  console.log('  🟢 AVAILABLE (1-2 weeks): Generator, transport');
  console.log('  ⚪ NO EXPIRY: Radio, tools (always available)\n');
  
  process.exit(0);
}

addUrgencyToResources().catch((error) => {
  console.error('❌ Error updating resources:', error);
  process.exit(1);
});
