// src/components/ReputationCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, Chip } from 'react-native-paper';
import type { Reputation } from '../lib/reputationHelpers';
import {
  getReputationLevelLabel,
  getReputationLevelIcon,
  getReputationLevelColor,
  getBadgeLabel,
  getBadgeIcon,
  getPointsToNextLevel,
  formatReputationScore
} from '../lib/reputationHelpers';

interface ReputationCardProps {
  reputation: Reputation;
  showDetails?: boolean;
  compact?: boolean;
}

export default function ReputationCard({ 
  reputation, 
  showDetails = true,
  compact = false 
}: ReputationCardProps) {
  const levelIcon = getReputationLevelIcon(reputation.level);
  const levelLabel = getReputationLevelLabel(reputation.level);
  const levelColor = getReputationLevelColor(reputation.level);
  const pointsToNext = getPointsToNextLevel(reputation.score, reputation.level);
  
  // Compact version (for cards in lists)
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={[styles.compactLevel, { color: levelColor }]}>
          {levelIcon} {levelLabel}
        </Text>
        <Text style={styles.compactScore}>
          {reputation.score}/100
        </Text>
      </View>
    );
  }
  
  // Full version (for detail screens)
  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header: Level & Score */}
        <View style={styles.header}>
          <View style={styles.levelSection}>
            <Text style={styles.levelIcon}>{levelIcon}</Text>
            <View>
              <Text style={[styles.levelLabel, { color: levelColor }]}>
                {levelLabel}
              </Text>
              <Text style={styles.scoreText}>
                {formatReputationScore(reputation.score)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Progress to Next Level */}
        {pointsToNext > 0 && (
          <View style={styles.progressSection}>
            <ProgressBar
              progress={reputation.score / 100}
              color={levelColor}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {pointsToNext} poäng till nästa nivå
            </Text>
          </View>
        )}
        
        {/* Badges */}
        {reputation.badges.length > 0 && (
          <View style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>Utmärkelser</Text>
            <View style={styles.badgesContainer}>
              {reputation.badges.map(badge => (
                <Chip
                  key={badge}
                  mode="outlined"
                  style={styles.badge}
                  textStyle={styles.badgeText}
                >
                  {getBadgeIcon(badge)} {getBadgeLabel(badge)}
                </Chip>
              ))}
            </View>
          </View>
        )}
        
        {/* Detailed Metrics */}
        {showDetails && (
          <View style={styles.metricsSection}>
            <Text style={styles.sectionTitle}>Aktivitet</Text>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>💝 Hearts givna</Text>
              <Text style={styles.metricValue}>{reputation.metrics.hearts_given}</Text>
            </View>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>💖 Hearts mottagna</Text>
              <Text style={styles.metricValue}>{reputation.metrics.hearts_received}</Text>
            </View>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>📦 Resurser delade</Text>
              <Text style={styles.metricValue}>{reputation.metrics.resources_shared}</Text>
            </View>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>✅ Slutförda</Text>
              <Text style={styles.metricValue}>
                {(reputation.metrics.completion_rate * 100).toFixed(0)}%
              </Text>
            </View>
            
            {reputation.metrics.response_time_avg > 0 && (
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>⚡ Svarstid</Text>
                <Text style={styles.metricValue}>
                  {reputation.metrics.response_time_avg < 1 
                    ? `${(reputation.metrics.response_time_avg * 60).toFixed(0)} min`
                    : `${reputation.metrics.response_time_avg.toFixed(1)} tim`
                  }
                </Text>
              </View>
            )}
          </View>
        )}
        
        {/* Last Updated */}
        <Text style={styles.timestamp}>
          Uppdaterad {new Date(reputation.calculated_at).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  compactLevel: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  compactScore: {
    fontSize: 14,
    color: '#666'
  },
  header: {
    marginBottom: 16
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  levelIcon: {
    fontSize: 48
  },
  levelLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  scoreText: {
    fontSize: 16,
    color: '#666'
  },
  progressSection: {
    marginBottom: 16
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  badgesSection: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  badge: {
    marginBottom: 4
  },
  badgeText: {
    fontSize: 12
  },
  metricsSection: {
    marginTop: 8
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  metricLabel: {
    fontSize: 14,
    color: '#333'
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016'
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic'
  }
});
