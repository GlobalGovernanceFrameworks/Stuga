const { onDocumentUpdated, onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

// Update user's Hearts balance when transaction confirmed
exports.updateHeartsBalance = onDocumentUpdated('hearts_transactions/{txId}', async (event) => {
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
      
    } catch (error) {
      console.error('Error updating Hearts balances:', error);
    }
  }
});

// Send notification when Hearts received
exports.notifyHeartsReceived = onDocumentCreated('hearts_transactions/{txId}', async (event) => {
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
exports.notifyUrgentResource = onDocumentCreated('resources/{resourceId}', async (event) => {
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
          icon: 'notification_icon', // Uses notification-icon.png
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
