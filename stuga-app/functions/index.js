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
  
  // TODO: Add push notifications when FCM tokens are implemented
});
