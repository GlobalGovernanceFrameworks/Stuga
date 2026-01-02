import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Resource } from '../types';

export default function NeighborDetailScreen({ route, navigation }: any) {
  const { neighbor } = route.params;
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const isMe = currentUser?.uid === neighbor.user_id;


  useFocusEffect(
    React.useCallback(() => {
      loadNeighborResources();
    }, [])
  );

  async function loadNeighborResources() {
    try {
      const q = query(
        collection(db, 'resources'),
        where('user_id', '==', neighbor.user_id)
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

  const offers = resources.filter(r => r.type === 'offer');
  const needs = resources.filter(r => r.type === 'need');

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.name}>{neighbor.name}</Text>
          <Text style={styles.info}>🔥 {neighbor.hearts_balance} Hearts</Text>
          <Text style={styles.info}>
            📍 {neighbor.availability_status === 'available' ? 'Tillgänglig' : 'Borta'}
          </Text>
        </Card.Content>
      </Card>

      {loading ? (
        <ActivityIndicator size="large" color="#2D5016" style={{ marginTop: 32 }} />
      ) : (
        <>
          {offers.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>ERBJUDER</Text>
              {offers.map(resource => (
                <Card key={resource.id} style={styles.resourceCard}>
                  <Card.Content>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceDesc}>{resource.description}</Text>
                  </Card.Content>
                </Card>
              ))}
            </>
          )}

          {needs.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>BEHÖVER</Text>
              {needs.map(resource => (
                <Card key={resource.id} style={styles.resourceCard}>
                  <Card.Content>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceDesc}>{resource.description}</Text>
                  </Card.Content>
                </Card>
              ))}
            </>
          )}

          {resources.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>Inga resurser än</Text>
                <Text style={styles.emptyText}>
                  {neighbor.name.split(' ')[0]} har inte lagt till några resurser ännu.
                </Text>
                {!isMe && (
                  <Text style={styles.emptyHint}>
                    💡 Du kan ändå skicka Hearts för hjälp du fått tidigare!
                  </Text>
                )}
              </Card.Content>
            </Card>
          )}
        </>
      )}

      <View style={styles.actions}>
        {!isMe && (
          <Button 
            mode="contained" 
            style={styles.button}
            buttonColor="#FF6B35"
          >
            💬 Kontakta {neighbor.name.split(' ')[0]}
          </Button>
        )}
        {!isMe && (
          <Button 
            mode="contained" 
            style={styles.button}
            buttonColor="#2D5016"
            onPress={() => navigation.navigate('SendHearts', { neighbor })}
          >
            💖 Skicka Hearts
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 16
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D5016'
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#2D5016'
  },
  resourceCard: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  resourceDesc: {
    fontSize: 14,
    color: '#666'
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
    marginBottom: 8
  },
  emptyHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  },
  actions: {
    marginTop: 24,
    marginBottom: 32
  },
  button: {
    marginBottom: 12
  }
});
