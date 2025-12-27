import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { PrimaryButton, SecondaryButton } from '../components/Button';

const NeighborDetailScreen = ({ route, navigation }) => {
  const { neighbor } = route.params;

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topSpacer} />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButton}>← Tillbaka</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profilePhotoContainer}>
            <View style={styles.profilePhoto}>
              <Text style={styles.initials}>
                {neighbor.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          </View>
          
          <View style={styles.nameRow}>
            <Text style={styles.name}>{neighbor.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          </View>
          
          <Text style={styles.info}>
            {neighbor.distance}m {neighbor.direction} · 💗 {neighbor.heartsBalance} Hearts
          </Text>
        </View>

        {/* Resources Section */}
        <View style={styles.divider} />
        
        <Text style={styles.sectionHeader}>
          {neighbor.resources[0]?.type === 'offer' ? 'ERBJUDER' : 'BEHÖVER'}
        </Text>

        {neighbor.resources.map((resource) => (
          <View key={resource.id} style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>
              {resource.category === 'värme' && '🔥'} {resource.title}
            </Text>
            <Text style={styles.resourceDescription}>"{resource.description}"</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="💬 Kontakta"
          onPress={() => {/* Contact flow */}}
          style={styles.button}
        />
        <SecondaryButton
          title="💖 Skicka Hearts (tack)"
          onPress={() => navigation.navigate('SendHearts', { neighbor })}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSpacer: {
    height: Platform.OS === 'ios' ? 0 : spacing.sm,
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 4,
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    minHeight: 56,
  },
  backButton: {
    ...typography.body,
    color: colors.forestGreen,
    fontWeight: '600',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profilePhotoContainer: {
    marginBottom: spacing.md,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1F5DD',
    borderWidth: 3,
    borderColor: colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.h1,
    color: colors.forestGreen,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.h1,
    marginRight: spacing.sm,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  info: {
    ...typography.bodySmall,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  sectionHeader: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  resourceCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  resourceTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  resourceDescription: {
    ...typography.bodySmall,
    fontStyle: 'italic',
  },
  bottomContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
  },
  button: {
    marginBottom: spacing.sm,
  },
});

export default NeighborDetailScreen;
