import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, SegmentedButtons, FAB } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Resource } from '../types';
import { getCategoryLabel } from '../lib/categoryHelpers';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { SkeletonCard } from '../components/SkeletonCard';
import { isExpired } from '../lib/expiryHelpers';

type FilterType = 'all' | 'open' | 'completed';

export default function MyResourcesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('open');

  useFocusEffect(
    React.useCallback(() => {
      loadMyResources();
    }, [])
  );

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

      // Sort by created_at (newest first)
      data.sort((a, b) => b.created_at - a.created_at);
      
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkFulfilled(resource: Resource) {
    Alert.alert(
      'Markera som slutförd?',
      `Är "${resource.title}" nu slutförd/uppfylld?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ja, slutförd',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'resources', resource.id), {
                status: 'completed',
                updated_at: Date.now()
              });
              await loadMyResources();
              Alert.alert('✓', 'Resurs markerad som slutförd!');
            } catch (error) {
              console.error('Error marking fulfilled:', error);
              Alert.alert('Fel', 'Kunde inte uppdatera resurs');
            }
          }
        }
      ]
    );
  }

  async function handleReopen(resource: Resource) {
    try {
      await updateDoc(doc(db, 'resources', resource.id), {
        status: 'open',
        updated_at: Date.now()
      });
      await loadMyResources();
      Alert.alert('✓', 'Resurs återöppnad!');
    } catch (error) {
      console.error('Error reopening:', error);
      Alert.alert('Fel', 'Kunde inte öppna resurs');
    }
  }

  async function handleDelete(resource: Resource) {
    Alert.alert(
      'Ta bort resurs?',
      `Vill du permanent ta bort "${resource.title}"?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'resources', resource.id));
              await loadMyResources();
              Alert.alert('✓', 'Resurs borttagen!');
            } catch (error) {
              console.error('Error deleting:', error);
              Alert.alert('Fel', 'Kunde inte ta bort resurs');
            }
          }
        }
      ]
    );
  }

  // Filter resources based on selected filter
  const filteredResources = resources.filter(r => {
    // Hide expired resources from "open" filter
    if (filter === 'open' && isExpired(r.expires_at)) return false;
    
    if (filter === 'all') return true;
    if (filter === 'open') return r.status === 'open';
    if (filter === 'completed') return r.status === 'completed';
    return true;
  });

  const openCount = resources.filter(r => r.status === 'open' && !isExpired(r.expires_at)).length;
  const completedCount = resources.filter(r => r.status === 'completed').length;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
        <View style={styles.container}>
          <Text style={styles.header}>Mina resurser</Text>
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <Text style={styles.header}>Mina resurser</Text>

        <Card style={styles.filterCard}>
          <Card.Content>
            <SegmentedButtons
              value={filter}
              onValueChange={(value) => setFilter(value as FilterType)}
              buttons={[
                { 
                  value: 'open', 
                  label: `Öppna (${openCount})`,
                  icon: 'circle-outline'
                },
                { 
                  value: 'completed', 
                  label: `Slutförda (${completedCount})`,
                  icon: 'check-circle-outline'
                },
                { 
                  value: 'all', 
                  label: 'Alla',
                  icon: 'view-list'
                }
              ]}
            />
          </Card.Content>
        </Card>

        {filteredResources.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>
                {filter === 'open' && 'Inga öppna resurser'}
                {filter === 'completed' && 'Inga slutförda resurser'}
                {filter === 'all' && 'Inga resurser än'}
              </Text>
              <Text style={styles.emptyText}>
                {filter === 'open' && 'Lägg till en resurs för att börja dela med dina grannar.'}
                {filter === 'completed' && 'Slutförda erbjudanden och behov visas här.'}
                {filter === 'all' && 'Lägg till din första resurs!'}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredResources.map(resource => {
            const isCompleted = resource.status === 'completed';
            const isResourceExpired = isExpired(resource.expires_at);

            return (
              <Card 
                key={resource.id} 
                style={[
                  styles.resourceCard,
                  isCompleted && styles.completedCard,
                  isResourceExpired && styles.expiredCard
                ]}
              >
                <Card.Content>
                  <View style={styles.badges}>
                    <StatusBadge status={resource.status} />
                    {!isCompleted && <UrgencyBadge expiresAt={resource.expires_at} showTimeRemaining />}
                  </View>
                  
                  <Text style={[styles.title, isCompleted && styles.completedText]}>
                    {resource.title}
                  </Text>
                  
                  <Text style={styles.category}>
                    {resource.type === 'offer' ? '📤 Erbjuder' : '📥 Behöver'} · {getCategoryLabel(resource.category)}
                  </Text>
                  
                  {resource.description && (
                    <Text style={styles.description}>{resource.description}</Text>
                  )}

                  <View style={styles.actions}>
                    {!isCompleted ? (
                      <>
                        <Button
                          mode="outlined"
                          onPress={() => navigation.navigate('EditResource', { resource })}
                          style={styles.actionButton}
                          textColor="#2D5016"
                          icon="pencil"
                        >
                          Redigera
                        </Button>
                        <Button
                          mode="contained"
                          onPress={() => handleMarkFulfilled(resource)}
                          style={styles.actionButton}
                          buttonColor="#6BCF7F"
                          textColor="#fff"
                          icon="check"
                        >
                          Slutförd
                        </Button>
                        <Button
                          mode="outlined"
                          onPress={() => handleDelete(resource)}
                          style={styles.actionButton}
                          textColor="#C1121F"
                          icon="delete"
                        >
                          Ta bort
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          mode="outlined"
                          onPress={() => handleReopen(resource)}
                          style={styles.actionButton}
                          textColor="#2D5016"
                          icon="refresh"
                        >
                          Återöppna
                        </Button>
                        <Button
                          mode="text"
                          onPress={() => handleDelete(resource)}
                          style={styles.actionButton}
                          textColor="#999"
                          icon="delete"
                        >
                          Ta bort
                        </Button>
                      </>
                    )}
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      <FAB
        icon="plus"
        label="Lägg till resurs"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate('AddResource')}
        color="#fff"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D5016'
  },
  filterCard: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  resourceCard: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  completedCard: {
    backgroundColor: '#F5F5F5',
    opacity: 0.8
  },
  expiredCard: {
    backgroundColor: '#FFF4E6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500'
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2D5016'
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999'
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  actionButton: {
    flex: 1
  },
  emptyCard: {
    marginTop: 32,
    backgroundColor: '#FFF4E6'
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 24
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#2D5016'
  }
});
