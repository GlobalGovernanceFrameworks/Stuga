import { collection, query, where, getDocs, addDoc, updateDoc, doc, or } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ContactRequest } from '../types';

// Check contact status between two users
export async function getContactStatus(
  currentUserId: string,
  otherUserId: string
): Promise<'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'declined'> {
  try {
    // Check for any existing contact request in either direction
    const q = query(
      collection(db, 'contact_requests'),
      or(
        where('from_user', '==', currentUserId),
        where('to_user', '==', currentUserId)
      )
    );

    const snapshot = await getDocs(q);
    
    // Find request involving both users
    const request = snapshot.docs.find(doc => {
      const data = doc.data();
      return (
        (data.from_user === currentUserId && data.to_user === otherUserId) ||
        (data.from_user === otherUserId && data.to_user === currentUserId)
      );
    });

    if (!request) return 'none';

    const data = request.data() as ContactRequest;
    
    if (data.status === 'accepted') return 'accepted';
    if (data.status === 'declined') return 'declined';
    
    // Pending - check direction
    if (data.from_user === currentUserId) return 'pending_sent';
    return 'pending_received';
    
  } catch (error) {
    console.error('Error getting contact status:', error);
    return 'none';
  }
}

// Send contact request
export async function sendContactRequest(
  fromUserId: string,
  toUserId: string,
  message?: string
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'contact_requests'), {
      from_user: fromUserId,
      to_user: toUserId,
      status: 'pending',
      created_at: Date.now(),
      message: message || ''
    });
    
    console.log('✅ Contact request sent:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error sending contact request:', error);
    throw error;
  }
}

// Accept contact request
export async function acceptContactRequest(requestId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'contact_requests', requestId), {
      status: 'accepted',
      responded_at: Date.now()
    });
    
    console.log('✅ Contact request accepted:', requestId);
  } catch (error) {
    console.error('Error accepting contact request:', error);
    throw error;
  }
}

// Decline contact request
export async function declineContactRequest(requestId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'contact_requests', requestId), {
      status: 'declined',
      responded_at: Date.now()
    });
    
    console.log('✅ Contact request declined:', requestId);
  } catch (error) {
    console.error('Error declining contact request:', error);
    throw error;
  }
}

// Get pending contact requests for user
export async function getPendingContactRequests(userId: string): Promise<ContactRequest[]> {
  try {
    const q = query(
      collection(db, 'contact_requests'),
      where('to_user', '==', userId),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContactRequest[];
  } catch (error) {
    console.error('Error getting pending requests:', error);
    return [];
  }
}
