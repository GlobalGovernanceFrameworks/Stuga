// calculateAllReputations.js
// Run: node calculateAllReputations.js

const admin = require('firebase-admin');
const { readFileSync } = require('fs');

// Load service account
const serviceAccount = JSON.parse(
  readFileSync('../../functions/stuga-dev-service-account.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'stuga-dev'
});

const db = admin.firestore();

async function calculateReputationForUser(userId) {
  console.log(`\nCalculating reputation for: ${userId}`);
  
  try {
    // Get Hearts metrics (CONFIRMED only)
    const heartsGiven = await db.collection('hearts_transactions')
      .where('from_user', '==', userId)
      .where('confirmed_by_receiver', '==', true)
      .get();
    
    const heartsReceived = await db.collection('hearts_transactions')
      .where('to_user', '==', userId)
      .where('confirmed_by_receiver', '==', true)
      .get();
    
    const heartsGivenTotal = heartsGiven.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    const heartsReceivedTotal = heartsReceived.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    
    // Get Resources metrics
    const resources = await db.collection('resources')
      .where('user_id', '==', userId)
      .get();
    
    const completedResources = resources.docs.filter(doc => doc.data().status === 'completed').length;
    const completionRate = resources.size > 0 ? completedResources / resources.size : 0;
    
    // Get Response time metrics
    const contacts = await db.collection('contact_requests')
      .where('to_user', '==', userId)
      .where('status', '==', 'accepted')
      .get();
    
    let avgResponseTime = 0;
    if (contacts.size > 0) {
      const responseTimes = contacts.docs
        .map(doc => {
          const data = doc.data();
          if (data.responded_at && data.created_at) {
            return (data.responded_at - data.created_at) / (1000 * 60 * 60); // hours
          }
          return null;
        })
        .filter(t => t !== null);
      
      if (responseTimes.length > 0) {
        avgResponseTime = responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length;
      }
    }
    
    // Calculate score (0-100)
    let score = 0;
    
    // Hearts given: max 30 points
    score += Math.min(30, heartsGivenTotal * 0.3);
    
    // Hearts received: max 30 points
    score += Math.min(30, heartsReceivedTotal * 0.3);
    
    // Resources shared: max 20 points
    score += Math.min(20, resources.size * 2);
    
    // Completion rate: max 10 points
    score += completionRate * 10;
    
    // Response time: max 10 points
    if (avgResponseTime > 0) {
      if (avgResponseTime < 1) score += 10;
      else if (avgResponseTime < 6) score += 7;
      else if (avgResponseTime < 24) score += 4;
      else score += 2;
    }
    
    score = Math.round(score);
    
    // Determine level
    let level = 'bronze';
    if (score >= 75) level = 'platinum';
    else if (score >= 50) level = 'gold';
    else if (score >= 25) level = 'silver';
    
    // Determine badges
    const badges = [];
    if (heartsGivenTotal >= 100) badges.push('generous_giver');
    if (heartsReceivedTotal >= 100) badges.push('valued_neighbor');
    if (resources.size >= 10) badges.push('active_sharer');
    if (avgResponseTime > 0 && avgResponseTime < 2) badges.push('quick_responder');
    if (completionRate >= 0.8 && resources.size >= 3) badges.push('reliable_neighbor');
    if (heartsGivenTotal >= 50) badges.push('helper');
    if (heartsGivenTotal >= 50 && heartsReceivedTotal >= 50) badges.push('community_builder');
    
    // Create reputation object
    const reputation = {
      score,
      level,
      metrics: {
        hearts_given: heartsGivenTotal,
        hearts_received: heartsReceivedTotal,
        resources_shared: resources.size,
        completion_rate: completionRate,
        response_time_avg: avgResponseTime,
        active_days: 0
      },
      badges,
      calculated_at: Date.now(),
      calculated_by: 'server'
    };
    
    // Update user document
    await db.collection('users').doc(userId).update({ reputation });
    
    console.log(`✅ ${userId}: ${score}/100 (${level}) - ${badges.length} badges`);
    return reputation;
    
  } catch (error) {
    console.error(`❌ Error calculating for ${userId}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🔄 Calculating reputation for all users...\n');
  
  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`Found ${usersSnapshot.size} users\n`);
    
    let succeeded = 0;
    let failed = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const reputation = await calculateReputationForUser(userId);
      
      if (reputation) {
        succeeded++;
      } else {
        failed++;
      }
    }
    
    console.log(`\n🎉 Done!`);
    console.log(`   ✅ Succeeded: ${succeeded}`);
    console.log(`   ❌ Failed: ${failed}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
