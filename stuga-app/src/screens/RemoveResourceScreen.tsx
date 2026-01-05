import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Resource } from '../types';
import { useNetworkState } from '../hooks/useNetworkState';
import { queueResourceDelete } from '../lib/database';
import { getCategoryLabel } from '../lib/categoryHelpers';
import { StatusBadge } from '../components/StatusBadge';

export default function RemoveResourceScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { isOffline } = useNetworkState();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyResources();
  }, []);

  async function loadMyResources() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'resources'),
        where('user_id', '==', user.uid)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];

      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(resource: any) {
    Alert.alert(
      'Ta bort resurs?',
      `Vill du ta bort "${resource.title}"?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            try {
              if (isOffline) {
                // Queue deletion for later
                queueResourceDelete(resource.id);
                alert(`📦 Offline: Borttagning köad!\n\n"${resource.title}" kommer tas bort när du är online igen.`);
              } else {
                // Delete immediately when online
                await deleteDoc(doc(db, 'resources', resource.id));
                alert('✅ Resurs borttagen!');
              }
              loadMyResources(); // Refresh list
            } catch (error) {
              console.error('Error deleting resource:', error);
              alert('Kunde inte ta bort resurs');
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  if (resources.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Du har inga resurser att ta bort</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          buttonColor="#2D5016"
          textColor="#fff"
        >
          Tillbaka
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
    >
      {isOffline && (
        <Card style={styles.offlineCard}>
          <Card.Content>
            <Text style={styles.offlineText}>
              📡 Offline-läge: Borttagningar kommer köas och genomföras när du är online
            </Text>
          </Card.Content>
        </Card>
      )}
      <Text style={styles.header}>Välj resurs att ta bort</Text>
      
        {resources.map(resource => (
          <Card key={resource.id} style={styles.card}>
            <Card.Content>
              <StatusBadge status={resource.status} />
              <Text style={styles.title}>{resource.title}</Text>
                <Text style={styles.category}>
                  {resource.type === 'offer' ? '📤 Erbjuder' : '📥 Behöver'} · {getCategoryLabel(resource.category)}
                </Text>
              {resource.description && (
                <Text style={styles.description}>{resource.description}</Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => handleDelete(resource)}
                buttonColor="#C1121F"
                textColor="#fff"
              >
                Ta bort
              </Button>
            </Card.Actions>
          </Card>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  offlineCard: {
    marginBottom: 16,
    backgroundColor: '#FFF4E6'
  },
  offlineText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 16
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2D5016'
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#999'
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16
  },
  backButton: {
    marginTop: 16
  }
});
