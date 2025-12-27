import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { colors, spacing, typography } from '../theme';
import StatusIndicator from '../components/StatusIndicator';
import NeighborCard from '../components/NeighborCard';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { neighbors } from '../data/mockData';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>☰ Stuga</Text>
        <StatusIndicator status="offline" />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>🏘 GRANNAR ({neighbors.length} INOM 500M)</Text>
        
        {neighbors.map((neighbor) => (
          <NeighborCard
            key={neighbor.id}
            neighbor={neighbor}
            onPress={() => navigation.navigate('NeighborDetail', { neighbor })}
          />
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <View style={styles.meshStatus}>
          <Text style={styles.meshText}>Senast synkad: 2 tim sedan</Text>
          <Text style={styles.meshText}>🔵🔵🔵⚪️⚪️ (3 noder nåbara)</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="➕ Lägg till resurs"
            onPress={() => navigation.navigate('AddResource')}
            style={styles.button}
          />
          <SecondaryButton
            title="💖 Skicka Hearts"
            onPress={() => navigation.navigate('SendHearts')}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appName: {
    ...typography.h2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  meshStatus: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  meshText: {
    ...typography.bodySmall,
  },
  buttonContainer: {
    // gap: spacing.sm, // Not supported in all RN versions
  },
  button: {
    marginBottom: spacing.sm,
  },
});

export default HomeScreen;
