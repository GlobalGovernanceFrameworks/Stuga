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

async function updateLocations() {
  // First, get all user documents to see their IDs
  const snapshot = await db.collection('users').get();
  
  console.log('Current users:');
  snapshot.docs.forEach(doc => {
    console.log(`- ${doc.id}: ${doc.data().name}`);
  });

  const updates = [
    {
      name: 'Anna Svensson',
      location: {
        lat: 59.516158,
        lon: 17.908897,
        accuracy: 50,
        updated_at: Date.now()
      }
    },
    {
      name: 'Sven Andersson',
      location: {
        lat: 59.517326,
        lon: 17.910821,
        accuracy: 50,
        updated_at: Date.now()
      }
    },
    {
      name: 'Maria Johansson',
      location: {
        lat: 59.517208,
        lon: 17.914544,
        accuracy: 50,
        updated_at: Date.now()
      }
    },
    {
      name: 'Lars Bergström',
      location: {
        lat: 59.516224,
        lon: 17.914966,
        accuracy: 50,
        updated_at: Date.now()
      },
    }
  ];

  for (const update of updates) {
    // Find user by name
    const userSnapshot = await db.collection('users')
      .where('name', '==', update.name)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      console.log(`⚠️ User not found: ${update.name}`);
      continue;
    }

    const userDoc = userSnapshot.docs[0];
    await userDoc.ref.update({
      location: update.location
    });
    console.log(`✅ Updated ${update.name}`);
  }

  console.log('🎉 All locations updated!');
  process.exit(0);
}

updateLocations();
