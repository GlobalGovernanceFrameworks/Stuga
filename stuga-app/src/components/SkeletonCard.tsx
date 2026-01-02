import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

export function SkeletonCard() {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.skeleton}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, styles.short]} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  skeleton: {
    gap: 8
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4
  },
  short: {
    width: '60%'
  }
});
