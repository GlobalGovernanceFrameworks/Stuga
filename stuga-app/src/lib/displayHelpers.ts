import { User } from '../types';
import { formatDistance, formatDistanceFuzzy } from './locationHelpers';

// Get the name to display publicly (before contact acceptance)
export function getDisplayName(user: User): string {
  return user.display_name || user.name;
}

// Get the real name (only after contact acceptance)
export function getRealName(user: User): string {
  return user.name;
}

// Check if user has custom display name
export function hasCustomDisplayName(user: User): boolean {
  return !!user.display_name && !user.display_name.startsWith('Granne #');
}

// Generate default display name
export function generateDefaultDisplayName(): string {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `Granne #${number}`;
}

// Show exact or fuzzy distance based on contact status and privacy settings
export function getDisplayDistance(
  distanceMeters: number,
  contactAccepted: boolean,
  privacyExactDistance: boolean = false
): string {
  // If contact accepted AND user allows exact distance, show exact
  if (contactAccepted && privacyExactDistance) {
    return formatDistance(distanceMeters);
  }
  
  // Otherwise show fuzzy
  return formatDistanceFuzzy(distanceMeters);
}
