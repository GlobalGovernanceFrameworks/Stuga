const { onDocumentUpdated, onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onCall } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');

admin.initializeApp();

// Region configuration for all functions
// europe-north1 = Finland (Hamina) - closest available Cloud Functions region
// Note: Firestore is in europe-north2 (Stockholm), but Cloud Functions v2
// does not support europe-north2. Finland is geographically closest (~450km).
const REGION = 'europe-north1';

// ============================================================================
// HEARTS BALANCE FUNCTIONS (Existing)
// ============================================================================

// Update user's Hearts balance when transaction confirmed
exports.updateHeartsBalance = onDocumentUpdated({
  document: 'hearts_transactions/{txId}',
  region: REGION
}, async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  
  // Trigger when receiver confirms
  if (!before.confirmed_by_receiver && after.confirmed_by_receiver) {
    const batch = admin.firestore().batch();
    
    try {
      // Find sender document
      const sendersSnapshot = await admin.firestore()
        .collection('users')
        .where('user_id', '==', after.from_user)
        .get();
      
      if (sendersSnapshot.empty) {
        console.error('❌ Sender not found:', after.from_user);
        return;
      }

      const senderDoc = sendersSnapshot.docs[0];
      const senderData = senderDoc.data();
      const senderRef = senderDoc.ref;

      // VALIDATION: Check sender has sufficient balance
      if (senderData.hearts_balance < after.amount) {
        console.error(`❌ Insufficient balance: ${senderData.name} has ${senderData.hearts_balance}, needs ${after.amount}`);
        
        // Mark transaction as failed
        const txRef = admin.firestore().doc(`hearts_transactions/${event.params.txId}`);
        await txRef.update({
          confirmed_by_receiver: false, // Revert confirmation
          error: 'Insufficient balance'
        });
        
        return; // Abort transaction
      }

      // Deduct from sender
      batch.update(senderRef, {
        hearts_balance: admin.firestore.FieldValue.increment(-after.amount)
      });
      
      // Find receiver document
      const receiversSnapshot = await admin.firestore()
        .collection('users')
        .where('user_id', '==', after.to_user)
        .get();
      
      if (!receiversSnapshot.empty) {
        const receiverRef = receiversSnapshot.docs[0].ref;
        batch.update(receiverRef, {
          hearts_balance: admin.firestore.FieldValue.increment(after.amount)
        });
      }
      
      // Mark transaction complete
      const txRef = admin.firestore().doc(`hearts_transactions/${event.params.txId}`);
      batch.update(txRef, {
        completed_at: admin.firestore.FieldValue.serverTimestamp()
      });
      
      await batch.commit();
      console.log(`✅ Updated Hearts balances for transaction ${event.params.txId}`);
      
      // 🆕 TRIGGER REPUTATION RECALCULATION
      await Promise.all([
        calculateReputationForUser(after.from_user),
        calculateReputationForUser(after.to_user)
      ]);
      
    } catch (error) {
      console.error('Error updating Hearts balances:', error);
    }
  }
});

// Send notification when Hearts received
exports.notifyHeartsReceived = onDocumentCreated({
  document: 'hearts_transactions/{txId}',
  region: REGION
}, async (event) => {
  const tx = event.data.data();
  console.log(`💖 Hearts transaction created: ${tx.from_user} → ${tx.to_user} (${tx.amount} Hearts)`);
  
  try {
    // Get receiver's fcm_token
    const receiversSnapshot = await admin.firestore()
      .collection('users')
      .where('user_id', '==', tx.to_user)
      .get();
    
    if (receiversSnapshot.empty) {
      console.log('ℹ️ Receiver not found');
      return;
    }
    
    const receiver = receiversSnapshot.docs[0].data();
    if (!receiver.fcm_token) {
      console.log('ℹ️ Receiver has no FCM token');
      return;
    }
    
    // Get sender's name
    const sendersSnapshot = await admin.firestore()
      .collection('users')
      .where('user_id', '==', tx.from_user)
      .get();
    
    const senderName = !sendersSnapshot.empty 
      ? sendersSnapshot.docs[0].data().name 
      : 'En granne';
    
    // Send notification
    await admin.messaging().send({
      token: receiver.fcm_token,
      notification: {
        title: '💖 Hearts mottagna!',
        body: `${senderName} skickade ${tx.amount} Hearts${tx.reason ? ': ' + tx.reason : ''}`
      },
      data: {
        type: 'hearts_received',
        transactionId: event.params.txId,
        amount: String(tx.amount)
      },
      android: {
        notification: {
          icon: 'notification_icon',
          color: '#2D5016',
          channelId: 'hearts_transactions'
        }
      }
    });
    
    console.log(`✅ Sent Hearts notification to ${receiver.name}`);
    
  } catch (error) {
    console.error('❌ Error sending Hearts notification:', error);
  }
});

// Send notification when urgent resource posted
exports.notifyUrgentResource = onDocumentCreated({
  document: 'resources/{resourceId}',
  region: REGION
}, async (event) => {
  const resource = event.data.data();
  
  console.log(`📦 Resource created: ${resource.title} by ${resource.user_id}`);
  
  // Only notify for urgent resources (< 24h expiry)
  if (!resource.expires_at) {
    console.log('ℹ️ No expiry, skipping notification');
    return;
  }
  
  const hoursUntilExpiry = (resource.expires_at - Date.now()) / 3600000;
  if (hoursUntilExpiry > 24) {
    console.log(`ℹ️ Not urgent (${Math.round(hoursUntilExpiry)}h), skipping notification`);
    return;
  }
  
  try {
    // Get creator's location
    const creatorsSnapshot = await admin.firestore()
      .collection('users')
      .where('user_id', '==', resource.user_id)
      .get();
    
    if (creatorsSnapshot.empty) {
      console.error('❌ Creator not found:', resource.user_id);
      return;
    }
    
    const creator = creatorsSnapshot.docs[0].data();
    if (!creator.location) {
      console.log('ℹ️ Creator has no location');
      return;
    }
    
    // Get all users with fcm_token
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('fcm_token', '!=', null)
      .get();
    
    const tokens = [];
    
    usersSnapshot.forEach(doc => {
      const user = doc.data();
      
      // Skip creator
      if (user.user_id === resource.user_id) return;
      
      // Skip users without location
      if (!user.location) return;
      
      // Calculate distance (Haversine formula simplified)
      const lat1 = creator.location.lat;
      const lon1 = creator.location.lon;
      const lat2 = user.location.lat;
      const lon2 = user.location.lon;
      
      const R = 6371e3; // Earth radius in meters
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lon2 - lon1) * Math.PI / 180;
      
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      // Only notify if within 500m
      if (distance <= 500) {
        tokens.push(user.fcm_token);
      }
    });
    
    if (tokens.length === 0) {
      console.log('ℹ️ No nearby users to notify');
      return;
    }
    
    // Category labels
    const categoryLabels = {
      'mat': 'Mat 🥪',
      'värme': 'Värme 🔥',
      'verktyg': 'Verktyg 🔨',
      'transport': 'Transport 🚗',
      'kunskap': 'Kunskap 📚',
      'boende': 'Boende 🏠',
      'första_hjälpen': 'Första hjälpen ⚕️',
      'annat': 'Annat'
    };
    
    const categoryLabel = categoryLabels[resource.category] || resource.category;
    const resourceType = resource.type === 'need' ? 'behövs' : 'erbjuds';
    
    // Send notifications
    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: `🔴 ${categoryLabel} ${resourceType}`,
        body: `${resource.title} • ${Math.round(hoursUntilExpiry)} tim kvar`
      },
      data: {
        type: 'urgent_resource',
        resourceId: event.params.resourceId,
        category: resource.category
      },
      android: {
        priority: 'high',
        notification: {
          icon: 'notification_icon',
          color: '#2D5016',
          channelId: 'urgent_resources'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    });
    
    console.log(`✅ Sent notifications to ${tokens.length} nearby users`);
    
  } catch (error) {
    console.error('❌ Error sending notifications:', error);
  }
});

// ============================================================================
// REPUTATION SYSTEM (New)
// ============================================================================

/**
 * Calculate reputation score for a user
 * Called automatically when relevant data changes
 */
async function calculateReputationForUser(userId) {
  try {
    console.log(`📊 Calculating reputation for: ${userId}`);
    
    // 1. Get Hearts metrics
    const heartsMetrics = await getHeartsMetrics(userId);
    
    // 2. Get Resources metrics
    const resourcesMetrics = await getResourcesMetrics(userId);
    
    // 3. Get Response time metrics
    const responseTime = await getResponseTimeMetrics(userId);
    
    // 4. Calculate score
    const metrics = {
      hearts_given: heartsMetrics.given,
      hearts_received: heartsMetrics.received,
      resources_shared: resourcesMetrics.total,
      response_time_avg: responseTime,
      completion_rate: resourcesMetrics.completionRate,
      active_days: 0 // TODO: Track activity days
    };
    
    const score = calculateScore(metrics);
    const level = getReputationLevel(score);
    const badges = calculateBadges(metrics);
    
    const reputation = {
      score,
      level,
      metrics,
      badges,
      calculated_at: Date.now(),
      calculated_by: 'server'
    };
    
    // 5. Update user document
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('user_id', '==', userId)
      .get();
    
    if (usersSnapshot.empty) {
      console.error('❌ User not found:', userId);
      return null;
    }
    
    const userRef = usersSnapshot.docs[0].ref;
    await userRef.update({ reputation });
    
    console.log(`✅ Updated reputation for ${userId}: ${level} (${score}/100)`);
    
    return reputation;
    
  } catch (error) {
    console.error('❌ Error calculating reputation:', error);
    return null;
  }
}

/**
 * Get Hearts given and received (confirmed only)
 */
async function getHeartsMetrics(userId) {
  try {
    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      admin.firestore()
        .collection('hearts_transactions')
        .where('from_user', '==', userId)
        .where('confirmed_by_receiver', '==', true)
        .get(),
      admin.firestore()
        .collection('hearts_transactions')
        .where('to_user', '==', userId)
        .where('confirmed_by_receiver', '==', true)
        .get()
    ]);
    
    const given = sentSnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().amount || 0);
    }, 0);
    
    const received = receivedSnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().amount || 0);
    }, 0);
    
    return { given, received };
    
  } catch (error) {
    console.error('Error getting Hearts metrics:', error);
    return { given: 0, received: 0 };
  }
}

/**
 * Get resources shared and completion rate
 */
async function getResourcesMetrics(userId) {
  try {
    const snapshot = await admin.firestore()
      .collection('resources')
      .where('user_id', '==', userId)
      .get();
    
    const total = snapshot.size;
    
    if (total === 0) {
      return { total: 0, completionRate: 0 };
    }
    
    const completed = snapshot.docs.filter(doc => {
      return doc.data().status === 'completed';
    }).length;
    
    const completionRate = completed / total;
    
    return { total, completionRate };
    
  } catch (error) {
    console.error('Error getting resources metrics:', error);
    return { total: 0, completionRate: 0 };
  }
}

/**
 * Get average response time to contact requests (in hours)
 */
async function getResponseTimeMetrics(userId) {
  try {
    const snapshot = await admin.firestore()
      .collection('contact_requests')
      .where('to_user', '==', userId)
      .where('status', '==', 'accepted')
      .get();
    
    if (snapshot.empty) {
      return 0;
    }
    
    const responseTimes = snapshot.docs.map(doc => {
      const data = doc.data();
      const responseTime = (data.responded_at - data.created_at) / (1000 * 60 * 60); // hours
      return responseTime;
    });
    
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    
    return avgResponseTime;
    
  } catch (error) {
    console.error('Error getting response time metrics:', error);
    return 0;
  }
}

/**
 * Calculate overall reputation score (0-100)
 */
function calculateScore(metrics) {
  let score = 0;
  
  // Hearts given (max 30 points)
  score += Math.min(30, metrics.hearts_given * 0.3);
  
  // Hearts received (max 30 points)
  score += Math.min(30, metrics.hearts_received * 0.3);
  
  // Resources shared (max 20 points)
  score += Math.min(20, metrics.resources_shared * 2);
  
  // Completion rate (max 10 points)
  score += metrics.completion_rate * 10;
  
  // Response time bonus (max 10 points)
  if (metrics.response_time_avg === 0) {
    score += 5; // No contact requests yet - neutral
  } else if (metrics.response_time_avg < 1) {
    score += 10; // < 1 hour - excellent
  } else if (metrics.response_time_avg < 6) {
    score += 7; // < 6 hours - good
  } else if (metrics.response_time_avg < 24) {
    score += 4; // < 1 day - acceptable
  } else {
    score += 2; // > 1 day - slow
  }
  
  return Math.round(score);
}

/**
 * Determine reputation level based on score
 */
function getReputationLevel(score) {
  if (score >= 75) return 'platinum';
  if (score >= 50) return 'gold';
  if (score >= 25) return 'silver';
  return 'bronze';
}

/**
 * Calculate earned badges based on metrics
 */
function calculateBadges(metrics) {
  const badges = [];
  
  if (metrics.hearts_given >= 100) badges.push('generous_giver');
  if (metrics.hearts_received >= 100) badges.push('valued_neighbor');
  if (metrics.resources_shared >= 10) badges.push('active_sharer');
  if (metrics.response_time_avg > 0 && metrics.response_time_avg < 2) badges.push('quick_responder');
  if (metrics.resources_shared > 0 && metrics.completion_rate >= 0.8) badges.push('reliable_neighbor');
  if (metrics.hearts_given >= 50) badges.push('helper');
  if (metrics.hearts_given >= 50 && metrics.hearts_received >= 50) badges.push('community_builder');
  
  return badges;
}

// ============================================================================
// REPUTATION TRIGGERS
// ============================================================================

/**
 * Recalculate reputation when resource status changes
 */
exports.onResourceStatusChange = onDocumentUpdated({
  document: 'resources/{resourceId}',
  region: REGION
}, async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  
  // Trigger when status changes
  if (before.status !== after.status) {
    console.log(`📦 Resource status changed: ${before.status} → ${after.status}`);
    await calculateReputationForUser(after.user_id);
  }
});

/**
 * Recalculate reputation when contact request is accepted
 */
exports.onContactRequestAccepted = onDocumentUpdated({
  document: 'contact_requests/{requestId}',
  region: REGION
}, async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  
  // Trigger when accepted
  if (before.status !== 'accepted' && after.status === 'accepted') {
    console.log(`🤝 Contact request accepted`);
    await calculateReputationForUser(after.to_user);
  }
});

// ============================================================================
// CALLABLE FUNCTIONS
// ============================================================================

/**
 * Manual reputation calculation (for testing/debugging)
 */
exports.calculateReputation = onCall({
  region: REGION
}, async (request) => {
  const userId = request.data.userId;
  
  if (!userId) {
    throw new Error('userId is required');
  }
  
  console.log(`🔧 Manual reputation calculation requested for: ${userId}`);
  
  const reputation = await calculateReputationForUser(userId);
  
  return {
    success: reputation !== null,
    reputation
  };
});

/**
 * Bulk recalculate reputation for all users
 */
exports.recalculateAllReputations = onCall({
  region: REGION
}, async (request) => {
  console.log('🔄 Bulk reputation recalculation started');
  
  try {
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .get();
    
    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const reputation = await calculateReputationForUser(userData.user_id);
      
      processed++;
      if (reputation) {
        succeeded++;
      } else {
        failed++;
      }
      
      // Log progress every 10 users
      if (processed % 10 === 0) {
        console.log(`Progress: ${processed}/${usersSnapshot.size} users`);
      }
    }
    
    console.log(`✅ Bulk recalculation complete: ${succeeded} succeeded, ${failed} failed`);
    
    return {
      success: true,
      total: usersSnapshot.size,
      succeeded,
      failed
    };
    
  } catch (error) {
    console.error('❌ Bulk recalculation error:', error);
    throw new Error('Bulk recalculation failed');
  }
});
