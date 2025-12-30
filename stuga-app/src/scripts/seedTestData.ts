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

async function seedTestData() {
  console.log('🌱 Seeding test data...\n');

  // Create test users
  const users = [
    {
      user_id: 'test-anna-123',
      name: 'Anna Svensson',
      bankid_verified: true,
      created_at: Date.now(),
      location: {
        lat: 59.5186,
        lon: 17.9448,
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
      bankid_verified: true,
      created_at: Date.now(),
      location: {
        lat: 59.5190,
        lon: 17.9450,
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
      bankid_verified: true,
      created_at: Date.now(),
      location: {
        lat: 59.5195,
        lon: 17.9455,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 320,
      availability_status: 'available',
      bluetooth_id: 'bt-maria-789'
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

  // Create test resources
  const resources = [
    {
      user_id: 'test-anna-123',
      type: 'offer',
      category: 'värme',
      title: 'Generator, 5kW',
      description: 'Diesel, kan köra 8h/dag. Vi har eldvärme själva.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      user_id: 'test-anna-123',
      type: 'offer',
      category: 'värme',
      title: 'Ved, ca 0.5 m³',
      description: 'Sög träd förra veckan, kan dela med 2-3 familjer',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      user_id: 'test-sven-456',
      type: 'need',
      category: 'mat',
      title: 'Mat för 2-3 dagar',
      description: 'Familj på 4 personer behöver matvaror',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      user_id: 'test-maria-789',
      type: 'offer',
      category: 'kunskap',
      title: 'Matlagning',
      description: 'Kan laga mat för större grupper',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      created_at: Date.now(),
      updated_at: Date.now()
    }
  ];

  for (const resource of resources) {
    await db.collection('resources').add(resource);
    console.log(`✅ Created resource: ${resource.title}`);
  }

  // Create test Hearts transaction
  const transaction = {
    from_user: 'test-sven-456',
    to_user: 'test-anna-123',
    amount: 50,
    reason: 'Tack för veden!',
    related_resource: null,
    confirmed_by_sender: true,
    confirmed_by_receiver: true,
    created_at: Date.now() - 86400000, // Yesterday
    completed_at: Date.now() - 86400000
  };

  await db.collection('hearts_transactions').add(transaction);
  console.log('✅ Created Hearts transaction');

  console.log('\n🎉 Test data seeded successfully!\n');
  process.exit(0);
}

seedTestData().catch((error) => {
  console.error('❌ Error seeding data:', error);
  process.exit(1);
});
