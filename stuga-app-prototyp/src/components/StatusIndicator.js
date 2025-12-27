import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

const StatusIndicator = ({ status = 'offline' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: '🌐',
          label: 'Online',
          backgroundColor: colors.onlineGreen,
        };
      case 'mesh':
        return {
          icon: '📡',
          label: 'Mesh',
          backgroundColor: colors.meshYellow,
        };
      case 'offline':
      default:
        return {
          icon: '📌',
          label: 'Offline',
          backgroundColor: colors.offlineRed,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <Text style={styles.text}>
        {config.icon} {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default StatusIndicator;
