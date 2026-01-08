import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth, db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import type { User, HeartsTransaction } from '../types';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    resourcesPosted: 0,
    neighborsHelped: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<HeartsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Load user data
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() } as User);
      }

      // Load stats
      await loadStats(currentUser.uid);
      
      // Load recent transactions
      await loadRecentTransactions(currentUser.uid);

      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  }

  async function loadStats(userId: string) {
    try {
      // Count Hearts sent
      const sentQuery = query(
        collection(db, 'hearts_transactions'),
        where('from_user', '==', userId)
      );
      const sentSnapshot = await getDocs(sentQuery);
      const totalSent = sentSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      // Count Hearts received
      const receivedQuery = query(
        collection(db, 'hearts_transactions'),
        where('to_user', '==', userId)
      );
      const receivedSnapshot = await getDocs(receivedQuery);
      const totalReceived = receivedSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      // Count unique neighbors helped (received Hearts from)
      const uniqueNeighbors = new Set(
        receivedSnapshot.docs.map(doc => doc.data().from_user)
      );

      // Count resources posted
      const resourcesQuery = query(
        collection(db, 'resources'),
        where('user_id', '==', userId)
      );
      const resourcesSnapshot = await getDocs(resourcesQuery);

      setStats({
        totalSent,
        totalReceived,
        resourcesPosted: resourcesSnapshot.size,
        neighborsHelped: uniqueNeighbors.size
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function loadRecentTransactions(userId: string) {
    try {
      // Get recent sent transactions
      const sentQuery = query(
        collection(db, 'hearts_transactions'),
        where('from_user', '==', userId),
        orderBy('created_at', 'desc'),
        limit(3)
      );
      const sentSnapshot = await getDocs(sentQuery);

      // Get recent received transactions
      const receivedQuery = query(
        collection(db, 'hearts_transactions'),
        where('to_user', '==', userId),
        orderBy('created_at', 'desc'),
        limit(3)
      );
      const receivedSnapshot = await getDocs(receivedQuery);

      // Combine and sort
      const allTransactions = [
        ...sentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...receivedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ] as HeartsTransaction[];

      allTransactions.sort((a, b) => b.created_at - a.created_at);
      setRecentTransactions(allTransactions.slice(0, 5));
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Nyss';
    if (diffMins < 60) return `${diffMins} min sedan`;
    if (diffHours < 24) return `${diffHours} tim sedan`;
    if (diffDays === 1) return 'Igår';
    if (diffDays < 7) return `${diffDays} dagar sedan`;
    
    return date.toLocaleDateString('sv-SE', { 
      day: 'numeric', 
      month: 'short'
    });
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Laddar profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
    >
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text style={styles.name}>{user?.name || 'Okänd användare'}</Text>
          <Text style={styles.joinDate}>
            Medlem sedan {user?.created_at ? 
              new Date(user.created_at).toLocaleDateString('sv-SE', {
                year: 'numeric',
                month: 'long'
              }) : 'okänt'}
          </Text>
        </Card.Content>
      </Card>

      {/* Hearts Balance */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Ditt saldo</Text>
          <Text style={styles.heartsBalance}>
            🔥 {user?.hearts_balance || 0} Hearts
          </Text>
        </Card.Content>
      </Card>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.totalSent}</Text>
            <Text style={styles.statLabel}>Hearts skickade</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.totalReceived}</Text>
            <Text style={styles.statLabel}>Hearts mottagna</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.resourcesPosted}</Text>
            <Text style={styles.statLabel}>Resurser postade</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.neighborsHelped}</Text>
            <Text style={styles.statLabel}>Grannar hjälpta</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Recent Activity */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Senaste aktivitet</Text>
          
          {recentTransactions.length === 0 ? (
            <Text style={styles.emptyText}>Ingen aktivitet ännu</Text>
          ) : (
            recentTransactions.map((tx, index) => {
              const isSent = tx.from_user === auth.currentUser?.uid;
              return (
                <View key={tx.id}>
                  {index > 0 && <Divider style={styles.divider} />}
                  <View style={styles.transactionRow}>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionAmount}>
                        {isSent ? '-' : '+'}{tx.amount} Hearts
                      </Text>
                      <Text style={styles.transactionReason}>
                        {tx.reason || (isSent ? 'Hearts skickade' : 'Hearts mottagna')}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(tx.created_at)}
                      </Text>
                    </View>
                    <Text style={styles.transactionStatus}>
                      {tx.confirmed_by_receiver ? '✓' : '⏳'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Button 
            mode="outlined" 
            onPress={() => auth.signOut()}
            style={styles.logoutButton}
          >
            Logga ut
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 16
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#2D5016'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4
  },
  joinDate: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8
  },
  card: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 12
  },
  heartsBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D5016',
    textAlign: 'center',
    marginVertical: 8
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF'
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5016',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  transactionInfo: {
    flex: 1
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 2
  },
  transactionReason: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2
  },
  transactionDate: {
    fontSize: 12,
    color: '#999'
  },
  transactionStatus: {
    fontSize: 20
  },
  divider: {
    marginVertical: 8
  },
  logoutButton: {
    marginTop: 8
  }
});
