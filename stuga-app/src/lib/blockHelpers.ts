import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Block a user
export async function blockUser(currentUserId: string, userIdToBlock: string): Promise<void> {
  try {
    console.log('🚫 Blocking user:', {
      currentUserId,
      userIdToBlock
    });
    
    const userRef = doc(db, 'users', currentUserId);
    await updateDoc(userRef, {
      blocked_users: arrayUnion(userIdToBlock)
    });
    
    console.log('✅ User blocked:', userIdToBlock);
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
}

// Unblock a user
export async function unblockUser(currentUserId: string, userIdToUnblock: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', currentUserId);
    await updateDoc(userRef, {
      blocked_users: arrayRemove(userIdToUnblock)
    });
    
    console.log('✅ User unblocked:', userIdToUnblock);
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
}

// Check if user is blocked
export async function isUserBlocked(currentUserId: string, otherUserId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', currentUserId));
    if (!userDoc.exists()) return false;
    
    const blockedUsers = userDoc.data().blocked_users || [];
    return blockedUsers.includes(otherUserId);
  } catch (error) {
    console.error('Error checking block status:', error);
    return false;
  }
}

// Get list of blocked users
export async function getBlockedUsers(currentUserId: string): Promise<string[]> {
  try {
    const userDoc = await getDoc(doc(db, 'users', currentUserId));
    if (!userDoc.exists()) return [];
    
    return userDoc.data().blocked_users || [];
  } catch (error) {
    console.error('Error getting blocked users:', error);
    return [];
  }
}
