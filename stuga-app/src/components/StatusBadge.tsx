import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface StatusBadgeProps {
  status: 'open' | 'matched' | 'completed' | 'cancelled';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    open: { label: 'Öppen', color: '#6BCF7F', icon: '🟢' },
    matched: { label: 'Matchad', color: '#FFA500', icon: '🟡' },
    completed: { label: 'Slutförd', color: '#999', icon: '⚪' },
    cancelled: { label: 'Avbruten', color: '#C1121F', icon: '🔴' }
  };

  const { label, color, icon } = config[status];

  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.badgeText, { color }]}>
        {icon} {label}
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
