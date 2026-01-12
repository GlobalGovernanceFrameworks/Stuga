const admin = require('firebase-admin');

// SETUP INSTRUCTIONS:
// 1. Download service account key from Firebase Console:
//    Firebase Console → stuga-dev → Settings → Service accounts
//    → Generate new private key
// 2. Save as: functions/stuga-dev-service-account.json
// 3. Run: node seedDevData.js

// Try to load service account key
let serviceAccount;
try {
  serviceAccount = require('./stuga-dev-service-account.json');
} catch (error) {
  console.error('❌ ERROR: Could not find stuga-dev-service-account.json');
  console.error('');
  console.error('Please download service account key:');
  console.error('1. Go to: https://console.firebase.google.com/project/stuga-dev/settings/serviceaccounts/adminsdk');
  console.error('2. Click "Generate new private key"');
  console.error('3. Save as: functions/stuga-dev-service-account.json');
  console.error('4. Run this script again');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'stuga-dev'
});

const db = admin.firestore();

async function seedDevData() {
  console.log('🌱 Seeding DEV data to stuga-dev...\n');
  console.log('This will create test users with realistic activity for testing reputation system.\n');

  // Create test users with varied activity levels
  const users = [
    {
      user_id: 'dev-user-1',
      name: 'Alice Andersson',
      bankid_verified: false,
      created_at: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      location: {
        lat: 59.516158,
        lon: 17.908897,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 100,
      availability_status: 'available'
    },
    {
      user_id: 'dev-user-2',
      name: 'Bob Bengtsson',
      bankid_verified: false,
      created_at: Date.now() - (20 * 24 * 60 * 60 * 1000), // 20 days ago
      location: {
        lat: 59.517326,
        lon: 17.910821,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 150,
      availability_status: 'available'
    },
    {
      user_id: 'dev-user-3',
      name: 'Clara Carlsson',
      bankid_verified: false,
      created_at: Date.now() - (15 * 24 * 60 * 60 * 1000), // 15 days ago
      location: {
        lat: 59.517208,
        lon: 17.914544,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 200,
      availability_status: 'available'
    },
    {
      user_id: 'dev-user-4',
      name: 'David Davidsson',
      bankid_verified: false,
      created_at: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
      location: {
        lat: 59.516224,
        lon: 17.914966,
        accuracy: 50,
        updated_at: Date.now()
      },
      hearts_balance: 75,
      availability_status: 'available'
    }
  ];

  console.log('📝 Creating users...');
  for (const user of users) {
    await db.collection('users').doc(user.user_id).set(user);
    console.log(`   ✅ ${user.name} (${user.user_id})`);
  }

  // Create CONFIRMED Hearts transactions (these count for reputation)
  console.log('\n💖 Creating confirmed Hearts transactions...');
  const confirmedTransactions = [
    {
      from_user: 'dev-user-1',
      to_user: 'dev-user-2',
      amount: 25,
      reason: 'Tack för hjälpen med generatorn!',
      confirmed_by_sender: true,
      confirmed_by_receiver: true,
      created_at: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
      completed_at: Date.now() - (5 * 24 * 60 * 60 * 1000)
    },
    {
      from_user: 'dev-user-2',
      to_user: 'dev-user-3',
      amount: 50,
      reason: 'Tack för maten!',
      confirmed_by_sender: true,
      confirmed_by_receiver: true,
      created_at: Date.now() - (4 * 24 * 60 * 60 * 1000),
      completed_at: Date.now() - (4 * 24 * 60 * 60 * 1000)
    },
    {
      from_user: 'dev-user-3',
      to_user: 'dev-user-1',
      amount: 30,
      reason: 'Snabb hjälp med transporten!',
      confirmed_by_sender: true,
      confirmed_by_receiver: true,
      created_at: Date.now() - (3 * 24 * 60 * 60 * 1000),
      completed_at: Date.now() - (3 * 24 * 60 * 60 * 1000)
    },
    {
      from_user: 'dev-user-1',
      to_user: 'dev-user-3',
      amount: 40,
      reason: 'Tack för boende under krisen',
      confirmed_by_sender: true,
      confirmed_by_receiver: true,
      created_at: Date.now() - (2 * 24 * 60 * 60 * 1000),
      completed_at: Date.now() - (2 * 24 * 60 * 60 * 1000)
    },
    {
      from_user: 'dev-user-4',
      to_user: 'dev-user-1',
      amount: 20,
      reason: 'Tack för verktyg',
      confirmed_by_sender: true,
      confirmed_by_receiver: true,
      created_at: Date.now() - (1 * 24 * 60 * 60 * 1000),
      completed_at: Date.now() - (1 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const tx of confirmedTransactions) {
    await db.collection('hearts_transactions').add(tx);
    console.log(`   ✅ ${tx.from_user} → ${tx.to_user}: ${tx.amount} Hearts`);
  }

  // Create PENDING transactions (not yet confirmed - don't count for reputation)
  console.log('\n⏳ Creating pending Hearts transactions...');
  const pendingTransactions = [
    {
      from_user: 'dev-user-2',
      to_user: 'dev-user-1',
      amount: 15,
      reason: 'För hjälp med första hjälpen',
      confirmed_by_sender: true,
      confirmed_by_receiver: false, // Not confirmed yet
      created_at: Date.now(),
      completed_at: null
    }
  ];

  for (const tx of pendingTransactions) {
    await db.collection('hearts_transactions').add(tx);
    console.log(`   ⏳ ${tx.from_user} → ${tx.to_user}: ${tx.amount} Hearts (pending)`);
  }

  // Create resources with different statuses
  console.log('\n📦 Creating resources...');
  const resources = [
    // Alice's resources (dev-user-1)
    {
      user_id: 'dev-user-1',
      type: 'offer',
      category: 'värme',
      title: 'Generator, 5kW Honda',
      description: 'Diesel generator, fungerar perfekt. Kan köra 8-10 timmar per dag.',
      status: 'completed', // Completed = counts for reputation
      matched_with_user: 'dev-user-2',
      hearts_value: 25,
      created_at: Date.now() - (6 * 24 * 60 * 60 * 1000),
      updated_at: Date.now() - (5 * 24 * 60 * 60 * 1000)
    },
    {
      user_id: 'dev-user-1',
      type: 'offer',
      category: 'första_hjälpen',
      title: 'Första hjälpen-utbildning',
      description: 'Jobbat som sjuksköterska i 15 år. Kan hjälpa vid akuta situationer.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      created_at: Date.now() - (3 * 24 * 60 * 60 * 1000),
      updated_at: Date.now() - (3 * 24 * 60 * 60 * 1000)
    },

    // Bob's resources (dev-user-2)
    {
      user_id: 'dev-user-2',
      type: 'offer',
      category: 'mat',
      title: 'Campingkök och gasolflaskor',
      description: '2 st gasolflaskor (fulla) och Primus spiskök.',
      status: 'completed',
      matched_with_user: 'dev-user-3',
      hearts_value: 50,
      created_at: Date.now() - (5 * 24 * 60 * 60 * 1000),
      updated_at: Date.now() - (4 * 24 * 60 * 60 * 1000)
    },
    {
      user_id: 'dev-user-2',
      type: 'need',
      category: 'transport',
      title: 'Hjälp med transport',
      description: 'Behöver hjälp att transportera ved från skogen.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      created_at: Date.now() - (1 * 24 * 60 * 60 * 1000),
      updated_at: Date.now() - (1 * 24 * 60 * 60 * 1000)
    },

    // Clara's resources (dev-user-3)
    {
      user_id: 'dev-user-3',
      type: 'offer',
      category: 'boende',
      title: 'Vedspis och plats att värma sig',
      description: 'Stort vardagsrum med vedspis. Kan ta emot 8-10 personer.',
      status: 'completed',
      matched_with_user: 'dev-user-1',
      hearts_value: 40,
      created_at: Date.now() - (3 * 24 * 60 * 60 * 1000),
      updated_at: Date.now() - (2 * 24 * 60 * 60 * 1000)
    },
    {
      user_id: 'dev-user-3',
      type: 'offer',
      category: 'annat',
      title: 'Batteriradio och ficklampor',
      description: 'FM/AM-radio med kurbel, samt 3 kraftiga ficklampor.',
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      created_at: Date.now() - (2 * 24 * 60 * 60 * 1000),
      updated_at: Date.now() - (2 * 24 * 60 * 60 * 1000)
    },

    // David's resources (dev-user-4)
    {
      user_id: 'dev-user-4',
      type: 'offer',
      category: 'verktyg',
      title: 'Elverktyg och förlängningssladdar',
      description: 'Borrmaskin, motorsåg, 3x50m förlängningssladdar.',
      status: 'completed',
      matched_with_user: 'dev-user-1',
      hearts_value: 20,
      created_at: Date.now() - (2 * 24 * 60 * 60 * 1000),
      updated_at: Date.now() - (1 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const resource of resources) {
    await db.collection('resources').add(resource);
    console.log(`   ✅ ${resource.title} (${resource.status})`);
  }

  // Create contact requests for response time metrics
  console.log('\n🤝 Creating contact requests...');
  const contacts = [
    {
      from_user: 'dev-user-2',
      to_user: 'dev-user-1',
      status: 'accepted',
      created_at: Date.now() - (6 * 24 * 60 * 60 * 1000),
      responded_at: Date.now() - (6 * 24 * 60 * 60 * 1000) + (30 * 60 * 1000) // 30 min response
    },
    {
      from_user: 'dev-user-3',
      to_user: 'dev-user-1',
      status: 'accepted',
      created_at: Date.now() - (3 * 24 * 60 * 60 * 1000),
      responded_at: Date.now() - (3 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000) // 2 hour response
    },
    {
      from_user: 'dev-user-1',
      to_user: 'dev-user-3',
      status: 'accepted',
      created_at: Date.now() - (2 * 24 * 60 * 60 * 1000),
      responded_at: Date.now() - (2 * 24 * 60 * 60 * 1000) + (15 * 60 * 1000) // 15 min response
    },
    {
      from_user: 'dev-user-4',
      to_user: 'dev-user-1',
      status: 'pending',
      created_at: Date.now(),
      responded_at: null
    }
  ];

  for (const contact of contacts) {
    await db.collection('contact_requests').add(contact);
    console.log(`   ✅ ${contact.from_user} → ${contact.to_user} (${contact.status})`);
  }

  console.log('\n🎉 Dev data seeded successfully!\n');
  
  console.log('📊 Summary:');
  console.log('   • 4 test users created');
  console.log('   • 5 confirmed Hearts transactions');
  console.log('   • 1 pending Hearts transaction');
  console.log('   • 7 resources (3 completed, 4 open)');
  console.log('   • 4 contact requests (3 accepted, 1 pending)\n');

  console.log('🧪 Expected reputation scores (approximate):');
  console.log('   • dev-user-1 (Alice):');
  console.log('     - Hearts given: 65 (25+40)');
  console.log('     - Hearts received: 50 (30+20)');
  console.log('     - Resources shared: 2');
  console.log('     - Completion rate: 50% (1/2 completed)');
  console.log('     - Response time: ~1.25 hours avg');
  console.log('     - Expected score: ~40-45 (Silver)\n');

  console.log('   • dev-user-2 (Bob):');
  console.log('     - Hearts given: 50');
  console.log('     - Hearts received: 25');
  console.log('     - Resources shared: 2');
  console.log('     - Completion rate: 50% (1/2 completed)');
  console.log('     - Response time: N/A');
  console.log('     - Expected score: ~30-35 (Silver)\n');

  console.log('   • dev-user-3 (Clara):');
  console.log('     - Hearts given: 30');
  console.log('     - Hearts received: 90 (50+40)');
  console.log('     - Resources shared: 2');
  console.log('     - Completion rate: 50% (1/2 completed)');
  console.log('     - Response time: ~15 min (very fast!)');
  console.log('     - Expected score: ~45-50 (Silver/Gold)\n');

  console.log('   • dev-user-4 (David):');
  console.log('     - Hearts given: 20');
  console.log('     - Hearts received: 0');
  console.log('     - Resources shared: 1');
  console.log('     - Completion rate: 100% (1/1 completed)');
  console.log('     - Response time: N/A');
  console.log('     - Expected score: ~20-25 (Bronze/Silver)\n');

  console.log('🚀 Next steps:');
  console.log('   1. Run app: npx expo start');
  console.log('   2. Go to Profile screen');
  console.log('   3. Click test button to calculate reputation');
  console.log('   4. Check Firestore Console for reputation field');
  console.log('   5. Verify scores match expectations\n');

  process.exit(0);
}

seedDevData().catch(error => {
  console.error('❌ Error seeding data:', error);
  process.exit(1);
});
