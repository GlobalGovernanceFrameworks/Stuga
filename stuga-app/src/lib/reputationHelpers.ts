import { db, functions } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Reputation } from '../types';

// ============================================================================
// CLOUD FUNCTIONS API
// ============================================================================

/**
 * Get reputation from Firestore (server-calculated)
 */
export async function getReputation(userId: string): Promise<Reputation | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      console.log('User not found:', userId);
      return null;
    }
    
    const userData = userDoc.data();
    const reputation = userData.reputation;
    
    if (!reputation) {
      console.log('No reputation calculated yet for:', userId);
      return null;
    }
    
    // Verify it's server-calculated
    if (reputation.calculated_by !== 'server') {
      console.warn('⚠️ Reputation not verified by server for:', userId);
    }
    
    return reputation as Reputation;
  } catch (error) {
    console.error('Error getting reputation:', error);
    return null;
  }
}

/**
 * Trigger manual reputation calculation via Cloud Function
 */
export async function triggerReputationCalculation(userId: string): Promise<Reputation | null> {
  try {
    console.log('Triggering reputation calculation for:', userId);
    
    const calculateReputation = httpsCallable(functions, 'calculateReputation');
    const result = await calculateReputation({ userId });
    
    const data = result.data as any;
    
    if (!data || !data.reputation) {
      console.error('No reputation data returned from Cloud Function');
      return null;
    }
    
    console.log('✅ Reputation calculated:', data.reputation);
    return data.reputation as Reputation;
  } catch (error) {
    console.error('Error triggering reputation calculation:', error);
    throw error;
  }
}

/**
 * Trigger bulk recalculation of all users (admin only)
 */
export async function recalculateAllReputations(): Promise<{
  total: number;
  succeeded: number;
  failed: number;
} | null> {
  try {
    console.log('🔄 Starting bulk reputation recalculation...');
    
    const recalculateAll = httpsCallable(functions, 'recalculateAllReputations');
    const result = await recalculateAll();
    
    const data = result.data as any;
    
    if (!data) {
      console.error('No data returned from bulk recalculation');
      return null;
    }
    
    console.log('✅ Bulk recalculation complete:', data);
    return {
      total: data.total || 0,
      succeeded: data.succeeded || 0,
      failed: data.failed || 0
    };
  } catch (error) {
    console.error('Error in bulk recalculation:', error);
    throw error;
  }
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

/**
 * Get Swedish label for reputation level
 */
export function getReputationLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    'bronze': 'Brons',
    'silver': 'Silver',
    'gold': 'Guld',
    'platinum': 'Platina'
  };
  return labels[level] || 'Okänd';
}

/**
 * Get emoji icon for reputation level
 */
export function getReputationLevelIcon(level: string): string {
  const icons: Record<string, string> = {
    'bronze': '🥉',
    'silver': '🥈',
    'gold': '🥇',
    'platinum': '💎'
  };
  return icons[level] || '❓';
}

/**
 * Get Swedish label for badge
 */
export function getBadgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    'generous_giver': 'Generös givare',
    'valued_neighbor': 'Värderad granne',
    'active_sharer': 'Aktiv delningsgranne',
    'quick_responder': 'Snabb responsare',
    'reliable_neighbor': 'Pålitlig granne',
    'helper': 'Hjälpare',
    'community_builder': 'Samhällsbyggare'
  };
  return labels[badge] || badge;
}

/**
 * Get emoji icon for badge
 */
export function getBadgeIcon(badge: string): string {
  const icons: Record<string, string> = {
    'generous_giver': '🎁',
    'valued_neighbor': '⭐',
    'active_sharer': '📦',
    'quick_responder': '⚡',
    'reliable_neighbor': '✅',
    'helper': '🤝',
    'community_builder': '🏘️'
  };
  return icons[badge] || '🏆';
}

/**
 * Get color for reputation level
 */
export function getReputationLevelColor(level: string): string {
  const colors: Record<string, string> = {
    'bronze': '#CD7F32',
    'silver': '#C0C0C0',
    'gold': '#FFD700',
    'platinum': '#E5E4E2'
  };
  return colors[level] || '#999999';
}

/**
 * Calculate points needed to reach next level
 */
export function getPointsToNextLevel(score: number, currentLevel: string): number {
  const thresholds: Record<string, number> = {
    'bronze': 25,
    'silver': 50,
    'gold': 75,
    'platinum': 100
  };
  
  const levels = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return 0; // Already at max level or unknown level
  }
  
  const nextLevel = levels[currentIndex + 1];
  const nextThreshold = thresholds[nextLevel];
  
  return Math.max(0, nextThreshold - score);
}

/**
 * Get personalized tips for improving reputation
 */
export function getReputationTips(reputation: Reputation): string[] {
  const tips: string[] = [];
  const { metrics, badges } = reputation;
  
  // Hearts tips
  if (metrics.hearts_given < 50 && !badges.includes('helper')) {
    tips.push('💝 Skicka fler Hearts till grannar som hjälper dig');
  }
  
  if (metrics.hearts_received < 50 && !badges.includes('valued_neighbor')) {
    tips.push('🤝 Hjälp grannar för att få Hearts tillbaka');
  }
  
  // Resources tips
  if (metrics.resources_shared < 5 && !badges.includes('active_sharer')) {
    tips.push('📦 Dela fler resurser med dina grannar');
  }
  
  if (metrics.completion_rate < 0.7) {
    tips.push('✅ Slutför fler av dina delningar för högre tillförlitlighet');
  }
  
  // Response time tips
  if (metrics.response_time_avg > 24 && !badges.includes('quick_responder')) {
    tips.push('⚡ Svara snabbare på kontaktförfrågningar');
  }
  
  // Activity tips
  if (metrics.active_days < 7) {
    tips.push('📅 Använd Stuga regelbundet för att bygga förtroende');
  }
  
  // If already doing great
  if (tips.length === 0) {
    tips.push('🌟 Du är en fantastisk granne! Fortsätt så!');
  }
  
  return tips;
}

/**
 * Format reputation score as percentage
 */
export function formatReputationScore(score: number): string {
  return `${score}/100`;
}

/**
 * Get reputation description for level
 */
export function getReputationDescription(level: string): string {
  const descriptions: Record<string, string> = {
    'bronze': 'Ny granne i området. Fortsätt hjälpa andra för att öka din reputation!',
    'silver': 'Pålitlig granne. Du är på god väg att bli en viktig del av grannskapet!',
    'gold': 'Värderad granne. Du är en viktig tillgång för ditt område!',
    'platinum': 'Exemplarisk granne. Du är en förebild i grannskapet!'
  };
  return descriptions[level] || '';
}
