import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, Card, ActivityIndicator, FAB } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { User } from '../types';
import { SkeletonCard } from '../components/SkeletonCard';

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [neighbors, setNeighbors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    authenticateAndLoad();
  }, []);

  const USE_TEST_ACCOUNT = false; // Toggle this for demos vs development

  async function authenticateAndLoad() {
    try {
      if (USE_TEST_ACCOUNT) {
        await signInWithEmailAndPassword(auth, 'test@stuga.local', 'test1234');
        console.log('🔑 Signed in as test user');
      } else {
        const userCredential = await signInAnonymously(auth);
        console.log('🔑 Your anonymous UID:', userCredential.user.uid);
      }
      await loadNeighbors();
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }

  async function loadNeighbors() {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setNeighbors(users);
    } catch (error) {
      console.error('Error loading neighbors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Add this
    }
  }

async function onRefresh() {
  setRefreshing(true);
  await loadNeighbors();
}

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>🏘️ GRANNAR</Text>
        {[1, 2, 3, 4, 5].map(i => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏘️ GRANNAR ({neighbors.length})</Text>

      {neighbors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏘️</Text>
          <Text style={styles.emptyTitle}>Inga grannar hittade</Text>
          <Text style={styles.emptyText}>
            Det verkar inte finnas några grannar i närheten som använder Stuga än.
          </Text>
          <Button
            mode="contained"
            onPress={loadNeighbors}
            style={{ marginTop: 16 }}
            buttonColor="#2D5016"
            textColor="#fff"
          >
            Uppdatera
          </Button>
        </View>
      ) : (      
        <FlatList
          data={neighbors}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2D5016']}
            />
          }
          renderItem={({ item }) => (
            <Card 
              style={styles.card}
              onPress={() => navigation.navigate('NeighborDetail', { neighbor: item })}
            >
              <Card.Content>
                <Text style={styles.name}>🟢 {item.name}</Text>
                <Text style={styles.hearts}>🔥 {item.hearts_balance} Hearts</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <View style={[styles.heartsButton, { bottom: insets.bottom + 96 }]}>
        <Button
          mode="outlined"
          icon="heart"
          onPress={() => navigation.navigate('HeartsHistory')}
          style={{ borderColor: '#2D5016' }}
          textColor="#2D5016"
        >
          Visa Hearts Historik
        </Button>
      </View>
      <View style={[styles.fabContainer, { bottom: insets.bottom + 16 }]}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => navigation.navigate('AddResource')}
          style={styles.fabButton}
          buttonColor="#2D5016"
          textColor="#fff"
          contentStyle={styles.fabContent}
        >
          Lägg till
        </Button>
        
        <Button
          mode="contained"
          icon="delete"
          onPress={() => navigation.navigate('RemoveResource')}
          style={styles.fabButton}
          buttonColor="#C1121F"
          textColor="#fff"
          contentStyle={styles.fabContent}
        >
          Ta bort
        </Button>
      </View>
    </View>
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D5016'
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  },
  hearts: {
    fontSize: 14,
    color: '#666'
  },
  heartsButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    // bottom: removed, set dynamically above
    zIndex: 1
  },
  fabContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    zIndex: 1
  },
  fabButton: {
    flex: 1
  },
  fabContent: {
    paddingVertical: 8
  }
});
