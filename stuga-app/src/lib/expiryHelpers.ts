// Helper functions for resource expiration and urgency

export type UrgencyLevel = 'expired' | 'urgent' | 'soon' | 'available';

export interface UrgencyInfo {
  level: UrgencyLevel;
  label: string;
  color: string;
  icon: string;
  timeRemaining?: string;
}

// Check if a resource is expired
export function isExpired(expiresAt: number | null | undefined): boolean {
  if (!expiresAt) return false;
  return expiresAt < Date.now();
}

// Calculate urgency level based on time remaining
export function getUrgencyLevel(expiresAt: number | null | undefined): UrgencyLevel {
  if (!expiresAt) return 'available';
  
  const now = Date.now();
  const timeRemaining = expiresAt - now;
  
  if (timeRemaining < 0) return 'expired';
  if (timeRemaining < 24 * 60 * 60 * 1000) return 'urgent'; // < 24 hours
  if (timeRemaining < 7 * 24 * 60 * 60 * 1000) return 'soon'; // < 7 days
  
  return 'available';
}

// Get urgency info with labels, colors, and icons
export function getUrgencyInfo(expiresAt: number | null | undefined): UrgencyInfo {
  const level = getUrgencyLevel(expiresAt);
  
  const configs: Record<UrgencyLevel, Omit<UrgencyInfo, 'level' | 'timeRemaining'>> = {
    expired: {
      label: 'Utgången',
      color: '#999',
      icon: '⚪'
    },
    urgent: {
      label: 'Brådskande',
      color: '#C1121F',
      icon: '🔴'
    },
    soon: {
      label: 'Snart utgången',
      color: '#FFA500',
      icon: '🟡'
    },
    available: {
      label: 'Tillgänglig',
      color: '#6BCF7F',
      icon: '🟢'
    }
  };
  
  return {
    level,
    ...configs[level],
    timeRemaining: expiresAt ? formatTimeRemaining(expiresAt) : undefined
  };
}

// Format time remaining in a human-readable way
export function formatTimeRemaining(expiresAt: number): string {
  const now = Date.now();
  const diff = expiresAt - now;
  
  if (diff < 0) return 'Utgången';
  
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} min kvar`;
  }
  if (hours < 24) {
    return `${hours} tim kvar`;
  }
  if (days === 1) {
    return 'Utgår imorgon';
  }
  if (days < 7) {
    return `${days} dagar kvar`;
  }
  
  // Format as date for longer periods
  return `Utgår ${new Date(expiresAt).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short'
  })}`;
}

// Get quick expiry options (for UI picker)
export function getExpiryOptions(): Array<{ label: string; hours: number }> {
  return [
    { label: 'Ingen utgång', hours: 0 },
    { label: '6 timmar', hours: 6 },
    { label: '24 timmar', hours: 24 },
    { label: '3 dagar', hours: 72 },
    { label: '1 vecka', hours: 168 },
    { label: 'Anpassad...', hours: -1 }
  ];
}

// Calculate expiry timestamp from hours
export function calculateExpiryTimestamp(hours: number): number {
  return Date.now() + (hours * 60 * 60 * 1000);
}
