import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator, Divider, Button } from 'react-native-paper';
import { collection, query, where, getDocs, or, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { HeartsTransaction } from '../types';

export default function HeartsHistoryScreen() {
  const [transactions, setTransactions] = useState<HeartsTransaction[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [myBalance, setMyBalance] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  async function loadTransactions() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Get user's balance
      const userDoc = await getDocs(
        query(collection(db, 'users'), where('user_id', '==', user.uid))
      );
      if (!userDoc.empty) {
        setMyBalance(userDoc.docs[0].data().hearts_balance || 0);
      }

      // Get all transactions
      const q = query(
        collection(db, 'hearts_transactions'),
        or(
          where('from_user', '==', user.uid),
          where('to_user', '==', user.uid)
        )
      );

      const snapshot = await getDocs(q);
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HeartsTransaction[];

      // Sort by date (newest first)
      txs.sort((a, b) => b.created_at - a.created_at);
      setTransactions(txs);

      // Fetch all unique user IDs from transactions
      const userIds = new Set<string>();
      txs.forEach(tx => {
        userIds.add(tx.from_user);
        userIds.add(tx.to_user);
      });

      // Fetch user names
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const names: Record<string, string> = {};
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (userIds.has(data.user_id)) {
          names[data.user_id] = data.name;
        }
      });
      setUserNames(names);

    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  async function handleConfirm(tx: HeartsTransaction) {
    try {
      await updateDoc(doc(db, 'hearts_transactions', tx.id), {
        confirmed_by_receiver: true
      });
      
      // Reload to see updated balances
      await loadTransactions();
      alert('✅ Hearts bekräftade! Saldo uppdaterat.');
    } catch (error) {
      console.error('Error confirming Hearts:', error);
      alert('Kunde inte bekräfta Hearts');
    }
  }

  const sent = transactions.filter(tx => tx.from_user === auth.currentUser?.uid);
  const received = transactions.filter(tx => tx.to_user === auth.currentUser?.uid);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text style={styles.balanceTitle}>Ditt saldo</Text>
          <Text style={styles.balanceAmount}>🔥 {myBalance} Hearts</Text>
          <Text style={styles.balanceSubtitle}>Senaste 30 dagarna</Text>
        </Card.Content>
      </Card>

      {sent.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>SKICKAT</Text>
          {sent.map(tx => (
            <Card key={tx.id} style={styles.txCard}>
              <Card.Content>
                <View style={styles.txHeader}>
                  <Text style={styles.txName}>💚 {userNames[tx.to_user] || tx.to_user}</Text>
                  <Text style={styles.txAmount}>-{tx.amount} Hearts</Text>
                </View>
                {tx.reason && (
                  <Text style={styles.txReason}>"{tx.reason}"</Text>
                )}
                <Text style={styles.txDate}>
                  {new Date(tx.created_at).toLocaleDateString('sv-SE')} {' '}
                  {new Date(tx.created_at).toLocaleTimeString('sv-SE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {' '}
                  {tx.confirmed_by_receiver ? '✓' : '⏳'}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </>
      )}

      {received.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>MOTTAGIT</Text>
          {received.map(tx => (
            <Card key={tx.id} style={styles.txCard}>
              <Card.Content>
                <View style={styles.txHeader}>
                  <Text style={styles.txName}>💛 {userNames[tx.from_user] || tx.from_user}</Text>
                  <Text style={[styles.txAmount, styles.positive]}>+{tx.amount} Hearts</Text>
                </View>
                {tx.reason && (
                  <Text style={styles.txReason}>"{tx.reason}"</Text>
                )}
                <Text style={styles.txDate}>
                  {new Date(tx.created_at).toLocaleDateString('sv-SE')} {' '}
                  {new Date(tx.created_at).toLocaleTimeString('sv-SE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {' '}
                  {tx.completed_at ? '✓' : '⏳'}
                </Text>
                {!tx.confirmed_by_receiver && (
                  <Button
                    mode="contained"
                    onPress={() => handleConfirm(tx)}
                    style={{ marginTop: 8 }}
                    buttonColor="#6BCF7F"
                    textColor="#fff"
                  >
                    Bekräfta mottagning
                  </Button>
                )}
              </Card.Content>
            </Card>
          ))}
        </>
      )}

      {transactions.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Inga transaktioner än</Text>
          <Text style={styles.emptySubtext}>
            Skicka Hearts till grannar för att tacka för hjälp!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 16
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  balanceCard: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  balanceTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4
  },
  balanceSubtitle: {
    fontSize: 14,
    color: '#999'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#2D5016'
  },
  txCard: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  txName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016'
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C1121F'
  },
  positive: {
    color: '#6BCF7F'
  },
  txReason: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4
  },
  txDate: {
    fontSize: 12,
    color: '#999'
  },
  empty: {
    alignItems: 'center',
    marginTop: 64
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
    paddingHorizontal: 32
  }
});
