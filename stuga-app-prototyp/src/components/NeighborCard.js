import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

const NeighborCard = ({ neighbor, onPress }) => {
  const getStatusColor = () => {
    switch (neighbor.connectionType) {
      case 'direct':
        return colors.onlineGreen;
      case 'mesh-1':
        return colors.meshYellow;
      case 'mesh-2':
      default:
        return colors.offlineRed;
    }
  };

  const getResourcesText = () => {
    if (neighbor.resourcesOffered.length > 0) {
      return `Erbjuder: ${neighbor.resourcesOffered.join(', ')}`;
    } else if (neighbor.resourcesNeeded.length > 0) {
      return `Behöver: ${neighbor.resourcesNeeded.join(', ')}`;
    }
    return 'Inga resurser';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, shadows.card]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.name}>{neighbor.name}</Text>
        </View>
        <Text style={styles.distance}>
          {neighbor.distance}m {neighbor.direction}
        </Text>
      </View>
      
      <Text style={styles.resources}>{getResourcesText()}</Text>
      
      <Text style={styles.hearts}>💗 {neighbor.heartsBalance} Hearts</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
  },
  distance: {
    ...typography.bodySmall,
  },
  resources: {
    ...typography.bodySmall,
    marginBottom: spacing.sm,
  },
  hearts: {
    ...typography.bodySmall,
    color: colors.warmOrange,
  },
});

export default NeighborCard;
