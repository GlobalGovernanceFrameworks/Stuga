import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getUrgencyInfo } from '../lib/expiryHelpers';

interface UrgencyBadgeProps {
  expiresAt: number | null | undefined;
  showTimeRemaining?: boolean;
}

export function UrgencyBadge({ expiresAt, showTimeRemaining = false }: UrgencyBadgeProps) {
  const urgency = getUrgencyInfo(expiresAt);
  
  // Don't show badge for expired resources (they should be filtered out)
  if (urgency.level === 'expired') {
    return null;
  }
  
  // Don't show badge for resources without expiry unless urgent
  if (!expiresAt && urgency.level === 'available') {
    return null;
  }

  return (
    <View style={[styles.badge, { backgroundColor: urgency.color + '20' }]}>
      <Text style={[styles.badgeText, { color: urgency.color }]}>
        {urgency.icon} {urgency.label}
        {showTimeRemaining && urgency.timeRemaining && ` · ${urgency.timeRemaining}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold'
  }
});
