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

// Helper for expiry timestamps
function hoursFromNow(hours: number): number {
  return Date.now() + (hours * 60 * 60 * 1000);
}

async function seedTestData() {
  console.log('🌱 Seeding test data with urgency...\n');

  // Create test users
  const users = [
    {
      user_id: 'test-anna-123',
      name: 'Anna Svensson',
      display_name: 'Anna S',
      phone_number: '+46701234567',
      registration_completed: true,
      privacy_settings: {
        exact_distance: false,
        show_hearts: true
      },
      blocked_users: [],
      bankid_verified: true,
      created_at: Date.now(),
      location: {
        lat: 59.516158,
        lon: 17.908897,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 245,
      availability_status: 'available',
      bluetooth_id: 'bt-anna-123'
    },
    {
      user_id: 'test-sven-456',
      name: 'Sven Andersson',
      display_name: 'Sven från Väsby',
      phone_number: '+46702345678',
      registration_completed: true,
      privacy_settings: {
        exact_distance: false,
        show_hearts: true
      },
      blocked_users: [],
      bankid_verified: true,
      created_at: Date.now(),
      location: {
        lat: 59.517326,
        lon: 17.910821,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 180,
      availability_status: 'available',
      bluetooth_id: 'bt-sven-456'
    },
    {
      user_id: 'test-maria-789',
      name: 'Maria Johansson',
      display_name: 'Maria J',
      phone_number: '+46703456789',
      registration_completed: true,
      privacy_settings: {
        exact_distance: false,
        show_hearts: true
      },
      blocked_users: [],
      bankid_verified: true,
      created_at: Date.now(),
      location: {
        lat: 59.517208,
        lon: 17.914544,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 320,
      availability_status: 'available',
      bluetooth_id: 'bt-maria-789'
    },
    {
      user_id: 'test-lars-101',
      name: 'Lars Bergström',
      display_name: 'Lasse',
      phone_number: '+46704567890', 
      registration_completed: true,
      privacy_settings: {
        exact_distance: false,
        show_hearts: true
      },
      blocked_users: [],
      bankid_verified: true,
      created_at: Date.now(),
      location: {
        lat: 59.516224,
        lon: 17.914966,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 150,
      availability_status: 'available',
      bluetooth_id: 'bt-lars-101'
    }
  ];

  for (const user of users) {
    await db.collection('users').doc(user.user_id).set(user);
    console.log(`✅ Created user: ${user.name}`);
  }

  const currentUID = '2Dx0SsdQSxTpJarSBITT2WHXRF02'; // From console logs

  // Create a test user for your anonymous auth
  await db.collection('users').doc(currentUID).set({
    user_id: currentUID,
    name: 'Testanvändare (Du)',
    bankid_verified: false,
    created_at: Date.now(),
    location: {
      lat: 59.5186,
      lon: 17.9448,
      accuracy: 50,
      updated_at: Date.now()
    },
    hearts_balance: 500,
    availability_status: 'available'
  });
  console.log('✅ Created test user for anonymous auth');

  // Create test resources with urgency levels
  const resources = [
    // Anna's resources
    {
      user_id: 'test-anna-123',
      type: 'offer',
      category: 'värme',
      title: 'Generator, 5kW Honda',
      description: 'Diesel. Kan köra 8-10 timmar per dag. Vi har ved själva så generatorn är tillgänglig.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      expires_at: hoursFromNow(168), // 1 week - 🟢 Available
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      user_id: 'test-anna-123',
      type: 'offer',
      category: 'första_hjälpen',
      title: 'Första hjälpen-utbildning',
      description: 'Jobbat som sjuksköterska i 15 år. Kan hjälpa till vid akuta situationer.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      expires_at: hoursFromNow(12), // 12 hours - 🔴 Brådskande
      created_at: Date.now(),
      updated_at: Date.now()
    },
    // Sven's resources
    {
      user_id: 'test-sven-456',
      type: 'offer',
      category: 'mat',
      title: 'Campingkök och gasolflaskor',
      description: '2 st gasolflaskor (fulla) och Primus spisköök. Kan dela eller laga mat åt flera familjer.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      expires_at: hoursFromNow(48), // 2 days - 🟡 Snart utgången
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      user_id: 'test-sven-456',
      type: 'need',
      category: 'mat',
      title: 'Torrvaror och konserver',
      description: 'Familj på 4 personer. Har vatten men behöver hållbar mat för 3-5 dagar.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      expires_at: hoursFromNow(6), // 6 hours - 🔴 BRÅDSKANDE
      created_at: Date.now(),
      updated_at: Date.now()
    },
    // Maria's resources
    {
      user_id: 'test-maria-789',
      type: 'offer',
      category: 'annat',
      title: 'Batteriradio och ficklampor',
      description: 'FM/AM-radio med kurbel, samt 3 kraftiga ficklampor med extra batterier.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      // No expiry - always available
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      user_id: 'test-maria-789',
      type: 'offer',
      category: 'boende',
      title: 'Vedspis och plats att värma sig',
      description: 'Stort vardagsrum med vedspis. Kan ta emot 8-10 personer om det blir riktigt kallt.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      expires_at: hoursFromNow(72), // 3 days - 🟡 Snart utgången
      created_at: Date.now(),
      updated_at: Date.now()
    },
    // Lars's resources
    {
      user_id: 'test-lars-101',
      type: 'offer',
      category: 'verktyg',
      title: 'Elverktyg och förlängningssladdar',
      description: 'Borrmaskin, motorsåg, 3x50m förlängningssladdar. Kan också hjälpa till med mindre reparationer.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      // No expiry - tools always available
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      user_id: 'test-lars-101',
      type: 'offer',
      category: 'transport',
      title: 'Fyrhjulsdrift och släp',
      description: 'Volvo XC90 och trailer. Kan hjälpa till med transporter även i dåligt väglag.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      expires_at: hoursFromNow(336), // 2 weeks - 🟢 Tillgänglig
      created_at: Date.now(),
      updated_at: Date.now()
    }
  ];

  for (const resource of resources) {
    await db.collection('resources').add(resource);
    const urgency = resource.expires_at 
      ? `(expires in ${Math.round((resource.expires_at - Date.now()) / (60 * 60 * 1000))}h)`
      : '(no expiry)';
    console.log(`✅ Created resource: ${resource.title} ${urgency}`);
  }

  // Create test Hearts transactions - show the system in use
  const transactions = [
    {
      from_user: 'test-sven-456',
      to_user: 'test-anna-123',
      amount: 50,
      reason: 'Tack för hjälpen med första hjälpen!',
      related_resource: null,
      confirmed_by_sender: true,
      confirmed_by_receiver: true,
      created_at: Date.now() - 86400000, // Yesterday
      completed_at: Date.now() - 86400000
    },
    {
      from_user: 'test-maria-789',
      to_user: 'test-lars-101',
      amount: 30,
      reason: 'Tack för transporten!',
      related_resource: null,
      confirmed_by_sender: true,
      confirmed_by_receiver: true,
      created_at: Date.now() - 172800000, // 2 days ago
      completed_at: Date.now() - 172800000
    }
  ];

  for (const transaction of transactions) {
    await db.collection('hearts_transactions').add(transaction);
    console.log(`✅ Created Hearts transaction: ${transaction.reason}`);
  }

  console.log('\n🎉 Test data seeded successfully with urgency levels!');
  console.log('\nDemo-ready resources with urgency:');
  console.log('  🔴 URGENT (< 24h):');
  console.log('    - Torrvaror (6h) - Family needs food NOW');
  console.log('    - Första hjälpen (12h) - Medical help today');
  console.log('  🟡 SOON (2-3 days):');
  console.log('    - Campingkök (48h) - Limited fuel');
  console.log('    - Vedspis (72h) - Shelter for cold weather');
  console.log('  🟢 AVAILABLE (1-2 weeks):');
  console.log('    - Generator (1 week)');
  console.log('    - Fyrhjulsdrift (2 weeks)');
  console.log('  ⚪ NO EXPIRY:');
  console.log('    - Batteriradio (always available)');
  console.log('    - Elverktyg (always available)');
  console.log('\n4 neighbors within 500m, perfect for pilot demo!\n');
  
  process.exit(0);
}

seedTestData().catch((error) => {
  console.error('❌ Error seeding data:', error);
  process.exit(1);
});
