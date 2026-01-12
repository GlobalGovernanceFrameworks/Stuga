// src/screens/ReputationTestScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  getReputation, 
  triggerReputationCalculation,
  recalculateAllReputations,
  getReputationLevelIcon,
  getReputationLevelLabel,
  getBadgeLabel,
  getBadgeIcon
} from '../lib/reputationHelpers';
import { db, auth } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, orderBy, limit, doc } from 'firebase/firestore';

export default function ReputationTestScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // ============================================================================
  // TEST 1: Manual Calculation for Single User
  // ============================================================================
  async function test1ManualCalculation() {
    setLoading(true);
    const results: any[] = [];
    
    try {
      results.push({ type: 'header', text: '🧪 TEST 1: Manual Reputation Calculation' });
      
      const userId = 'dev-user-1'; // Alice
      results.push({ type: 'info', text: `Testing user: ${userId}` });
      
      // Trigger calculation
      results.push({ type: 'action', text: 'Calling Cloud Function...' });
      const reputation = await triggerReputationCalculation(userId);
      
      if (!reputation) {
        results.push({ type: 'error', text: '❌ FAILED: No reputation returned' });
        setTestResults(results);
        setLoading(false);
        return;
      }
      
      // Verify data
      results.push({ type: 'success', text: `✅ SUCCESS: Reputation calculated` });
      results.push({ type: 'data', text: `Score: ${reputation.score}/100` });
      results.push({ type: 'data', text: `Level: ${getReputationLevelIcon(reputation.level)} ${getReputationLevelLabel(reputation.level)}` });
      results.push({ type: 'data', text: `Calculated by: ${reputation.calculated_by}` });
      
      // Metrics
      results.push({ type: 'subheader', text: 'Metrics:' });
      results.push({ type: 'data', text: `  • Hearts given: ${reputation.metrics.hearts_given}` });
      results.push({ type: 'data', text: `  • Hearts received: ${reputation.metrics.hearts_received}` });
      results.push({ type: 'data', text: `  • Resources shared: ${reputation.metrics.resources_shared}` });
      results.push({ type: 'data', text: `  • Completion rate: ${(reputation.metrics.completion_rate * 100).toFixed(0)}%` });
      results.push({ type: 'data', text: `  • Response time: ${reputation.metrics.response_time_avg.toFixed(1)}h` });
      
      // Badges
      if (reputation.badges.length > 0) {
        results.push({ type: 'subheader', text: 'Badges:' });
        reputation.badges.forEach((badge: string) => {
          results.push({ type: 'data', text: `  • ${getBadgeLabel(badge)}` });
        });
      }
      
      // Verify in Firestore
      results.push({ type: 'action', text: 'Verifying in Firestore...' });
      const firestoreRep = await getReputation(userId);
      
      if (firestoreRep?.calculated_by === 'server') {
        results.push({ type: 'success', text: '✅ VERIFIED: Data saved in Firestore with calculated_by="server"' });
      } else {
        results.push({ type: 'error', text: '❌ WARNING: Data in Firestore not marked as server-calculated' });
      }
      
    } catch (error: any) {
      results.push({ type: 'error', text: `❌ ERROR: ${error.message}` });
      console.error('Test 1 error:', error);
    }
    
    setTestResults(results);
    setLoading(false);
  }

  // ============================================================================
  // TEST 2: Automatic Trigger (Hearts Confirmation)
  // ============================================================================
  async function test2AutomaticTrigger() {
    setLoading(true);
    const results: any[] = [];
    
    try {
      results.push({ type: 'header', text: '🧪 TEST 2: Automatic Trigger on Hearts Confirmation' });
      
      const fromUser = 'dev-user-1';
      const toUser = 'dev-user-2';
      
      // Get initial reputation
      results.push({ type: 'action', text: 'Getting initial reputation...' });
      const beforeRep = await getReputation(fromUser);
      const initialScore = beforeRep?.score || 0;
      results.push({ type: 'data', text: `Initial score (${fromUser}): ${initialScore}` });
      
      // Create Hearts transaction
      results.push({ type: 'action', text: 'Creating Hearts transaction...' });
      const txRef = await addDoc(collection(db, 'hearts_transactions'), {
        from_user: fromUser,
        to_user: toUser,
        amount: 10,
        reason: '🧪 Test automatic trigger',
        confirmed_by_sender: true,
        confirmed_by_receiver: false,
        created_at: Date.now(),
        completed_at: null
      });
      results.push({ type: 'success', text: `✅ Transaction created: ${txRef.id}` });
      
      // Confirm transaction (triggers Cloud Function)
      results.push({ type: 'action', text: 'Confirming transaction (should trigger Cloud Function)...' });
      await updateDoc(txRef, {
        confirmed_by_receiver: true
      });
      results.push({ type: 'success', text: '✅ Transaction confirmed' });
      
      // Wait for Cloud Function to execute
      results.push({ type: 'info', text: 'Waiting 3 seconds for Cloud Function...' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get updated reputation
      results.push({ type: 'action', text: 'Getting updated reputation...' });
      const afterRep = await getReputation(fromUser);
      const finalScore = afterRep?.score || 0;
      results.push({ type: 'data', text: `Final score (${fromUser}): ${finalScore}` });
      
      // Verify change
      if (finalScore > initialScore) {
        results.push({ type: 'success', text: `✅ SUCCESS: Score increased by ${finalScore - initialScore} points` });
        results.push({ type: 'success', text: '✅ Automatic trigger is working!' });
      } else {
        results.push({ type: 'error', text: '❌ WARNING: Score did not increase' });
        results.push({ type: 'info', text: 'Check Cloud Functions logs for errors' });
      }
      
    } catch (error: any) {
      results.push({ type: 'error', text: `❌ ERROR: ${error.message}` });
      console.error('Test 2 error:', error);
    }
    
    setTestResults(results);
    setLoading(false);
  }

  // ============================================================================
  // TEST 3: Security Rules
  // ============================================================================
  async function test3SecurityRules() {
    setLoading(true);
    const results: any[] = [];
    
    try {
      results.push({ type: 'header', text: '🧪 TEST 3: Security Rules (Try to Cheat)' });
      
      const user = auth.currentUser;
      if (!user) {
        results.push({ type: 'error', text: '❌ Not authenticated' });
        setTestResults(results);
        setLoading(false);
        return;
      }
      
      results.push({ type: 'info', text: `Testing with user: ${user.uid}` });
      
      // Try to write fake reputation
      results.push({ type: 'action', text: 'Attempting to write fake reputation...' });
      
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          reputation: {
            score: 100,
            level: 'platinum',
            badges: ['cheater', 'hacker'],
            calculated_by: 'client',
            metrics: {
              hearts_given: 999,
              hearts_received: 999,
              resources_shared: 999,
              response_time_avg: 0,
              completion_rate: 1,
              active_days: 999
            }
          }
        });
        
        // If we get here, security failed
        results.push({ type: 'error', text: '❌ CRITICAL BUG: Could write reputation!' });
        results.push({ type: 'error', text: '❌ Security rules are NOT working!' });
        
      } catch (securityError: any) {
        // This is the expected behavior
        results.push({ type: 'success', text: '✅ SUCCESS: Permission denied (as expected)' });
        results.push({ type: 'success', text: '✅ Security rules are working correctly!' });
        results.push({ type: 'data', text: `Error code: ${securityError.code}` });
      }
      
      // Try to update allowed fields
      results.push({ type: 'action', text: 'Testing update of allowed fields...' });
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          availability_status: 'available'
        });
        results.push({ type: 'success', text: '✅ Can update allowed fields (correct)' });
      } catch (error: any) {
        results.push({ type: 'error', text: `❌ Cannot update allowed fields: ${error.message}` });
      }
      
    } catch (error: any) {
      results.push({ type: 'error', text: `❌ ERROR: ${error.message}` });
      console.error('Test 3 error:', error);
    }
    
    setTestResults(results);
    setLoading(false);
  }

  // ============================================================================
  // TEST 4: Bulk Recalculation
  // ============================================================================
  async function test4BulkRecalculation() {
    setLoading(true);
    const results: any[] = [];
    
    try {
      results.push({ type: 'header', text: '🧪 TEST 4: Bulk Recalculation (All Users)' });
      results.push({ type: 'warning', text: '⚠️  This will recalculate ALL users (can be slow)' });
      
      results.push({ type: 'action', text: 'Calling recalculateAllReputations...' });
      const result = await recalculateAllReputations();
      
      if (!result) {
        results.push({ type: 'error', text: '❌ FAILED: No result returned' });
        setTestResults(results);
        setLoading(false);
        return;
      }
      
      results.push({ type: 'success', text: `✅ SUCCESS: Bulk recalculation complete` });
      results.push({ type: 'data', text: `Total users: ${result.total}` });
      results.push({ type: 'data', text: `Succeeded: ${result.succeeded}` });
      results.push({ type: 'data', text: `Failed: ${result.failed}` });
      
      if (result.failed > 0) {
        results.push({ type: 'warning', text: '⚠️  Some users failed - check Cloud Functions logs' });
      }
      
    } catch (error: any) {
      results.push({ type: 'error', text: `❌ ERROR: ${error.message}` });
      console.error('Test 4 error:', error);
    }
    
    setTestResults(results);
    setLoading(false);
  }

  // ============================================================================
  // TEST 5: Verify All Test Users
  // ============================================================================
  async function test5VerifyAllUsers() {
    setLoading(true);
    const results: any[] = [];
    
    try {
      results.push({ type: 'header', text: '🧪 TEST 5: Verify All Test Users' });
      
      const testUsers = ['dev-user-1', 'dev-user-2', 'dev-user-3', 'dev-user-4'];
      
      for (const userId of testUsers) {
        results.push({ type: 'subheader', text: `Checking ${userId}...` });
        
        const reputation = await getReputation(userId);
        
        if (!reputation) {
          results.push({ type: 'error', text: `  ❌ No reputation found` });
          continue;
        }
        
        const icon = getReputationLevelIcon(reputation.level);
        const level = getReputationLevelLabel(reputation.level);
        
        results.push({ type: 'success', text: `  ✅ ${icon} ${level} (${reputation.score}/100)` });
        results.push({ type: 'data', text: `     Hearts: ${reputation.metrics.hearts_given} given, ${reputation.metrics.hearts_received} received` });
        results.push({ type: 'data', text: `     Resources: ${reputation.metrics.resources_shared} (${(reputation.metrics.completion_rate * 100).toFixed(0)}% completed)` });
        
        if (reputation.badges.length > 0) {
          results.push({ type: 'data', text: `     Badges: ${reputation.badges.map(b => getBadgeLabel(b)).join(', ')}` });
        }
      }
      
    } catch (error: any) {
      results.push({ type: 'error', text: `❌ ERROR: ${error.message}` });
      console.error('Test 5 error:', error);
    }
    
    setTestResults(results);
    setLoading(false);
  }

  // ============================================================================
  // Render Test Result
  // ============================================================================
  function renderResult(item: any, index: number) {
    const styles = getResultStyle(item.type);
    
    return (
      <Text key={index} style={styles}>
        {item.text}
      </Text>
    );
  }

  function getResultStyle(type: string) {
    switch (type) {
      case 'header':
        return resultStyles.header;
      case 'subheader':
        return resultStyles.subheader;
      case 'success':
        return resultStyles.success;
      case 'error':
        return resultStyles.error;
      case 'warning':
        return resultStyles.warning;
      case 'action':
        return resultStyles.action;
      case 'data':
        return resultStyles.data;
      case 'info':
      default:
        return resultStyles.info;
    }
  }

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>🧪 Reputation System Tests</Text>
            <Text style={styles.subtitle}>
              Run these tests to verify Cloud Functions are working correctly
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Quick Tests</Text>
            
            <Button
              mode="contained"
              onPress={test1ManualCalculation}
              disabled={loading}
              style={styles.testButton}
              buttonColor="#2D5016"
            >
              Test 1: Manual Calculation
            </Button>
            
            <Button
              mode="contained"
              onPress={test2AutomaticTrigger}
              disabled={loading}
              style={styles.testButton}
              buttonColor="#FF6B35"
            >
              Test 2: Automatic Trigger
            </Button>
            
            <Button
              mode="contained"
              onPress={test3SecurityRules}
              disabled={loading}
              style={styles.testButton}
              buttonColor="#6BCF7F"
            >
              Test 3: Security Rules
            </Button>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Advanced Tests</Text>
            
            <Button
              mode="contained"
              onPress={test4BulkRecalculation}
              disabled={loading}
              style={styles.testButton}
              buttonColor="#0066CC"
            >
              Test 4: Bulk Recalculation
            </Button>
            
            <Button
              mode="contained"
              onPress={test5VerifyAllUsers}
              disabled={loading}
              style={styles.testButton}
              buttonColor="#9B59B6"
            >
              Test 5: Verify All Users
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              onPress={() => setTestResults([])}
              disabled={loading || testResults.length === 0}
              style={styles.testButton}
            >
              Clear Results
            </Button>
          </Card.Content>
        </Card>

        {loading && (
          <Card style={styles.card}>
            <Card.Content style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#2D5016" />
              <Text style={styles.loadingText}>Running test...</Text>
            </Card.Content>
          </Card>
        )}

        {testResults.length > 0 && (
          <Card style={styles.resultsCard}>
            <Card.Content>
              {testResults.map((result, index) => renderResult(result, index))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 12,
    marginTop: 8
  },
  testButton: {
    marginBottom: 12
  },
  divider: {
    marginVertical: 16
  },
  loadingContent: {
    alignItems: 'center',
    paddingVertical: 24
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
  },
  resultsCard: {
    marginBottom: 16,
    backgroundColor: '#F8F9FA'
  }
});

const resultStyles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    marginTop: 16,
    marginBottom: 8
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginTop: 12,
    marginBottom: 4
  },
  success: {
    fontSize: 14,
    color: '#6BCF7F',
    marginBottom: 4,
    lineHeight: 20
  },
  error: {
    fontSize: 14,
    color: '#C1121F',
    marginBottom: 4,
    lineHeight: 20,
    fontWeight: 'bold'
  },
  warning: {
    fontSize: 14,
    color: '#FF6B35',
    marginBottom: 4,
    lineHeight: 20
  },
  action: {
    fontSize: 14,
    color: '#0066CC',
    marginBottom: 4,
    lineHeight: 20,
    fontStyle: 'italic'
  },
  data: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
    lineHeight: 18,
    fontFamily: 'monospace'
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20
  }
});
