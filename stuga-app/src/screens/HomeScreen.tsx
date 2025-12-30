import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Card, ActivityIndicator, FAB } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { User } from '../types';

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [neighbors, setNeighbors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authenticateAndLoad();
  }, []);

  async function authenticateAndLoad() {
    try {
      // Sign in anonymously for testing
      await signInAnonymously(auth);
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
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏘️ GRANNAR ({neighbors.length})</Text>
      
      <FlatList
        data={neighbors}
        keyExtractor={item => item.id}
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

      <FAB
        icon="plus"
        label="Lägg till resurs"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate('AddResource')}
      />
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
  hearts: {
    fontSize: 14,
    color: '#666'
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2D5016'
  }
});
